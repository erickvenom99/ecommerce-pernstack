import React from 'react';

export default function AboutPage() {
  const features = [
    { title: 'Fast Delivery', desc: 'Get your items delivered to your doorstep in record time, hassle-free.', icon: '⚡' },
    { title: 'Secure Payments', desc: 'Shop with confidence using our fully encrypted, secure payment gateways.', icon: '🛡️' },
    { title: '24/7 Support', desc: 'Our dedicated customer service team is always here to help you out.', icon: '🤝' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-amber-500 mb-6">
            Rethinking the way you shop online.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Welcome to <span className="font-semibold text-amber-500">Ally-Buy</span>. We bridge the gap between premium quality and seamless accessibility, bringing the marketplace right to your screen.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-amber-500">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At Ally-Buy, our goal is simple: to build a frictionless shopping experience. We believe that finding and purchasing your favorite products should be effortless, secure, and lightning-fast. 
          </p>
          <p className="text-gray-600 leading-relaxed">
            By eliminating unnecessary bloat and focusing on clean design, we ensure you spend less time navigating and more time enjoying what you buy.
          </p>
        </div>
        <div className="bg-gradient-to-tr from-yellow-500 to-purple-600 h-64 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-bold">
          [ Go Cart Concept Visual ]
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-100 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-amber-500 mb-12">Why Choose Ally-Buy?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feat.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feat.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}