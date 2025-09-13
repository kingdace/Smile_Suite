import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Building2 } from "lucide-react";
import {
    ValidatedInput,
    ValidatedTextarea,
} from "@/Components/ui/validated-input";

export default function ClinicInfoSection({
    data,
    setData,
    errors,
    isAdmin,
    validateField,
    getFieldError,
    isFieldValid,
    isFieldInvalid,
    isFieldValidating,
}) {
    const logoInput = useRef();

    // Handle input changes with real-time validation
    const handleInputChange = (fieldName, value) => {
        setData(fieldName, value);
        validateField(fieldName, value, { ...data, [fieldName]: value });
    };

    if (!isAdmin) return null;

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Clinic Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ValidatedInput
                        name="clinic_name"
                        label="Clinic Name"
                        type="text"
                        value={data.clinic_name || ""}
                        onChange={(e) =>
                            handleInputChange("clinic_name", e.target.value)
                        }
                        error={
                            getFieldError("clinic_name") || errors.clinic_name
                        }
                        isValid={isFieldValid("clinic_name")}
                        isInvalid={isFieldInvalid("clinic_name")}
                        isValidating={isFieldValidating("clinic_name")}
                        required
                        placeholder="Enter clinic name"
                    />

                    <ValidatedInput
                        name="contact_number"
                        label="Contact Number"
                        type="tel"
                        value={data.contact_number || ""}
                        onChange={(e) =>
                            handleInputChange("contact_number", e.target.value)
                        }
                        error={
                            getFieldError("contact_number") ||
                            errors.contact_number
                        }
                        isValid={isFieldValid("contact_number")}
                        isInvalid={isFieldInvalid("contact_number")}
                        isValidating={isFieldValidating("contact_number")}
                        placeholder="09XX-XXX-XXXX"
                    />

                    <ValidatedInput
                        name="clinic_email"
                        label="Email"
                        type="email"
                        value={data.clinic_email || ""}
                        onChange={(e) =>
                            handleInputChange("clinic_email", e.target.value)
                        }
                        error={
                            getFieldError("clinic_email") || errors.clinic_email
                        }
                        isValid={isFieldValid("clinic_email")}
                        isInvalid={isFieldInvalid("clinic_email")}
                        isValidating={isFieldValidating("clinic_email")}
                        required
                        placeholder="clinic@example.com"
                    />

                    <ValidatedInput
                        name="license_number"
                        label="License Number"
                        type="text"
                        value={data.license_number || ""}
                        onChange={(e) =>
                            handleInputChange("license_number", e.target.value)
                        }
                        error={
                            getFieldError("license_number") ||
                            errors.license_number
                        }
                        isValid={isFieldValid("license_number")}
                        isInvalid={isFieldInvalid("license_number")}
                        isValidating={isFieldValidating("license_number")}
                        placeholder="DOH-123456"
                    />
                </div>

                <ValidatedTextarea
                    name="description"
                    label="Description"
                    value={data.description || ""}
                    onChange={(e) =>
                        handleInputChange("description", e.target.value)
                    }
                    error={getFieldError("description") || errors.description}
                    isValid={isFieldValid("description")}
                    isInvalid={isFieldInvalid("description")}
                    isValidating={isFieldValidating("description")}
                    rows={3}
                    placeholder="Tell patients about your clinic..."
                />

                <div>
                    <Label htmlFor="logo" className="text-sm font-medium">
                        Clinic Logo
                    </Label>
                    <Input
                        ref={logoInput}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData("logo", e.target.files[0])}
                        className="mb-2"
                    />
                    {data.logo_url && (
                        <div className="mt-2">
                            <img
                                src={data.logo_url}
                                alt="Clinic Logo"
                                className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                                onError={(e) => {
                                    e.target.src = "/images/clinic-logo.png";
                                }}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
