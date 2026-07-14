import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
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
            <h3 className="text-2xl font-light text-[#2c3d30] mb-8">Send us a Message</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#4f574d] mb-2">Full Name</label>
                <input type="text" id="name" className="w-full bg-white border border-[#d1d6cf] text-[#2c3d30] p-3 rounded-lg focus:border-[#2c3d30] focus:ring-1 focus:ring-[#2c3d30] transition-colors outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#4f574d] mb-2">Email Address</label>
                <input type="email" id="email" className="w-full bg-white border border-[#d1d6cf] text-[#2c3d30] p-3 rounded-lg focus:border-[#2c3d30] focus:ring-1 focus:ring-[#2c3d30] transition-colors outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#4f574d] mb-2">Phone Number</label>
                <input type="tel" id="phone" className="w-full bg-white border border-[#d1d6cf] text-[#2c3d30] p-3 rounded-lg focus:border-[#2c3d30] focus:ring-1 focus:ring-[#2c3d30] transition-colors outline-none" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label htmlFor="message" className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#4f574d] mb-2">Message</label>
                <textarea id="message" rows={4} className="w-full bg-white border border-[#d1d6cf] text-[#2c3d30] p-3 rounded-lg focus:border-[#2c3d30] focus:ring-1 focus:ring-[#2c3d30] transition-colors outline-none resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full bg-[#2c3d30] text-white text-[11px] uppercase tracking-[0.2em] font-semibold py-4 rounded-full hover:bg-[#3a4f40] transition-colors mt-4">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
