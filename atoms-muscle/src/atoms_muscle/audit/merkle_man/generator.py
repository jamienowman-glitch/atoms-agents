import hashlib
import json
from datetime import datetime

class MerkleGenerator:
    """
    The Merkle Man's Brain.
    Takes a list of Transactions, hashes them, and builds a Merkle Tree.
    """
    
    def __init__(self, transactions: list):
        """
        :param transactions: List of dict objects (ledger rows)
        """
        self.transactions = transactions
        self.leaves = [self._hash_transaction(tx) for tx in transactions]
        self.tree = []
        self.root = None
        
        if self.leaves:
            self.root = self._build_tree(self.leaves)

    def _hash_transaction(self, tx: dict) -> str:
        """
        Canonical Hash of a Transaction.
        Str = wallet_id:delta:reason:ref
        """
        # Ensure consistent ordering and string conversion
        payload = f"{tx.get('wallet_id')}:{tx.get('delta_snax')}:{tx.get('reason')}:{tx.get('reference_id')}"
        return hashlib.sha256(payload.encode('utf-8')).hexdigest()

    def _build_tree(self, leaves: list) -> str:
        """
        Recursively build tree.
        """
        if len(leaves) == 1:
            return leaves[0]
            
        next_level = []
        for i in range(0, len(leaves), 2):
            left = leaves[i]
            if i + 1 < len(leaves):
                right = leaves[i + 1]
            else:
                right = left # Duplicate last node if odd
                
            combined = f"{left}{right}"
            next_level.append(hashlib.sha256(combined.encode('utf-8')).hexdigest())
            
        return self._build_tree(next_level)

    def get_root(self) -> str:
        return self.root or ""
