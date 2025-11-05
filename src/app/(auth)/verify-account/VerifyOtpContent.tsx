// app/(auth)/verify-account/VerifyOtpContent.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Clock, ArrowLeft } from "lucide-react";

export default function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const router = useRouter();

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  // Verify OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5071/api/Auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("✅ Verification successful! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setMessage("❌ The code is invalid or incorrect.");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP with timer
  const handleResend = async () => {
    setResendDisabled(true);
    setResendTimer(60);

    try {
      await fetch("http://localhost:5071/api/Auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMessage("📩 A new verification code has been sent to your email.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to resend code. Please try again.");
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 pt-20">
      {/* Header Logo */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-gray-900">ZoodRass</span>
        </Link>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 right-6">
        <Link 
          href="/signup"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Signup
        </Link>
      </div>

      {/* Verification Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Account
          </h1>
          <p className="text-gray-600 mb-4">
            Enter the 6-digit verification code sent to
          </p>
          <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-lg p-3">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-700">{email}</span>
          </div>
        </div>

        {/* OTP Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <Label htmlFor="otp" className="text-sm font-semibold text-gray-700">
              Verification Code *
            </Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-center text-lg font-semibold tracking-widest transition-all duration-200"
              required
              maxLength={6}
            />
          </div>

          {/* Message Display */}
          {message && (
            <div className={`rounded-xl p-4 text-sm font-medium ${
              message.startsWith("✅") || message.startsWith("📩") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          {/* Resend Code */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              {resendDisabled ? (
                <span className="font-medium">
                  Resend code in <span className="text-blue-600">{resendTimer}s</span>
                </span>
              ) : (
                <span>Didn&apos;t receive the code?</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendDisabled}
              className={`font-semibold transition-all duration-200 ${
                resendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-700 underline underline-offset-2"
              }`}
            >
              Resend Code
            </button>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={loading || otp.length !== 6}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </div>
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having trouble?{" "}
            <Link 
              href="/contact" 
              className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors duration-200"
            >
              Contact Support
            </Link>
          </p>
        </div>

        {/* Sign In Link */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Already verified your account?{" "}
            <Link 
              href="/login" 
              className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors duration-200"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}