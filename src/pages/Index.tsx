import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { GalaxyBackground } from "@/components/background/GalaxyBackground";
import { AnimatedCubes } from "@/components/background/AnimatedCubes";
import { DataStream } from "@/components/ai-elements/DataStream";
import { HeroSection } from "@/components/index/HeroSection";
import { features } from "@/data/features";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#141326]/10" />
      <GalaxyBackground />
      <DataStream />
      <AnimatedCubes />
      
      {/* Content */}
      <div className="relative z-10">
        <HeroSection />

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-[#00dcf5] max-w-2xl mx-auto">
              Seamlessly integrate AI capabilities into your workflow with our powerful features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card cyber-card p-6 md:p-8 group cursor-pointer"
              >
                <div className="text-[#32ed83] mb-4 transition-transform duration-300 group-hover:scale-110">
                  {<feature.icon className="w-8 md:w-10 h-8 md:h-10" />}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 gradient-text">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg text-[#00dcf5]">{feature.description}</p>
                {feature.capabilities && (
                  <ul className="mt-4 space-y-2">
                    {feature.capabilities.map((capability, idx) => (
                      <li key={idx} className="text-sm text-[#32ed83] flex items-center">
                        <ChevronDown className="w-4 h-4 mr-2 text-[#c202af]" />
                        {capability}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;