import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Let the installed stripe package pick a compatible apiVersion.
  // If you later need to lock a version, use the one Stripe
  // shows in your dashboard for your account.
});
