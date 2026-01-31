---
name: read-temperature
description: Teaches an Agent how to read the Business Temperature and adjust its behavior accordingly.
---

# Skill: Read Business Temperature

## Context
The "Temperature" (0-100) is the heartbeat of the business. It is not just a number on a dashboard; it is a **Command Signal** that dictates your operational cadence and risk tolerance.

## How to Read Temperature
You must check the current temperature before proposing any high-impact actions (e.g., launching campaigns, running discounts, changing heavy copy).

**Query:**
```sql
-- Check the current active temperature band
SELECT slug, display_name, behavioral_intent, min_val, max_val 
FROM temperature_bands_registry 
WHERE 72 BETWEEN min_val AND max_val; -- REPLACE 72 WITH ACTUAL CURRENT SCORE
```
*(Note: In a real scenario, you would fetch the current score from `core_kpis` or `surface_state` first. For now, assume you have access to the score.)*

## The 6 Temperature Bands (Behavioral Laws)

### 1. ICE (0-40)
*   **State**: Critical Failure / Stasis.
*   **Behavior**: **EMERGENCY STOP.**
*   **Actions**:
    *   Disable all autopilot marketing.
    *   Do NOT spend budget.
    *   Draft a "Situation Room" review document.
    *   Demand human intervention.

### 2. BLUE (40-55)
*   **State**: Underheating / Cold.
*   **Behavior**: **CONSERVATIVE ACTIVATION.**
*   **Actions**:
    *   Focus only on proven, high-ROI channels.
    *   No experimentation.
    *   Increase frequency slightly, but keep costs low.

### 3. YELLOW - LOW (55-65)
*   **State**: Tepid / Minor Correction Needed.
*   **Behavior**: **OPTIMIZATION MODE.**
*   **Actions**:
    *   Make small adjustments to copy/creative.
    *   Cut the bottom 10% of underperforming ads.
    *   Seek efficiency gains.

### 4. GREEN (65-75)
*   **State**: OPTIMUM / Flow State.
*   **Behavior**: **STANDARD OPERATIONS.**
*   **Actions**:
    *   Run standard agent loops.
    *   Execute growth plans.
    *   Allowed to experiment (10-20% budget).
    *   "Business as usual."

### 5. YELLOW - HIGH (75-90)
*   **State**: Overheating / Strain.
*   **Behavior**: **COOLING PROTOCOLS.**
*   **Actions**:
    *   Demand is outstripping supply or operations.
    *   Decrease ad spend.
    *   Raise prices or reduce discounts.
    *   Focus on "Sold Out" waitlists.

### 6. RED (90-100)
*   **State**: CRITICAL OVERLOAD.
*   **Behavior**: **HALT & STABILIZE.**
*   **Actions**:
    *   Stop all acquisition.
    *   Focus 100% on Customer Support and Fulfillment.
    *   Prevent the system from crashing.
    *   notify_user immediately with an action plan to reduce load.

## Agent Prime Directive
**"I will not execute a Strategy that contradicts the current Temperature."**
*   *Example*: Do not run a "Flash Sale" (Heat) when the temperature is Red (Overheating).
*   *Example*: Do not "Wait and See" (Cool) when the temperature is Ice (Freezing).
