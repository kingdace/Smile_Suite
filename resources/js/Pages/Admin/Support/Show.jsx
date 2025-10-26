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
    Building2,
    Mail,
    Phone,
    Upload,
} from "lucide-react";

export default function Show({ auth, ticket, adminUsers }) {
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
        is_internal: false,
    });

    const {
        data: updateData,
        setData: setUpdateData,
        put: putUpdate,
        processing: updateProcessing,
    } = useForm({
        status: ticket.status,
        assigned_to: ticket.assigned_to || "unassigned",
        admin_note: "",
    });

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        postMessage(route("admin.support.messages.store", ticket.id), {
            onSuccess: () => {
                setMessageData("message", "");
                setMessageData("attachments", []);
                setMessageData("is_internal", false);
                setShowMessageForm(false);
            },
        });
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();

        // Convert "unassigned" back to null for the backend
        const formData = {
            ...updateData,
            assigned_to:
                updateData.assigned_to === "unassigned"
                    ? null
                    : updateData.assigned_to,
        };

        putUpdate(route("admin.support.update", ticket.id), formData, {
            onSuccess: () => {
                setUpdateData("admin_note", "");
            },
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setMessageData("attachments", files);
    };

    const removeFile = (index) => {
        const newAttachments = messageData.attachments.filter(
            (_, i) => i !== index
        );
        setMessageData("attachments", newAttachments);
    };

    const getStatusBadge = (status) => {
        const variants = {
            open: "bg-blue-100 text-blue-800",
            in_progress: "bg-yellow-100 text-yellow-800",
            resolved: "bg-green-100 text-green-800",
            closed: "bg-gray-100 text-gray-800",
        };
        return variants[status] || "bg-gray-100 text-gray-800";
    };

    const getPriorityBadge = (priority) => {
        const variants = {
            low: "bg-gray-100 text-gray-800",
            medium: "bg-blue-100 text-blue-800",
            high: "bg-orange-100 text-orange-800",
            urgent: "bg-red-100 text-red-800",
        };
        return variants[priority] || "bg-gray-100 text-gray-800";
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Support Ticket #${ticket.ticket_number}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route("admin.support.index")}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900">
                                        Support Ticket #{ticket.ticket_number}
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        {ticket.subject}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    className={getStatusBadge(ticket.status)}
                                >
                                    {ticket.status.replace("_", " ")}
                                </Badge>
                                <Badge
                                    className={getPriorityBadge(
                                        ticket.priority
                                    )}
                                >
                                    {ticket.priority}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Ticket Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        Ticket Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Description
                                        </Label>
                                        <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                            {ticket.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Category
                                            </Label>
                                            <p className="mt-1 text-sm text-gray-900 capitalize">
                                                {ticket.category.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Created
                                            </Label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(
                                                    ticket.created_at
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Messages */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5" />
                                            Messages (
                                            {ticket.messages?.length || 0})
                                        </div>
                                        <Button
                                            onClick={() =>
                                                setShowMessageForm(true)
                                            }
                                            size="sm"
                                        >
                                            <Send className="w-4 h-4 mr-1" />
                                            Add Message
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {ticket.messages?.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`p-4 rounded-lg ${
                                                    message.is_admin
                                                        ? "bg-blue-50 border-l-4 border-blue-500"
                                                        : "bg-gray-50 border-l-4 border-gray-300"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        <span className="text-sm font-medium">
                                                            {message.user?.name}
                                                        </span>
                                                        {message.is_admin && (
                                                            <Badge variant="secondary">
                                                                Admin
                                                            </Badge>
                                                        )}
                                                        {message.is_internal && (
                                                            <Badge variant="outline">
                                                                Internal
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(
                                                            message.created_at
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                                    {message.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Attachments */}
                            {ticket.attachments &&
                                ticket.attachments.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Paperclip className="w-5 h-5" />
                                                Attachments (
                                                {ticket.attachments.length})
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {ticket.attachments.map(
                                                    (attachment) => {
                                                        const fileType =
                                                            getFileType(
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
                                                                key={
                                                                    attachment.id
                                                                }
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
                                                    }
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Ticket Management */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ticket Management</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleUpdateSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <Label htmlFor="status">
                                                Status
                                            </Label>
                                            <Select
                                                value={updateData.status}
                                                onValueChange={(value) =>
                                                    setUpdateData(
                                                        "status",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
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

                                        <div>
                                            <Label htmlFor="assigned_to">
                                                Assign To
                                            </Label>
                                            <Select
                                                value={
                                                    updateData.assigned_to ||
                                                    "unassigned"
                                                }
                                                onValueChange={(value) =>
                                                    setUpdateData(
                                                        "assigned_to",
                                                        value === "unassigned"
                                                            ? null
                                                            : value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Unassigned" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">
                                                        Unassigned
                                                    </SelectItem>
                                                    {adminUsers.map((admin) => (
                                                        <SelectItem
                                                            key={admin.id}
                                                            value={admin.id.toString()}
                                                        >
                                                            {admin.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="admin_note">
                                                Admin Note
                                            </Label>
                                            <Textarea
                                                id="admin_note"
                                                value={updateData.admin_note}
                                                onChange={(e) =>
                                                    setUpdateData(
                                                        "admin_note",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Add internal note..."
                                                rows={3}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={updateProcessing}
                                            className="w-full"
                                        >
                                            {updateProcessing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                "Update Ticket"
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Clinic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5" />
                                        Clinic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Clinic Name
                                        </Label>
                                        <p className="text-sm text-gray-900">
                                            {ticket.clinic?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Submitted By
                                        </Label>
                                        <p className="text-sm text-gray-900">
                                            {ticket.user?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Email
                                        </Label>
                                        <p className="text-sm text-gray-900">
                                            {ticket.user?.email}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Message Form Modal */}
                {showMessageForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-t-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Send className="w-5 h-5" />
                                        <h2 className="text-lg font-bold">
                                            Add Message
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setShowMessageForm(false)
                                        }
                                        className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/20 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <form
                                onSubmit={handleMessageSubmit}
                                className="p-4 space-y-4"
                            >
                                <div>
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        value={messageData.message}
                                        onChange={(e) =>
                                            setMessageData(
                                                "message",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Type your message..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_internal"
                                        checked={messageData.is_internal}
                                        onChange={(e) =>
                                            setMessageData(
                                                "is_internal",
                                                e.target.checked
                                            )
                                        }
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="is_internal">
                                        Internal message (not visible to clinic)
                                    </Label>
                                </div>

                                <div>
                                    <Label>Attachments (Optional)</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <input
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer flex flex-col items-center justify-center py-4"
                                        >
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600 mb-1">
                                                Click to upload files
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Max 5 files, 10MB each
                                            </p>
                                        </label>
                                    </div>

                                    {messageData.attachments.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {messageData.attachments.map(
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
                                                                removeFile(
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

                                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setShowMessageForm(false)
                                        }
                                        variant="outline"
                                        disabled={messageProcessing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={messageProcessing}
                                    >
                                        {messageProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
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
                                        />
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
