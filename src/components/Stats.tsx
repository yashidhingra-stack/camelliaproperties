import { motion } from 'motion/react';

const stats = [
  { value: "500+", label: "Properties Sold" },
  { value: "1000+", label: "Happy Clients" },
  { value: "15+", label: "Years Experience" },
  { value: "50+", label: "Expert Agents" },
];

export default function Stats() {
  return (
    <section className="bg-[#f4f1ed] text-[#2c3d30] py-20 border-y border-[#d1d6cf]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-5xl font-light tracking-tighter mb-3">{stat.value}</span>
              <span className="text-xs uppercase font-semibold tracking-[0.15em] text-[#4f574d]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
