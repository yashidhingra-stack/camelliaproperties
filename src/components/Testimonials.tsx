import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Rajesh Sharma",
    text: "Camellia Properties helped us find our dream home with complete transparency and professionalism.",
    rating: 5
  },
  {
    name: "Priya Verma",
    text: "Excellent service and expert guidance throughout the investment process. Highly satisfied.",
    rating: 5
  },
  {
    name: "Amit Gupta",
    text: "Highly recommended for anyone looking for reliable real estate solutions. They truly care about their clients.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#f4f1ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-[#2c3d30] mb-4">Client Testimonials</h2>
          <p className="text-xs text-[#788575] uppercase tracking-[0.2em] font-semibold">
            Words from our clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-10 rounded-2xl shadow-sm border border-[#d1d6cf] flex flex-col relative"
            >
              <div className="text-[#d1d6cf] text-6xl absolute top-6 right-8 font-serif leading-none">"</div>
              <div className="flex mb-6 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#2c3d30] fill-current mr-1" />
                ))}
              </div>
              <p className="text-[15px] text-[#4f574d] mb-8 leading-relaxed flex-grow relative z-10">
                "{testimonial.text}"
              </p>
              <div className="font-medium text-[#2c3d30] text-sm tracking-wide">
                — {testimonial.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
