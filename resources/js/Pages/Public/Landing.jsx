import GuestLayout from "@/Layouts/GuestLayout";
import { Link } from "@inertiajs/react";
import {
    Calendar,
    Users,
    FileText,
    CreditCard,
    CheckCircle,
    ArrowRight,
    Smile,
    ShieldCheck,
    Globe,
    Zap,
    UserCircle,
    Star,
    MessageCircle,
    DollarSign,
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Sparkles,
    Play,
} from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";

// NOTE: For best results, add this to your <head> in public/index.html or your Blade layout:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Montserrat:wght@700&display=swap" rel="stylesheet">
// And add 'font-inter' and 'font-montserrat' to your Tailwind config theme.fontFamily

// Placeholder avatar
const Avatar = ({ name }) => (
    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
        {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
    </div>
);

// FAQ Accordion Item
function FaqItem({ question, answer, open, onClick, isFirst, isLast }) {
    return (
        <div
            className={`transition-all duration-200 bg-white ${
                isFirst ? "rounded-t-2xl" : ""
            } ${isLast ? "rounded-b-2xl" : ""} ${open ? "shadow-md z-10" : ""}`}
        >
            <button
                className={`w-full flex justify-between items-center py-5 px-6 text-left focus:outline-none transition-colors duration-150 ${
                    open ? "bg-blue-50" : "hover:bg-blue-50"
                } rounded-2xl`}
                onClick={onClick}
                style={{ borderRadius: isFirst || isLast ? "1rem" : 0 }}
            >
                <span className="font-semibold text-gray-900 text-base">
                    {question}
                </span>
                <ArrowRight
                    className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                        open ? "rotate-90 text-blue-600" : "text-gray-400"
                    }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 px-6 ${
                    open ? "max-h-40 py-3 bg-blue-50" : "max-h-0"
                }`}
            >
                <p className="text-gray-700 text-base leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
}

import { useState } from "react";

export default function Landing() {
    const [faqOpen, setFaqOpen] = useState(0);
    const faqs = [
        {
            q: "Is Smile Suite secure?",
            a: "Absolutely! We use industry-standard encryption and best practices to keep your data safe and private.",
        },
        {
            q: "Can I access Smile Suite on mobile?",
            a: "Yes, Smile Suite is fully responsive and works on any device with a modern browser.",
        },
        {
            q: "How do I get started?",
            a: "Just click 'Get Started' and follow the simple registration process. Our team is here to help if you need it!",
        },
    ];

    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex flex-col">
            <SiteHeader />
            {/* Hero Section: slightly more pronounced gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 pb-0 z-10">
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-stretch min-h-[32rem] md:min-h-[38rem] lg:min-h-[44rem]">
                    {/* Left: Headline and content */}
                    <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12 md:py-0 md:pr-0 z-10">
                        {/* Enhanced tagline with better styling */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-700 font-semibold tracking-wide">
                                    #1 Dental SaaS Platform
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">
                                    4.9/5 rating
                                </span>
                            </div>
                        </div>
                        <h1
                            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight mb-8 animate-fade-in"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            <span className="block">
                                The Future of{" "}
                                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent relative inline-block">
                                    Dental Practice
                                    <div className="absolute left-0 bottom-0 w-full h-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full -z-10 opacity-60"></div>
                                </span>
                            </span>
                            <span className="block text-gray-800">
                                Management
                            </span>
                        </h1>
                        <p
                            className="mt-2 mb-10 text-xl text-gray-600 max-w-2xl font-medium animate-fade-in leading-relaxed"
                            style={{
                                fontFamily: "Inter, sans-serif",
                                letterSpacing: "0.01em",
                            }}
                        >
                            Transform your dental practice with our
                            comprehensive SaaS platform. Manage patients,
                            appointments, treatments, and billing with{" "}
                            <span className="text-blue-600 font-semibold bg-blue-50 px-1 rounded">
                                enterprise-grade security
                            </span>
                            . Built for dental professionals who prioritize{" "}
                            <span className="text-cyan-600 font-semibold bg-cyan-50 px-1 rounded">
                                patient care
                            </span>
                            , not administrative tasks.
                        </p>
                        <div className="mt-2 flex flex-col sm:flex-row sm:justify-start gap-4 animate-fade-in">
                            <Link
                                href={route("public.clinics.index")}
                                className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:ring-offset-2 group transform hover:scale-105"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Start Free Trial
                                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                            </Link>
                            <Link
                                href="#features"
                                className="inline-flex items-center justify-center px-10 py-4 border-2 border-blue-600 text-lg font-bold rounded-xl text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-offset-2 group transform hover:scale-105"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Explore Features
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </div>
                        {/* Enhanced trust badges */}
                        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-fade-in">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                                        <span className="text-blue-600 text-xs font-bold">
                                            D
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-cyan-100 border-2 border-white flex items-center justify-center">
                                        <span className="text-cyan-600 text-xs font-bold">
                                            C
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
                                        <span className="text-green-600 text-xs font-bold">
                                            P
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        500+ Clinics
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Trust Smile Suite
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        99.9% Uptime
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Enterprise Reliability
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        HIPAA Compliant
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Bank-level Security
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right: Enhanced hero image with floating elements */}
                    <div className="flex-1 relative flex items-center justify-center py-12 md:py-16 lg:py-20">
                        {/* Enhanced decorative elements */}
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-blue-200/30 to-cyan-200/20 rounded-full blur-3xl z-10 animate-pulse" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-cyan-200/20 to-blue-200/30 rounded-full blur-2xl z-10" />

                        {/* Floating stats cards */}
                        <div className="absolute top-8 left-8 z-30 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900">
                                        50K+
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Patients
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-8 right-8 z-30 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900">
                                        10K+
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Appointments
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main image container */}
                        <div className="relative z-20 w-full flex justify-center">
                            <div className="relative w-full max-w-2xl">
                                <img
                                    src="/images/dental-image.png"
                                    alt="Modern dental clinic management platform"
                                    className="w-full h-[28rem] md:h-[34rem] lg:h-[38rem] object-cover rounded-3xl shadow-2xl border-4 border-white ring-4 ring-blue-100/50"
                                    style={{
                                        minHeight: "20rem",
                                        maxHeight: "44rem",
                                        boxShadow:
                                            "0 20px 60px 0 rgba(16, 112, 202, 0.25)",
                                    }}
                                    loading="lazy"
                                />
                                {/* Enhanced gradient overlay */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-white/60 via-blue-100/20 to-transparent pointer-events-none" />

                                {/* Floating action button */}
                                <div className="absolute bottom-6 left-6 z-30">
                                    <button className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl border border-white/20 hover:bg-white transition-all duration-300 group">
                                        <Play className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Features Section */}
            <section
                id="features"
                className="py-24 bg-gradient-to-b from-white to-blue-50/30 border-t border-b border-gray-100 z-10 relative"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 rounded-full border border-blue-200/50 mb-6">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-700 font-semibold tracking-wide">
                                Powerful Features
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                            Everything you need to{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                scale your practice
                            </span>
                        </h2>
                        <p className="max-w-3xl text-xl text-gray-600 lg:mx-auto leading-relaxed">
                            From patient management to advanced analytics, our
                            comprehensive platform provides all the tools modern
                            dental practices need to thrive.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center group animate-fade-in border border-gray-100 hover:border-blue-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Patient Management
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed">
                                Complete patient lifecycle management with
                                digital records, medical history, and
                                personalized treatment plans.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold">
                                <span>Learn more</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center group animate-fade-in border border-gray-100 hover:border-cyan-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Smart Scheduling
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed">
                                AI-powered appointment scheduling with automated
                                reminders, conflict detection, and calendar
                                optimization.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-cyan-600 font-semibold">
                                <span>Learn more</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center group animate-fade-in border border-gray-100 hover:border-blue-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Treatment Records
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed">
                                Comprehensive treatment documentation with
                                progress tracking, outcome monitoring, and
                                clinical decision support.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold">
                                <span>Learn more</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center group animate-fade-in border border-gray-100 hover:border-cyan-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <CreditCard className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Payment Processing
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed">
                                Secure payment processing with multiple payment
                                methods, automated billing, and comprehensive
                                financial reporting.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-cyan-600 font-semibold">
                                <span>Learn more</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center group animate-fade-in border border-gray-100 hover:border-blue-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Enterprise Security
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed">
                                HIPAA-compliant security with end-to-end
                                encryption, multi-factor authentication, and
                                regular security audits.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold">
                                <span>Learn more</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center group animate-fade-in border border-gray-100 hover:border-cyan-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Globe className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Cloud-First Platform
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed">
                                Access your practice from anywhere with
                                real-time sync, automatic backups, and seamless
                                multi-device experience.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-cyan-600 font-semibold">
                                <span>Learn more</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="relative z-20 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 py-20 px-4 sm:px-8 lg:px-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-8">
                        <Globe className="w-4 h-4 text-white" />
                        <span className="text-sm text-white font-semibold tracking-wide">
                            Network of Trusted Clinics
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
                        Ready to find your perfect{" "}
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            dental clinic?
                        </span>
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Browse our extensive network of verified dental clinics,
                        read patient reviews, and book appointments with
                        confidence. Your perfect smile starts here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href={route("public.clinics.index")}
                            className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-lg font-bold rounded-xl text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-100 shadow-2xl hover:shadow-white/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 group transform hover:scale-105"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Browse Clinics
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </Link>
                        <Link
                            href="#testimonials"
                            className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 text-lg font-bold rounded-xl text-white bg-transparent hover:bg-white/10 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 focus:ring-offset-2 group transform hover:scale-105"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Read Reviews
                            <Star className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Enhanced FAQ Section */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50 border-t border-b border-gray-100 z-10 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 rounded-full border border-blue-200/50 mb-6">
                            <MessageCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-700 font-semibold tracking-wide">
                                Common Questions
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
                            Everything you need to{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                know
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Get answers to the most frequently asked questions
                            about Smile Suite and how we can transform your
                            dental practice.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white/80 shadow-xl divide-y divide-gray-200 p-2">
                        {faqs.map((faq, i) => (
                            <FaqItem
                                key={i}
                                question={faq.q}
                                answer={faq.a}
                                open={faqOpen === i}
                                onClick={() =>
                                    setFaqOpen(faqOpen === i ? -1 : i)
                                }
                                isFirst={i === 0}
                                isLast={i === faqs.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Testimonials Section */}
            <section
                id="testimonials"
                className="py-24 bg-gradient-to-br from-blue-50 via-white to-cyan-50 z-10 relative"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 rounded-full border border-blue-200/50 mb-6">
                            <Star className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-700 font-semibold tracking-wide">
                                Customer Success Stories
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
                            Trusted by{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                dental professionals
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Join hundreds of dental practices that have
                            transformed their operations with Smile Suite.
                            Here's what our customers have to say.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center animate-fade-in border border-gray-100 hover:border-blue-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <Avatar name="Dr. Alice Smith" />
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                            </div>
                            <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                                "Smile Suite has revolutionized our practice
                                management. The AI-powered scheduling and
                                patient management features have increased our
                                efficiency by 40%."
                            </p>
                            <div className="text-center">
                                <div className="text-blue-700 font-bold text-lg">
                                    Dr. Alice Smith
                                </div>
                                <div className="text-gray-500 text-sm">
                                    Dental Practice Owner
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center animate-fade-in border border-gray-100 hover:border-cyan-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <Avatar name="Dr. Michael Chen" />
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                            </div>
                            <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                                "The cloud-based platform allows me to access
                                patient records from anywhere. The security
                                features give me peace of mind knowing our data
                                is protected."
                            </p>
                            <div className="text-center">
                                <div className="text-cyan-700 font-bold text-lg">
                                    Dr. Michael Chen
                                </div>
                                <div className="text-gray-500 text-sm">
                                    Orthodontist
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center animate-fade-in border border-gray-100 hover:border-orange-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <Avatar name="Sarah Johnson" />
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                            </div>
                            <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                                "The onboarding process was seamless, and the
                                support team is incredibly responsive. Our staff
                                was productive within the first week of
                                implementation."
                            </p>
                            <div className="text-center">
                                <div className="text-orange-700 font-bold text-lg">
                                    Sarah Johnson
                                </div>
                                <div className="text-gray-500 text-sm">
                                    Practice Manager
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Pricing Section */}
            <div className="py-24 bg-gradient-to-b from-gray-50 to-white z-10 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 rounded-full border border-blue-200/50 mb-6">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-700 font-semibold tracking-wide">
                                Flexible Pricing
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
                            Choose the perfect{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                plan for your practice
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Start with a free trial, then choose the plan that
                            scales with your practice. No hidden fees, cancel
                            anytime.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Basic Plan */}
                        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center animate-fade-in border border-gray-200 hover:border-blue-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">
                                Starter
                            </h3>
                            <p className="text-4xl font-extrabold text-gray-900 mb-2">
                                $29{" "}
                                <span className="text-lg font-medium text-gray-500">
                                    /mo
                                </span>
                            </p>
                            <p className="text-gray-600 mb-6">
                                Perfect for small practices
                            </p>
                            <ul className="text-gray-600 mb-8 space-y-3 text-left w-full">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Patient Management</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Appointment Scheduling</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Email Support</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Basic Reporting</span>
                                </li>
                            </ul>
                            <button className="w-full px-8 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Start Free Trial
                            </button>
                        </div>

                        {/* Premium Plan */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center scale-105 animate-fade-in relative border-4 border-blue-500">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                                    MOST POPULAR
                                </span>
                            </div>
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-white">
                                Professional
                            </h3>
                            <p className="text-4xl font-extrabold text-white mb-2">
                                $59{" "}
                                <span className="text-lg font-medium text-blue-100">
                                    /mo
                                </span>
                            </p>
                            <p className="text-blue-100 mb-6">
                                For growing practices
                            </p>
                            <ul className="text-blue-100 mb-8 space-y-3 text-left w-full">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                                    <span>Everything in Starter</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                                    <span>Treatment Records</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                                    <span>SMS Reminders</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                                    <span>Priority Support</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                                    <span>Advanced Analytics</span>
                                </li>
                            </ul>
                            <button className="w-full px-8 py-4 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Start Free Trial
                            </button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center animate-fade-in border border-gray-200 hover:border-cyan-200 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">
                                Enterprise
                            </h3>
                            <p className="text-4xl font-extrabold text-gray-900 mb-2">
                                Custom
                            </p>
                            <p className="text-gray-600 mb-6">
                                For large organizations
                            </p>
                            <ul className="text-gray-600 mb-8 space-y-3 text-left w-full">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>All Professional Features</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Custom Integrations</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Dedicated Account Manager</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>White-label Solutions</span>
                                </li>
                            </ul>
                            <button className="w-full px-8 py-4 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Final CTA Section */}
            <div
                id="clinics"
                className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 z-10 relative overflow-hidden"
            >
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center py-24 px-4 sm:py-32 sm:px-6 lg:px-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-8">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-sm text-white font-semibold tracking-wide">
                            Join 500+ Clinics
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                        Ready to transform your{" "}
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            dental practice?
                        </span>
                    </h2>
                    <p className="mb-12 text-xl leading-8 text-blue-100 max-w-3xl mx-auto">
                        Join hundreds of dental professionals who have already
                        modernized their practice with Smile Suite. Start your
                        free trial today and see the difference.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href={route("register.clinic")}
                            className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-lg font-bold rounded-xl text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-100 shadow-2xl hover:shadow-white/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 group transform hover:scale-105"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Start Free Trial
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </Link>
                        <Link
                            href={route("public.clinics.index")}
                            className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 text-lg font-bold rounded-xl text-white bg-transparent hover:bg-white/10 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 focus:ring-offset-2 group transform hover:scale-105"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Browse Clinics
                            <Globe className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        </Link>
                    </div>
                    <div className="mt-12 flex items-center justify-center gap-8 text-blue-100">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-300" />
                            <span className="text-sm">
                                No credit card required
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-300" />
                            <span className="text-sm">14-day free trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-300" />
                            <span className="text-sm">Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 z-10 relative">
                <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:py-20 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
                        {/* Left: Logo, description, social */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white">
                                Smile Suite
                            </h3>
                            <p className="text-gray-300 text-base max-w-xs">
                                Cloud-based dental clinic management solution
                                designed to streamline your practice operations.
                            </p>
                            <div className="flex gap-4 mt-2">
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    <Facebook className="w-6 h-6" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    <Twitter className="w-6 h-6" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    <Instagram className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                        {/* Center: Platform/Support links */}
                        <div className="flex flex-col sm:flex-row gap-10 md:gap-16 justify-center">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">
                                    Platform
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            href="#features"
                                            className="text-base text-gray-300 hover:text-white transition"
                                        >
                                            Features
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("public.clinics.index")}
                                            className="text-base text-gray-300 hover:text-white transition"
                                        >
                                            Find Clinics
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">
                                    Support
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            href="#about"
                                            className="text-base text-gray-300 hover:text-white transition"
                                        >
                                            About
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("register")}
                                            className="text-base text-gray-300 hover:text-white transition"
                                        >
                                            Register
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("login")}
                                            className="text-base text-gray-300 hover:text-white transition"
                                        >
                                            Login
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* Right: Newsletter */}
                        <div className="space-y-4 max-w-sm w-full">
                            <h4 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
                                Newsletter
                            </h4>
                            <p className="text-gray-400 text-sm mb-2">
                                Get updates and news from Smile Suite.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-2 w-full">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center gap-2 min-w-[120px] justify-center"
                                >
                                    <Mail className="w-5 h-5" />
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="mt-14 border-t border-gray-800 pt-8 text-center">
                        <p className="text-base text-gray-400">
                            &copy; 2024 Smile Suite. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
