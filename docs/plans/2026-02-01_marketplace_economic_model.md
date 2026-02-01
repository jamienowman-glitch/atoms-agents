# Marketplace Economic Model: The "Dynamic Floor" Strategy

> **The Problem**: In a Marketplace, you cannot float the Currency Value (`snax_exchange_rate`) to control your profit margin. If you devalue the Snax, you steal value from Developers who hold it. They will leave.

> **The Solution**: **Fix the Currency. Float the Floor.**

---

## 1. The Strategy: "Wholesale + Markup"

We separate the price into two components:
1.  **The Wholesale Floor (Maintained by Us)**: The strict cost to run the infrastructure + The Boss's Guaranteed Profit Margin.
2.  **The Developer Markup (Maintained by Them)**: The value of their IP/Algorithm.

$$ \text{Final Price} = \text{Wholesale Floor (Dynamic)} + \text{Developer Markup (Static)} $$

### Why this wins:
*   **The Boss** is happy: He guarantees his margin on *every* run because the Floor dynamically adjusts to cover costs.
*   **The Developer** is happy: They control their earnings. If Snax is stable (£0.10), they know exactly what `+3 Snax` Markup means in real money.
*   **The User** is protected: They see a single final price.

---

## 2. The Mechanism: "The Efficiency Oracle V2"

Instead of changing the Exchange Rate (Global), the Oracle now updates the **Base Cost Registry** (Per Tool).

### Step A: Fix the Peg (Stability)
*   **Rate**: 10 Snax = £1.00 (Fixed).
*   **Why**: A marketplace needs a stable unit of account. Developers cannot price their products in a currency that wobbles daily.

### Step B: The Oracle Calculation (Protection)
Every night, the Oracle runs:
1.  **Calculate True Cost**: `AWS_Spend + Marketing_Allocation / Total_Runs = Cost_Per_Run` (e.g., £0.05).
2.  **Apply Target Margin**: `Cost (£0.05) * (1 + 30%) = £0.065`.
3.  **Convert to Snax**: `£0.065 * 10 = 0.65 Snax`.
4.  **Update Registry**: Set `tool_wholesale_floor = 0.65`.

### Step C: The Price Update
*   Developer A has set their markup to `2.0 Snax`.
*   New Price = `0.65 (Floor) + 2.0 (Markup) = 2.65 Snax`.
*   **Result**: The price nudges up slightly to cover our increased infrastructure costs. The Developer's income (2.0) remains untouched.

---

## 3. Comparison

| Feature | Old Plan (Floating Currency) | **New Plan (Dynamic Floor)** |
| :--- | :--- | :--- |
| **Boss's Margin** | Protected (Global Devaluation) | **Protected (Cost Pass-Through)** |
| **Developer Revenue** | **Destroyed** (Earns less real £) | **Protected** (Earns stable £) |
| **User Experience** | Confusing (Why did my balance drop?) | **Clear** (Prices adjust slightly) |
| **Marketplace Trust** | Low (Central Bank Risk) | **High** (Fair Cost + Verified IP) |

---

## 4. Implementation Plan

### 1. Schema Update
Add `wholesale_floor_snax` and `developer_markup_snax` to the `pricing` table.
*   `base_price_snax` becomes a computed column (generated always as `floor + markup`).

### 2. The Oracle Logic
Update `atoms-core/src/billing/efficiency_oracle.py`:
*   **DELETE**: Stop updating `system_config.snax_exchange_rate`. (**Freeze it**).
*   **NEW**: Start updating `pricing.wholesale_floor_snax` based on `operating_costs`.

### 3. The God Config
*   **Slider**: "Target Margin %" (e.g., 30%).
*   **Effect**: Instantly recalculates the Wholesale Floor for all tools.

"Boss, we can't devalue the money in people's pockets—that kills the marketplace. Instead, we **dynamically adjust the rent** (Wholesale Cost) based on our margins. You still get your guaranteed profit % on every run, but the Developers keep their stable income. It's safe, fair, and scalable."

## 6. The Discount Rule (Who Pays?)
> **Question**: If we offer "20% off Snax vs Crypto", does the Developer lose money?
> **Answer**: **NO.**

*   **The Rule**: Platform Promotions are Platform Costs.
*   **Mechanism**:
    1.  User buys 100 Snax for £8 (instead of £10). **We absorb the £2 loss as Marketing Spend.**
    2.  User spends 10 Snax at Developer A.
    3.  Developer A receives the full value of 10 Snax (based on the £1 peg).
*   **Why**: We cannot force Developers to subsidize our user acquisition strategy. They always get paid on the **Face Value** of Snax, not the purchase price.
