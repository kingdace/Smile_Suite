import { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import {
    HelpCircle,
    Plus,
    Search,
    Filter,
    RefreshCw,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    MessageSquare,
    Paperclip,
    Eye,
    ChevronRight,
    Edit,
    X,
    Upload,
    Users,
    Building2,
    Zap,
    TrendingUp,
} from "lucide-react";
import SupportTicketForm from "@/Components/SupportTicketForm";

export default function Index({ auth, tickets, stats, filters }) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "all");
    const [priorityFilter, setPriorityFilter] = useState(
        filters?.priority || "all"
    );
    const [categoryFilter, setCategoryFilter] = useState(
        filters?.category || "all"
    );

    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: editProcessing,
    } = useForm({
        subject: "",
        description: "",
        category: "",
        priority: "",
        status: "",
        attachments: [],
        existingAttachments: [],
    });

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
        router.get(route("clinic.support.index", auth.clinic_id), {
            search: searchTerm,
            status: statusFilter,
            priority: priorityFilter,
            category: categoryFilter,
        });
    };

    const handleRefresh = () => {
        router.reload();
    };

    const handleEditClick = (ticket) => {
        setEditData({
            subject: ticket.subject,
            description: ticket.description,
            category: ticket.category,
            priority: ticket.priority,
            status: ticket.status,
            attachments: [],
            existingAttachments: ticket.attachments || [],
        });
        setShowEditModal(ticket);
    };

    const handleEditFileChange = (e) => {
        const files = Array.from(e.target.files);
        setEditData("attachments", files);
    };

    const removeEditFile = (index) => {
        const newAttachments = editData.attachments.filter(
            (_, i) => i !== index
        );
        setEditData("attachments", newAttachments);
    };

    const removeExistingAttachment = (index) => {
        const newExistingAttachments = editData.existingAttachments.filter(
            (_, i) => i !== index
        );
        setEditData("existingAttachments", newExistingAttachments);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (isSubmittingEdit || editProcessing) {
            console.log(
                "Edit submission already in progress, ignoring duplicate submit"
            );
            return;
        }

        setIsSubmittingEdit(true);
        const formDataToSend = new FormData();
        formDataToSend.append("subject", editData.subject);
        formDataToSend.append("description", editData.description);
        formDataToSend.append("category", editData.category);
        formDataToSend.append("priority", editData.priority);
        formDataToSend.append("status", editData.status);
        formDataToSend.append("_method", "PUT");

        editData.attachments.forEach((file, index) => {
            formDataToSend.append(`attachments[${index}]`, file);
        });

        // Add existing attachments that weren't removed
        editData.existingAttachments.forEach((attachment, index) => {
            formDataToSend.append(
                `existing_attachments[${index}]`,
                attachment.id
            );
        });

        router.post(
            route("clinic.support.update", [auth.clinic_id, showEditModal.id]),
            formDataToSend,
            {
                onSuccess: () => {
                    setShowEditModal(null);
                    setIsSubmittingEdit(false);
                    router.reload();
                },
                onError: () => {
                    setIsSubmittingEdit(false);
                },
                onFinish: () => {
                    setIsSubmittingEdit(false);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Help & Support" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Compact Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 mx-5 mb-4 rounded-lg shadow-lg">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <HelpCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-white">
                                        Help & Support
                                    </h1>
                                    <p className="text-blue-100 text-xs">
                                        Manage support requests
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleRefresh}
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs px-3 py-1"
                                >
                                    <RefreshCw className="h-3 w-3" />
                                    Refresh
                                </Button>
                                <Button
                                    onClick={() => setShowCreateForm(true)}
                                    size="sm"
                                    className="gap-1 bg-white/25 border-white/40 text-white hover:bg-white/35 text-xs px-3 py-1"
                                >
                                    <Plus className="h-3 w-3" />
                                    New Ticket
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Compact Stats Cards with Visual Elements */}
                <div className="mx-5 mb-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Card className="group border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-blue-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-6 -translate-x-6 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                        <CardContent className="p-3 relative">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-2 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-lg shadow-md flex-shrink-0">
                                    <MessageSquare className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0 w-full">
                                    <p className="text-[10px] text-gray-600 font-medium mb-0.5 leading-none">
                                        Total
                                    </p>
                                    <p className="text-base font-bold text-gray-900 leading-none">
                                        {stats.total}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-green-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full translate-y-6 -translate-x-6 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                        <CardContent className="p-3 relative">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-2 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-lg shadow-md flex-shrink-0">
                                    <Clock className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0 w-full">
                                    <p className="text-[10px] text-gray-600 font-medium mb-0.5 leading-none">
                                        Open
                                    </p>
                                    <p className="text-base font-bold text-gray-900 leading-none">
                                        {stats.open}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-gray-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full translate-y-6 -translate-x-6 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                        <CardContent className="p-3 relative">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-2 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 rounded-lg shadow-md flex-shrink-0">
                                    <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0 w-full">
                                    <p className="text-[10px] text-gray-600 font-medium mb-0.5 leading-none">
                                        Resolved
                                    </p>
                                    <p className="text-base font-bold text-gray-900 leading-none">
                                        {stats.resolved}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-red-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-full translate-y-6 -translate-x-6 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                        <CardContent className="p-3 relative">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-2 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 rounded-lg shadow-md flex-shrink-0">
                                    <AlertCircle className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0 w-full">
                                    <p className="text-[10px] text-gray-600 font-medium mb-0.5 leading-none">
                                        Urgent
                                    </p>
                                    <p className="text-base font-bold text-gray-900 leading-none">
                                        {stats.urgent}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Compact Search and Filters - Single Row */}
                <div className="mx-5 mb-3">
                    <Card className="border-0 shadow-lg bg-white border border-gray-200">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                                {/* Search Bar */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search tickets..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Filter Dropdowns */}
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-28 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
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
                                    <SelectTrigger className="w-28 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
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
                                    <SelectTrigger className="w-32 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
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

                                {/* Action Buttons */}
                                <Button
                                    onClick={handleFilter}
                                    className="h-10 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Enhanced Tickets List */}
                <div className="mx-5 mb-6">
                    <Card className="bg-white/90 backdrop-blur-sm border-blue-200/50 shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">
                                        Support Tickets
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        Manage your support requests
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
                                        You haven't created any support tickets
                                        yet.
                                    </p>
                                    <Button
                                        onClick={() => setShowCreateForm(true)}
                                        className="bg-blue-600 text-white hover:bg-blue-700 h-8 px-4"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1" />
                                        Create Your First Ticket
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 px-4">
                                    {tickets.data.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className="bg-white rounded-lg border border-gray-200 shadow-sm"
                                        >
                                            <div className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        {/* Header Row */}
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-base font-bold text-gray-900 truncate">
                                                                    {
                                                                        ticket.subject
                                                                    }
                                                                </h3>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge
                                                                    className={`${getStatusColor(
                                                                        ticket.status
                                                                    )} text-xs px-2 py-0.5 font-semibold`}
                                                                >
                                                                    {ticket.status.replace(
                                                                        "_",
                                                                        " "
                                                                    )}
                                                                </Badge>
                                                                <div
                                                                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                                                        ticket.priority
                                                                    )}`}
                                                                >
                                                                    {getPriorityIcon(
                                                                        ticket.priority
                                                                    )}
                                                                    <span className="capitalize">
                                                                        {
                                                                            ticket.priority
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Description */}
                                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                                                            {ticket.description}
                                                        </p>

                                                        {/* Metadata Row */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                                                    <MessageSquare className="w-3 h-3 text-blue-600" />
                                                                    <span className="font-mono font-semibold text-blue-700">
                                                                        #
                                                                        {
                                                                            ticket.ticket_number
                                                                        }
                                                                    </span>
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                                                                    <span className="capitalize font-medium">
                                                                        {ticket.category.replace(
                                                                            "_",
                                                                            " "
                                                                        )}
                                                                    </span>
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3 text-gray-500" />
                                                                    <span className="font-medium">
                                                                        {new Date(
                                                                            ticket.created_at
                                                                        ).toLocaleDateString(
                                                                            "en-US",
                                                                            {
                                                                                year: "numeric",
                                                                                month: "short",
                                                                                day: "numeric",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </span>
                                                                {ticket.messages &&
                                                                    ticket
                                                                        .messages
                                                                        .length >
                                                                        0 && (
                                                                        <span className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                                                                            <MessageSquare className="w-3 h-3 text-green-600" />
                                                                            <span className="font-medium text-green-700">
                                                                                {
                                                                                    ticket
                                                                                        .messages
                                                                                        .length
                                                                                }{" "}
                                                                                msg
                                                                            </span>
                                                                        </span>
                                                                    )}
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex items-center gap-1.5">
                                                                <Link
                                                                    href={route(
                                                                        "clinic.support.show",
                                                                        [
                                                                            auth.clinic_id,
                                                                            ticket.id,
                                                                        ]
                                                                    )}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                                                                >
                                                                    <Eye className="w-3 h-3" />
                                                                    View
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            ticket
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors"
                                                                >
                                                                    <Edit className="w-3 h-3" />
                                                                    Edit
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Compact Pagination - Right Aligned */}
                            {tickets.data.length > 0 && tickets.links && (
                                <div className="px-4 py-2 border-t border-gray-100">
                                    <div className="flex justify-end">
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
                {/* Create Form Modal */}
                {showCreateForm && (
                    <SupportTicketForm
                        onClose={() => setShowCreateForm(false)}
                        onSuccess={() => {
                            router.reload();
                        }}
                        clinic={auth.clinic}
                    />
                )}

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
                            {/* Compact Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-t-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Edit className="w-5 h-5" />
                                        <h2 className="text-lg font-bold">
                                            Edit Support Ticket
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setShowEditModal(null)}
                                        className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/20 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleEditSubmit}
                                className="p-4 space-y-4"
                            >
                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <Input
                                        type="text"
                                        value={editData.subject}
                                        onChange={(e) =>
                                            setEditData(
                                                "subject",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Brief description of your issue"
                                        required
                                        className="w-full"
                                    />
                                </div>

                                {/* Category and Priority */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <Select
                                            value={editData.category}
                                            onValueChange={(value) =>
                                                setEditData("category", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority *
                                        </label>
                                        <Select
                                            value={editData.priority}
                                            onValueChange={(value) =>
                                                setEditData("priority", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    Low
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    High
                                                </SelectItem>
                                                <SelectItem value="urgent">
                                                    Urgent
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status *
                                    </label>
                                    <Select
                                        value={editData.status}
                                        onValueChange={(value) =>
                                            setEditData("status", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <Textarea
                                        value={editData.description}
                                        onChange={(e) =>
                                            setEditData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Please provide detailed information about your issue..."
                                        rows={4}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                {/* Attachments */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Attachments (Optional)
                                    </label>

                                    {/* Existing Attachments */}
                                    {editData.existingAttachments &&
                                        editData.existingAttachments.length >
                                            0 && (
                                            <div className="mb-3">
                                                <p className="text-xs text-gray-600 mb-2">
                                                    Current attachments:
                                                </p>
                                                <div className="space-y-2">
                                                    {editData.existingAttachments.map(
                                                        (attachment, index) => (
                                                            <div
                                                                key={
                                                                    attachment.id
                                                                }
                                                                className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Paperclip className="w-4 h-4 text-blue-600" />
                                                                    <span className="text-sm text-blue-800 font-medium">
                                                                        {
                                                                            attachment.original_filename
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-blue-600">
                                                                        (
                                                                        {attachment.file_size
                                                                            ? `${(
                                                                                  attachment.file_size /
                                                                                  1024
                                                                              ).toFixed(
                                                                                  1
                                                                              )} KB`
                                                                            : "Unknown size"}
                                                                        )
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeExistingAttachment(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <input
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                            onChange={handleEditFileChange}
                                            className="hidden"
                                            id="edit-file-upload"
                                        />
                                        <label
                                            htmlFor="edit-file-upload"
                                            className="cursor-pointer flex flex-col items-center justify-center py-4"
                                        >
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600 mb-1">
                                                Click to upload files or drag
                                                and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Max 5 files, 10MB each.
                                                Supported: JPG, PNG, PDF, DOC,
                                                DOCX
                                            </p>
                                        </label>
                                    </div>

                                    {/* File List */}
                                    {editData.attachments.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {editData.attachments.map(
                                                (file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Paperclip className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm text-gray-700">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                (
                                                                {(
                                                                    file.size /
                                                                    1024 /
                                                                    1024
                                                                ).toFixed(
                                                                    2
                                                                )}{" "}
                                                                MB)
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeEditFile(
                                                                    index
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowEditModal(null)}
                                        disabled={editProcessing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={
                                            editProcessing || isSubmittingEdit
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {editProcessing || isSubmittingEdit ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Update Ticket
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
