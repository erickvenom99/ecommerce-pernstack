'use client'; // Include this if using the App Router to handle the form state

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API route trigger)
    console.log('Submitted message:', formData);
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid md:grid-cols-5">
        
        {/* Contact Info Sidebar */}
        <div className="md:col-span-2 bg-amber-500 p-10 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Get in touch</h2>
            <p className="text-white text-sm leading-relaxed">
              Have a question about an order, feedback, or just want to say hello? Drop us a line, and our team will respond within 24 hours.
            </p>
          </div>

          <div className="space-y-4 my-8 md:my-0">
            <div className="flex items-center space-x-3 text-sm text-white">
              <span>📧</span> <span>allybuy23@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-white">
              <span>📍</span> <span>No 14 Jesse-Hillary street, 32108</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-white">
              <span>🕒</span> <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
            </div>
          </div>

          <div className="text-xs text-white">
            &copy; 2026 Ally-buy Inc. All rights reserved.
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 p-10 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Subject</label>
            <input 
              type="text" 
              required
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Order Inquiry, Feedback, etc."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Message</label>
            <textarea 
              rows="5"
              required
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-white font-medium text-sm py-3 px-8 rounded-lg shadow-sm hover:shadow transition-all duration-150"
          >
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
}