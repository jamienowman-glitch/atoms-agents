"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const FREE_TIER_DATA = [
    // --- COMPUTE & SERVERLESS ---
    {
        product: "Lambda",
        limit: "1 Million Requests / Month\n400k GB-seconds Compute",
        risk: "LOW",
        risk_desc: "Always Free. Hard to exceed for simple logic.",
        mitigation: "Use for Event Triggers",
        type: "Always Free"
    },
    {
        product: "EC2",
        limit: "750 Hours / Month (t2.micro/t3.micro)",
        risk: "MED",
        risk_desc: "12 Months Only. Bill shock after year 1.",
        mitigation: "Set Calendar Reminder to cancel",
        type: "12 Months"
    },
    {
        product: "Lightsail",
        limit: "90 Days Free ($3.50 Plan)",
        risk: "MED",
        risk_desc: "Short Trial Period",
        mitigation: "Migrate before 90 days",
        type: "Trial"
    },
    {
        product: "ECS (Container Service)",
        limit: "Orchestration is Free (Pay for EC2/Fargate)",
        risk: "HIGH",
        risk_desc: "Underlying compute is NOT free unless on Free Tier EC2",
        mitigation: "Use Lambda for true scale",
        type: "Always Free"
    },

    // --- DATABASES ---
    {
        product: "DynamoDB",
        limit: "25 GB Storage\n25 RCU / 25 WCU",
        risk: "LOW",
        risk_desc: "Sufficient for massive scale prototypes",
        mitigation: "Use On-Demand Mode (carefully)",
        type: "Always Free"
    },
    {
        product: "RDS (Relational)",
        limit: "750 Hours / Month (db.t3.micro / db.t4g.micro)",
        risk: "MED",
        risk_desc: "12 Months Only. Expensive if left on.",
        mitigation: "Use Supabase (Always Free)",
        type: "12 Months"
    },
    {
        product: "ElastiCache (Redis)",
        limit: "750 Hours / Month (t2.micro / t3.micro)",
        risk: "MED",
        risk_desc: "12 Months Only",
        mitigation: "Use Local Cache or Cloudflare KV",
        type: "12 Months"
    },
    {
        product: "Aurora DSQL (Distributed)",
        limit: "100k Processing Units\n1GB Storage",
        risk: "LOW",
        risk_desc: "New Service. Limits might change.",
        mitigation: "Evaluators only",
        type: "Always Free"
    },
    {
        product: "DocumentDB (Mongo)",
        limit: "30-day Free Trial (t3.medium)",
        risk: "HIGH",
        risk_desc: "Very short trial",
        mitigation: "Avoid for Production",
        type: "Trial"
    },

    // --- STORAGE ---
    {
        product: "S3",
        limit: "5 GB Standard Storage\n20,000 GET Requests",
        risk: "MED",
        risk_desc: "12 Months Only. Egress fees.",
        mitigation: "Move cold data to Glacier",
        type: "12 Months"
    },
    {
        product: "EFS (Elastic File System)",
        limit: "5 GB Storage",
        risk: "LOW",
        risk_desc: "Good for shared lambda state",
        mitigation: "Monitor Usage",
        type: "12 Months"
    },
    {
        product: "EBS (Block Storage)",
        limit: "30 GB Storage",
        risk: "LOW",
        risk_desc: "Attached to EC2",
        mitigation: "Delete unattached volumes",
        type: "12 Months"
    },

    // --- AI & ML ---
    {
        product: "Polly (TTS)",
        limit: "5 Million Characters / Month",
        risk: "LOW",
        risk_desc: "Generous for first year",
        mitigation: "Cache audio files",
        type: "12 Months"
    },
    {
        product: "Transcribe",
        limit: "60 Minutes / Month",
        risk: "HIGH",
        risk_desc: "Very low limit compared to Muscle",
        mitigation: "Use only for testing",
        type: "12 Months"
    },
    {
        product: "Rekognition",
        limit: "5,000 Images / Month",
        risk: "LOW",
        risk_desc: "Good for MVP",
        mitigation: "Resize images before sending",
        type: "12 Months"
    },
    {
        product: "Lex (Chatbots)",
        limit: "10,000 Text Requests / Month",
        risk: "LOW",
        risk_desc: "First year generous",
        mitigation: "Use Local LLM for logic",
        type: "12 Months"
    },
    {
        product: "Translate",
        limit: "2 Million Characters / Month",
        risk: "LOW",
        risk_desc: "Good volume",
        mitigation: "Cache translations",
        type: "12 Months"
    },
    {
        product: "Comprehend (NLP)",
        limit: "50k Units",
        risk: "LOW",
        risk_desc: "First year only",
        mitigation: "Use Local Embeddings",
        type: "12 Months"
    },
    {
        product: "SageMaker",
        limit: "250 hours (t2.medium) notebook\n50 hours m4.xlarge training",
        risk: "HIGH",
        risk_desc: "Complex pricing model",
        mitigation: "Use Google Colab for experiments",
        type: "2 Months"
    },
    {
        product: "Bedrock",
        limit: "Use Credits / Paid",
        risk: "HIGH",
        risk_desc: "No dedicated free tier found in list",
        mitigation: "Pay as you go",
        type: "Paid"
    },

    // --- DEV TOOLS ---
    {
        product: "CloudWatch",
        limit: "10 Custom Metrics\n5GB Log Data",
        risk: "MED",
        risk_desc: "Logs get expensive fast",
        mitigation: "Set short retention policies",
        type: "Always Free"
    },
    {
        product: "Amplify Hosting",
        limit: "1000 Build Minutes\n5GB Storage",
        risk: "LOW",
        risk_desc: "Good static host",
        mitigation: "Alternative to Vercel",
        type: "12 Months"
    },
    {
        product: "CodeBuild",
        limit: "100 Build Minutes / Month",
        risk: "LOW",
        risk_desc: "Low minutes",
        mitigation: "Use GitHub Actions",
        type: "Always Free"
    },
    {
        product: "CodePipeline",
        limit: "1 Active Pipeline",
        risk: "LOW",
        risk_desc: "Single pipeline limitation",
        mitigation: "Mono-repo",
        type: "Always Free"
    },
    {
        product: "CodeCatalyst",
        limit: "2,000 Build Minutes",
        risk: "LOW",
        risk_desc: "Integrated dev environment",
        mitigation: "Use for prototyping",
        type: "Always Free"
    },
    {
        product: "Systems Manager",
        limit: "Parameter Store (Free)",
        risk: "LOW",
        risk_desc: "Standard features are free",
        mitigation: "-",
        type: "Always Free"
    },
    {
        product: "CloudTrail",
        limit: "1 Trail",
        risk: "LOW",
        risk_desc: "Audit logs",
        mitigation: "-",
        type: "Always Free"
    },
    {
        product: "X-Ray",
        limit: "100k Traces",
        risk: "LOW",
        risk_desc: "Tracing",
        mitigation: "-",
        type: "Always Free"
    }
];

