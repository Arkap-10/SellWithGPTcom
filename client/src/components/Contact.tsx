import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, ArrowRight } from "lucide-react";

export default function Contact() {
  return (
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

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                  <p className="text-muted-foreground mb-1">Available Mon-Fri, 9am - 6pm PST.</p>
                  <button className="text-[#0066CC] font-medium hover:underline text-left">Start a conversation</button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <Card className="border border-gray-200 shadow-xl bg-white p-2">
              <CardContent className="p-6 md:p-8">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                      <Input id="name" placeholder="John Doe" className="h-11 bg-gray-50 border-gray-200 focus:bg-white" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">Work Email</label>
                      <Input id="email" type="email" placeholder="john@company.com" className="h-11 bg-gray-50 border-gray-200 focus:bg-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-foreground">Company Name</label>
                    <Input id="company" placeholder="Acme Inc." className="h-11 bg-gray-50 border-gray-200 focus:bg-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">How can we help?</label>
                    <Textarea id="message" placeholder="Tell us about your project needs..." className="min-h-[120px] bg-gray-50 border-gray-200 focus:bg-white resize-none" />
                  </div>

                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-lg">
                    Request Demo <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </section>
  );
}
