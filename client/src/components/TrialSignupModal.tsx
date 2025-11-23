import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import logo from "@assets/SellWithGPTLogo_1763916030768.jpeg";

interface TrialSignupModalProps {
  children: React.ReactNode;
  planName?: string;
  price?: string;
}

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
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
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

  const validateCardNumber = (cardNumber: string): string | null => {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (!digits) {
      return "Card number is required";
    }
    
    if (digits.length < 13 || digits.length > 19) {
      return "Card number must be between 13 and 19 digits";
    }
    
    // Luhn algorithm validation
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    if (sum % 10 !== 0) {
      return "Please enter a valid card number";
    }
    
    return null;
  };

  const validateExpiry = (expiry: string): string | null => {
    if (!expiry) {
      return "Expiry date is required";
    }
    
    const parts = expiry.split('/');
    if (parts.length !== 2) {
      return "Please enter expiry in MM/YY format";
    }
    
    const month = parseInt(parts[0]);
    const year = parseInt(parts[1]);
    
    if (month < 1 || month > 12) {
      return "Invalid month";
    }
    
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "Card has expired";
    }
    
    return null;
  };

  const validateCVC = (cvc: string): string | null => {
    if (!cvc) {
      return "CVC is required";
    }
    
    if (cvc.length < 3 || cvc.length > 4) {
      return "CVC must be 3 or 4 digits";
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

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all payment fields
    const cardError = validateCardNumber(formData.cardNumber);
    if (cardError) {
      toast({
        title: "Invalid Card Number",
        description: cardError,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const expiryError = validateExpiry(formData.expiry);
    if (expiryError) {
      toast({
        title: "Invalid Expiry Date",
        description: expiryError,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const cvcError = validateCVC(formData.cvc);
    if (cvcError) {
      toast({
        title: "Invalid CVC",
        description: cvcError,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!formData.cardName || formData.cardName.trim().length < 2) {
      toast({
        title: "Invalid Cardholder Name",
        description: "Please enter the name on the card",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const cardDigits = formData.cardNumber.replace(/\D/g, '');
      let maskedCard = '';
      if (cardDigits.length >= 8) {
        const first4 = cardDigits.slice(0, 4);
        const last4 = cardDigits.slice(-4);
        maskedCard = `${first4} xxxx xxxx ${last4}`;
      }
      
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
          cardProvided: true,
          cardMasked: maskedCard || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setIsLoading(false);
      setIsOpen(false);
      setStep(1);
      setFormData({
        email: "",
        fullName: "",
        companyName: "",
        phone: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
        cardName: "",
      });
      
      toast({
        title: "Trial Started Successfully!",
        description: "Our team will be in touch with you shortly on the email provided. Welcome to SellWithGPT.",
        duration: 5000,
      });
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    setFormData({ ...formData, cardNumber: formattedValue });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setFormData({ ...formData, expiry: value });
  };

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);
  const trialEndDate = futureDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0">
        <div className="bg-gray-50 p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <img src={logo} alt="SellWithGPT Logo" className="w-6 h-6 rounded object-cover" />
            <span className="font-bold font-heading text-foreground">SellWithGPT</span>
          </div>
          <DialogTitle className="text-xl font-bold">Start your 14-day free trial</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            No charge today. Cancel anytime before {trialEndDate}.
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
                />
              </div>
              <Button type="submit" className="w-full bg-[#0066CC] hover:bg-[#0052a3] h-11 text-base">
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="bg-blue-50 p-3 rounded-md flex items-start gap-3 text-sm text-blue-800">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <p>We verify card validity with a $0.00 hold. You won't be charged until your trial ends.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Card Information</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input 
                      placeholder="0000 0000 0000 0000" 
                      className="pl-10 font-mono" 
                      required 
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input 
                      placeholder="MM / YY" 
                      className="font-mono" 
                      required 
                      value={formData.expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVC</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="123" 
                        className="pl-9 font-mono" 
                        required 
                        value={formData.cvc}
                        onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Name on Card</Label>
                  <Input 
                    placeholder="Cardholder Name" 
                    required 
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="font-medium">Total due today</span>
                  <span className="font-bold text-lg">$0.00</span>
                </div>
                
                <Button type="submit" className="w-full bg-[#0066CC] hover:bg-[#0052a3] h-11 text-base" disabled={isLoading}>
                  {isLoading ? "Verifying..." : `Start Free Trial`}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  By clicking "Start Free Trial", you agree to our Terms of Service. 
                  Plan renews at {price}/mo after trial.
                </p>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
