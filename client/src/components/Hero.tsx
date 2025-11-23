import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/Hero_illustration_of_chat_connecting_to_ecommerce_ab62e0cf.png";
import { ArrowRight, CheckCircle, PlayCircle } from "lucide-react";
import { TrialSignupModal } from "@/components/TrialSignupModal";
import { VideoModal } from "@/components/VideoModal";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-hero-gradient">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Now Available for Magento 2
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold font-heading text-foreground leading-[1.1] mb-6">
                Turn ChatGPT Conversations into <span className="text-[#FF6900]">Magento Sales</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                The first seamless integration that lets millions of ChatGPT users browse your catalog and buy products instantly—without ever leaving the conversation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <TrialSignupModal>
                  <Button size="lg" className="bg-[#0066CC] hover:bg-[#0052a3] text-white text-lg px-8 h-12 shadow-lg shadow-blue-900/20">
                    Start Your 14-Day Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </TrialSignupModal>
                
                <VideoModal videoSrc="/SellWithGPTIntroVideo.mp4">
                  <Button variant="outline" size="lg" className="text-foreground border-gray-200 hover:bg-gray-50 text-lg px-8 h-12 group">
                    <PlayCircle className="mr-2 w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    View Demo
                  </Button>
                </VideoModal>
              </div>

              <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>No coding required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Setup in 10 mins</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-[#FF6900]/20 rounded-full blur-3xl opacity-30"></div>
              
              <div className="relative group cursor-pointer">
                <VideoModal videoSrc="/SellWithGPTIntroVideo.mp4">
                  <div className="relative">
                    <img 
                      src={heroImage} 
                      alt="ChatGPT Integration Interface" 
                      className="relative w-full h-auto rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 rounded-2xl">
                      <div className="w-20 h-20 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300">
                        <PlayCircle className="w-10 h-10 text-primary ml-1" />
                      </div>
                    </div>
                  </div>
                </VideoModal>
                
                {/* Floating UI Cards for effect - kept separate from the click target to avoid confusion, or included if they are part of the "image" feel */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -left-6 top-1/4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-w-[200px] pointer-events-none"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">AI</div>
                    <div className="h-2 w-20 bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-2 w-32 bg-gray-100 rounded mb-2"></div>
                  <div className="h-2 w-24 bg-gray-100 rounded"></div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-6 bottom-1/4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 pointer-events-none"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground mb-1">
                    Order Confirmed
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground">Order #4923 • $129.00</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
