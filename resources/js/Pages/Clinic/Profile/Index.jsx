import React, { useRef, useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Copy, X, Image as ImageIcon, GripVertical } from "lucide-react";
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function Index({
    user,
    clinic,
    users,
    plan,
    limit,
    count,
    errors,
    success,
    auth,
}) {
    const isAdmin = user.role === "clinic_admin";
    const logoInput = useRef();
    const galleryInputRef = useRef();
    const { data, setData, post, processing } = useForm({
        clinic_name: clinic?.name || "",
        contact_number: clinic?.contact_number || "",
        email: clinic?.email || "",
        license_number: clinic?.license_number || "",
        description: clinic?.description || "",
        logo: null,
        latitude: clinic?.latitude || "",
        longitude: clinic?.longitude || "",
        name: user.name,
        user_email: user.email,
        password: "",
        password_confirmation: "",
        operating_hours: clinic?.operating_hours || {},
    });

    const DAYS_OF_WEEK = [
        { id: "monday", label: "Monday" },
        { id: "tuesday", label: "Tuesday" },
        { id: "wednesday", label: "Wednesday" },
        { id: "thursday", label: "Thursday" },
        { id: "friday", label: "Friday" },
        { id: "saturday", label: "Saturday" },
        { id: "sunday", label: "Sunday" },
    ];

    const [operatingDays, setOperatingDays] = useState(() => {
        // Default: all days closed
        const initial = {};
        DAYS_OF_WEEK.forEach((day) => {
            initial[day.id] = { open: "", close: "", closed: true };
        });
        if (clinic.operating_hours) {
            Object.entries(clinic.operating_hours).forEach(([day, hours]) => {
                if (Array.isArray(hours) && hours.length === 2) {
                    initial[day] = {
                        open: hours[0],
                        close: hours[1],
                        closed: false,
                    };
                } else {
                    initial[day] = { open: "", close: "", closed: true };
                }
            });
        }
        return initial;
    });

    const [quickDays, setQuickDays] = useState([]);
    const [quickOpen, setQuickOpen] = useState("");
    const [quickClose, setQuickClose] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    const [galleryUploading, setGalleryUploading] = useState(false);
    const [galleryError, setGalleryError] = useState("");
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [showDeleteId, setShowDeleteId] = useState(null);
    const [lightboxImg, setLightboxImg] = useState(null);
    const [galleryImages, setGalleryImages] = useState(
        clinic.gallery_images || []
    );
    const [galleryOrder, setGalleryOrder] = useState(
        galleryImages.map((img) => img.id)
    );
    const dropRef = useRef();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleQuickApply = () => {
        setOperatingDays((prev) => {
            const updated = { ...prev };
            quickDays.forEach((day) => {
                updated[day] = {
                    open: quickOpen,
                    close: quickClose,
                    closed: false,
                };
            });
            return updated;
        });
    };

    const handleOperatingDayChange = (day, field, value) => {
        setOperatingDays((prev) => {
            const updated = {
                ...prev,
                [day]: {
                    ...prev[day],
                    [field]: value,
                    closed: field === "closed" ? value : prev[day].closed,
                },
            };
            setValidationErrors(validateHours(updated));
            return updated;
        });
    };

    const handleCopyPreviousDay = (dayIdx) => {
        if (dayIdx === 0) return;
        const prevDay = DAYS_OF_WEEK[dayIdx - 1].id;
        setOperatingDays((prev) => ({
            ...prev,
            [DAYS_OF_WEEK[dayIdx].id]: { ...prev[prevDay] },
        }));
    };

    const handleSetAll = () => {
        if (!quickOpen || !quickClose) return;
        setOperatingDays((prev) => {
            const updated = { ...prev };
            DAYS_OF_WEEK.forEach((day) => {
                updated[day.id] = {
                    open: quickOpen,
                    close: quickClose,
                    closed: false,
                };
            });
            setValidationErrors(validateHours(updated));
            return updated;
        });
    };

    const validateHours = (days) => {
        const errors = {};
        Object.entries(days).forEach(([day, { open, close, closed }]) => {
            if (!closed && open && close && open >= close) {
                errors[day] = "Open time must be before close time.";
            }
        });
        return errors;
    };

    const submit = (e) => {
        e.preventDefault();
        setData(
            "operating_hours",
            Object.fromEntries(
                Object.entries(operatingDays).map(
                    ([day, { open, close, closed }]) =>
                        closed ? [day, null] : [day, [open, close]]
                )
            )
        );
        post(route("clinic.profile.update"), { forceFormData: true });
    };

    const format12h = (time) => {
        if (!time) return "";
        let [h, m] = time.split(":");
        h = parseInt(h, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12;
        if (h === 0) h = 12;
        return `${h}:${m} ${ampm}`;
    };

    function handleGalleryFiles(files) {
        setGalleryError("");
        if (!files.length) return;
        const previews = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setGalleryPreviews(previews);
    }

    function GalleryImage({ src, alt }) {
        const [error, setError] = useState(false);
        const [retry, setRetry] = useState(0);

        useEffect(() => {
            if (error && retry < 5) {
                const timeout = setTimeout(() => {
                    setError(false);
                    setRetry((r) => r + 1);
                }, 1000 * (retry + 1)); // Exponential backoff
                return () => clearTimeout(timeout);
            }
        }, [error, retry]);

        if (error && retry >= 5) {
            return (
                <div className="text-xs text-red-500">Image not available</div>
            );
        }

        return (
            <img
                src={src}
                alt={alt}
                onError={() => setError(true)}
                style={{ width: "100%", height: "100%" }}
                className="object-cover w-full h-full rounded-lg"
            />
        );
    }

    // Helper for sortable items
    function SortableImage({ img, idx, onDelete, onLightbox }) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: img.id });
        return (
            <div
                ref={setNodeRef}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition,
                    zIndex: isDragging ? 10 : 1,
                    minWidth: 0,
                }}
                className="relative group w-full h-24 md:h-28 bg-white rounded-lg overflow-hidden border border-blue-100 shadow-sm flex items-center justify-center transition-all duration-200 focus:ring-2 focus:ring-blue-400 hover:border-blue-400 cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label="View image"
                onClick={() => onLightbox(img.image_url)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        onLightbox(img.image_url);
                    }
                }}
            >
                <GalleryImage src={img.image_url} alt="Gallery" />
                <button
                    type="button"
                    className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 rounded-full p-1 shadow border border-gray-200"
                    title="Remove image from gallery"
                    aria-label="Remove image from gallery"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(img.id);
                    }}
                >
                    <X className="w-4 h-4" />
                </button>
                <span
                    {...attributes}
                    {...listeners}
                    className="absolute bottom-1.5 left-1.5 cursor-grab bg-white/80 rounded-full p-1 shadow text-blue-400 hover:bg-blue-100"
                    title="Drag to reorder"
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4" />
                </span>
            </div>
        );
    }

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Profile" />
            <div className="max-w-5xl mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">
                    {isAdmin ? "Clinic Profile" : "My Profile"}
                </h1>
                {success && (
                    <div className="mb-4 text-green-600 bg-green-50 border border-green-200 rounded p-2">
                        {success}
                    </div>
                )}
                {errors && Object.keys(errors).length > 0 && (
                    <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {Object.values(errors).map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    </div>
                )}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>
                            {isAdmin
                                ? "Clinic Information"
                                : "User Information"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {isAdmin && (
                                <>
                                    <div>
                                        <label className="block font-semibold mb-1">
                                            Clinic Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border px-3 py-2"
                                            value={data.clinic_name}
                                            onChange={(e) =>
                                                setData(
                                                    "clinic_name",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">
                                            Contact Number
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border px-3 py-2"
                                            value={data.contact_number}
                                            onChange={(e) =>
                                                setData(
                                                    "contact_number",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full border px-3 py-2"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">
                                            License Number
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border px-3 py-2"
                                            value={data.license_number}
                                            onChange={(e) =>
                                                setData(
                                                    "license_number",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            className="w-full border px-3 py-2"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">
                                            Clinic Logo
                                        </label>
                                        <input
                                            type="file"
                                            ref={logoInput}
                                            className="w-full"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData(
                                                    "logo",
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                        {clinic?.logo_url && (
                                            <img
                                                src={clinic.logo_url}
                                                alt="Clinic Logo"
                                                className="h-20 mt-2 rounded"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">
                                            Latitude
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border px-3 py-2"
                                            value={data.latitude}
                                            onChange={(e) =>
                                                setData(
                                                    "latitude",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">
                                            Longitude
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border px-3 py-2"
                                            value={data.longitude}
                                            onChange={(e) =>
                                                setData(
                                                    "longitude",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block font-semibold mb-1">
                                            Set Location on Map
                                        </label>
                                        <MapContainer
                                            center={[
                                                parseFloat(data.latitude) ||
                                                    13.41,
                                                parseFloat(data.longitude) ||
                                                    122.56,
                                            ]}
                                            zoom={15}
                                            style={{
                                                height: "250px",
                                                width: "100%",
                                            }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            <LocationMarker
                                                position={
                                                    data.latitude &&
                                                    data.longitude
                                                        ? [
                                                              parseFloat(
                                                                  data.latitude
                                                              ),
                                                              parseFloat(
                                                                  data.longitude
                                                              ),
                                                          ]
                                                        : null
                                                }
                                                setPosition={([lat, lng]) => {
                                                    setData(
                                                        "latitude",
                                                        lat.toFixed(6)
                                                    );
                                                    setData(
                                                        "longitude",
                                                        lng.toFixed(6)
                                                    );
                                                }}
                                            />
                                        </MapContainer>
                                    </div>
                                    <div className="bg-white rounded-2xl shadow p-5 mb-8 border border-blue-100">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <h2 className="text-2xl font-extrabold text-blue-900 flex items-center gap-2 mb-1">
                                                    <ImageIcon className="w-6 h-6 text-blue-400" />{" "}
                                                    Gallery
                                                </h2>
                                                <div className="text-gray-500 text-sm font-medium">
                                                    Drag & drop or click to
                                                    upload. Drag images to
                                                    reorder. Max 8 images.
                                                </div>
                                            </div>
                                            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                                                {galleryOrder.length} / 8
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                style={{ display: "none" }}
                                                ref={galleryInputRef}
                                                onChange={(e) => {
                                                    handleGalleryFiles(
                                                        Array.from(
                                                            e.target.files
                                                        )
                                                    );
                                                    e.target.value = ""; // allow re-uploading same file
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    galleryInputRef.current.click()
                                                }
                                                className="mb-2"
                                                variant="outline"
                                            >
                                                Upload Images
                                            </Button>
                                            <span className="text-xs text-gray-500 ml-2">
                                                Max 8 images. Drag to reorder.
                                            </span>
                                        </div>
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={(e) => {
                                                const { active, over } = e;
                                                if (active.id !== over?.id) {
                                                    const oldIdx =
                                                        galleryOrder.indexOf(
                                                            active.id
                                                        );
                                                    const newIdx =
                                                        galleryOrder.indexOf(
                                                            over.id
                                                        );
                                                    const newOrder = arrayMove(
                                                        galleryOrder,
                                                        oldIdx,
                                                        newIdx
                                                    );
                                                    setGalleryOrder(newOrder);
                                                    // TODO: Call backend to persist new order if needed
                                                }
                                            }}
                                        >
                                            <SortableContext
                                                items={galleryOrder}
                                                strategy={
                                                    verticalListSortingStrategy
                                                }
                                            >
                                                <div className="grid grid-cols-4 gap-2 mb-2">
                                                    {galleryOrder.length > 0 ? (
                                                        galleryOrder.map(
                                                            (id, idx) => {
                                                                const img =
                                                                    galleryImages.find(
                                                                        (i) =>
                                                                            i.id ===
                                                                                id ||
                                                                            (!i.id &&
                                                                                id.startsWith(
                                                                                    "temp-"
                                                                                ))
                                                                    );
                                                                if (!img)
                                                                    return null;
                                                                return (
                                                                    <SortableImage
                                                                        key={
                                                                            img.id ||
                                                                            `temp-${idx}-${id}`
                                                                        }
                                                                        img={
                                                                            img
                                                                        }
                                                                        idx={
                                                                            idx
                                                                        }
                                                                        onDelete={
                                                                            setShowDeleteId
                                                                        }
                                                                        onLightbox={
                                                                            setLightboxImg
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        <div className="col-span-4 text-gray-400 italic flex items-center gap-2 justify-center min-h-[60px]">
                                                            <ImageIcon className="w-5 h-5" />{" "}
                                                            No images yet.
                                                        </div>
                                                    )}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                        {/* Lightbox Modal */}
                                        {lightboxImg && (
                                            <div
                                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                                                onClick={() =>
                                                    setLightboxImg(null)
                                                }
                                                tabIndex={-1}
                                                aria-modal="true"
                                                role="dialog"
                                            >
                                                <img
                                                    src={lightboxImg}
                                                    alt="Large view"
                                                    className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg border-4 border-white"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                />
                                                <button
                                                    className="absolute top-4 right-4 bg-white/80 hover:bg-red-500 hover:text-white text-gray-700 rounded-full p-2 shadow"
                                                    onClick={() =>
                                                        setLightboxImg(null)
                                                    }
                                                    aria-label="Close"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-3 mb-3">
                                            {galleryPreviews.length > 0 && (
                                                <div className="mb-2 flex flex-wrap gap-3">
                                                    {galleryPreviews.map(
                                                        (file, i) => (
                                                            <div
                                                                key={i}
                                                                className="relative w-28 aspect-[4/3] rounded-lg overflow-hidden border border-green-300 flex items-center justify-center"
                                                            >
                                                                <GalleryImage
                                                                    src={
                                                                        file.preview
                                                                    }
                                                                    alt="Preview"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 hover:text-white text-gray-700 rounded-full p-1 shadow transition"
                                                                    title="Remove"
                                                                    onClick={() =>
                                                                        setGalleryPreviews(
                                                                            galleryPreviews.filter(
                                                                                (
                                                                                    _,
                                                                                    idx
                                                                                ) =>
                                                                                    idx !==
                                                                                    i
                                                                            )
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                    <Button
                                                        type="button"
                                                        className="h-10 mt-2"
                                                        disabled={
                                                            galleryUploading
                                                        }
                                                        onClick={async () => {
                                                            setGalleryError("");
                                                            setGalleryUploading(
                                                                true
                                                            );
                                                            let success = true;
                                                            for (const file of galleryPreviews) {
                                                                const formData =
                                                                    new FormData();
                                                                formData.append(
                                                                    "image",
                                                                    file.file
                                                                );
                                                                const res =
                                                                    await fetch(
                                                                        route(
                                                                            "clinic.profile.gallery.upload"
                                                                        ),
                                                                        {
                                                                            method: "POST",
                                                                            headers:
                                                                                {
                                                                                    "X-CSRF-TOKEN":
                                                                                        document.querySelector(
                                                                                            "meta[name=csrf-token]"
                                                                                        )
                                                                                            .content,
                                                                                },
                                                                            body: formData,
                                                                            credentials:
                                                                                "same-origin",
                                                                        }
                                                                    );
                                                                if (!res.ok) {
                                                                    success = false;
                                                                    setGalleryError(
                                                                        "One or more uploads failed. Please check file type/size."
                                                                    );
                                                                }
                                                            }
                                                            setGalleryUploading(
                                                                false
                                                            );
                                                            setGalleryPreviews(
                                                                []
                                                            );
                                                            if (success) {
                                                                window.location.reload(); // Robust, always-correct fix
                                                            }
                                                        }}
                                                    >
                                                        {galleryUploading
                                                            ? "Uploading..."
                                                            : "Upload"}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        {galleryError && (
                                            <div className="text-xs text-red-600 mb-2">
                                                {galleryError}
                                            </div>
                                        )}
                                        {showDeleteId && (
                                            <div
                                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                                                role="dialog"
                                                aria-modal="true"
                                            >
                                                <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
                                                    <h3 className="font-bold text-lg mb-2">
                                                        Remove Image?
                                                    </h3>
                                                    <p className="text-gray-600 mb-4">
                                                        Are you sure you want to
                                                        remove this image from
                                                        the gallery?
                                                    </p>
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            onClick={() =>
                                                                setShowDeleteId(
                                                                    null
                                                                )
                                                            }
                                                            variant="secondary"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={async () => {
                                                                await fetch(
                                                                    route(
                                                                        "clinic.profile.gallery.delete",
                                                                        {
                                                                            id: showDeleteId,
                                                                        }
                                                                    ),
                                                                    {
                                                                        method: "DELETE",
                                                                        headers:
                                                                            {
                                                                                "X-CSRF-TOKEN":
                                                                                    document.querySelector(
                                                                                        "meta[name=csrf-token]"
                                                                                    )
                                                                                        .content,
                                                                            },
                                                                    }
                                                                );
                                                                setShowDeleteId(
                                                                    null
                                                                );
                                                                router.reload();
                                                            }}
                                                            variant="destructive"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="border-t pt-6 mt-6">
                                <label className="block font-semibold mb-2 text-lg">
                                    Operating Hours
                                </label>
                                <div className="flex flex-wrap items-center gap-2 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <span className="font-medium mr-2">
                                        Quick Setup:
                                    </span>
                                    {DAYS_OF_WEEK.map((day) => (
                                        <label
                                            key={day.id}
                                            className="flex items-center gap-1 text-xs font-medium"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={quickDays.includes(
                                                    day.id
                                                )}
                                                onChange={(e) =>
                                                    setQuickDays((qd) =>
                                                        e.target.checked
                                                            ? [...qd, day.id]
                                                            : qd.filter(
                                                                  (d) =>
                                                                      d !==
                                                                      day.id
                                                              )
                                                    )
                                                }
                                                aria-label={`Select ${day.label} for quick setup`}
                                            />
                                            {day.label.slice(0, 3)}
                                        </label>
                                    ))}
                                    <input
                                        type="time"
                                        value={quickOpen}
                                        onChange={(e) =>
                                            setQuickOpen(e.target.value)
                                        }
                                        className="border px-2 py-1 rounded w-20 ml-2 text-sm"
                                        placeholder="Open"
                                        aria-label="Quick open time"
                                    />
                                    <span>-</span>
                                    <input
                                        type="time"
                                        value={quickClose}
                                        onChange={(e) =>
                                            setQuickClose(e.target.value)
                                        }
                                        className="border px-2 py-1 rounded w-20 text-sm"
                                        placeholder="Close"
                                        aria-label="Quick close time"
                                    />
                                    <button
                                        type="button"
                                        className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                                        onClick={handleQuickApply}
                                        aria-label="Apply quick setup to selected days"
                                    >
                                        Apply to Selected
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                                        onClick={handleSetAll}
                                        aria-label="Set all days to quick setup times"
                                    >
                                        Set All
                                    </button>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {DAYS_OF_WEEK.map((day, idx) => (
                                        <div
                                            key={day.id}
                                            className="flex flex-wrap md:flex-nowrap items-center bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 gap-2 hover:bg-blue-50 transition relative"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    !operatingDays[day.id]
                                                        .closed
                                                }
                                                onChange={(e) =>
                                                    handleOperatingDayChange(
                                                        day.id,
                                                        "closed",
                                                        !e.target.checked
                                                    )
                                                }
                                                className="mr-2 scale-90"
                                                aria-label={`Toggle ${day.label} open/closed`}
                                            />
                                            <span className="font-semibold text-sm w-20">
                                                {day.label}
                                            </span>
                                            {!operatingDays[day.id]
                                                .closed ? null : (
                                                <span
                                                    className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold"
                                                    aria-label="Closed"
                                                >
                                                    Closed
                                                </span>
                                            )}
                                            <input
                                                type="time"
                                                value={
                                                    operatingDays[day.id].open
                                                }
                                                onChange={(e) =>
                                                    handleOperatingDayChange(
                                                        day.id,
                                                        "open",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={
                                                    operatingDays[day.id].closed
                                                }
                                                className="border px-2 py-1 rounded w-20 text-sm"
                                                aria-label={`${day.label} open time`}
                                            />
                                            <span className="mx-1">-</span>
                                            <input
                                                type="time"
                                                value={
                                                    operatingDays[day.id].close
                                                }
                                                onChange={(e) =>
                                                    handleOperatingDayChange(
                                                        day.id,
                                                        "close",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={
                                                    operatingDays[day.id].closed
                                                }
                                                className="border px-2 py-1 rounded w-20 text-sm"
                                                aria-label={`${day.label} close time`}
                                            />
                                            {idx > 0 && (
                                                <button
                                                    type="button"
                                                    className="ml-auto p-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full border border-gray-300 flex items-center justify-center"
                                                    onClick={() =>
                                                        handleCopyPreviousDay(
                                                            idx
                                                        )
                                                    }
                                                    aria-label={`Copy previous day's hours to ${day.label}`}
                                                    title="Copy previous day's hours"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            )}
                                            {validationErrors[day.id] && (
                                                <span
                                                    className="ml-2 text-red-600 text-xs font-semibold"
                                                    aria-live="polite"
                                                >
                                                    {validationErrors[day.id]}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    Example: Use Quick Setup to check Tuesday to
                                    Sunday and set 08:00 - 05:00 PM for each.
                                    Leave Monday unchecked for closed.
                                </div>
                                {errors && errors.operating_hours && (
                                    <div className="text-red-600 text-sm mt-2">
                                        {errors.operating_hours}
                                    </div>
                                )}
                            </div>

                            <Button type="submit" disabled={processing}>
                                Update Profile
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });
    return position ? (
        <Marker
            position={position}
            icon={
                new L.Icon({
                    iconUrl:
                        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl:
                        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                    shadowSize: [41, 41],
                })
            }
        />
    ) : null;
}
