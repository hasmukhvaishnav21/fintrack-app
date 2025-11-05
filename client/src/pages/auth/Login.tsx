import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Smartphone, ArrowRight, Shield, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [_, setLocation] = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        // Development mode: show OTP
        if (data.dev_otp) {
          toast({
            title: "OTP Sent (Dev Mode)",
            description: `Your OTP is: ${data.dev_otp}`,
            duration: 10000,
          });
        } else {
          toast({
            title: "OTP Sent",
            description: "Check your phone for the verification code",
          });
        }

        setLocation(`/auth/verify-otp?phone=${encodeURIComponent(phoneNumber)}`);
      } else {
        throw new Error(data.error || "Failed to send OTP");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Fintrack</h1>
          <p className="text-sm opacity-90">Your Financial Freedom</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your mobile number to continue
            </p>

            {/* Phone Input */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                    className="pl-12 text-lg"
                    disabled={isLoading}
                    data-testid="input-phone-number"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  We'll send you a one-time password (OTP)
                </p>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full"
                size="lg"
                data-testid="button-send-otp"
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Features */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Secure & Safe</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-level security to protect your financial data
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Quick Access</h3>
                <p className="text-sm text-muted-foreground">
                  One-tap login with OTP verification
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
