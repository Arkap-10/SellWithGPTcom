import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowRight } from "lucide-react";
import { TrialSignupModal } from "./TrialSignupModal";

export default function Contact() {
  return (
    <>
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-foreground">
              Ready to transform your customer experience?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Get in touch with our team to schedule a personalized demo or learn more about our Enterprise solutions.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Email Us</h3>
                  <p className="text-muted-foreground mb-1">Our team typically responds within 2 hours.</p>
                  <a href="mailto:sales@sellwithgpt.com" className="text-[#0066CC] font-medium hover:underline">sales@sellwithgpt.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <Card className="border border-gray-200 shadow-xl bg-white p-2">
              <CardContent className="p-6 md:p-8">
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold font-heading text-foreground">
                      Start Your Free Trial
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Join leading e-commerce businesses using AI to drive sales. No credit card required for the first 7 days.
                    </p>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <TrialSignupModal>
                      <Button 
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-lg"
                        data-testid="button-start-trial-contact"
                      >
                        Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </TrialSignupModal>
                    <p className="text-sm text-muted-foreground">
                      Get started in minutes • Cancel anytime
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </section>
    </>
  );
}
