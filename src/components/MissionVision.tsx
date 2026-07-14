import { motion } from 'motion/react';
import { Target, Lightbulb } from 'lucide-react';

export default function MissionVision() {
  return (
    <section className="py-24 bg-white border-t border-[#d1d6cf]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#f4f1ed] p-12 rounded-3xl"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
              <Target className="w-8 h-8 text-[#2c3d30]" />
            </div>
            <h3 className="text-2xl font-light text-[#2c3d30] mb-4">Our Mission</h3>
            <p className="text-[15px] text-[#4f574d] leading-relaxed">
              To provide trustworthy, transparent, and customer-centric real estate services while helping clients achieve their property ownership and investment goals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#2c3d30] text-white p-12 rounded-3xl"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">Our Vision</h3>
            <p className="text-[15px] text-[#a5b5a2] leading-relaxed">
              To become the most preferred real estate partner by delivering exceptional value, innovative solutions, and unmatched customer satisfaction.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
