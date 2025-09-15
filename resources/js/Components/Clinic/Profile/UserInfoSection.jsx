import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { User, Mail, Lock } from "lucide-react";

export default function UserInfoSection({ data, setData, errors, isAdmin }) {
    if (!isAdmin) return null;

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                            Full Name *
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name || ""}
                            onChange={(e) => setData("name", e.target.value)}
                            className={errors.name ? "border-red-500" : ""}
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email || ""}
                            onChange={(e) => setData("email", e.target.value)}
                            className={errors.email ? "border-red-500" : ""}
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Change Password
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                New Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password || ""}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className={
                                    errors.password ? "border-red-500" : ""
                                }
                                placeholder="Leave blank to keep current password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label
                                htmlFor="password_confirmation"
                                className="text-sm font-medium"
                            >
                                Confirm New Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation || ""}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                className={
                                    errors.password_confirmation
                                        ? "border-red-500"
                                        : ""
                                }
                                placeholder="Confirm new password"
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Leave password fields blank if you don't want to change
                        your password.
                    </p>
                </div>
            </div>
        </div>
    );
}
