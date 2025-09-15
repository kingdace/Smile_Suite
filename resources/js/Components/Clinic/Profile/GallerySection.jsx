import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Image, Upload, X, Eye, Trash2 } from "lucide-react";
import { useGalleryManagement } from "@/hooks/useGalleryManagement";
import { ToastContainer, useToast } from "@/Components/ui/toast";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function GallerySection({
    initialGalleryImages = [],
    errors = {},
    onGalleryChange,
}) {
    const { toasts, removeToast } = useToast();
    const {
        galleryInputRef,
        galleryUploading,
        galleryError,
        galleryPreviews,
        showDeleteId,
        lightboxImg,
        galleryImages,
        galleryOrder,
        handleGalleryFiles,
        handleGalleryUpload,
        handleDeleteImage,
        handleGalleryReorder,
        openLightbox,
        closeLightbox,
        openDeleteConfirmation,
        closeDeleteConfirmation,
        setGalleryPreviews,
        clearPreviews,
    } = useGalleryManagement(initialGalleryImages);

    // Notify parent when gallery changes
    useEffect(() => {
        if (onGalleryChange) {
            onGalleryChange(galleryImages);
        }
    }, [galleryImages, onGalleryChange]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                {/* Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        ref={galleryInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                            handleGalleryFiles(Array.from(e.target.files))
                        }
                        className="hidden"
                    />
                    <Button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        variant="outline"
                        className="mb-4"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Images
                    </Button>
                    <p className="text-sm text-gray-500">
                        Upload multiple images to showcase your clinic
                    </p>
                </div>

                {/* Preview Section */}
                {galleryPreviews.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-700">
                                Preview ({galleryPreviews.length} files)
                            </h4>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={clearPreviews}
                                disabled={galleryUploading}
                            >
                                Clear All
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {galleryPreviews.map((preview, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={preview.preview}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border"
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                            const newPreviews =
                                                galleryPreviews.filter(
                                                    (_, i) => i !== idx
                                                );
                                            setGalleryPreviews(newPreviews);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            onClick={handleGalleryUpload}
                            disabled={
                                galleryUploading || galleryPreviews.length === 0
                            }
                            className="w-full"
                        >
                            {galleryUploading
                                ? "Uploading..."
                                : "Upload All Images"}
                        </Button>
                    </div>
                )}

                {/* Error Display */}
                {galleryError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm">{galleryError}</p>
                    </div>
                )}

                {/* Gallery Display */}
                {galleryImages.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-700">
                            Current Gallery
                        </h4>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => {
                                const { active, over } = event;
                                if (active.id !== over?.id) {
                                    handleGalleryReorder(active.id, over.id);
                                }
                            }}
                        >
                            <SortableContext
                                items={galleryOrder}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {galleryOrder.map((imageId) => {
                                        const image = galleryImages.find(
                                            (img) => img.id === imageId
                                        );
                                        if (!image) return null;
                                        return (
                                            <SortableImageItem
                                                key={imageId}
                                                image={image}
                                                onView={() =>
                                                    openLightbox(
                                                        image.image_url
                                                    )
                                                }
                                                onDelete={() =>
                                                    openDeleteConfirmation(
                                                        imageId
                                                    )
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                )}

                {/* Lightbox Modal */}
                {lightboxImg && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="relative max-w-4xl max-h-full p-4">
                            <Button
                                type="button"
                                onClick={closeLightbox}
                                className="absolute -top-2 -right-2 bg-white text-black hover:bg-gray-100"
                                size="sm"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <img
                                src={lightboxImg}
                                alt="Gallery"
                                className="max-w-full max-h-full rounded-lg"
                            />
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">
                                Delete Image
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this image? This
                                action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={closeDeleteConfirmation}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (!galleryUploading) {
                                            handleDeleteImage(showDeleteId);
                                        }
                                    }}
                                    variant="destructive"
                                    className="flex-1"
                                    disabled={galleryUploading}
                                >
                                    {galleryUploading
                                        ? "Deleting..."
                                        : "Delete"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {errors.gallery && (
                    <div className="text-red-500 text-sm">{errors.gallery}</div>
                )}
            </div>

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
        </div>
    );
}

// Sortable Image Item Component
function SortableImageItem({ image, onView, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div className="relative group">
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="cursor-move"
            >
                <img
                    src={image.image_url}
                    alt={image.alt_text || "Gallery image"}
                    className="w-full h-24 object-cover rounded-lg border"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={onView}
                            className="h-8 w-8 p-0"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            {/* Delete button outside draggable area */}
            <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={onDelete}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 className="h-3 w-3" />
            </Button>
        </div>
    );
}
