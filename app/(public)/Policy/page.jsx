import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Ally Buy',
  description: 'Privacy Policy details for Ally Buy.',
};

export default function Policy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: August 2, 2026</p>

      <p className="text-sm leading-relaxed mb-6">
        Ally Buy (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) operates the website{' '}
        <a href="https://ally-buy.com" className="text-amber-500 hover:underline">
          ally-buy.com
        </a>
        . This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or make a purchase from us.
      </p>

      <p className="text-sm leading-relaxed mb-8">
        By using Ally Buy, you consent to the practices described in this Privacy Policy.
      </p>

      <div className="space-y-6 text-sm leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Information We Collect</h2>
          <p className="mb-2">We may collect the following types of information:</p>
          
          <div className="space-y-3 pl-4">
            <div>
              <p className="font-medium text-slate-900">(a) Information you provide to us:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-700">
                <li>Full name</li>
                <li>Delivery address</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Order details (products purchased, order history)</li>
                <li>Any information you provide when contacting customer support</li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-slate-900">(b) Payment information:</p>
              <p className="text-slate-700 mt-1">
                We use Paystack as our payment processor. Payment card details are collected and processed directly by Paystack; we do not store your full card details on our servers.
              </p>
            </div>

            <div>
              <p className="font-medium text-slate-900">(c) Automatically collected information:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-700">
                <li>IP address</li>
                <li>Browser type and device information</li>
                <li>Pages visited and time spent on our website</li>
                <li>Cookies and similar tracking technologies (see Section 5)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">2. How We Use Your Information</h2>
          <p className="mb-2">We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Process and fulfill your orders, including shipping and delivery within Nigeria;</li>
            <li>Communicate with you about your orders, including confirmations and delivery updates;</li>
            <li>Respond to customer service inquiries;</li>
            <li>Improve our website, products, and customer experience;</li>
            <li>Detect and prevent fraud or unauthorized transactions;</li>
            <li>Comply with legal obligations.</li>
          </ul>
          <p className="mt-3 font-medium text-slate-900">
            We do not sell your personal information to third parties.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">3. How We Share Your Information</h2>
          <p className="mb-2">We may share your information with:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li><strong>Payment processors (Paystack)</strong> to process your payments securely;</li>
            <li><strong>Delivery/courier partners</strong> to fulfill and deliver your orders within Nigeria;</li>
            <li><strong>Service providers</strong> who help us operate our website (e.g., hosting providers), under obligations to protect your data;</li>
            <li><strong>Law enforcement or regulators</strong>, where required by law or to protect our legal rights.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Data Retention</h2>
          <p className="text-slate-700">
            We retain your personal information for as long as necessary to fulfill the purposes described in this policy, including to comply with legal, accounting, or reporting requirements.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Cookies</h2>
          <p className="text-slate-700">
            Our website may use cookies and similar technologies to remember your preferences, keep items in your cart, and understand how visitors use our site. You can control cookies through your browser settings; disabling cookies may affect certain website functionality.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Data Security</h2>
          <p className="text-slate-700">
            We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Your Rights</h2>
          <p className="mb-2 text-slate-700">Depending on applicable law, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Access the personal information we hold about you;</li>
            <li>Request correction of inaccurate information;</li>
            <li>Request deletion of your personal information, subject to legal or contractual retention requirements;</li>
            <li>Object to or restrict certain processing of your information.</li>
          </ul>
          <p className="mt-2 text-slate-700">
            To exercise any of these rights, contact us using the details below.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">8. Children&apos;s Privacy</h2>
          <p className="text-slate-700">
            Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">9. Changes to This Policy</h2>
          <p className="text-slate-700">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last updated&quot; date.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">10. Contact Us</h2>
          <p className="text-slate-700 mb-2">
            If you have questions or concerns about this Privacy Policy or how we handle your personal information, please contact us:
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 space-y-1">
            <p><strong>Email:</strong> allybuy23@gmail.com</p>
            <p><strong>Phone:</strong> +234-806-087-2223</p>
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