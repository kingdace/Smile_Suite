import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import SiteHeader from "@/Components/SiteHeader";
import {
    Building2,
    User,
    Mail,
    Phone,
    BadgeCheck,
    Info,
    MessageCircle,
    Star,
    ShieldCheck,
    Users,
    CheckCircle,
} from "lucide-react";
import SmileyDy from "@/Components/Chatbot/SmileyDy";

export default function ClinicRegister() {
    const { data, setData, post, processing, errors, reset } = useForm({
        clinic_name: "",
        contact_person: "",
        email: "",
        phone: "",
        license_number: "",
        description: "",
        message: "",
        subscription_plan: "basic",
    });

    const subscriptionPlans = [
        {
            id: "basic",
            name: "Basic",
            price: 999,
            features: [
                "Patient Management (up to 500 patients)",
                "Appointment Scheduling (up to 2 dentists & staffs)",
                "Payment Processing (all methods)",
                "Treatment Management",
                "Service Management (up to 20 services)",
                "Standard Dashboard & Reports",
                "Email Notifications",
                "14-day Free Trial",
            ],
            hasTrial: true,
        },
        {
            id: "premium",
            name: "Premium",
            price: 1999,
            features: [
                "Everything in Basic",
                "Up to 5 dentist and staff accounts",
                "Inventory Management",
                "Supplier Management",
                "Clinic Profile Management",
                "Export Feature",
                "Bulk Operations",
                "Priority Support",
            ],
            hasTrial: false,
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: 2999,
            features: [
                "Everything in Premium",
                "Unlimited dentist and staff accounts",
                "Multi-branch Management",
                "Advanced Analytics & Insights",
                "Custom Reporting",
                "API Access",
                "24/7 Priority Support",
                "Training & Onboarding",
            ],
            hasTrial: false,
        },
    ];

    const selectedPlan = subscriptionPlans.find(
        (plan) => plan.id === data.subscription_plan
    );

    const submit = (e) => {
        e.preventDefault();
        post(route("register.clinic.request"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Register Clinic" />
            <SiteHeader />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Simplified background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    {/* Main subtle gradient circles - hidden on mobile */}
                    <div className="hidden md:block absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full mix-blend-multiply transform rotate-45"></div>
                    <div className="hidden md:block absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full mix-blend-multiply transform -rotate-30"></div>
                    <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/15 via-indigo-500/15 to-purple-500/15 rounded-full mix-blend-multiply"></div>
                </div>

                <div className="max-w-4xl w-full space-y-4 sm:space-y-5 relative z-10">
                    {/* Mobile-optimized header */}
                    <div className="text-center mb-4 sm:mb-5">
                        {/* Mobile: Simplified header, Desktop: Full header */}

                        {/* Mobile: Direct title, Desktop: Full title */}
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2 sm:mb-3">
                            <span className="hidden sm:inline">
                                Register Your{" "}
                                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                                    Dental Clinic
                                </span>
                            </span>
                        </h2>

                        {/* Mobile: Short description, Desktop: Full description */}
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            <span className="sm:hidden">
                                Join our platform and streamline your dental
                                practice.
                            </span>
                            <span className="hidden sm:inline">
                                Join hundreds of dental practices that have
                                transformed their operations with Smile Suite.
                                Request to join our platform and streamline your
                                dental practice.
                            </span>
                        </p>
                    </div>
                    <Card className="shadow-xl sm:shadow-2xl rounded-2xl sm:rounded-3xl border border-blue-200/20 bg-white backdrop-blur-sm relative overflow-hidden">
                        {/* Simplified card decorative elements - hidden on mobile */}
                        <div className="hidden sm:block absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="hidden sm:block absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-full -translate-y-12 -translate-x-12"></div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 rounded-3xl"></div>
                        <CardHeader className="pb-4 sm:pb-5 relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                        <span className="sm:hidden">
                                            Registration Form
                                        </span>
                                        <span className="hidden sm:inline">
                                            Clinic Registration Request
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                        <span className="sm:hidden">
                                            Fill out the form below to get
                                            started.
                                        </span>
                                        <span className="hidden sm:inline">
                                            Fill out the form below and we'll
                                            get back to you within 24-48 hours
                                            to set up your clinic account.
                                        </span>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label
                                            htmlFor="clinic_name"
                                            className="text-base font-semibold text-gray-900 mb-3 block"
                                        >
                                            Clinic Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="clinic_name"
                                            type="text"
                                            value={data.clinic_name}
                                            onChange={(e) =>
                                                setData(
                                                    "clinic_name",
                                                    e.target.value
                                                )
                                            }
                                            className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                                            required
                                        />
                                        {errors.clinic_name && (
                                            <p className="text-sm text-red-600 mt-2">
                                                {errors.clinic_name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="contact_person"
                                            className="text-base font-semibold text-gray-900 mb-3 block"
                                        >
                                            Contact Person{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="contact_person"
                                            type="text"
                                            value={data.contact_person}
                                            onChange={(e) =>
                                                setData(
                                                    "contact_person",
                                                    e.target.value
                                                )
                                            }
                                            className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                                            required
                                        />
                                        {errors.contact_person && (
                                            <p className="text-sm text-red-600 mt-2">
                                                {errors.contact_person}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label
                                            htmlFor="email"
                                            className="text-base font-semibold text-gray-900 mb-3 block"
                                        >
                                            Email Address{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600 mt-2">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="phone"
                                            className="text-base font-semibold text-gray-900 mb-3 block"
                                        >
                                            Phone Number{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                                            required
                                        />
                                        <p className="text-sm text-gray-600 mt-2">
                                            Format: +639XXXXXXXXX or 09XXXXXXXXX
                                        </p>
                                        {errors.phone && (
                                            <p className="text-sm text-red-600 mt-2">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label
                                        htmlFor="license_number"
                                        className="text-base font-semibold text-gray-900 mb-3 block"
                                    >
                                        Dental License Number{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="license_number"
                                        type="text"
                                        value={data.license_number}
                                        onChange={(e) =>
                                            setData(
                                                "license_number",
                                                e.target.value
                                            )
                                        }
                                        className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                                        required
                                    />
                                    <p className="text-sm text-gray-600 mt-2">
                                        Format: Letters, numbers, and hyphens
                                        only (e.g., DENT-123456)
                                    </p>
                                    {errors.license_number && (
                                        <p className="text-sm text-red-600 mt-2">
                                            {errors.license_number}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="description"
                                        className="text-base font-semibold text-gray-900 mb-3 block"
                                    >
                                        Clinic Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                        className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                                        placeholder="Tell us about your clinic, services offered, and years in practice..."
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600 mt-2">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="message">
                                        Additional Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                        rows={3}
                                        placeholder="Any specific requirements or questions you have..."
                                    />
                                    {errors.message && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="subscription_plan"
                                        className="text-base font-semibold text-gray-900 mb-4 block"
                                    >
                                        Subscription Plan{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                        {subscriptionPlans.map((plan) => {
                                            const PlanIcon =
                                                plan.id === "basic"
                                                    ? Users
                                                    : plan.id === "premium"
                                                    ? ShieldCheck
                                                    : Star;
                                            const planColor =
                                                plan.id === "basic"
                                                    ? "text-blue-400"
                                                    : plan.id === "premium"
                                                    ? "text-cyan-500"
                                                    : "text-yellow-500";
                                            return (
                                                <div
                                                    key={plan.id}
                                                    className={`relative border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 group ${
                                                        data.subscription_plan ===
                                                        plan.id
                                                            ? "border-blue-500 bg-blue-50 shadow-lg sm:shadow-xl scale-105"
                                                            : "border-gray-200 hover:border-blue-300 bg-white hover:shadow-md sm:hover:shadow-lg"
                                                    }`}
                                                    onClick={() =>
                                                        setData(
                                                            "subscription_plan",
                                                            plan.id
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <PlanIcon
                                                                className={`w-5 h-5 sm:w-6 sm:h-6 ${planColor}`}
                                                            />
                                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                                                {plan.name}
                                                            </h3>
                                                        </div>
                                                        {data.subscription_plan ===
                                                            plan.id && (
                                                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 animate-bounce" />
                                                        )}
                                                    </div>
                                                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                                                        {plan.hasTrial ? (
                                                            <>
                                                                <span className="text-green-600">
                                                                    FREE
                                                                </span>
                                                                <span className="text-xs sm:text-sm font-normal text-gray-500">
                                                                    /14 days
                                                                    trial
                                                                </span>
                                                                <div className="text-xs sm:text-sm text-gray-500 line-through mt-1">
                                                                    Then ₱
                                                                    {plan.price}
                                                                    /month
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                ₱{plan.price}
                                                                <span className="text-xs sm:text-sm font-normal text-gray-500">
                                                                    /month
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <ul className="space-y-1 sm:space-y-2">
                                                        {plan.features.map(
                                                            (
                                                                feature,
                                                                index
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="flex items-center text-xs sm:text-sm text-gray-600"
                                                                >
                                                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 flex-shrink-0" />
                                                                    <span className="leading-tight">
                                                                        {
                                                                            feature
                                                                        }
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {errors.subscription_plan && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.subscription_plan}
                                        </p>
                                    )}
                                </div>
                                {selectedPlan && (
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-3 sm:p-4 flex items-center gap-3 mt-2 shadow-lg">
                                        <div
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-lg ${
                                                selectedPlan.hasTrial
                                                    ? "bg-gradient-to-br from-green-400 to-emerald-500"
                                                    : "bg-gradient-to-br from-yellow-400 to-orange-500"
                                            }`}
                                        >
                                            {selectedPlan.hasTrial ? (
                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
                                            ) : (
                                                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm sm:text-base font-bold text-blue-900 mb-1">
                                                <span className="sm:hidden">
                                                    Selected:{" "}
                                                </span>
                                                <span className="hidden sm:inline">
                                                    Selected Plan:{" "}
                                                </span>
                                                {selectedPlan.name}
                                            </h4>
                                            {selectedPlan.hasTrial ? (
                                                <div>
                                                    <p className="text-xs sm:text-sm text-green-700 font-medium">
                                                        14-day FREE trial
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Then ₱
                                                        {selectedPlan.price}
                                                        /month
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-xs sm:text-sm text-blue-700 font-medium">
                                                    ₱{selectedPlan.price}/month
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-blue-600 mb-1">
                                                {selectedPlan.hasTrial
                                                    ? "Trial period"
                                                    : "First month payment"}
                                            </p>
                                            <p className="text-xl font-bold text-blue-900">
                                                {selectedPlan.hasTrial
                                                    ? "FREE"
                                                    : `₱${selectedPlan.price}`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <Alert className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                                    <AlertDescription className="text-gray-700">
                                        <strong className="flex items-center gap-2 text-blue-900 mb-2">
                                            <Info className="w-5 h-5 text-blue-600" />
                                            What happens next?
                                        </strong>
                                        <div className="space-y-1 text-sm">
                                            <div>
                                                1. We'll review your application
                                                within 24-48 hours
                                            </div>
                                            <div>
                                                2. If approved, we'll create
                                                your clinic account and send
                                                login credentials
                                            </div>
                                            <div>
                                                3. You'll get access to our full
                                                clinic management system
                                            </div>
                                            <div>
                                                4. Our team will help you set up
                                                and train your staff
                                            </div>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                                <Button
                                    type="submit"
                                    className="w-full mt-5 py-3 px-6 rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8z"
                                                ></path>
                                            </svg>
                                            Submitting Request...
                                        </span>
                                    ) : (
                                        "Submit Registration Request"
                                    )}
                                </Button>
                            </form>
                            <div className="mt-8 text-center border-t pt-6">
                                <p className="text-sm text-gray-600">
                                    Already have a clinic account?{" "}
                                    <Link
                                        href={route("login")}
                                        className="text-blue-600 hover:text-blue-500 font-semibold underline underline-offset-2"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SmileyDy Chatbot */}
            <SmileyDy position="right" />
        </>
    );
}
