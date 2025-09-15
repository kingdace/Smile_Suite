import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocationManagement } from "@/hooks/useLocationManagement";

export default function LocationSection({ data, setData, errors }) {
    const {
        handleMapClick: hookHandleMapClick,
        getMapCenter,
        hasValidCoordinates,
    } = useLocationManagement(data.latitude, data.longitude);

    // Custom map click handler that updates form data directly
    const handleMapClick = React.useCallback(
        (latlng) => {
            setData("latitude", latlng.lat.toFixed(6));
            setData("longitude", latlng.lng.toFixed(6));
        },
        [setData]
    );

    // Check if coordinates are valid from form data
    const hasValidFormCoordinates = React.useCallback(() => {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        return (
            !isNaN(lat) &&
            !isNaN(lng) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180
        );
    }, [data.latitude, data.longitude]);

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label
                            htmlFor="latitude"
                            className="text-sm font-medium"
                        >
                            Latitude
                        </Label>
                        <Input
                            id="latitude"
                            type="text"
                            value={data.latitude || ""}
                            onChange={(e) =>
                                setData("latitude", e.target.value)
                            }
                            className={errors.latitude ? "border-red-500" : ""}
                            placeholder="13.4125"
                        />
                        {errors.latitude && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.latitude}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="longitude"
                            className="text-sm font-medium"
                        >
                            Longitude
                        </Label>
                        <Input
                            id="longitude"
                            type="text"
                            value={data.longitude || ""}
                            onChange={(e) =>
                                setData("longitude", e.target.value)
                            }
                            className={errors.longitude ? "border-red-500" : ""}
                            placeholder="122.5656"
                        />
                        {errors.longitude && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.longitude}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Label className="text-sm font-medium mb-2 block">
                        Set Location on Map
                    </Label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <MapContainer
                            center={getMapCenter()}
                            zoom={15}
                            style={{ height: "300px", width: "100%" }}
                            className="z-0"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker
                                position={
                                    hasValidFormCoordinates()
                                        ? [
                                              parseFloat(data.latitude),
                                              parseFloat(data.longitude),
                                          ]
                                        : null
                                }
                                onMapClick={handleMapClick}
                            />
                        </MapContainer>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Click on the map to set your clinic's location. This
                        helps patients find you easily.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Location Marker Component
function LocationMarker({ position, onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
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
