import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function OTPVerification() {
  const [_, setLocation] = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useToast();
  const { checkAuth } = useAuth();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get phone number from URL
  const params = new URLSearchParams(window.location.search);
  const phoneNumber = params.get("phone") || "";

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    // For new users, check if name is provided
    if (isNewUser && !name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to complete signup",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phoneNumber,
          otp: otpString,
          name: isNewUser ? name.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check auth to update context from server
        await checkAuth();
        toast({
          title: "Success!",
          description: isNewUser ? "Account created successfully" : "Welcome back!",
        });
        setLocation("/");
      } else if (data.error === "Name is required for new users") {
        // This is a new user, show name input
        setIsNewUser(true);
        toast({
          title: "Welcome!",
          description: "Please enter your name to complete signup",
        });
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        
        if (data.dev_otp) {
          toast({
            title: "OTP Resent (Dev Mode)",
            description: `Your new OTP is: ${data.dev_otp}`,
            duration: 10000,
          });
        } else {
          toast({
            title: "OTP Resent",
            description: "A new code has been sent to your phone",
          });
        }
      } else {
        throw new Error(data.error || "Failed to resend OTP");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-12">
        <button
          onClick={() => setLocation("/auth/login")}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6 hover-elevate active-elevate-2"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>
          <p className="text-sm opacity-90">
            Sent to {phoneNumber.replace(/(\d{5})(\d{5})/, "$1 $2")}
          </p>
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
            <h2 className="text-lg font-bold text-foreground mb-4">
              Enter Verification Code
            </h2>

            {/* OTP Input */}
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-2xl font-bold"
                  disabled={isLoading}
                  data-testid={`input-otp-${index}`}
                />
              ))}
            </div>

            {/* Name Input for New Users */}
            {isNewUser && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6"
              >
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-name"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We need your name to create your account
                </p>
              </motion.div>
            )}

            <Button
              onClick={handleVerify}
              disabled={isLoading || otp.some((d) => !d) || (isNewUser && !name.trim())}
              className="w-full mb-4"
              size="lg"
              data-testid="button-verify-otp"
            >
              {isLoading ? (
                "Verifying..."
              ) : (
                <>
                  {isNewUser ? "Create Account" : "Verify & Continue"}
                  <Check className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <button
              onClick={handleResendOTP}
              disabled={isLoading}
              className="text-sm text-primary font-medium w-full hover:underline disabled:opacity-50"
              data-testid="button-resend-otp"
            >
              Resend OTP
            </button>
          </Card>

          {/* Info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Didn't receive the code? Check your phone or click "Resend OTP"
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
