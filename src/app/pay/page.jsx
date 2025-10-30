'use client'

import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'

// Initialize Stripe with your public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Page() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineItems: [
            {
              price_data: {
                currency: 'usd',
                product_data: { name: 'Sample Product' },
                unit_amount: 100,
              },
              quantity: 1,
            },
          ],
        }),
      })

      const data = await res.json()

      // Redirect using Stripe-hosted URL if available
      if (data.url) {
        window.location.href = data.url
        return
      }

      // Fallback: redirect using session ID
      if (data.id) {
        const stripe = await stripePromise
        await stripe.redirectToCheckout({ sessionId: data.id })
      }
    } catch (err) {
      console.error(err)
      alert('Checkout failed. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-semibold">Buy Sample Product</h1>
      <p className="text-gray-600">$1 • One-time payment</p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="px-6 py-2 rounded-md bg-black text-white disabled:opacity-60"
      >
        {loading ? 'Redirecting…' : 'Pay $19.99'}
      </button>
    </div>
  )
}
