import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import axios from "axios";
import { Send, Loader2, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function SendReminders({ auth, clinic }) {
    const [sendingReminders, setSendingReminders] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSendReminders = async () => {
        if (
            !confirm(
                `Send SMS reminders to all patients with appointments scheduled for TODAY at ${clinic.name}?`
            )
        ) {
            return;
        }

        setSendingReminders(true);
        setResult(null);
        setError(null);

        try {
            const response = await axios.post(
                route("clinic.appointments.send-reminders", clinic.id)
            );

            if (response.data.success) {
                setResult({
                    message: response.data.message,
                    output: response.data.output,
                    stats: response.data.stats,
                });
            } else {
                setError(response.data.message || "Failed to send reminders");
            }
        } catch (err) {
            console.error("Failed to send reminders:", err);
            setError(
                err.response?.data?.message ||
                    "Failed to send reminders. Please try again."
            );
        } finally {
            setSendingReminders(false);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Send SMS Reminders" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                router.visit(
                                    route("clinic.dashboard", clinic.id)
                                )
                            }
                            className="mb-4 text-sm hover:bg-blue-50"
                            size="sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Send SMS Appointment Reminders
                            </h1>
                            <p className="text-base text-gray-600">
                                Send reminders to patients with appointments scheduled for today at{" "}
                                <strong className="text-blue-600">{clinic.name}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <Card className="shadow-xl border-gray-200">
                    <CardHeader className="pb-4 border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                                <Send className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-gray-900">Appointment Reminders</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border border-blue-200/50 rounded-xl p-5 shadow-sm">
                            <h3 className="font-semibold text-blue-900 mb-3 text-base flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                What this does:
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800 space-y-1 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>Finds appointments scheduled for <strong className="text-blue-900">TODAY</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>Filters by status: <strong className="text-blue-900">Pending</strong> or <strong className="text-blue-900">Confirmed</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>Sends SMS to patients with valid phone numbers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>Prevents duplicate sends (won't send twice on the same day)</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center justify-center pt-4 pb-2">
                            <Button
                                onClick={handleSendReminders}
                                disabled={sendingReminders}
                                size="lg"
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                {sendingReminders ? (
                                    <>
                                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                        Sending Reminders...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-6 h-6 mr-2" />
                                        Send SMS Reminders
                                    </>
                                )}
                            </Button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-red-900 mb-1 text-base">
                                            Error
                                        </h3>
                                        <p className="text-red-800 text-sm">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg p-5 space-y-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-green-900 mb-1 text-base">
                                            {result.message}
                                        </h3>
                                    </div>
                                </div>

                                {result.stats && (
                                    <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="text-gray-600 text-xs font-medium mb-1">Total</div>
                                                <div className="font-bold text-gray-900 text-xl">
                                                    {result.stats.total}
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                                                <div className="text-gray-600 text-xs font-medium mb-1">Sent</div>
                                                <div className="font-bold text-green-600 text-xl">
                                                    {result.stats.sms_sent}
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                                                <div className="text-gray-600 text-xs font-medium mb-1">Failed</div>
                                                <div className="font-bold text-red-600 text-xl">
                                                    {result.stats.sms_failed}
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <div className="text-gray-600 text-xs font-medium mb-1">No Phone</div>
                                                <div className="font-bold text-yellow-600 text-xl">
                                                    {result.stats.no_phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-80 overflow-y-auto shadow-inner">
                                    <pre className="whitespace-pre-wrap leading-relaxed">
                                        {result.output}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        Direct access:{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                            /clinic/{clinic.id}/appointments/send-reminders
                        </code>
                    </p>
                </div>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
