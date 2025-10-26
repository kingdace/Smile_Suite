import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    HelpCircle,
    Search,
    Filter,
    RefreshCw,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    MessageSquare,
    Eye,
    ChevronRight,
    Building2,
    User,
    Zap,
} from "lucide-react";

export default function Index({ auth, tickets, stats, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "all");
    const [priorityFilter, setPriorityFilter] = useState(
        filters?.priority || "all"
    );
    const [categoryFilter, setCategoryFilter] = useState(
        filters?.category || "all"
    );
    const [clinicFilter, setClinicFilter] = useState(
        filters?.clinic_id || "all"
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "open":
                return "bg-green-100 text-green-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            case "resolved":
                return "bg-gray-100 text-gray-800";
            case "closed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent":
                return "text-red-600";
            case "high":
                return "text-orange-600";
            case "medium":
                return "text-blue-600";
            case "low":
                return "text-gray-600";
            default:
                return "text-gray-600";
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "urgent":
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            case "high":
                return <Zap className="w-4 h-4 text-orange-600" />;
            case "medium":
                return <Clock className="w-4 h-4 text-blue-600" />;
            case "low":
                return <CheckCircle className="w-4 h-4 text-gray-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const handleFilter = () => {
        router.get(route("admin.support.index"), {
            search: searchTerm,
            status: statusFilter,
            priority: priorityFilter,
            category: categoryFilter,
            clinic_id: clinicFilter,
        });
    };

    const handleRefresh = () => {
        router.reload();
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Admin Support Management" />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-slate-200/50 border-t border-t-slate-200">
                {/* Compact Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 mx-5 mb-4 rounded-lg shadow-lg">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8"></div>

                    <div className="relative px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white/20 rounded-md backdrop-blur-sm">
                                    <HelpCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">
                                        Support Management
                                    </h1>
                                    <p className="text-slate-100 text-sm">
                                        Manage all clinic support tickets
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleRefresh}
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 h-8 px-3"
                                >
                                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact Stats Cards */}
                <div className="mx-5 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Card className="bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 mb-1">
                                        Total
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {stats.total}
                                    </p>
                                </div>
                                <div className="p-1.5 bg-slate-100 rounded-md">
                                    <MessageSquare className="w-4 h-4 text-slate-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-sm border-green-200/50 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 mb-1">
                                        Open
                                    </p>
                                    <p className="text-lg font-bold text-green-600">
                                        {stats.open}
                                    </p>
                                </div>
                                <div className="p-1.5 bg-green-100 rounded-md">
                                    <Clock className="w-4 h-4 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 mb-1">
                                        Resolved
                                    </p>
                                    <p className="text-lg font-bold text-gray-600">
                                        {stats.resolved}
                                    </p>
                                </div>
                                <div className="p-1.5 bg-gray-100 rounded-md">
                                    <CheckCircle className="w-4 h-4 text-gray-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-sm border-red-200/50 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 mb-1">
                                        Urgent
                                    </p>
                                    <p className="text-lg font-bold text-red-600">
                                        {stats.urgent}
                                    </p>
                                </div>
                                <div className="p-1.5 bg-red-100 rounded-md">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Compact Filters */}
                <div className="mx-5 mb-4">
                    <Card className="bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Filter className="w-4 h-4 text-gray-600" />
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Filters
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                <Input
                                    placeholder="Search tickets..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full h-9"
                                />
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="open">
                                            Open
                                        </SelectItem>
                                        <SelectItem value="in_progress">
                                            In Progress
                                        </SelectItem>
                                        <SelectItem value="resolved">
                                            Resolved
                                        </SelectItem>
                                        <SelectItem value="closed">
                                            Closed
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={priorityFilter}
                                    onValueChange={setPriorityFilter}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Priority
                                        </SelectItem>
                                        <SelectItem value="urgent">
                                            Urgent
                                        </SelectItem>
                                        <SelectItem value="high">
                                            High
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={categoryFilter}
                                    onValueChange={setCategoryFilter}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        <SelectItem value="technical">
                                            Technical
                                        </SelectItem>
                                        <SelectItem value="billing">
                                            Billing
                                        </SelectItem>
                                        <SelectItem value="feature_request">
                                            Feature Request
                                        </SelectItem>
                                        <SelectItem value="bug_report">
                                            Bug Report
                                        </SelectItem>
                                        <SelectItem value="general">
                                            General
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={clinicFilter}
                                    onValueChange={setClinicFilter}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Clinic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Clinics
                                        </SelectItem>
                                        {/* Add clinic options here */}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleFilter}
                                    className="w-full h-9"
                                >
                                    <Search className="w-3.5 h-3.5 mr-1" />
                                    Apply
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Enhanced Tickets List */}
                <div className="mx-5 mb-6">
                    <Card className="bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">
                                        Support Tickets
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        Manage all clinic support requests
                                    </CardDescription>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {tickets.data.length} ticket
                                    {tickets.data.length !== 1 ? "s" : ""}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {tickets.data.length === 0 ? (
                                <div className="text-center py-8 px-4">
                                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-base font-medium text-gray-900 mb-2">
                                        No Support Tickets
                                    </h3>
                                    <p className="text-gray-500 mb-4 text-sm">
                                        No support tickets have been submitted
                                        yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {tickets.data.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className="p-4 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-base font-semibold text-gray-900 truncate">
                                                            {ticket.subject}
                                                        </h3>
                                                        <Badge
                                                            className={`${getStatusColor(
                                                                ticket.status
                                                            )} text-xs px-2 py-0.5`}
                                                        >
                                                            {ticket.status.replace(
                                                                "_",
                                                                " "
                                                            )}
                                                        </Badge>
                                                        <div className="flex items-center gap-1">
                                                            {getPriorityIcon(
                                                                ticket.priority
                                                            )}
                                                            <span
                                                                className={`text-xs font-medium ${getPriorityColor(
                                                                    ticket.priority
                                                                )}`}
                                                            >
                                                                {
                                                                    ticket.priority
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                        {ticket.description}
                                                    </p>

                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="w-3 h-3" />
                                                            #
                                                            {
                                                                ticket.ticket_number
                                                            }
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Building2 className="w-3 h-3" />
                                                            {ticket.clinic
                                                                ?.name ||
                                                                "Unknown Clinic"}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            {ticket.user
                                                                ?.name ||
                                                                "Unknown User"}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(
                                                                ticket.created_at
                                                            ).toLocaleDateString()}
                                                        </span>
                                                        {ticket.messages &&
                                                            ticket.messages
                                                                .length > 0 && (
                                                                <>
                                                                    <span>
                                                                        •
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <MessageSquare className="w-3 h-3" />
                                                                        {
                                                                            ticket
                                                                                .messages
                                                                                .length
                                                                        }{" "}
                                                                        message
                                                                        {ticket
                                                                            .messages
                                                                            .length !==
                                                                        1
                                                                            ? "s"
                                                                            : ""}
                                                                    </span>
                                                                </>
                                                            )}
                                                    </div>
                                                </div>

                                                <div className="ml-4 flex-shrink-0">
                                                    <Link
                                                        href={route(
                                                            "admin.support.show",
                                                            ticket.id
                                                        )}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View
                                                        <ChevronRight className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Compact Pagination */}
                            {tickets.data.length > 0 && tickets.links && (
                                <div className="px-4 py-3 border-t border-gray-100">
                                    <div className="flex justify-center">
                                        <div className="flex items-center gap-1">
                                            {tickets.links.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || "#"}
                                                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                                            link.active
                                                                ? "bg-blue-600 text-white"
                                                                : link.url
                                                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                : "bg-gray-50 text-gray-400 cursor-not-allowed"
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
