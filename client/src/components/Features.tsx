import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import iconSeamless from "@assets/generated_images/Abstract_icon_for_seamless_integration_a5c1d7f1.png";
import iconSecure from "@assets/generated_images/Abstract_icon_for_secure_transactions_6eccea7c.png";
import iconAnalytics from "@assets/generated_images/Abstract_icon_for_sales_analytics_ae2d676b.png";

const features = [
  {
    title: "Seamless Catalog Sync",
    description: "Automatically sync your Magento product catalog with ChatGPT in real-time. No manual uploads required.",
    icon: iconSeamless,
    color: "bg-primary/10",
  },
  {
    title: "Secure Checkout",
    description: "Enterprise-grade security ensures all transactions processed through the chat interface are safe and compliant.",
    icon: iconSecure,
    color: "bg-blue-50",
  },
  {
    title: "Conversational Analytics",
    description: "Track how users interact with your products in chat. Gain insights into intent, sentiment, and conversion paths.",
    icon: iconAnalytics,
    color: "bg-orange-50",
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
            Everything you need to sell in the AI era
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform bridges the gap between traditional e-commerce and conversational AI, giving you a powerful new sales channel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-none hover:shadow-xl transition-shadow duration-300 bg-accent/30 overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <img src={feature.icon} alt={feature.title} className="w-10 h-10 object-contain" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
