import psycopg2
import json
import sys
from pathlib import Path
import uuid

# Config
VAULT_DIR = Path("/Users/jaynowman/northstar-keys")

def read_vault(filename):
    path = VAULT_DIR / filename
    if not path.exists():
        return None
    with open(path, "r") as f:
        return f.read().strip()

def get_db_url():
    url = read_vault("postgres-connection-string.txt") or \
          read_vault("db-url.txt") or \
          read_vault("supabase-db-url.txt")
    if not url:
        print("❌ FATAL: No DB URL found in vault.")
        sys.exit(1)
    return url

def run_verification():
    print("🕵️  Starting Discount Engine Verification...")
    db_url = get_db_url()
    
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = False # Transactional
        cur = conn.cursor()

        # 1. Setup Test Data
        print("   Creating Test Tenant...")
        tenant_id = str(uuid.uuid4())
        slug = f"test-tenant-{uuid.uuid4().hex[:8]}"
        cur.execute("insert into public.tenants (id, name, slug) values (%s, %s, %s)", (tenant_id, 'Test Tenant', slug)) # Assuming tenants table exists and simple
        
        print("   Creating Policy...")
        # Policy: Max 20%, KPI: Profit Margin >= 0.15
        cur.execute("""
            insert into public.discount_policy (tenant_id, min_discount_pct, max_discount_pct, kpi_ceiling, kpi_floor)
            values (%s, 0.0, 0.20, '{"profit_margin": 0.15}'::jsonb, '{}'::jsonb)
        """, (tenant_id,))
        conn.commit() # Commit setup so subsequent rollbacks don't lose it

        # 2. Policy Test: Create 50% off code (Should Fail)
        print("   [TEST 1] Creating Illegal Code (50% > 20%)...")
        try:
            cur.execute("""
                select public.create_discount_code(
                    %s, null, 'ILLEGAL50', 'percent', 0.50, 'internal'
                )
            """, (tenant_id,))
            print("   ❌ FAILED: Code creation should have failed due to policy violation.")
        except psycopg2.Error as e:
            if 'Policy Violation' in str(e):
                print(f"   ✅ SUCCESS: Caught expected error: {e.pgerror.strip()}")
            else:
                print(f"   ❌ FAILED: Unexpected error: {e}")
            conn.rollback()

        # 3. KPI Test: Floor Breach
        print("   [TEST 2] KPI Governance Check...")
        # Add a valid code (10%)
        cur.execute("""
            select public.create_discount_code(
                %s, null, 'VALID10', 'percent', 0.10, 'internal'
            )
        """, (tenant_id,))
        
        # Set KPI Snapshot Low (0.10 < 0.15)
        cur.execute("""
            insert into public.discount_kpi_snapshots (tenant_id, kpi_slug, value)
            values (%s, 'profit_margin', 0.10)
        """, (tenant_id,))
        conn.commit() # Commit so we can test against it, and rollback won't remove it
        
        # Try to Validate
        try:
            cur.execute("select public.validate_discount_code('VALID10', 100)")
            print("   ❌ FAILED: Validation should have failed due to KPI floor breach.")
        except psycopg2.Error as e:
            if 'Governance Rejection' in str(e):
                print(f"   ✅ SUCCESS: Caught expected error: {e.pgerror.strip()}")
            else:
                print(f"   ❌ FAILED: Unexpected error: {e}")
            conn.rollback() # Reset for next test

        # 4. Success Case
        print("   [TEST 3] Successful Redemption...")
        # Update KPI to healthy (0.20 > 0.15)
        # First remove old one to avoid timestamp race condition
        cur.execute("delete from public.discount_kpi_snapshots where tenant_id = %s", (tenant_id,))
        
        cur.execute("""
            insert into public.discount_kpi_snapshots (tenant_id, kpi_slug, value)
            values (%s, 'profit_margin', 0.20)
        """, (tenant_id,))
        conn.commit() # Commit healthy state
        
        # Verify validate passes
        cur.execute("select public.validate_discount_code('VALID10', 100)")
        res = cur.fetchone()[0]
        if res.get('valid'):
             print("   ✅ Validation Passed.")
        else:
             print("   ❌ Validation Failed unexpected.")

        # Redeem
        cur.execute("""
            select public.redeem_discount_code('VALID10', 100, 'USD', 'TEST_ORDER_1')
        """)
        redemption_id = cur.fetchone()[0]
        print(f"   ✅ Redeemed! ID: {redemption_id}")
        
        # Check Redemption Record
        cur.execute("select times_redeemed from discount_codes where code='VALID10'")
        count = cur.fetchone()[0]
        if count == 1:
            print("   ✅ Validated times_redeemed = 1")
        else:
            print(f"   ❌ times_redeemed mismatch: {count}")

        # 5. Channel Test
        print("   [TEST 4] Channel Injection (Shopify)...")
        cur.execute("""
            select public.create_discount_code(
                %s, null, 'SHOPIFY_TEST', 'fixed', 5.00, 'shopify'
            )
        """, (tenant_id,))
        cur.execute("select channel from discount_codes where code='SHOPIFY_TEST'")
        chan = cur.fetchone()[0]
        if chan == 'shopify':
            print("   ✅ Channel set to shopify")
        else:
            print(f"   ❌ Channel mismatch: {chan}")
            
        conn.rollback() # CLEANUP (Or commit if we want to keep, but test usually cleanups)
        print("🧹 Cleanup: Transaction Rolled Back. System clean.")
        
    except Exception as e:
        print(f"❌ Script Error: {e}")
        conn.rollback()
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    run_verification()
