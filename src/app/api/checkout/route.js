import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    // 1) Parse request JSON
    const body = await req.json();
    const origin = new URL(req.url).origin;

    // 2) Extract values (with sane defaults)
    const {
      lineItems,
      email,          // Accept both from frontend
      key_type,
      quantity = 10,
    } = body || {};

    // Use whichever was provided
    // const finalKeyType = key_type || keyType;

    // 3) Validate basics
    if (!email || !key_type) {
      return NextResponse.json(
        { error: "Missing required fields: email and keyType are required." },
        { status: 400 }
      );
    }

    // 4) Build a safe line_items array
    const items = Array.isArray(lineItems) && lineItems.length > 0
      ? lineItems
      : [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Blog Keys (10-pack)" },
              unit_amount: 100,
            },
            quantity: 1,
          },
        ];

    // 5) ✅ CRITICAL: Use snake_case for Stripe metadata
    // Stripe normalizes keys, so use lowercase with underscores
    const metadata = {
      email: String(email),
      key_type: String(key_type).toLowerCase(), // ✅ snake_case
      quantity: String(quantity),
    };

    console.log("🔍 Creating checkout session with metadata:", metadata);
    console.log("📧 Email:", email);
    // console.log("🔑 Key Type:", finalKeyType);
    console.log("🔢 Quantity:", quantity);

    // 6) Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata, // ✅ This will have: email, key_type, quantity
    });

    console.log("✅ Session created:", session.id);

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Stripe checkout error:", error);
    const message = typeof error?.message === "string" ? error.message : "Bad Request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}