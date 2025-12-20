import os
import json
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

# Handle imports for both module and standalone execution
try:
    from ..models import ComparisonContext
except ImportError:
    # Fallback for standalone execution
    import sys
    backend_path = Path(__file__).resolve().parent.parent.parent
    if str(backend_path) not in sys.path:
        sys.path.insert(0, str(backend_path))
    from app.models import ComparisonContext

# Load .env from project root
project_root = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(project_root / ".env.local", override=True)
load_dotenv(project_root / ".env")
load_dotenv(project_root / "backend" / ".env.local", override=True)
load_dotenv(project_root / "backend" / ".env")

# Gemini setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Groq fallback client
groq_client = None

def get_groq_client():
    global groq_client
    if groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        groq_client = Groq(api_key=api_key)
    return groq_client

# Flexible snippet templates for common winners — LLM adapts or generates fresh for any tech
SNIPPET_TEMPLATES = {
    # Databases
    "supabase_react": """
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fetch user profile example
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return data
}
""",

    "firebase_react": """
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"

const firebaseConfig = { /* paste your config from console */ }

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Get user profile example
export async function getUserProfile() {
  const user = auth.currentUser
  if (!user) return null
  const docSnap = await getDoc(doc(db, "users", user.uid))
  return docSnap.exists() ? docSnap.data() : null
}
""",

    "postgres_node": """
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432,
})

// Query example
async function getUser(id) {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return res.rows[0]
}
""",

    # Auth
    "clerk_nextjs": """
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

// Protected page example
import { SignedIn, UserButton } from '@clerk/nextjs'
<SignedIn>
  <UserButton />
</SignedIn>
""",

    "nextauth_nextjs": """
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
""",

    # Hosting/Deployment
    "railway_deploy": """
# In your repo root, install CLI if needed: npm i -g @railway/cli

# Link and deploy
railway link  # select your project
railway up    # deploys current dir

# Set env vars in Railway dashboard
# Example service config in railway.toml (optional):
[start]
cmd = "node app.js"
""",

    "render_deploy": """
# render.yaml example in root
services:
  - type: web
    name: my-app
    runtime: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production

# Deploy with Git integration or CLI: render deploy
""",

    # Payments/Business
    "stripe_node": """
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Create checkout session example
async function createCheckoutSession() {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: 'price_1ABC123', quantity: 1 }],
    mode: 'subscription',
    success_url: 'https://your-site/success',
    cancel_url: 'https://your-site/cancel',
  })
  return session.id
}
""",

    # AWS/GCP
    "aws_s3_node": """
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

// Upload file example
async function uploadFile(fileName, fileContent) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
  }
  return await s3.upload(params).promise()
}
""",

    "gcp_storage_node": """
const { Storage } = require('@google-cloud/storage')
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID,
})

// Upload file example
async function uploadFile(bucketName, fileName, fileContent) {
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(fileName)
  await file.save(fileContent)
  return file.publicUrl()
}
""",

    # UI Frameworks
    "tailwind_config": """
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// In your CSS file
@tailwind base;
@tailwind components;
@tailwind utilities;
""",

    # General fallback for obscure (e.g., Erlang)
    "general_python": """
# Example setup for {winner}
import some_library  # install via pip if needed

def main():
  # Simple usage
  result = some_library.function(param='value')
  print(result)

if __name__ == "__main__":
  main()
""",
}

