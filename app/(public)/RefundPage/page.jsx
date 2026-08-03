import React from 'react';

export const metadata = {
  title: 'Refund & Cancellation Policy | Ally Buy',
  description: 'Refund, return, and order cancellation policy for Ally Buy.',
};

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-2">Refund and Cancellation Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: August 2, 2026</p>

      <p className="text-sm leading-relaxed mb-8">
        At Ally Buy, we want you our esteemed customer to be satisfied with your purchase. This policy explains how refunds, returns, and order cancellations work.
      </p>

      <div className="space-y-6 text-sm leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Order Cancellations</h2>
          <p className="mb-2 text-slate-700">
            You may cancel an order <strong>free of charge before it has been shipped</strong>. To cancel, contact us within 14 days of purchase at{' '}
            <a href="mailto:osenoye.aghaulor@gmail.com" className="text-amber-500 hover:underline">
              osenoye.aghaulor@gmail.com
            </a>{' '}
            or <strong>09135008700</strong> with your order number.
          </p>
          <p className="text-slate-700">
            Once an order has been shipped, it can no longer be cancelled, but you may be eligible for a return under Section 2 below.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Returns and Refund Eligibility</h2>
          <p className="mb-2 text-slate-700">
            You may request a return and refund within 7 days of delivery.
          </p>
          <p className="mb-2 text-slate-700">To be eligible for a refund, the item must be:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 mb-3">
            <li>Unused and in the same condition you received it;</li>
            <li>In its original packaging, with tags/labels intact (where applicable);</li>
            <li>Accompanied by proof of purchase (order number or receipt).</li>
          </ul>
          <p className="text-slate-700">
            Certain items may not be eligible for return, including but not limited to: Fragrance, personal care/hygiene items such as underwear, and items marked as final sale at the time of purchase. Any such exclusions will be clearly stated on the product page.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">3. How to Request a Refund or Return</h2>
          <p className="mb-2 text-slate-700">To start a return or refund request:</p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-700">
            <li>
              Contact us within 7 days of delivery at{' '}
              <a href="mailto:osenoye.aghaulor@gmail.com" className="text-amber-500 hover:underline">
                osenoye.aghaulor@gmail.com
              </a>{' '}
              or <strong>09135008700</strong> with your order number and reason for the return.
            </li>
            <li>We will review your request and provide instructions for returning the item, if approved.</li>
            <li>Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund.</li>
          </ol>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Refund Method and Timing</h2>
          <p className="mb-2 text-slate-700">
            Approved refunds will be issued to your original payment method via Paystack.
          </p>
          <p className="mb-2 text-slate-700">
            Please allow up to <strong>7–10 business days</strong> for the refund to reflect, depending on your bank or payment provider&apos;s processing times.
          </p>
          <p className="text-slate-700">
            If a product was damaged, defective, or incorrect on arrival, please notify us within 48 hours of delivery with photos of the item, and we will arrange a replacement or full refund, including any applicable return shipping costs.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Return Shipping Costs</h2>
          <p className="mb-2 text-slate-700">
            If the return is due to our error (wrong item shipped, defective product), we will cover return shipping costs.
          </p>
          <p className="text-slate-700">
            If the return is due to a change of mind or other reasons not related to our error, the customer is responsible for return shipping costs, unless otherwise stated.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Non-Refundable Situations</h2>
          <p className="mb-2 text-slate-700">We reserve the right to decline a refund or return where:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>The request is made more than 7 days after delivery;</li>
            <li>The item shows signs of use, damage not caused by us, or is missing original packaging;</li>
            <li>The item falls under a category excluded from returns (see Section 2).</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Contact Us</h2>
          <p className="text-slate-700 mb-2">
            For any questions about cancellations, returns, or refunds, reach out to us:
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 space-y-1">
            <p><strong>Email:</strong> osenoye.aghaulor@gmail.com</p>
            <p><strong>Phone:</strong> 09135008700</p>
            <p>
              <strong>Website:</strong>{' '}
              <a href="https://ally-buy.com" className="text-amber-500 hover:underline">
                ally-buy.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}