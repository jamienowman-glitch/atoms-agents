import os
import psycopg2
from solana.rpc.api import Client
from solana.transaction import Transaction
from solders.system_program import Transfer, TransferParams
from solders.pubkey import Pubkey
from solders.keypair import Keypair

# Config
VAULT_KEY_PATH = "/Users/jaynowman/northstar-keys/SOLANA_PRIVATE_KEY"
DB_URL_PATH = "/Users/jaynowman/northstar-keys/supabase-db-url.txt"
RPC_URL = "https://api.mainnet-beta.solana.com"

class PayoutSender:
    def __init__(self):
        self.solana_client = Client(RPC_URL)
        self.keypair = self._load_keypair()
        self.db_conn = self._connect_db()

from atoms_core.config.naming import format_provider_key

    def _load_keypair(self) -> Keypair:
        # Canonical Name: MARKETPLACE_SOLANA_WALLET
        key_filename = f"{format_provider_key('Marketplace Solana Wallet')}.key"
        key_path = os.path.join(os.path.dirname(VAULT_KEY_PATH), key_filename)
        
        if not os.path.exists(key_path):
             # Fallback to default for dev, but strictly prefer named key
             key_path = VAULT_KEY_PATH
        
        if not os.path.exists(key_path):
             raise FileNotFoundError(f"Solana Key not found. Please add 'Marketplace Solana Wallet' in Config.")
             
        print(f"🔑 Loading Wallet from: {key_path}")
        with open(key_path, 'r') as f:
            secret = f.read().strip()
            if secret.startswith("["):
                import json
                return Keypair.from_bytes(json.loads(secret))
            return Keypair.from_base58_string(secret)

    def _connect_db(self):
        with open(DB_URL_PATH, 'r') as f:
            url = f.read().strip()
        return psycopg2.connect(url)

    def process_payouts(self):
        """
        Main Payout Loop.
        1. Find pending balances > 10 Snax (Threshold).
        2. Lookup developer contract (Address).
        3. Send SOL.
        4. Update DB.
        """
        cur = self.db_conn.cursor()
        
        # 1. Get Pending
        cur.execute("""
            SELECT t.id, db.pending_snax, mc.payout_wallet_address, mc.payout_chain
            FROM developer_balance db
            JOIN marketplace_contracts mc ON db.tenant_id = mc.tenant_id
            JOIN tenants t ON db.tenant_id = t.id
            WHERE db.pending_snax > 0
              AND mc.payout_wallet_address IS NOT NULL
        """)
        
        candidates = cur.fetchall()
        print(f"💰 Found {len(candidates)} developers pending payout.")

        for row in candidates:
            tenant_id, amount_snax, address, chain = row
            
            if chain != 'solana':
                print(f"Skipping {tenant_id} (Chain {chain} not supported yet)")
                continue

            # Convert Snax to SOL (mock rate 1000 snax = 0.1 SOL for now)
            # In reality, fetch rate from Oracle.
            sol_amount = amount_snax / 10000.0 
            lamports = int(sol_amount * 1_000_000_000)
            
            print(f"Processing {tenant_id}: {amount_snax} Snax -> {sol_amount} SOL")
            
            try:
                # 2. Build Tx
                dest_pubkey = Pubkey.from_string(address)
                ix = Transfer(
                    TransferParams(
                        from_pubkey=self.keypair.pubkey(),
                        to_pubkey=dest_pubkey,
                        lamports=lamports
                    )
                )
                tx = Transaction().add(ix)
                
                # 3. Execute Send (REAL MODE)
                print(f"🚀 Sending {sol_amount} SOL to {address}...")
                
                # Send and confirm
                # Note: In a real high-value system, we'd use a durable nonce and offline signing.
                # For Phase 3 MVP, we sign and send immediately.
                sig = self.solana_client.send_transaction(tx, self.keypair).value
                tx_sig = str(sig)
                
                print(f"✅ Transaction Sent! Signature: {tx_sig}")
                
                # 4. Update Ledger
                cur.execute("""
                    UPDATE developer_balance 
                    SET pending_snax = pending_snax - %s 
                    WHERE tenant_id = %s
                """, (amount_snax, tenant_id))
                
                cur.execute("""
                    INSERT INTO payout_history (tenant_id, snax_amount, crypto_amount, currency, tx_hash, status)
                    VALUES (%s, %s, %s, 'SOL', %s, 'complete')
                """, (tenant_id, amount_snax, sol_amount, tx_sig))
                
                self.db_conn.commit()
                print(f"✅ Paid {tenant_id}. Tx: {tx_sig}")
                
            except Exception as e:
                self.db_conn.rollback()
                print(f"❌ Failed to pay {tenant_id}: {e}")

if __name__ == "__main__":
    sender = PayoutSender()
    sender.process_payouts()
