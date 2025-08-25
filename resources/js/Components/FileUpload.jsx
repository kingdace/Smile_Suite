import React, { useState, useRef } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function FileUpload({
    files = [],
    onFilesChange,
    accept = "image/*",
    multiple = true,
    maxFiles = 10,
    className = "",
}) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (fileList) => {
        const newFiles = Array.from(fileList);
        const validFiles = newFiles.filter((file) => {
            if (!file.type.startsWith("image/")) {
                alert(`${file.name} is not an image file.`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                alert(`${file.name} is too large. Maximum size is 5MB.`);
                return false;
            }
            return true;
        });

        if ((files?.length || 0) + validFiles.length > maxFiles) {
            alert(`Maximum ${maxFiles} files allowed.`);
            return;
        }

        onFilesChange([...(files || []), ...validFiles]);
    };

    const removeFile = (index) => {
        const newFiles = (files || []).filter((_, i) => i !== index);
        onFilesChange(newFiles);
    };

    const openFileDialog = () => {
        inputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* File Input */}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
                className="hidden"
            />

            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                    Drag and drop images here, or{" "}
                    <button
                        type="button"
                        onClick={openFileDialog}
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        browse
                    </button>
                </p>
                <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB each. Max {maxFiles} files.
                </p>
            </div>

            {/* File List */}
            {files && files.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Uploaded Images:
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(files || []).map((file, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square rounded-lg border overflow-hidden bg-gray-100">
                                    {file instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <p className="text-xs text-gray-600 mt-1 truncate">
                                    {file instanceof File ? file.name : file}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
