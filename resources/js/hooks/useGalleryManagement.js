import { useState, useRef, useCallback } from "react";
import { router } from "@inertiajs/react";
import { useToast } from "@/Components/ui/toast";

export function useGalleryManagement(initialGalleryImages = []) {
    const galleryInputRef = useRef();
    const { showSuccess, showError, showWarning, showInfo } = useToast();

    // Gallery state
    const [galleryUploading, setGalleryUploading] = useState(false);
    const [galleryError, setGalleryError] = useState("");
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [lightboxImg, setLightboxImg] = useState(null);
    const [showDeleteId, setShowDeleteId] = useState(null);
    const [galleryImages, setGalleryImages] = useState(initialGalleryImages);
    const [galleryOrder, setGalleryOrder] = useState(
        initialGalleryImages.map((img) => img.id)
    );

    // Removed complex progress tracking that was causing issues

    // Handle gallery files selection
    const handleGalleryFiles = useCallback(
        (files) => {
            setGalleryError("");
            if (!files || !files.length) return;

            // Ensure files is an array
            const filesArray = Array.isArray(files) ? files : Array.from(files);

            // Validate files
            const maxFileSize = 4 * 1024 * 1024; // 4MB (matches backend)
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ];
            const maxFiles = 10;

            const validFiles = [];
            const errors = [];

            filesArray.forEach((file, index) => {
                // Check file size
                if (file.size > maxFileSize) {
                    errors.push(`${file.name} is too large (max 4MB)`);
                    return;
                }

                // Check file type
                if (!allowedTypes.includes(file.type)) {
                    errors.push(`${file.name} is not a supported image format`);
                    return;
                }

                validFiles.push(file);
            });

            // Check total file count
            if (validFiles.length + galleryPreviews.length > maxFiles) {
                errors.push(`Maximum ${maxFiles} images allowed`);
            }

            if (errors.length > 0) {
                setGalleryError(errors.join(", "));
                showWarning("Invalid Files", errors.join(", "));
                return;
            }

            if (validFiles.length === 0) {
                showWarning(
                    "No Valid Files",
                    "No valid image files were selected"
                );
                return;
            }

            const previews = validFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));

            setGalleryPreviews((prev) => [...prev, ...previews]);
            showInfo(
                "Files Selected",
                `${validFiles.length} image(s) ready for upload`
            );
        },
        [galleryPreviews.length, showWarning, showInfo]
    );

    // Handle gallery upload - simplified approach like the original working version
    const handleGalleryUpload = useCallback(async () => {
        setGalleryError("");
        setGalleryUploading(true);
        let success = true;

        for (const file of galleryPreviews) {
            const formData = new FormData();
            formData.append("image", file.file);

            try {
                const res = await fetch(
                    route("clinic.profile.gallery.upload"),
                    {
                        method: "POST",
                        headers: {
                            "X-CSRF-TOKEN": document.querySelector(
                                "meta[name=csrf-token]"
                            ).content,
                        },
                        body: formData,
                        credentials: "same-origin",
                    }
                );

                if (!res.ok) {
                    success = false;
                    setGalleryError(
                        "One or more uploads failed. Please check file type/size."
                    );
                }
            } catch (error) {
                success = false;
                setGalleryError("Upload failed. Please try again.");
            }
        }

        setGalleryUploading(false);
        setGalleryPreviews([]);

        if (success) {
            showSuccess("Upload Complete", "Images uploaded successfully");
            // Use Inertia reload to preserve current tab state
            router.reload();
        }
    }, [galleryPreviews, showSuccess]);

    // Open delete confirmation modal
    const openDeleteConfirmation = useCallback((imageId) => {
        setShowDeleteId(imageId);
    }, []);

    // Close delete confirmation modal
    const closeDeleteConfirmation = useCallback(() => {
        setShowDeleteId(null);
    }, []);

    // Handle gallery image deletion
    const handleDeleteImage = useCallback(
        async (imageId) => {
            try {
                setGalleryUploading(true);

                const response = await fetch(
                    route("clinic.profile.gallery.delete", { id: imageId }),
                    {
                        method: "DELETE",
                        headers: {
                            "X-CSRF-TOKEN": document.querySelector(
                                "meta[name=csrf-token]"
                            ).content,
                        },
                    }
                );

                if (response.ok) {
                    setShowDeleteId(null);
                    showSuccess(
                        "Image Deleted",
                        "Image has been successfully removed"
                    );
                    // Use Inertia reload to preserve current tab state
                    router.reload();
                } else {
                    setGalleryError(
                        "Failed to delete image. Please try again."
                    );
                }
            } catch (error) {
                setGalleryError("Failed to delete image. Please try again.");
            } finally {
                setGalleryUploading(false);
            }
        },
        [showSuccess]
    );

    // Handle gallery reordering
    const handleGalleryReorder = useCallback(
        (activeId, overId) => {
            if (activeId !== overId) {
                const oldIdx = galleryOrder.indexOf(activeId);
                const newIdx = galleryOrder.indexOf(overId);
                const newOrder = arrayMove(galleryOrder, oldIdx, newIdx);
                setGalleryOrder(newOrder);
                // TODO: Call backend to persist new order if needed
            }
        },
        [galleryOrder]
    );

    // Open lightbox
    const openLightbox = useCallback((imageUrl) => {
        setLightboxImg(imageUrl);
    }, []);

    // Close lightbox
    const closeLightbox = useCallback(() => {
        setLightboxImg(null);
    }, []);

    // Clear all previews
    const clearPreviews = useCallback(() => {
        // Revoke object URLs to prevent memory leaks
        galleryPreviews.forEach((preview) => {
            if (preview.preview) {
                URL.revokeObjectURL(preview.preview);
            }
        });
        setGalleryPreviews([]);
        setUploadProgress(0);
        setUploadResults([]);
        setGalleryError("");
    }, [galleryPreviews]);

    return {
        // Refs
        galleryInputRef,

        // State
        galleryUploading,
        galleryError,
        galleryPreviews,
        showDeleteId,
        lightboxImg,
        galleryImages,
        galleryOrder,

        // Actions
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
    };
}

// Helper function for array reordering (from dnd-kit)
function arrayMove(array, from, to) {
    const newArray = array.slice();
    newArray.splice(to, 0, newArray.splice(from, 1)[0]);
    return newArray;
}
