import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrialSignupModal } from "@/components/TrialSignupModal";

const plans = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for small stores getting started with AI commerce.",
    features: [
      "Up to 500 SKUs",
      "Basic Catalog Sync",
      "Standard Checkout Flow",
      "Email Support"
    ],
    cta: "Start 14-Day Free Trial",
    popular: false
  },
  {
    name: "Growth",
    price: "$149",
    description: "For growing businesses needing advanced integration features.",
    features: [
      "Up to 5,000 SKUs",
      "Real-time Inventory Sync",
      "Custom Checkout Branding",
      "Priority Chat Support",
      "Advanced Analytics"
    ],
    cta: "Start 14-Day Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full-scale solution for high volume merchants.",
    features: [
      "Unlimited SKUs",
      "Dedicated Success Manager",
      "Custom LLM Fine-tuning",
      "SLA & Uptime Guarantee",
      "Multi-store Support"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that best fits your business size and needs. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border ${plan.popular ? 'border-primary shadow-xl scale-105 z-10' : 'border-gray-200 shadow-sm'} bg-white flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-sm font-bold px-4 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-heading">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                </div>
                <CardDescription className="mt-4 text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-8">
                {plan.name === "Enterprise" ? (
                  <Button 
                    className="w-full h-12 text-base font-medium bg-white border-2 border-gray-100 hover:border-gray-300 text-foreground hover:bg-gray-50 shadow-none"
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  <TrialSignupModal planName={plan.name} price={plan.price}>
                    <Button 
                      className={`w-full h-12 text-base font-medium ${
                        plan.popular 
                          ? 'bg-[#0066CC] hover:bg-[#0052a3] text-white' 
                          : 'bg-white border-2 border-gray-100 hover:border-gray-300 text-foreground hover:bg-gray-50 shadow-none'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </TrialSignupModal>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