export default function AwsFreeTiers() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 md:p-12 font-sans text-black">
            <div className="w-full max-w-6xl min-h-[80vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">

                {/* HEAD */}
                <header className="p-12 border-b-4 border-black bg-orange-50 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">AWS</div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter text-orange-900">AWS Free Tier</h1>
                        </div>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-60">The Heavy Metal • 12 Month Limits</p>
                    </div>
                </header>

                <div className="flex-1 p-12 overflow-x-auto">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
                        <p className="font-mono text-sm">
                            <strong>⚠️ WARNING:</strong> Many AWS Free Tiers expire after 12 months.
                            Google Cloud run is &quot;Always Free&quot;. AWS is a &quot;Trap&quot; if you forget.
                        </p>
                    </div>

                    <table className="w-full border-4 border-black text-left border-collapse">
                        <thead>
                            <tr className="bg-orange-900 text-white uppercase text-sm font-bold tracking-wider">
                                <th className="p-4 border-r-2 border-white/20">Product</th>
                                <th className="p-4 border-r-2 border-white/20">Type</th>
                                <th className="p-4 border-r-2 border-white/20 w-1/3">Limit</th>
                                <th className="p-4 border-r-2 border-white/20">Risk</th>
                                <th className="p-4">Mitigation</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {FREE_TIER_DATA.map((row, i) => (
                                <tr key={row.product} className={`border-b-2 border-black ${i % 2 === 0 ? 'bg-white' : 'bg-orange-50'} hover:bg-orange-100 transition-colors`}>
                                    <td className="p-4 border-r-2 border-black font-bold uppercase">{row.product}</td>
                                    <td className="p-4 border-r-2 border-black">
                                        <span className={`text-xs px-2 py-1 uppercase font-bold border border-black ${row.type === 'Always Free' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>
                                            {row.type}
                                        </span>
                                    </td>
                                    <td className="p-4 border-r-2 border-black whitespace-pre-line">{row.limit}</td>
                                    <td className="p-4 border-r-2 border-black">
                                        <span className={`px-2 py-1 font-bold text-xs border border-black ${row.risk === 'HIGH' ? 'bg-red-500 text-white' :
                                                row.risk === 'MED' ? 'bg-yellow-400 text-black' :
                                                    'bg-green-400 text-black'
                                            }`}>
                                            {row.risk}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs font-bold text-orange-900">{row.mitigation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* FOOTER NOTE */}
                    <div className="mt-8 p-4 border-2 border-black bg-neutral-100 text-xs font-mono opacity-60">
                        * Data sourced from AWS Free Tier Offerings.
                        <div className="mt-2 font-bold">
                            &quot;Always Free&quot; items are usually reliable. &quot;12 Months Free&quot; will expire. &quot;Trials&quot; are dangerous if you forget.
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t-4 border-black bg-white flex justify-between">
                    <button onClick={() => router.push('/dashboard/infra/free-tiers')} className="font-bold uppercase tracking-widest hover:underline">
                        ← Back to Registry
                    </button>
                    <button onClick={() => window.open('https://aws.amazon.com/free', '_blank')} className="font-bold uppercase tracking-widest hover:underline text-xs opacity-50">
                        Verify on AWS ↗
                    </button>
                </div>
            </div>
        </div>
    );
}
