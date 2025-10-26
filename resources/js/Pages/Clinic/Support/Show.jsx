import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    ArrowLeft,
    MessageSquare,
    Calendar,
    Clock,
    User,
    Send,
    Paperclip,
    Download,
    Edit,
    Eye,
    X,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader2,
    FileText,
    Image,
    File,
    Maximize2,
    ZoomIn,
} from "lucide-react";

export default function Show({ auth, ticket, messages, attachments }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMessageForm, setShowMessageForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewType, setPreviewType] = useState(null);

    // Helper functions for file preview
    const getFileType = (filename, mimeType) => {
        const extension = filename.split(".").pop().toLowerCase();

        if (
            ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension) ||
            mimeType?.startsWith("image/")
        ) {
            return "image";
        }

        if (extension === "pdf" || mimeType === "application/pdf") {
            return "pdf";
        }

        if (
            ["doc", "docx", "txt", "rtf"].includes(extension) ||
            mimeType?.includes("document") ||
            mimeType?.includes("text")
        ) {
            return "document";
        }

        return "file";
    };

    const getFileIcon = (filename, mimeType) => {
        const fileType = getFileType(filename, mimeType);

        switch (fileType) {
            case "image":
                return <Image className="w-5 h-5 text-green-600" />;
            case "pdf":
                return <FileText className="w-5 h-5 text-red-600" />;
            case "document":
                return <FileText className="w-5 h-5 text-blue-600" />;
            default:
                return <File className="w-5 h-5 text-gray-600" />;
        }
    };

    const handlePreview = (attachment) => {
        const fileType = getFileType(
            attachment.original_filename,
            attachment.mime_type
        );
        setPreviewFile(attachment);
        setPreviewType(fileType);
    };

    // Helper function to get the correct file URL
    const getFileUrl = (filePath) => {
        if (!filePath) return "";

        // If it's already a full URL, return as is
        if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
            // Convert localhost to current host for local development
            if (filePath.includes("localhost")) {
                return filePath.replace(
                    "http://localhost",
                    window.location.origin
                );
            }
            // Handle 127.0.0.1 as well
            if (filePath.includes("127.0.0.1")) {
                return filePath.replace(
                    filePath.match(/https?:\/\/127\.0\.0\.1(:\d+)?/)[0],
                    window.location.origin
                );
            }
            return filePath;
        }

        // If it's a relative path, make it absolute
        if (filePath.startsWith("/")) {
            return window.location.origin + filePath;
        }

        // If it starts with storage/, add the origin
        if (filePath.startsWith("storage/")) {
            return window.location.origin + "/" + filePath;
        }

        // For AWS S3 URLs that might be stored without protocol
        if (
            filePath.includes("amazonaws.com") &&
            !filePath.startsWith("http")
        ) {
            return "https://" + filePath;
        }

        return filePath;
    };

    const closePreview = () => {
        setPreviewFile(null);
        setPreviewType(null);
    };

    const {
        data: messageData,
        setData: setMessageData,
        post: postMessage,
        processing: messageProcessing,
    } = useForm({
        message: "",
        attachments: [],
    });

    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: editProcessing,
    } = useForm({
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
    });

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        postMessage(
            route("clinic.support.messages.store", [auth.clinic_id, ticket.id]),
            {
                onSuccess: () => {
                    setMessageData("message", "");
                    setMessageData("attachments", []);
                    setShowMessageForm(false);
                },
            }
        );
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        putEdit(route("clinic.support.update", [auth.clinic_id, ticket.id]), {
            onSuccess: () => {
                setShowEditModal(false);
            },
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "open":
                return "bg-green-100 text-green-800 border-green-200";
            case "in_progress":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "resolved":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "closed":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent":
                return "text-red-600 bg-red-50";
            case "high":
                return "text-orange-600 bg-orange-50";
            case "medium":
                return "text-blue-600 bg-blue-50";
            case "low":
                return "text-gray-600 bg-gray-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "urgent":
                return <AlertCircle className="w-3 h-3" />;
            case "high":
                return <AlertCircle className="w-3 h-3" />;
            case "medium":
                return <Clock className="w-3 h-3" />;
            case "low":
                return <CheckCircle className="w-3 h-3" />;
            default:
                return <Clock className="w-3 h-3" />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "open":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "in_progress":
                return <Clock className="w-4 h-4 text-blue-600" />;
            case "resolved":
                return <CheckCircle className="w-4 h-4 text-gray-600" />;
            case "closed":
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Support Ticket #${ticket.ticket_number}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Header Section */}
                <div className="mx-5 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route(
                                        "clinic.support.index",
                                        auth.clinic_id
                                    )}
                                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </Link>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Support Ticket #{ticket.ticket_number}
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        {ticket.subject}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setShowEditModal(true)}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit Ticket
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-5 space-y-6">
                    {/* Ticket Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                                        {ticket.subject}
                                    </h2>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Badge
                                            className={`${getStatusColor(
                                                ticket.status
                                            )} text-xs px-2 py-0.5 font-semibold`}
                                        >
                                            {getStatusIcon(ticket.status)}
                                            <span className="ml-1">
                                                {ticket.status.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>
                                        </Badge>
                                        <div
                                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                                ticket.priority
                                            )}`}
                                        >
                                            {getPriorityIcon(ticket.priority)}
                                            <span className="capitalize">
                                                {ticket.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="prose max-w-none mb-4">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {ticket.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 text-xs text-gray-500 pt-4 border-t border-gray-100">
                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                    <MessageSquare className="w-3 h-3 text-blue-600" />
                                    <span className="font-mono font-semibold text-blue-700">
                                        #{ticket.ticket_number}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-gray-500" />
                                    <span className="font-medium">
                                        {new Date(
                                            ticket.created_at
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3 text-gray-500" />
                                    <span className="font-medium">
                                        {ticket.user?.name || "Unknown User"}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                                    <span className="capitalize font-medium">
                                        {ticket.category.replace("_", " ")}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Messages Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Messages ({messages.length})
                                </h3>
                                <Button
                                    onClick={() =>
                                        setShowMessageForm(!showMessageForm)
                                    }
                                    size="sm"
                                    className="h-8 px-3"
                                >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Add Message
                                </Button>
                            </div>

                            {/* Message Form */}
                            {showMessageForm && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <form
                                        onSubmit={handleMessageSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <Label
                                                htmlFor="message"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Your Message
                                            </Label>
                                            <Textarea
                                                id="message"
                                                value={messageData.message}
                                                onChange={(e) =>
                                                    setMessageData(
                                                        "message",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Type your message here..."
                                                rows={4}
                                                required
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setShowMessageForm(false)
                                                }
                                                size="sm"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={messageProcessing}
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                {messageProcessing && (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                )}
                                                <Send className="w-4 h-4 mr-1" />
                                                Send Message
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Messages List */}
                            <div className="space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>
                                            No messages yet. Be the first to add
                                            a message!
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-gray-900">
                                                        {message.user?.name ||
                                                            "Unknown User"}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(
                                                            message.created_at
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 whitespace-pre-wrap text-sm">
                                                    {message.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Attachments Section */}
                    {attachments && attachments.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Attachments ({attachments.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {attachments.map((attachment) => {
                                        const fileType = getFileType(
                                            attachment.original_filename,
                                            attachment.mime_type
                                        );
                                        const canPreview = [
                                            "image",
                                            "pdf",
                                            "document",
                                        ].includes(fileType);

                                        return (
                                            <div
                                                key={attachment.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        {getFileIcon(
                                                            attachment.original_filename,
                                                            attachment.mime_type
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {
                                                                attachment.original_filename
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {attachment.file_size
                                                                ? `${(
                                                                      attachment.file_size /
                                                                      1024
                                                                  ).toFixed(
                                                                      1
                                                                  )} KB`
                                                                : "Unknown size"}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0 flex gap-1">
                                                        {canPreview && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handlePreview(
                                                                        attachment
                                                                    )
                                                                }
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                                title="Preview"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                window.open(
                                                                    getFileUrl(
                                                                        attachment.file_path
                                                                    ),
                                                                    "_blank"
                                                                )
                                                            }
                                                            title="Download"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

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
                                        onClick={() => setShowEditModal(false)}
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

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowEditModal(false)}
                                        disabled={editProcessing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {editProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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

                {/* File Preview Modal */}
                {previewFile && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                            {/* Preview Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getFileIcon(
                                        previewFile.original_filename,
                                        previewFile.mime_type
                                    )}
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {previewFile.original_filename}
                                        </h3>
                                        <p className="text-blue-100 text-sm">
                                            {previewFile.file_size
                                                ? `${(
                                                      previewFile.file_size /
                                                      1024
                                                  ).toFixed(1)} KB`
                                                : "Unknown size"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            window.open(
                                                getFileUrl(
                                                    previewFile.file_path
                                                ),
                                                "_blank"
                                            )
                                        }
                                        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                                    >
                                        <Download className="w-4 h-4 mr-1" />
                                        Download
                                    </Button>
                                    <button
                                        onClick={closePreview}
                                        className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/20 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Preview Content */}
                            <div className="p-4 h-[calc(90vh-120px)] overflow-auto">
                                {previewType === "image" && (
                                    <div className="flex items-center justify-center h-full">
                                        <img
                                            src={getFileUrl(
                                                previewFile.file_path
                                            )}
                                            alt={previewFile.original_filename}
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                            onError={(e) => {
                                                console.log(
                                                    "Image failed to load:",
                                                    previewFile.file_path,
                                                    "Converted to:",
                                                    getFileUrl(
                                                        previewFile.file_path
                                                    )
                                                );
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display =
                                                    "flex";
                                            }}
                                        />
                                        <div className="hidden items-center justify-center h-full text-gray-500">
                                            <div className="text-center">
                                                <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                                <p className="text-lg font-medium">
                                                    Image preview not available
                                                </p>
                                                <p className="text-sm">
                                                    The image could not be
                                                    loaded
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {previewType === "pdf" && (
                                    <div className="h-full">
                                        <iframe
                                            src={getFileUrl(
                                                previewFile.file_path
                                            )}
                                            className="w-full h-full border-0 rounded-lg"
                                            title={
                                                previewFile.original_filename
                                            }
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display =
                                                    "flex";
                                            }}
                                        />
                                        <div className="hidden items-center justify-center h-full text-gray-500">
                                            <div className="text-center">
                                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                                <p className="text-lg font-medium">
                                                    PDF preview not available
                                                </p>
                                                <p className="text-sm">
                                                    Your browser doesn't support
                                                    PDF preview
                                                </p>
                                                <Button
                                                    onClick={() =>
                                                        window.open(
                                                            getFileUrl(
                                                                previewFile.file_path
                                                            ),
                                                            "_blank"
                                                        )
                                                    }
                                                    className="mt-4"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Open PDF
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {previewType === "document" && (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                                            <p className="text-lg font-medium text-gray-900 mb-2">
                                                Document Preview
                                            </p>
                                            <p className="text-gray-600 mb-4">
                                                This document type cannot be
                                                previewed in the browser
                                            </p>
                                            <div className="flex gap-3 justify-center">
                                                <Button
                                                    onClick={() =>
                                                        window.open(
                                                            getFileUrl(
                                                                previewFile.file_path
                                                            ),
                                                            "_blank"
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Open Document
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        window.open(
                                                            getFileUrl(
                                                                previewFile.file_path
                                                            ),
                                                            "_blank"
                                                        )
                                                    }
                                                >
                                                    <Maximize2 className="w-4 h-4 mr-2" />
                                                    View Full Screen
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {previewType === "file" && (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <File className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                                            <p className="text-lg font-medium text-gray-900 mb-2">
                                                File Preview Not Available
                                            </p>
                                            <p className="text-gray-600 mb-4">
                                                This file type cannot be
                                                previewed
                                            </p>
                                            <Button
                                                onClick={() =>
                                                    window.open(
                                                        getFileUrl(
                                                            previewFile.file_path
                                                        ),
                                                        "_blank"
                                                    )
                                                }
                                                className="bg-gray-600 hover:bg-gray-700"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download File
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
