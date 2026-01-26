# 💸 Cost Control & Free Tier Limits

> **Mandate**: "No Billion Dollar Bills." We run on Free Tiers until we have Revenue.

## 🚨 Active Stack (The Risk Register)

| Service | Provider | Free Tier Limit | ⚠️ Risk (The Bill Shock) | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Compute (Agents)** | **Google Cloud Run** | 2M requests/mo<br>180k vCPU-seconds | **HIGH**. "Scale to Infinity" = Infinite Bill. | Set `max-instances` to 1 or 2.<br>Set Billing Alerts. |
| **Database** | **Supabase** | 500MB Storage<br>50k Monthly Active Users | **MD**. Pauses project after inactivity. | Monitor DB Size.<br>Upgrade to Pro ($25) if vital. |
| **Storage (Media)** | **AWS S3** | 5GB Standard (12 mo)<br>20k GET Requests | **LOW**. Egress fees if we serve video heavily. | Use Cloudflare R2 (Zero Egress)<br>or standard caching. |
| **AI (Text)** | **Mistral API** | Varies / La Plateforme | **MD**. Token usage scales with Context. | Use `memory_blackboard` to limit context.<br>Cache results. |
| **AI (Vision)** | **Atoms Muscle** | Run on Cloud Run (See above) | **HIGH**. Uses more CPU/RAM than text agents. | Keep models loaded (lazy load) or compiled. |

---

## 📚 Google Cloud Free Tier Reference

Below is the standard usage capability for our GCP Project (`northstar-engines`).
*Check [Google Pricing](https://cloud.google.com/free) for updates.*

### Compute & Containers
| Product | Free Tier Limit | Notes |
| :--- | :--- | :--- |
| **Cloud Run** | 2M requests/mo<br>360k GB-sec Memory<br>180k vCPU-sec Compute | **Primary Agent Runner.** Good for stateless, event-driven agents. |
| **Cloud Run Functions** | 2M invocations/mo<br>400k GB-sec Memory | Good for small webhooks. |
| **Compute Engine** | 1 `e2-micro` instance (US regions) | **Always Free VM.** Good for "Sentinel" or simple cron scripts. |
| **Artifact Registry** | 0.5 GB Storage/mo | Where our Docker images live. Clean up old tags! |
| **Container Registry** | (Deprecated) | Use Artifact Registry. |

### Data & Logic
| Product | Free Tier Limit | Notes |
| :--- | :--- | :--- |
| **Firestore** | 1GB Storage<br>50k Reads/day | Good for small structured documents if Supabase falls over. |
| **BigQuery** | 1TB Querying/mo<br>10GB Storage | Data Warehouse. Don't stream logs here unless needed. |
| **Pub/Sub** | 10GB messages/mo | Event bus. |
| **Workflows** | 5k steps/mo | Orchestration. |

### AI & Perception
| Product | Free Tier Limit | Notes |
| :--- | :--- | :--- |
| **Vision API** | 1,000 units/mo | Expensive if we scale. Use Local `OpenCLIP` (Muscle) instead. |
| **Speech-to-Text** | 60 mins/mo | Very low limit. Use `Faster-Whisper` (Muscle). |
| **Video Intelligence** | 1,000 units/mo | Use FFmpeg (Muscle). |

### Operations
| Product | Free Tier Limit | Notes |
| :--- | :--- | :--- |
| **Cloud Build** | 2,500 build-minutes/mo | Enough for daily deploys. |
| **Cloud Logging** | 50GB logs/mo | Watch out for "Debug" noise. |
| **Cloud Shell** | 5GB Persistent Disk | Your dev environment. |

---

## 🛡️ Failover Strategy (Microsoft Azure)
> **Rationale**: "Vendor Agnosticism". If Google bans us or pricing changes, we deploy to Azure.
> **See**: `/dashboard/infra/free-tiers/azure`

| Service Match | Azure Product | Free Limit | Strategy |
| :--- | :--- | :--- | :--- |
| **Cloud Run** | **Container Apps** | 180k vCPU-seconds | **Identical**. Use same Dockerfile. |
| **Firestore** | **Cosmos DB** | 1000 RU/s | **Similar**. Requires Code Adapter. |
| **Muscle** | **Speech-to-Text** | 5 Hours | **Backup**. Use if OpenAI/Whisper fails. |

---

## ⚡ The SaaS Stack (Supabase, Resend, Cloudflare)
> **Rationale**: "Best-in-Class Primitives". We don't host databases or email.
> **See**: `/dashboard/infra/free-tiers/saas`

| Service | Product | Free Limit | Strategy |
| :--- | :--- | :--- | :--- |
| **Supabase** | **Database** | 500MB / 50k MAU | **Core**. Pauses after 7 days inactivity (Dev). |
| **Resend** | **Email** | 3,000/mo (100/day) | **Strict**. Batch emails. Don't spam. |
| **Cloudflare** | **R2 Storage** | 10 GB / Zero Egress | **Media**. Use for heavy assets instead of S3. |

---

## 🏗️ Heavy Metal Strategy (AWS)
> **Rationale**: "The 12-Month Trap". AWS has huge limits (Lambda 1M requests), but most storage/compute expires after 1 year.
> **See**: `/dashboard/infra/free-tiers/aws`

| Service | Product | Free Limit | Strategy |
| :--- | :--- | :--- | :--- |
| **Lambda** | **Functions** | 1M Requests (Always) | **Events**. Great for background workers. |
| **DynamoDB** | **NoSQL** | 25 GB (Always) | **State**. Massive persistent storage if Supabase fills up. |
| **S3** | **Storage** | 5 GB (12 Mo) | **Legacy**. Use Cloudflare R2 instead (Zero Egress). |
| **Polly** | **TTS** | 5M chars (12 Mo) | **Voice**. Use for year 1, then cache or switch. |
