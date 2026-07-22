import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    try {
      await addDoc(collection(db, 'inquiries'), {
        propertyName: 'General Contact Inquiry',
        name,
        email,
        phone,
        message,
        recipient: 'Romaldeep Singh',
        recipientPhone: '9564000003',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error saving contact message:", err);
    }

    const formattedText = `*New Contact Inquiry for Romaldeep Singh*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone Number:* ${phone}\n` +
      (email ? `*Email:* ${email}\n` : '') +
      `*Message:* ${message || 'Interested in property consultation.'}`;

    const whatsappUrl = `https://wa.me/919564000003?text=${encodeURIComponent(formattedText)}`;
    window.open(whatsappUrl, '_blank');

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 6000);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#2c3d30] mb-6">Get In Touch</h2>
            <p className="text-[15px] text-[#4f574d] mb-12 leading-relaxed max-w-md">
              Whether you are looking to buy, sell, or invest, our experts are here to help you every step of the way.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 w-12 h-12 bg-[#f4f1ed] rounded-full flex items-center justify-center border border-[#d1d6cf]">
                  <MapPin className="w-5 h-5 text-[#2c3d30]" />
                </div>
                <div className="ml-5">
                  <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#2c3d30] mb-1">Office Address</h4>
                  <p className="text-[15px] text-[#4f574d]">
                    #1029 sector 89<br/>
                    Mohali, Punjab<br/>
                    <span className="text-[12px] opacity-70 mt-1 block font-mono">30°41'23.4"N 76°41'26.4"E</span>
                  </p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=30.689837,76.690653" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center mt-2 text-[11px] uppercase tracking-[0.1em] text-[#2c3d30] font-bold hover:text-[#4f574d] transition-colors"
                  >
                    View on Google Maps &rarr;
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 w-12 h-12 bg-[#f4f1ed] rounded-full flex items-center justify-center border border-[#d1d6cf]">
                  <Phone className="w-5 h-5 text-[#2c3d30]" />
                </div>
                <div className="ml-5">
                  <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#2c3d30] mb-1">Phone</h4>
                  <p className="text-[15px] text-[#4f574d] mb-1">Ajay Chawla: +91 97655 00002</p>
                  <p className="text-[15px] text-[#4f574d] mb-1">Romal Deep Singh: +91 95640 00003</p>
                  <p className="text-[15px] text-[#4f574d]">Navneet Chawla: +91 73550 00078</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 w-12 h-12 bg-[#f4f1ed] rounded-full flex items-center justify-center border border-[#d1d6cf]">
                  <Mail className="w-5 h-5 text-[#2c3d30]" />
                </div>
                <div className="ml-5">
                  <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#2c3d30] mb-1">Email</h4>
                  <p className="text-[15px] text-[#4f574d]">info@camelliaproperties.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 w-12 h-12 bg-[#f4f1ed] rounded-full flex items-center justify-center border border-[#d1d6cf]">
                  <Clock className="w-5 h-5 text-[#2c3d30]" />
                </div>
                <div className="ml-5">
                  <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#2c3d30] mb-1">Working Hours</h4>
                  <p className="text-[15px] text-[#4f574d]">
                    Monday – Saturday: 9:00 AM – 7:00 PM<br/>
                    Sunday: By Appointment Only
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#f4f1ed] p-10 rounded-3xl border border-[#d1d6cf]"
          >
            <h3 className="text-2xl font-light text-[#2c3d30] mb-2">Send us a Message</h3>
            <p className="text-xs text-[#4f574d] mb-6">Inquiries are sent directly to Romaldeep Singh (+91 95640 00003)</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#4f574d] mb-2">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#d1d6cf] text-[#2c3d30] p-3 rounded-lg focus:border-[#2c3d30] focus:ring-1 focus:ring-[#2c3d30] transition-colors outline-none text-xs font-medium" 
                  placeholder="Your Name" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#4f574d] mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#d1d6cf] text-[#2c3d30] p-3 rounded-lg focus:border-[#2c3d30] focus:ring-1 focus:ring-[#2c3d30] transition-colors outline-none text-xs font-medium" 
                  placeholder="john@example.com (Optional)" 
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#4f574d] mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#d1d6cf] text-[#2c3d30] p-3 rounded-lg focus:border-[#2c3d30] focus:ring-1 focus:ring-[#2c3d30] transition-colors outline-none text-xs font-medium" 
                  placeholder="+91 95640 00003" 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#4f574d] mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={3} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-[#d1d6cf] text-[#2c3d30] p-3 rounded-lg focus:border-[#2c3d30] focus:ring-1 focus:ring-[#2c3d30] transition-colors outline-none resize-none text-xs font-medium" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] uppercase tracking-[0.15em] font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Send Message to Romaldeep Singh (+91 95640 00003)
              </button>

              {isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium text-center space-y-2"
                >
                  <p className="font-bold">🎉 Message Sent to Romaldeep Singh!</p>
                  <p className="text-[11px] text-emerald-800">Your inquiry has been logged and sent via WhatsApp (+91 95640 00003).</p>
                  <a 
                    href={`https://wa.me/919564000003?text=${encodeURIComponent(`Hi Romaldeep Singh,\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white font-bold rounded-lg text-[10px] uppercase tracking-wider shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    Open WhatsApp Chat
                  </a>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
