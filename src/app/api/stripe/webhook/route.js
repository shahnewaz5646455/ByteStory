// api/stripe/webhook/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database.Connection";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

/**
 * Build $inc object for different key types
 * Supports: blog, email, pdf, seo, hashtag, grammar
 */
function buildInc(keyType, quantity) {
  const type = String(keyType || "").toLowerCase().trim();

  const keyMap = {
    blog: "blog_key",
    email: "email_key",
    pdf: "pdf_key",
    seo: "seo_key",
    hashtag: "hashtag_key",
    grammar: "grammar_key",
  };

  const fieldName = keyMap[type] || `${type}_key`;
  return { [fieldName]: quantity };
}

export async function POST(req) {
  console.log("🔔 Webhook received");

  // Stripe signature + raw body (App Router requires raw body for verification)
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook signature verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Only handle completed checkout sessions
  if (event.type !== "checkout.session.completed") {
    console.log("ℹ️ Ignoring event type:", event.type);
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object; // Stripe.Checkout.Session

    console.log("📦 Session ID:", session.id);
    console.log("🔍 Full Metadata:", JSON.stringify(session.metadata, null, 2));

    // Metadata (snake_case recommended)
    const email = session?.metadata?.email;
    const keyType = session?.metadata?.key_type; // e.g., "blog", "email"
    const quantityRaw = session?.metadata?.quantity;
    const quantity = parseInt(quantityRaw, 10) || 0;

    console.log("📧 Email:", email);
    console.log("🔑 Key Type:", keyType);
    console.log("🔢 Quantity:", quantity);

    // Validate required fields
    if (!email || !keyType || quantity < 1) {
      console.warn("⚠️ Missing/invalid metadata. Skipping database update.", {
        email,
        keyType,
        quantity,
        sessionId: session.id,
      });
      return NextResponse.json({ received: true });
    }

    // DB connect
    const conn = await connectDB();
    const db = conn.connection.db;

    // Idempotency: skip if this session was processed before
    const paymentsCol = db.collection("payments");
    const already = await paymentsCol.findOne({ sessionId: session.id });
    if (already) {
      console.log("⏭️ Payment already processed. Skipping.", session.id);
      return NextResponse.json({ received: true, skipped: true });
    }

    // Build increment (e.g. { blog_key: +N } or { email_key: +N })
    const inc = buildInc(keyType, quantity);
    console.log("📈 Will increment:", inc);

    // ✅ UPDATE USER in 'users' collection by email (robust + upsert)
    const usersCol = db.collection("users");
    const normalizedEmail = String(email).trim().toLowerCase();

    const updateRes = await usersCol.updateOne(
      { email: { $regex: `^${normalizedEmail}$`, $options: "i" } }, // case-insensitive match
      {
        $inc: inc,
        $set: { updatedAt: new Date() },
        $setOnInsert: {
          role: "user",
          name: session?.customer_details?.name || "",
          email: normalizedEmail,
          isEmailVerified: true,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Fetch updated snapshot for logging
    const updatedUser = updateRes.upsertedId
      ? await usersCol.findOne({ _id: updateRes.upsertedId })
      : await usersCol.findOne({
          email: { $regex: `^${normalizedEmail}$`, $options: "i" },
        });

    if (!updatedUser) {
      console.warn("⚠️ No user found/created for email:", email);
    } else {
      console.log("✅ User updated:", updatedUser.email, {
        blog_key: updatedUser.blog_key,
        email_key: updatedUser.email_key,
        hashtag_key: updatedUser.hashtag_key,
        pdf_key: updatedUser.pdf_key,
        seo_key: updatedUser.seo_key,
        grammar_key: updatedUser.grammar_key,
      });
    }

    // Record payment for idempotency
    await paymentsCol.insertOne({
      sessionId: session.id,
      email: normalizedEmail,
      keyType: String(keyType).toLowerCase(),
      quantity,
      amount_total: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      payment_status: session.payment_status ?? "unknown",
      customer_email: session.customer_details?.email || normalizedEmail,
      createdAt: new Date(),
      source: "stripe_webhook",
      eventType: event.type,
      processed: true,
    });

    console.log("✅ Payment record saved to 'payments' collection");
    console.log("🎉 Webhook processing completed successfully");

    return NextResponse.json({
      received: true,
      processed: true,
      email: normalizedEmail,
      keysAdded: quantity,
    });
  } catch (err) {
    console.error("❌ Fulfillment error:", err);
    console.error("Stack trace:", err.stack);
    // Return 500 so Stripe will retry if there was a transient failure
    return new NextResponse(`Fulfillment error: ${err.message}`, { status: 500 });
  }
}
