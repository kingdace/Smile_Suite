import { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    X,
    Upload,
    FileText,
    AlertCircle,
    Clock,
    CheckCircle,
    Zap,
    Paperclip,
    HelpCircle,
} from "lucide-react";

export default function SupportTicketForm({ onClose, onSuccess, clinic }) {
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        category: "general",
        priority: "medium",
        attachments: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append("subject", formData.subject);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("priority", formData.priority);

        formData.attachments.forEach((file, index) => {
            formDataToSend.append(`attachments[${index}]`, file);
        });

        router.post(route("clinic.support.store", clinic.id), formDataToSend, {
            onSuccess: () => {
                onSuccess?.();
                onClose();
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate file sizes and types
        const validFiles = files.filter((file) => {
            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
                "image/webp",
                "image/svg+xml",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ];

            if (file.size > maxSize) {
                alert(`File ${file.name} is too large. Maximum size is 10MB.`);
                return false;
            }

            if (!allowedTypes.includes(file.type)) {
                alert(
                    `File ${file.name} has an unsupported format. Please use JPG, PNG, PDF, DOC, or DOCX files.`
                );
                return false;
            }

            return true;
        });

        setFormData((prev) => ({
            ...prev,
            attachments: [...prev.attachments, ...validFiles],
        }));
    };

    const removeFile = (index) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
                {/* Compact Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5" />
                            <h2 className="text-lg font-bold">
                                Create Support Ticket
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/20 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                        </label>
                        <Input
                            type="text"
                            value={formData.subject}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    subject: e.target.value,
                                })
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
                                value={formData.category}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        category: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">
                                        General
                                    </SelectItem>
                                    <SelectItem value="technical">
                                        Technical Issue
                                    </SelectItem>
                                    <SelectItem value="billing">
                                        Billing Question
                                    </SelectItem>
                                    <SelectItem value="feature_request">
                                        Feature Request
                                    </SelectItem>
                                    <SelectItem value="bug_report">
                                        Bug Report
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority *
                            </label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        priority: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-gray-600" />
                                            Low
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="medium">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            Medium
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="high">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-orange-600" />
                                            High
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="urgent">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                            Urgent
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            rows={4}
                            placeholder="Please provide detailed information about your issue..."
                            required
                            className="w-full"
                        />
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attachments (Optional)
                        </label>
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
                                    Click to upload files or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    Max 5 files, 10MB each. Supported: JPG, PNG,
                                    PDF, DOC, DOCX
                                </p>
                            </label>
                        </div>

                        {/* File List */}
                        {formData.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {formData.attachments.map((file, index) => (
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
                                                ).toFixed(2)}{" "}
                                                MB)
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Create Ticket
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
