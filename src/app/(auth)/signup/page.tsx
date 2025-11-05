"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Briefcase, User, Mail, Phone, Lock } from "lucide-react";

export default function JobSeekerSignupPage() {
    // states for form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPasswordHash] = useState("");
    const [phone, setPhone] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5071/api/Auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    role: "User", // fixed role for job seekers
                    phoneNumber: phone,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to verify account page after successful registration
                router.push(`/verify-account?email=${encodeURIComponent(email)}`);
            } else {
                alert("Error in register: " + JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Cannot connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 pt-20">
            {/* Header Logo */}
            <div className="absolute top-6 left-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-bold text-2xl text-gray-900">ZoodRass</span>
                </Link>
            </div>

            {/* Signup Container */}
            <div className="w-full max-w-4xl flex bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Left Side - Illustration */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex-col justify-center items-center text-center">
                    <div className="max-w-xs">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                            <User className="h-12 w-12 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Join Our Community
                        </h1>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Create your account and discover amazing products tailored just for you. 
                            Start your shopping journey with ZoodRass today.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <div className="text-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-xs text-gray-600">Easy Signup</span>
                            </div>
                            <div className="text-center">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Lock className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="text-xs text-gray-600">Secure</span>
                            </div>
                            <div className="text-center">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Phone className="h-4 w-4 text-purple-600" />
                                </div>
                                <span className="text-xs text-gray-600">Quick Access</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12">
                    <div className="text-right mb-6">
                        <span className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link 
                                href="/login" 
                                className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors duration-200"
                            >
                                Sign in
                            </Link>
                        </span>
                    </div>

                    <div className="max-w-md mx-auto">
                        <div className="text-center lg:text-left mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Create Account
                            </h1>
                            <p className="text-gray-600">
                                Join Abrishom and start your shopping journey
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name" className="text-sm font-semibold text-gray-700">
                                        First Name *
                                    </Label>
                                    <Input
                                        id="first-name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
                                        required
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name" className="text-sm font-semibold text-gray-700">
                                        Last Name *
                                    </Label>
                                    <Input
                                        id="last-name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
                                        required
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                    Email Address *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    Password *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={passwordVisible ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPasswordHash(e.target.value)}
                                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl pr-12 transition-all duration-200"
                                        required
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                                    Phone Number *
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
                                    required
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating Account...
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                By creating an account, you agree to our{" "}
                                <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}