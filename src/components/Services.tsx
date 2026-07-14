import { motion } from 'motion/react';
import { Home, Building2, TrendingUp, Key, LineChart, Landmark } from 'lucide-react';

const services = [
  {
    title: "Residential Properties",
    description: "Find your dream home from our wide range of apartments, villas, independent houses, and plots.",
    icon: Home
  },
  {
    title: "Commercial Properties",
    description: "Explore offices, retail shops, warehouses, and commercial spaces in prime locations.",
    icon: Building2
  },
  {
    title: "Property Investment",
    description: "Get expert advice on high-return investment opportunities and emerging real estate markets.",
    icon: TrendingUp
  },
  {
    title: "Property Management",
    description: "Complete property maintenance, tenant management, and rental assistance services.",
    icon: Key
  },
  {
    title: "Property Valuation",
    description: "Professional property assessment and accurate market value analysis.",
    icon: LineChart
  },
  {
    title: "Loan Assistance",
    description: "Comprehensive guidance and support for home loans and property financing.",
    icon: Landmark
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-[#2c3d30] mb-4">Our Services</h2>
          <p className="text-xs text-[#788575] uppercase tracking-[0.2em] font-semibold">
            Comprehensive Real Estate Solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#f4f1ed] p-10 rounded-2xl border border-[#d1d6cf] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 text-[#2c3d30] group-hover:scale-110 transition-transform">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-[#2c3d30] mb-3">{service.title}</h3>
              <p className="text-sm text-[#4f574d] leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
