import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Image,
    X,
    Eye,
    Download,
    Trash2,
    FileImage,
    ExternalLink,
    Calendar,
    User,
} from "lucide-react";

export default function ImageGallery({
    images = [],
    onImagesChange,
    className = "",
}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const handleImageRemove = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const openImageViewer = (image, index) => {
        setSelectedImage({ ...image, index });
        setIsViewerOpen(true);
    };

    const isImageUrl = (url) => {
        return (
            url &&
            (url.startsWith("http://") ||
                url.startsWith("https://") ||
                url.startsWith("/storage/"))
        );
    };

    const getImageType = (url) => {
        if (!url) return "Unknown";
        if (url.includes("x-ray") || url.includes("xray")) return "X-Ray";
        if (url.includes("photo") || url.includes("image")) return "Photo";
        if (url.includes("scan") || url.includes("document")) return "Document";
        return "Image";
    };

    const formatDate = (date) => {
        if (!date) return "Unknown";
        try {
            return new Date(date).toLocaleDateString();
        } catch {
            return "Unknown";
        }
    };

    return (
        <div className={className}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Image className="h-5 w-5 text-blue-600" />
                        Treatment Images Gallery
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {images.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FileImage className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No images uploaded yet</p>
                            <p className="text-sm">
                                Upload images to see them here
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <CardContent className="p-0">
                                            <div className="aspect-square relative">
                                                {isImageUrl(image) ? (
                                                    <img
                                                        src={image}
                                                        alt={`Treatment image ${
                                                            index + 1
                                                        }`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA1MEgxNTBWMTUwSDUwVjUwWiIgZmlsbD0iI0U1RTdFQiIvPgo8cGF0aCBkPSJNNzUgNzVIMTI1VjEyNUg3NVY3NVoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB4PSI4NSIgeT0iODUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTkgM0g1QzMuOSAzIDMgMy45IDMgNVYxOUMzIDIwLjEgMy45IDIxIDUgMjFIMTlDMjAuMSAyMSAyMSAyMC4xIDIxIDE5VjVDMjEgMy45IDIwLjEgMyAxOSAzWk0xOSAxOUg1VjVIMTlWMTlaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNCAxNEgxMFYxMEgxNFYxNFoiIGZpbGw9IiM5QjlBQTAiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                        <FileImage className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                )}

                                                {/* Overlay Actions */}
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                openImageViewer(
                                                                    image,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {getImageType(image)}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        #{index + 1}
                                                    </span>
                                                </div>

                                                <div className="text-xs text-gray-600 space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            {formatDate(
                                                                new Date()
                                                            )}
                                                        </span>
                                                    </div>
                                                    {isImageUrl(image) && (
                                                        <div className="flex items-center gap-1">
                                                            <ExternalLink className="h-3 w-3" />
                                                            <span className="truncate">
                                                                External URL
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Image Viewer Dialog */}
            <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Image className="h-5 w-5 text-blue-600" />
                            Image Viewer
                        </DialogTitle>
                    </DialogHeader>

                    {selectedImage && (
                        <div className="space-y-4">
                            <div className="relative">
                                <img
                                    src={selectedImage}
                                    alt="Full size image"
                                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                                    onError={(e) => {
                                        e.target.src =
                                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA1MEgxNTBWMTUwSDUwVjUwWiIgZmlsbD0iI0U1RTdFQiIvPgo8cGF0aCBkPSJNNzUgNzVIMTI1VjEyNUg3NVY3NVoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB4PSI4NSIgeT0iODUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTkgM0g1QzMuOSAzIDMgMy45IDMgNVYxOUMzIDIwLjEgMy45IDIxIDUgMjFIMTlDMjAuMSAyMSAyMSAyMC4xIDIxIDE5VjVDMjEgMy45IDIwLjEgMyAxOSAzWk0xOSAxOUg1VjVIMTlWMTlaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNCAxNEgxMFYxMEgxNFYxNFoiIGZpbGw9IiM5QjlBQTAiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {formatDate(new Date())}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            <span>Treatment Image</span>
                                        </div>
                                    </div>
                                    <Badge variant="outline">
                                        {getImageType(selectedImage)}
                                    </Badge>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (isImageUrl(selectedImage)) {
                                                window.open(
                                                    selectedImage,
                                                    "_blank"
                                                );
                                            }
                                        }}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
