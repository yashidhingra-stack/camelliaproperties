import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, HeartHandshake, TrendingUp } from 'lucide-react';
import officeImage from '../assets/images/CP.png';

const reasons = [
  { title: "Trusted Real Estate Experts", icon: ShieldCheck },
  { title: "Verified Property Listings", icon: CheckCircle2 },
  { title: "Transparent Transactions", icon: HeartHandshake },
  { title: "Personalized Consultation", icon: HeartHandshake }, // Reusing icon or could use Users
  { title: "Strong Market Knowledge", icon: TrendingUp },
  { title: "Excellent Customer Support", icon: HeartHandshake }, // Reusing icon or could use Headphones
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#788575] text-xs uppercase tracking-[0.2em] font-semibold mb-4 block">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-light text-[#2c3d30] mb-6 tracking-tight">About Camellia Properties</h2>
            <p className="text-[15px] text-[#4f574d] mb-6 leading-relaxed">
              At Camellia Properties, we believe that buying or investing in real estate is one of life's most important decisions. Our team of experienced professionals works diligently to provide transparent, customer-focused, and result-oriented services.
            </p>
            <p className="text-[15px] text-[#4f574d] mb-10 leading-relaxed">
              With years of experience in residential, commercial, and investment properties, we provide reliable solutions tailored to your specific needs and aspirations.
            </p>
            
            <h3 className="text-xl font-medium text-[#2c3d30] mb-6">Why Choose Us?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-center group">
                  <reason.icon className="w-5 h-5 text-[#2c3d30] mr-3 flex-shrink-0" />
                  <span className="text-sm text-[#3a4f40] font-medium">{reason.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-[#2c3d30]/10">
              <img 
                src={officeImage} 
                alt="Camellia Properties Office" 
                className="w-full h-auto rounded-2xl hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-[#2c3d30] text-white p-8 rounded-2xl shadow-xl hidden md:block">
              <div className="text-5xl font-light mb-1 tracking-tighter">15+</div>
              <div className="text-xs uppercase tracking-[0.2em] font-medium text-[#a5b5a2]">Years Exp</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
