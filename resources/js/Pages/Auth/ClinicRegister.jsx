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
            price: 99,
            features: [
                "Up to 500 patients",
                "Basic appointment scheduling",
                "Patient records management",
                "Email support",
            ],
        },
        {
            id: "premium",
            name: "Premium",
            price: 199,
            features: [
                "Up to 2,000 patients",
                "Advanced appointment scheduling",
                "Treatment planning",
                "Inventory management",
                "Priority support",
            ],
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: 399,
            features: [
                "Unlimited patients",
                "Multi-location support",
                "Advanced reporting",
                "API access",
                "Dedicated support",
            ],
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Soft SVG background pattern */}
                <svg
                    className="absolute left-0 top-0 w-full h-full opacity-20 pointer-events-none"
                    width="100%"
                    height="100%"
                    viewBox="0 0 800 600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="700" cy="100" r="80" fill="#bae6fd" />
                    <circle cx="100" cy="500" r="120" fill="#c7d2fe" />
                    <rect
                        x="300"
                        y="350"
                        width="200"
                        height="80"
                        rx="40"
                        fill="#e0e7ff"
                    />
                </svg>
                <div className="max-w-2xl w-full space-y-8 relative z-10">
                    <div className="text-center mb-2">
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <Building2 className="w-7 h-7 text-blue-500" />
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Register Your Dental Clinic
                            </h2>
                        </div>
                        <p className="mt-2 text-base text-gray-600 flex items-center justify-center gap-1">
                            <Info className="w-4 h-4 text-cyan-400" />
                            Request to join our platform and streamline your
                            dental practice
                        </p>
                    </div>
                    <Card className="shadow-xl rounded-2xl border border-blue-100 bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="w-6 h-6 text-blue-400" />
                                <CardTitle className="text-2xl font-bold text-blue-700">
                                    Clinic Registration Request
                                </CardTitle>
                            </div>
                            <CardDescription className="text-gray-700 flex items-center gap-1">
                                <Info className="w-4 h-4 text-blue-300" />
                                Fill out the form below and we'll get back to
                                you within 24-48 hours to set up your clinic
                                account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-7">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="clinic_name">
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
                                            required
                                        />
                                        {errors.clinic_name && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.clinic_name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="contact_person">
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
                                            required
                                        />
                                        {errors.contact_person && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.contact_person}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="email">
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
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">
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
                                            required
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="license_number">
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
                                        required
                                    />
                                    {errors.license_number && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.license_number}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="description">
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
                                        rows={3}
                                        placeholder="Tell us about your clinic, services offered, and years in practice..."
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600 mt-1">
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
                                    <Label htmlFor="subscription_plan">
                                        Subscription Plan{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                    className={`relative border rounded-lg p-4 cursor-pointer transition-all group ${
                                                        data.subscription_plan ===
                                                        plan.id
                                                            ? "border-blue-500 bg-blue-50 shadow-lg scale-[1.03]"
                                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                                    }`}
                                                    onClick={() =>
                                                        setData(
                                                            "subscription_plan",
                                                            plan.id
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <PlanIcon
                                                                className={`w-6 h-6 ${planColor}`}
                                                            />
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {plan.name}
                                                            </h3>
                                                        </div>
                                                        {data.subscription_plan ===
                                                            plan.id && (
                                                            <CheckCircle className="h-5 w-5 text-blue-500 animate-bounce" />
                                                        )}
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-900 mb-3">
                                                        ${plan.price}
                                                        <span className="text-sm font-normal text-gray-500">
                                                            /month
                                                        </span>
                                                    </div>
                                                    <ul className="space-y-2">
                                                        {plan.features.map(
                                                            (
                                                                feature,
                                                                index
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="flex items-center text-sm text-gray-600"
                                                                >
                                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                                    {feature}
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
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-4 mt-2">
                                        <Star className="w-6 h-6 text-yellow-400" />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-blue-900">
                                                Selected Plan:{" "}
                                                {selectedPlan.name}
                                            </h4>
                                            <p className="text-sm text-blue-700">
                                                ${selectedPlan.price}/month
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-blue-600">
                                                Total for first month
                                            </p>
                                            <p className="text-lg font-bold text-blue-900">
                                                ${selectedPlan.price}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <Alert className="mt-6">
                                    <AlertDescription>
                                        <strong className="flex items-center gap-1">
                                            <Info className="w-4 h-4 text-blue-400" />
                                            What happens next?
                                        </strong>
                                        <br />
                                        1. We'll review your application within
                                        24-48 hours
                                        <br />
                                        2. If approved, we'll create your clinic
                                        account and send login credentials
                                        <br />
                                        3. You'll get access to our full clinic
                                        management system
                                        <br />
                                        4. Our team will help you set up and
                                        train your staff
                                    </AlertDescription>
                                </Alert>
                                <Button
                                    type="submit"
                                    className="w-full mt-2"
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
        </>
    );
}
