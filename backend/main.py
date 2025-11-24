import os
import json
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import stripe

# ----- Load .env from backend folder ----- #

env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

print("Loaded key:", os.getenv("OPENAI_API_KEY"))
print("Stripe key present:", bool(os.getenv("STRIPE_SECRET_KEY")))
print("Frontend URL:", os.getenv("FRONTEND_URL"))

# OpenAI client (used for website + brand kit)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Stripe client (for checkout)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# ----- FastAPI app + CORS ----- #

app = FastAPI(title="EZ Help Technology Backend (AI + Stripe)")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Models ----- #

class LogoRequest(BaseModel):
    business_name: str
    style: str


class WebsiteRequest(BaseModel):
    business_name: str
    industry: str
    tone: str


class BrandKitRequest(BaseModel):
    business_name: str
    tagline: Optional[str] = None
    brand_keywords: List[str] = []


class CheckoutRequest(BaseModel):
    price_id: str
    mode: str = "subscription"
    success_path: Optional[str] = "/success"
    cancel_path: Optional[str] = "/pricing"


# ----- Health ----- #

@app.get("/health")
def health():
    return {
        "status": "ok",
        "backend": "running",
        "ai": bool(os.getenv("OPENAI_API_KEY")),
        "stripe": bool(os.getenv("STRIPE_SECRET_KEY")),
    }


# ====== LOGO ENDPOINT (NO OPENAI, ALWAYS WORKS) ====== #

@app.post("/api/generate-logo")
async def generate_logo(payload: LogoRequest):
    """
    Stable logo endpoint: no OpenAI calls, always returns 200.
    Frontend still gets business_name + variants[] so nothing breaks.
    You can swap this later for real image generation.
    """
    fallback_variants = [
        {
            "label": f"{payload.business_name} – EZ Orb Style",
            "preview_url": "https://placehold.co/400x400/f97316/ffffff?text=EZ+Orb",
        },
        {
            "label": f"{payload.business_name} – Minimal Dark",
            "preview_url": "https://placehold.co/400x400/111827/eeeeee?text=Minimal",
        },
        {
            "label": f"{payload.business_name} – Gold Accent",
            "preview_url": "https://placehold.co/400x400/facc15/111827?text=Gold",
        },
    ]

    return {
        "mock": True,
        "business_name": payload.business_name,
        "variants": fallback_variants,
    }


# ====== WEBSITE (GPT-4.1) ====== #

@app.post("/api/generate-website")
async def generate_website(payload: WebsiteRequest):
    system_msg = (
        "You are an expert SaaS landing page and small business website copywriter. "
        "Return STRICT JSON with keys: hero, services. "
        'hero: {"headline","subheadline","cta"}. '
        'services: list of {"title","description"}.'
    )

    user_prompt = f"""
    Create website content for a business.

    Business name: "{payload.business_name}"
    Industry: {payload.industry}
    Tone of voice: {payload.tone}

    Focus on clarity, conversion, and simplicity.
    """

    try:
        chat = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
        )
        raw_content = chat.choices[0].message.content
        data = json.loads(raw_content)
    except Exception as e:
        print("Website generation error:", repr(e))
        data = {
            "hero": {
                "headline": f"Launch {payload.business_name} online.",
                "subheadline": "EZ Help Technology + FroBot build your brand, website, and marketing in minutes.",
                "cta": "Get Started",
            },
            "services": [
                {
                    "title": "AI Website Builder",
                    "description": "Instant, responsive website tailored to your industry and tone.",
                },
                {
                    "title": "Branding Engine",
                    "description": "Logos, colors, typography, and messaging all aligned.",
                },
            ],
        }

    return {
        "mock": False,
        "business_name": payload.business_name,
        "hero": data.get("hero", {}),
        "services": data.get("services", []),
    }


# ====== BRAND KIT (GPT-4.1-mini) ====== #

@app.post("/api/generate-brand-kit")
async def generate_brand_kit(payload: BrandKitRequest):
    keywords_str = ", ".join(payload.brand_keywords) if payload.brand_keywords else "modern, clean, professional"

    system_msg = (
        "You are a senior brand strategist. "
        "Return STRICT JSON with keys: colors, typography, voice. "
        "colors is a list of {name, hex}. "
        "typography has heading_font, body_font. "
        "voice has tone, dos, donts (lists of strings)."
    )

    user_prompt = f"""
    Create a brand kit for a business.

    Name: "{payload.business_name}"
    Tagline: "{payload.tagline or 'Powered by EZ Help Technology and FroBot'}"
    Keywords: {keywords_str}

    The palette should work well on dark backgrounds.
    """

    try:
        chat = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
        )

        raw_content = chat.choices[0].message.content
        data = json.loads(raw_content)
    except Exception as e:
        print("Brand kit generation error:", repr(e))
        data = {
            "colors": [
                {"name": "EZ Orange", "hex": "#f97316"},
                {"name": "Deep Charcoal", "hex": "#111827"},
                {"name": "Soft Gray", "hex": "#6b7280"},
                {"name": "Highlight Gold", "hex": "#facc15"},
            ],
            "typography": {
                "heading_font": "Poppins",
                "body_font": "Inter",
            },
            "voice": {
                "tone": "Confident, warm, and practical.",
                "dos": [
                    "Speak clearly and directly.",
                    "Highlight speed, automation, and simplicity.",
                    "Sound like a helpful expert, not a robot.",
                ],
                "donts": [
                    "Don’t overuse jargon.",
                    "Don’t be arrogant or condescending.",
                ],
            },
        }

    return {
        "mock": False,
        "business_name": payload.business_name,
        "colors": data.get("colors", []),
        "typography": data.get("typography", {}),
        "voice": data.get("voice", {}),
    }


# ====== STRIPE CHECKOUT (CREATE SESSION) ====== #

@app.post("/api/create-checkout-session")
async def create_checkout_session(payload: CheckoutRequest):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe is not configured")

    try:
        success_url = f"{FRONTEND_URL.rstrip('/')}{payload.success_path}?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{FRONTEND_URL.rstrip('/')}{payload.cancel_path}"

        session = stripe.checkout.Session.create(
            mode=payload.mode,
            line_items=[
                {
                    "price": payload.price_id,
                    "quantity": 1,
                }
            ],
            success_url=success_url,
            cancel_url=cancel_url,
        )

        return {"checkout_url": session.url}

    except Exception as e:
        print("Stripe checkout error:", repr(e))
        raise HTTPException(status_code=500, detail="Failed to create checkout session")


# ====== STRIPE CHECKOUT (READ SESSION) ====== #

@app.get("/api/checkout-session/{session_id}")
async def get_checkout_session(session_id: str):
    """
    Used by the /success page to show confirmation.
    """
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe is not configured")

    try:
        session = stripe.checkout.Session.retrieve(session_id)

        customer_email = None
        if session.get("customer_details"):
            customer_email = session["customer_details"].get("email")

        return {
            "id": session.id,
            "amount_total": session.amount_total,
            "currency": session.currency,
            "status": session.status,
            "customer_email": customer_email,
            "mode": session.mode,
        }

    except Exception as e:
        print("Stripe session fetch error:", repr(e))
        raise HTTPException(status_code=404, detail="Session not found")
