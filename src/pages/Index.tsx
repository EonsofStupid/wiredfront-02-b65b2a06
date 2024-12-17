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
      {/* Background machinery layers */}
      <div className="absolute inset-0 machinery-frame machinery-bar depth-layer-1" />
      <GalaxyBackground />
      <DataStream />
      <AnimatedCubes />
      
      {/* Content machinery layers */}
      <div className="relative depth-layer-2">
        <HeroSection />

        {/* Features Section with machinery styling */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-title machinery-text-gradient mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-body machinery-text-highlight max-w-2xl mx-auto">
              Seamlessly integrate AI capabilities into your workflow
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
                className="machinery-card machinery-interactive depth-layer-2"
              >
                <div className="machinery-icon-container mb-4">
                  {<feature.icon className="w-8 md:w-10 h-8 md:h-10" />}
                </div>
                <h3 className="machinery-text-gradient mb-3">
                  {feature.title}
                </h3>
                <p className="machinery-text">{feature.description}</p>
                {feature.capabilities && (
                  <ul className="mt-4 space-y-2">
                    {feature.capabilities.map((capability, idx) => (
                      <li key={idx} className="machinery-list-item">
                        <ChevronDown className="machinery-icon mr-2" />
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