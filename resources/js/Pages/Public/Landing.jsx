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
                        {/* Subtle tagline with icon */}
                        <span className="flex items-center gap-2 text-sm text-blue-500 font-semibold mb-6 tracking-wide">
                            <Sparkles className="w-5 h-5 text-blue-400" />
                            #1 Dental Platform
                        </span>
                        <h1
                            className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6 animate-fade-in drop-shadow-xl"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            <span className="block">
                                Modern{" "}
                                <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent relative inline-block">
                                    Dental Clinic
                                    <span
                                        className="absolute left-0 bottom-0 w-full h-2 bg-blue-100 rounded-full -z-10"
                                        style={{ opacity: 0.5 }}
                                    ></span>
                                </span>
                            </span>
                            <span className="block">Management Platform</span>
                        </h1>
                        <p
                            className="mt-2 mb-10 text-lg text-gray-500 max-w-xl font-medium animate-fade-in"
                            style={{
                                fontFamily: "Inter, sans-serif",
                                letterSpacing: "0.01em",
                            }}
                        >
                            All-in-one cloud solution to manage patients,
                            appointments, treatments, and billing—
                            <span className="text-blue-600 font-semibold">
                                securely
                            </span>
                            , from anywhere. Designed for dental professionals
                            who want to focus on{" "}
                            <span className="text-cyan-600 font-semibold">
                                care
                            </span>
                            , not paperwork.
                        </p>
                        <div className="mt-2 flex flex-col sm:flex-row sm:justify-start gap-4 animate-fade-in">
                            <Link
                                href={route("public.clinics.index")}
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 group"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#features"
                                className="inline-flex items-center justify-center px-8 py-3 border border-blue-600 text-lg font-semibold rounded-lg text-blue-700 bg-white hover:bg-blue-50 shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Learn More
                            </Link>
                        </div>
                        {/* Trust badge */}
                        <div className="mt-12 flex items-center gap-2 animate-fade-in">
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-500 text-sm font-medium">
                                Trusted by 100+ clinics
                            </span>
                        </div>
                    </div>
                    {/* Right: Large Image with overlay and more breathing room */}
                    <div className="flex-1 relative flex items-center justify-center py-12 md:py-16 lg:py-20">
                        {/* Decorative accent shape */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-200/40 to-cyan-200/30 rounded-full blur-2xl z-10" />
                        {/* Soft background accent behind image */}
                        <div className="absolute inset-0 bg-gradient-to-l from-cyan-100/80 via-white/0 to-white/0 z-10 pointer-events-none rounded-3xl" />
                        <div className="relative z-20 w-full flex justify-center">
                            <div className="relative w-full max-w-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
                                    alt="Dental clinic illustration placeholder"
                                    className="w-full h-[28rem] md:h-[34rem] lg:h-[38rem] object-cover rounded-3xl shadow-2xl border-4 border-white ring-4 ring-blue-100"
                                    style={{
                                        minHeight: "20rem",
                                        maxHeight: "44rem",
                                        boxShadow:
                                            "0 8px 40px 0 rgba(16, 112, 202, 0.15)",
                                    }}
                                    loading="lazy"
                                />
                                {/* Gradient overlay for modern look */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-white/40 via-blue-100/10 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section: white background */}
            <section
                id="features"
                className="py-24 bg-white border-t border-b border-gray-100 z-10 relative"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center mb-16">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase mb-2">
                            Features
                        </h2>
                        <p className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                            Everything you need to run your dental practice
                        </p>
                        <p className="max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            From patient management to appointment scheduling,
                            we've got you covered.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-blue-50 rounded-2xl shadow hover:shadow-2xl transition p-8 flex flex-col items-center text-center group animate-fade-in">
                            <Users className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Patient Management
                            </h3>
                            <p className="text-gray-500 text-base">
                                Comprehensive patient records, medical history,
                                and treatment plans all in one place.
                            </p>
                        </div>
                        <div className="bg-cyan-50 rounded-2xl shadow hover:shadow-2xl transition p-8 flex flex-col items-center text-center group animate-fade-in">
                            <Calendar className="w-10 h-10 text-cyan-600 mb-4 group-hover:scale-110 transition" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Appointment Scheduling
                            </h3>
                            <p className="text-gray-500 text-base">
                                Easy appointment booking, reminders, and
                                calendar management for your practice.
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-2xl shadow hover:shadow-2xl transition p-8 flex flex-col items-center text-center group animate-fade-in">
                            <FileText className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Treatment Records
                            </h3>
                            <p className="text-gray-500 text-base">
                                Detailed treatment documentation, progress
                                tracking, and outcome monitoring.
                            </p>
                        </div>
                        <div className="bg-cyan-50 rounded-2xl shadow hover:shadow-2xl transition p-8 flex flex-col items-center text-center group animate-fade-in">
                            <CreditCard className="w-10 h-10 text-cyan-600 mb-4 group-hover:scale-110 transition" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Payment Processing
                            </h3>
                            <p className="text-gray-500 text-base">
                                Secure payment handling, billing, and financial
                                reporting for your practice.
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-2xl shadow hover:shadow-2xl transition p-8 flex flex-col items-center text-center group animate-fade-in">
                            <ShieldCheck className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Data Security
                            </h3>
                            <p className="text-gray-500 text-base">
                                Your data is encrypted and protected with
                                industry-leading security standards.
                            </p>
                        </div>
                        <div className="bg-cyan-50 rounded-2xl shadow hover:shadow-2xl transition p-8 flex flex-col items-center text-center group animate-fade-in">
                            <Globe className="w-10 h-10 text-cyan-600 mb-4 group-hover:scale-110 transition" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Access Anywhere
                            </h3>
                            <p className="text-gray-500 text-base">
                                Cloud-based platform accessible from any device,
                                anywhere, anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section: blue-50 background */}
            <section className="relative z-20 bg-blue-50 py-12 px-4 sm:px-8 lg:px-16 flex flex-col items-center text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 font-montserrat">
                    Looking for a dental clinic?
                </h2>
                <p className="text-lg text-gray-600 mb-6 max-w-2xl">
                    Browse our network of trusted clinics and book your next
                    appointment with ease.
                </p>
                <Link
                    href={route("public.clinics.index")}
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 group"
                    style={{ fontFamily: "Inter, sans-serif" }}
                >
                    Find a Clinic
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </section>

            {/* FAQ Section: white background */}
            <section className="py-24 bg-white border-t border-b border-gray-100 z-10 relative">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-500">
                            Still have questions? We've got answers.
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

            {/* Testimonials or Additional Info: blue-50 background */}
            <section className="py-24 bg-blue-50 z-10 relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                            What Our Users Say
                        </h2>
                        <p className="text-lg text-gray-500">
                            Dentists and staff love Smile Suite. Here's what
                            they're saying:
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-pink-50 rounded-2xl shadow p-8 flex flex-col items-center text-center animate-fade-in">
                            <Avatar name="Dr. Alice Smith" />
                            <p className="text-gray-700 mt-4 mb-2">
                                "Smile Suite has made managing my clinic so much
                                easier. The appointment system is a game
                                changer!"
                            </p>
                            <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                            </div>
                            <span className="text-blue-700 font-semibold">
                                Dr. Alice Smith
                            </span>
                        </div>
                        <div className="bg-cyan-50 rounded-2xl shadow p-8 flex flex-col items-center text-center animate-fade-in">
                            <Avatar name="John Doe" />
                            <p className="text-gray-700 mt-4 mb-2">
                                "I can access patient records from anywhere,
                                even on my phone. Highly recommend for any
                                dental practice."
                            </p>
                            <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                            </div>
                            <span className="text-cyan-700 font-semibold">
                                John Doe
                            </span>
                        </div>
                        <div className="bg-orange-50 rounded-2xl shadow p-8 flex flex-col items-center text-center animate-fade-in">
                            <Avatar name="Sarah Lee" />
                            <p className="text-gray-700 mt-4 mb-2">
                                "The support team is fantastic and the platform
                                is so intuitive. My staff learned it in a day!"
                            </p>
                            <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <Star className="w-5 h-5 fill-yellow-400" />
                            </div>
                            <span className="text-blue-700 font-semibold">
                                Sarah Lee
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <div className="py-24 bg-white z-10 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-lg text-gray-500">
                            Choose the plan that fits your clinic. No hidden
                            fees, cancel anytime.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Basic Plan */}
                        <div className="rounded-2xl border border-gray-200 shadow p-8 flex flex-col items-center text-center hover:shadow-xl transition animate-fade-in">
                            <DollarSign className="w-10 h-10 text-blue-600 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Basic</h3>
                            <p className="text-3xl font-extrabold text-gray-900 mb-2">
                                $29{" "}
                                <span className="text-base font-medium text-gray-500">
                                    /mo
                                </span>
                            </p>
                            <ul className="text-gray-600 mb-6 space-y-2">
                                <li>✔ Patient Management</li>
                                <li>✔ Appointments</li>
                                <li>✔ Email Support</li>
                            </ul>
                            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                                Choose Basic
                            </button>
                        </div>
                        {/* Premium Plan */}
                        <div className="rounded-2xl border-4 border-blue-600 shadow-lg p-8 flex flex-col items-center text-center scale-105 bg-blue-50 animate-fade-in">
                            <DollarSign className="w-10 h-10 text-blue-700 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Premium</h3>
                            <p className="text-3xl font-extrabold text-gray-900 mb-2">
                                $59{" "}
                                <span className="text-base font-medium text-gray-500">
                                    /mo
                                </span>
                            </p>
                            <ul className="text-gray-700 mb-6 space-y-2">
                                <li>✔ Everything in Basic</li>
                                <li>✔ Treatment Records</li>
                                <li>✔ SMS Reminders</li>
                                <li>✔ Priority Support</li>
                            </ul>
                            <button className="px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition">
                                Choose Premium
                            </button>
                        </div>
                        {/* Enterprise Plan */}
                        <div className="rounded-2xl border border-gray-200 shadow p-8 flex flex-col items-center text-center hover:shadow-xl transition animate-fade-in">
                            <DollarSign className="w-10 h-10 text-cyan-600 mb-4" />
                            <h3 className="text-xl font-bold mb-2">
                                Enterprise
                            </h3>
                            <p className="text-3xl font-extrabold text-gray-900 mb-2">
                                Custom
                            </p>
                            <ul className="text-gray-600 mb-6 space-y-2">
                                <li>✔ All Premium Features</li>
                                <li>✔ Custom Integrations</li>
                                <li>✔ Dedicated Account Manager</li>
                            </ul>
                            <button className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div
                id="clinics"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 z-10 relative"
            >
                <div className="max-w-2xl mx-auto text-center py-20 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
                        Ready to find your dental clinic?
                    </h2>
                    <p className="mb-8 text-lg leading-6 text-blue-100">
                        Browse our network of professional dental clinics and
                        find the perfect match for your needs.
                    </p>
                    <Link
                        href={route("public.clinics.index")}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-semibold rounded-lg text-blue-700 bg-white hover:bg-blue-50 shadow-lg transition-all duration-150"
                    >
                        Browse Clinics
                    </Link>
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