async def run(context: ComparisonContext) -> ComparisonContext:
    """
    NarrativeAgent: Synthesizes everything into the final Decision Brief.
    Primary: Gemini 1.5 Flash for conversational voice.
    Fallback: Groq Llama 3.3 70B if Gemini rate-limited.
    """
    data = context.model_dump()

    # Extract cost data for prompt
    cost_a = context.cost_breakdown.get("year1_tco", {}).get("a", "N/A")
    cost_b = context.cost_breakdown.get("year1_tco", {}).get("b", "N/A")
    breakeven = context.cost_breakdown.get("breakeven_users", "N/A")
    
    # Extract gotchas
    gotchas_a = context.risks.get("gotchas_a", [])
    gotchas_b = context.risks.get("gotchas_b", [])
    
    # Extract migration effort
    migration_a_to_b = context.risks.get("migration_effort", {}).get("a_to_b", "Unknown")
    migration_b_to_a = context.risks.get("migration_effort", {}).get("b_to_a", "Unknown")

    # Include templates in prompt for LLM reference
    templates_json = json.dumps(SNIPPET_TEMPLATES, indent=2)
    
    prompt = f"""
You are a $500/hour technical co-founder who has built, scaled, and failed with dozens of stacks. 
A founder just asked you: "{context.query}"

You have this structured data from your specialist team:
{json.dumps(context.model_dump(), indent=2)}

Available code snippet templates (use as reference, adapt, or generate fresh):
{templates_json}

Your job: Write a tight, punchy Decision Brief that makes the founder feel like they just got the perfect advice over coffee.

Rules:
- ALWAYS pick ONE clear winner. Never hedge, never say "it depends" or "both are great".
- Speak directly to "you" — make it deeply personal based on their constraints, use case, team size, budget.
- Keep total length 400–600 words max.
- Use real numbers, one short war story if available, and honest trade-offs.
- End with momentum — they should feel excited to start.

Output EXACTLY this markdown structure:

# The Verdict
🎯 Pick [Winner]. 
You'll [biggest tangible benefit — e.g., save $1,800/year and ship 2 weeks faster]. 
Only consider the other if [one very specific condition].

# Why This Fits You Right Now
[2 tight paragraphs:
• Why the winner perfectly matches their situation (reference constraints/use_case/team/budget explicitly).
• One short, believable war story if available ("I saw a solo founder waste 3 weeks on X's security rules...").
• Honest but brief trade-off acknowledgment.]

# The Money
💰 Year 1 cost at your scale: Winner ~$[low number] vs Loser ~$[high number]
├─ You stay cheaper until ~[breakeven] users
└─ Biggest trap: [one specific cost gotcha from data]

# Watch Out For
🚨 Winner risks:
• [gotcha 1]
• [gotcha 2]

🚨 Loser risks:
• [gotcha 1]
• [gotcha 2]

🎯 My take: [short opinion on which set of risks is uglier in practice]

# Start in 15 Minutes
1. Head to [winner official domain, e.g., supabase.com] and sign up/create project
2. Grab your keys/config from the dashboard
3. Copy-paste this exact starter code (tailored to your query):

```tsx
[CRITICAL: Generate a real, working 8–15 line code snippet for ANY winner.
- First, check SNIPPET_TEMPLATES for a match (e.g., "supabase_react" if winner=Supabase and stack=React).
- If match, use and adapt it to user context.
- If no match (obscure tech like Erlang or non-code like PayPal), generate fresh: config steps, API call, or deploy command.
- Infer stack: React/Next.js if mentioned, Node/Python if backend, general JS if unspecified.
- For databases: client init + auth + simple query/insert.
- For auth: provider setup + protected example.
- For hosting: deploy CLI commands + config file.
- For payments: API init + checkout example.
- Make it complete, idiomatic, runnable — use env vars, no <placeholders>.
- Handle ANY tech analogy: if Erlang vs Go, give process spawn example in Erlang.]

You'll have core functionality running in 15–20 minutes. I've shipped this pattern many times.

# Escape Hatch
Winner → Loser: [effort from risks]
Loser → Winner: [effort from risks]

My take: Start simple with the winner. Regret costs more than migration.

Tone: Confident, direct, slightly edgy, deeply caring — like the co-founder who genuinely wants you to succeed.
"""

    try:
        # Use the model from config or default to gemini-1.5-flash-latest
        model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash-latest")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        context.final_brief = response.text
    except Exception as e:
        print(f"Gemini failed ({e}), falling back to Groq...")
        client = get_groq_client()
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=1024
        )
        context.final_brief = completion.choices[0].message.content.strip()

    return context

# Standalone test
if __name__ == "__main__":
    import asyncio
    async def test():
        ctx = ComparisonContext(query="test")
        ctx.option_a = "Firebase"
        ctx.option_b = "Supabase"
        ctx.constraints = ["low cost", "bootstrapped"]
        ctx.use_case = "SaaS MVP"
        ctx.cost_breakdown = {"year1_tco": {"a": 1140, "b": 300}, "breakeven_users": 40000}
        ctx.performance = {"war_stories": ["One team got a $2K bill shock from Firebase reads"]}
        ctx.risks = {"gotchas_a": ["Read overages", "Security rules"], "gotchas_b": ["Younger ecosystem"], "migration_effort": {"a_to_b": "1-2 weeks", "b_to_a": "3-5 days"}}
        result = await run(ctx)
        print("\n=== FINAL DECISION BRIEF ===\n")
        # Handle Unicode encoding for Windows console
        import sys
        if sys.stdout.encoding != 'utf-8':
            sys.stdout.reconfigure(encoding='utf-8')
        print(result.final_brief)
    asyncio.run(test())
