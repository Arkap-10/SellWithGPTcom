import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Calendar, Building2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import logo from "@assets/SellWithGPTLogo_1763916030768.jpeg";

interface TrialSignupModalProps {
  children: React.ReactNode;
  planName?: string;
  price?: string;
}

const GOOGLE_CALENDAR_URL = "https://calendar.app.google/s14wWTqUowReHzsB7";

export function TrialSignupModal({ children, planName = "", price = "" }: TrialSignupModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    companyName: "",
    phone: "",
    magentoVersion: "",
    monthlyOrders: "",
    integrationTimeline: "",
  });

  const validateEmail = (email: string): string | null => {
    if (!email) {
      return "Email is required";
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    
    const domain = email.split('@')[1]?.toLowerCase();
    const disposableDomains = [
      'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
      'mailinator.com', 'maildrop.cc', 'temp-mail.org', 'getnada.com'
    ];
    
    if (disposableDomains.includes(domain)) {
      return "Please use a professional email address";
    }
    
    return null;
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    if (emailError) {
      toast({
        title: "Invalid Email",
        description: emailError,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setStep(2);
  };

  const handleQualificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.magentoVersion) {
      toast({
        title: "Required Field",
        description: "Please select your Magento version",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!formData.monthlyOrders) {
      toast({
        title: "Required Field",
        description: "Please select your monthly order volume",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!formData.integrationTimeline) {
      toast({
        title: "Required Field",
        description: "Please select your integration timeline",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/trial-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          companyName: formData.companyName || undefined,
          phone: formData.phone || undefined,
          planName: planName || null,
          magentoVersion: formData.magentoVersion,
          monthlyOrders: formData.monthlyOrders,
          integrationTimeline: formData.integrationTimeline,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setIsLoading(false);
      setStep(3); // Go to success screen
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Signup Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setFormData({
        email: "",
        fullName: "",
        companyName: "",
        phone: "",
        magentoVersion: "",
        monthlyOrders: "",
        integrationTimeline: "",
      });
    }, 300);
  };

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);
  const trialEndDate = futureDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0">
        <div className="bg-gray-50 p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <img src={logo} alt="SellWithGPT Logo" className="w-6 h-6 rounded object-cover" />
            <span className="font-bold font-heading text-foreground">SellWithGPT</span>
          </div>
          <DialogTitle className="text-xl font-bold">
            {step === 3 ? "You're All Set!" : "Start your 14-day free trial"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            {step === 3 
              ? "Schedule a call with our team to get started" 
              : `No charge today. Cancel anytime before ${trialEndDate}.`
            }
          </DialogDescription>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  autoFocus 
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  data-testid="input-fullname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  type="text" 
                  placeholder="Acme Inc." 
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  data-testid="input-company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (optional)</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  data-testid="input-phone"
                />
              </div>
              <Button type="submit" className="w-full bg-[#0066CC] hover:bg-[#0052a3] h-11 text-base" data-testid="button-continue">
                Continue
              </Button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleQualificationSubmit} className="space-y-5">
              <div className="bg-blue-50 p-3 rounded-md flex items-start gap-3 text-sm text-blue-800">
                <Building2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Help us understand your business so we can provide the best onboarding experience.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Magento Version</Label>
                  <Select 
                    value={formData.magentoVersion} 
                    onValueChange={(value) => setFormData({ ...formData, magentoVersion: value })}
                  >
                    <SelectTrigger data-testid="select-magento-version">
                      <SelectValue placeholder="Select your Magento version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="magento2">Magento 2 (Open Source)</SelectItem>
                      <SelectItem value="adobe-commerce">Adobe Commerce (Magento 2)</SelectItem>
                      <SelectItem value="magento1">Magento 1 (Legacy)</SelectItem>
                      <SelectItem value="planning">Planning to migrate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Monthly Order Volume</Label>
                  <Select 
                    value={formData.monthlyOrders} 
                    onValueChange={(value) => setFormData({ ...formData, monthlyOrders: value })}
                  >
                    <SelectTrigger data-testid="select-monthly-orders">
                      <SelectValue placeholder="Select your monthly orders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-100">0 - 100 orders</SelectItem>
                      <SelectItem value="100-500">100 - 500 orders</SelectItem>
                      <SelectItem value="500-2000">500 - 2,000 orders</SelectItem>
                      <SelectItem value="2000-10000">2,000 - 10,000 orders</SelectItem>
                      <SelectItem value="10000+">10,000+ orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Integration Timeline</Label>
                  <Select 
                    value={formData.integrationTimeline} 
                    onValueChange={(value) => setFormData({ ...formData, integrationTimeline: value })}
                  >
                    <SelectTrigger data-testid="select-timeline">
                      <SelectValue placeholder="When do you want to integrate?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="1-2-weeks">Within 1-2 weeks</SelectItem>
                      <SelectItem value="1-month">Within a month</SelectItem>
                      <SelectItem value="evaluating">Just evaluating options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full bg-[#0066CC] hover:bg-[#0052a3] h-11 text-base" disabled={isLoading} data-testid="button-submit">
                  {isLoading ? "Submitting..." : "Complete Signup"}
                </Button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-full text-sm text-muted-foreground mt-3 hover:text-foreground"
                >
                  Back to contact info
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Welcome to SellWithGPT!</h3>
                <p className="text-muted-foreground text-sm">
                  Your trial account is ready. Schedule a quick onboarding call with our team to get started.
                </p>
              </div>

              <a
                href={GOOGLE_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-[#0066CC] hover:bg-[#0052a3] text-white h-12 rounded-md text-base font-medium transition-colors"
                data-testid="button-schedule-call"
              >
                <Calendar className="w-5 h-5" />
                Schedule Your Onboarding Call
              </a>

              <p className="text-xs text-muted-foreground">
                We'll walk you through setup and answer any questions. Takes about 15 minutes.
              </p>

              <button 
                type="button" 
                onClick={handleClose} 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                I'll schedule later
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
