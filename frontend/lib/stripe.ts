// frontend/lib/stripe.ts

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

// Single shared Stripe client for the app.
// We don't force apiVersion here so it matches the installed stripe package.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
