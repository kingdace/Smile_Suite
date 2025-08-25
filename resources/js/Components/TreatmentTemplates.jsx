import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    FileText,
    Plus,
    CheckCircle,
    Clock,
    DollarSign,
    Users,
    Stethoscope,
    Circle,
} from "lucide-react";

export default function TreatmentTemplates({
    onTemplateSelect,
    className = "",
}) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Predefined treatment templates
    const templates = [
        {
            id: "cleaning",
            name: "Dental Cleaning",
            category: "Preventive",
            description: "Professional dental cleaning and examination",
            estimatedDuration: 60,
            estimatedCost: 150,
            procedures: [
                {
                    step: "Oral examination and assessment",
                    notes: "Check for cavities, gum disease, and other oral health issues",
                },
                {
                    step: "Plaque and tartar removal",
                    notes: "Remove built-up plaque and tartar from teeth surfaces",
                },
                {
                    step: "Teeth polishing",
                    notes: "Polish teeth to remove surface stains and smooth enamel",
                },
                {
                    step: "Flossing and fluoride treatment",
                    notes: "Floss between teeth and apply fluoride for protection",
                },
            ],
            commonTeeth: [],
            materials: [
                "Dental scaler",
                "Polishing paste",
                "Floss",
                "Fluoride gel",
            ],
            prescriptions: [],
            followUpNotes: "Schedule next cleaning in 6 months",
            color: "bg-green-100 text-green-800",
        },
        {
            id: "filling",
            name: "Dental Filling",
            category: "Restorative",
            description: "Fill cavities and restore tooth structure",
            estimatedDuration: 45,
            estimatedCost: 200,
            procedures: [
                {
                    step: "Local anesthesia administration",
                    notes: "Numb the area around the affected tooth",
                },
                {
                    step: "Cavity preparation",
                    notes: "Remove decayed tooth material and prepare cavity",
                },
                {
                    step: "Filling placement",
                    notes: "Place and shape the filling material",
                },
                {
                    step: "Bite adjustment and polishing",
                    notes: "Adjust bite and polish the filling",
                },
            ],
            commonTeeth: [3, 4, 5, 12, 13, 14, 19, 20, 21, 28, 29, 30],
            materials: [
                "Composite resin",
                "Dental drill",
                "Etching gel",
                "Bonding agent",
            ],
            prescriptions: ["Ibuprofen for pain management"],
            followUpNotes:
                "Avoid hard foods for 24 hours, follow up if sensitivity persists",
            color: "bg-blue-100 text-blue-800",
        },
        {
            id: "extraction",
            name: "Tooth Extraction",
            category: "Surgical",
            description: "Remove damaged or problematic teeth",
            estimatedDuration: 30,
            estimatedCost: 300,
            procedures: [
                {
                    step: "X-ray examination",
                    notes: "Assess tooth position and root structure",
                },
                { step: "Local anesthesia", notes: "Numb the area completely" },
                {
                    step: "Tooth loosening",
                    notes: "Gently loosen the tooth from socket",
                },
                {
                    step: "Extraction and cleaning",
                    notes: "Remove tooth and clean extraction site",
                },
                {
                    step: "Gauze placement",
                    notes: "Place gauze to control bleeding",
                },
            ],
            commonTeeth: [1, 2, 16, 17, 32],
            materials: [
                "Extraction forceps",
                "Elevator",
                "Gauze",
                "Sutures if needed",
            ],
            prescriptions: ["Antibiotics", "Pain medication"],
            followUpNotes:
                "Keep gauze in place for 30 minutes, avoid smoking for 48 hours",
            color: "bg-red-100 text-red-800",
        },
        {
            id: "root-canal",
            name: "Root Canal Treatment",
            category: "Endodontic",
            description: "Treat infected tooth pulp and save the tooth",
            estimatedDuration: 90,
            estimatedCost: 800,
            procedures: [
                {
                    step: "Access preparation",
                    notes: "Create access to the pulp chamber",
                },
                {
                    step: "Pulp removal",
                    notes: "Remove infected or damaged pulp tissue",
                },
                {
                    step: "Canal cleaning and shaping",
                    notes: "Clean and shape the root canals",
                },
                {
                    step: "Canal filling",
                    notes: "Fill canals with gutta-percha",
                },
                {
                    step: "Temporary restoration",
                    notes: "Place temporary filling",
                },
            ],
            commonTeeth: [3, 4, 5, 12, 13, 14, 19, 20, 21, 28, 29, 30],
            materials: [
                "Endodontic files",
                "Gutta-percha",
                "Sealer",
                "Temporary filling",
            ],
            prescriptions: ["Antibiotics", "Pain medication"],
            followUpNotes: "Schedule permanent restoration in 1-2 weeks",
            color: "bg-purple-100 text-purple-800",
        },
        {
            id: "crown",
            name: "Dental Crown",
            category: "Restorative",
            description: "Cover and protect damaged or weakened teeth",
            estimatedDuration: 120,
            estimatedCost: 1000,
            procedures: [
                {
                    step: "Tooth preparation",
                    notes: "Reshape tooth to accommodate crown",
                },
                {
                    step: "Impressions",
                    notes: "Take impressions for crown fabrication",
                },
                {
                    step: "Temporary crown placement",
                    notes: "Place temporary crown",
                },
                {
                    step: "Crown fitting and cementation",
                    notes: "Fit and cement permanent crown",
                },
            ],
            commonTeeth: [3, 4, 5, 12, 13, 14, 19, 20, 21, 28, 29, 30],
            materials: ["Crown material", "Cement", "Impression material"],
            prescriptions: [],
            followUpNotes: "Avoid sticky foods, follow up if crown feels loose",
            color: "bg-yellow-100 text-yellow-800",
        },
        {
            id: "whitening",
            name: "Teeth Whitening",
            category: "Cosmetic",
            description: "Professional teeth whitening treatment",
            estimatedDuration: 60,
            estimatedCost: 250,
            procedures: [
                {
                    step: "Teeth cleaning",
                    notes: "Clean teeth to remove surface stains",
                },
                {
                    step: "Whitening gel application",
                    notes: "Apply professional whitening gel",
                },
                {
                    step: "Light activation",
                    notes: "Activate gel with special light",
                },
                {
                    step: "Rinse and assessment",
                    notes: "Rinse and assess results",
                },
            ],
            commonTeeth: [6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27],
            materials: [
                "Whitening gel",
                "Activation light",
                "Protective barriers",
            ],
            prescriptions: [],
            followUpNotes:
                "Avoid staining foods for 24 hours, maintain good oral hygiene",
            color: "bg-pink-100 text-pink-800",
        },
        {
            id: "braces",
            name: "Orthodontic Consultation",
            category: "Orthodontic",
            description: "Initial consultation for braces or aligners",
            estimatedDuration: 45,
            estimatedCost: 100,
            procedures: [
                {
                    step: "Oral examination",
                    notes: "Assess teeth alignment and bite issues",
                },
                {
                    step: "X-ray and imaging",
                    notes: "Take panoramic and cephalometric X-rays",
                },
                {
                    step: "Treatment planning",
                    notes: "Discuss treatment options and timeline",
                },
                {
                    step: "Cost estimation",
                    notes: "Provide detailed cost breakdown",
                },
            ],
            commonTeeth: [6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27],
            materials: [
                "Orthodontic instruments",
                "X-ray equipment",
                "Treatment planning software",
            ],
            prescriptions: [],
            followUpNotes: "Schedule follow-up for treatment initiation",
            color: "bg-indigo-100 text-indigo-800",
        },
        {
            id: "implant",
            name: "Dental Implant",
            category: "Surgical",
            description: "Place dental implant for missing tooth replacement",
            estimatedDuration: 120,
            estimatedCost: 2500,
            procedures: [
                {
                    step: "Site preparation",
                    notes: "Prepare implant site and create osteotomy",
                },
                {
                    step: "Implant placement",
                    notes: "Place titanium implant in jawbone",
                },
                {
                    step: "Suturing",
                    notes: "Close surgical site with sutures",
                },
                {
                    step: "Post-op instructions",
                    notes: "Provide detailed aftercare instructions",
                },
            ],
            commonTeeth: [
                1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 28, 29,
                30, 31, 32,
            ],
            materials: [
                "Titanium implant",
                "Surgical drill",
                "Sutures",
                "Bone graft if needed",
            ],
            prescriptions: ["Antibiotics", "Pain medication", "Mouthwash"],
            followUpNotes:
                "Soft diet for 1 week, follow up in 2 weeks for suture removal",
            color: "bg-orange-100 text-orange-800",
        },
        {
            id: "gum-treatment",
            name: "Gum Disease Treatment",
            category: "Periodontal",
            description: "Treat gingivitis and periodontitis",
            estimatedDuration: 90,
            estimatedCost: 400,
            procedures: [
                {
                    step: "Deep cleaning",
                    notes: "Remove plaque and tartar below gumline",
                },
                {
                    step: "Root planing",
                    notes: "Smooth root surfaces to prevent bacteria buildup",
                },
                {
                    step: "Antibiotic treatment",
                    notes: "Apply local antibiotics if needed",
                },
                {
                    step: "Oral hygiene instruction",
                    notes: "Demonstrate proper brushing and flossing",
                },
            ],
            commonTeeth: [],
            materials: [
                "Ultrasonic scaler",
                "Hand scalers",
                "Antibiotic gel",
                "Chlorhexidine rinse",
            ],
            prescriptions: ["Chlorhexidine mouthwash", "Antibiotics if severe"],
            followUpNotes:
                "Follow up in 4-6 weeks, maintain strict oral hygiene",
            color: "bg-teal-100 text-teal-800",
        },
        {
            id: "emergency",
            name: "Dental Emergency",
            category: "Emergency",
            description: "Emergency treatment for dental pain or trauma",
            estimatedDuration: 30,
            estimatedCost: 200,
            procedures: [
                {
                    step: "Pain assessment",
                    notes: "Evaluate pain level and source",
                },
                {
                    step: "Emergency treatment",
                    notes: "Provide immediate pain relief",
                },
                {
                    step: "Temporary restoration",
                    notes: "Place temporary filling or crown",
                },
                {
                    step: "Follow-up planning",
                    notes: "Schedule definitive treatment",
                },
            ],
            commonTeeth: [],
            materials: [
                "Temporary filling material",
                "Pain medication",
                "Emergency kit",
            ],
            prescriptions: ["Pain medication", "Antibiotics if infection"],
            followUpNotes: "Return for definitive treatment within 1 week",
            color: "bg-red-100 text-red-800",
        },
        {
            id: "consultation",
            name: "General Consultation",
            category: "Consultation",
            description: "General dental consultation and examination",
            estimatedDuration: 30,
            estimatedCost: 50,
            procedures: [
                {
                    step: "Patient history review",
                    notes: "Review medical and dental history",
                },
                {
                    step: "Oral examination",
                    notes: "Comprehensive oral examination",
                },
                {
                    step: "X-ray if needed",
                    notes: "Take necessary X-rays for diagnosis",
                },
                {
                    step: "Treatment discussion",
                    notes: "Discuss findings and treatment options",
                },
            ],
            commonTeeth: [],
            materials: ["Examination instruments", "X-ray equipment if needed"],
            prescriptions: [],
            followUpNotes: "Schedule follow-up based on treatment plan",
            color: "bg-gray-100 text-gray-800",
        },
    ];

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setIsDialogOpen(true);
    };

    const applyTemplate = () => {
        if (selectedTemplate) {
            onTemplateSelect(selectedTemplate);
            setIsDialogOpen(false);
            setSelectedTemplate(null);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Preventive":
                return <CheckCircle className="h-4 w-4" />;
            case "Restorative":
                return <Circle className="h-4 w-4" />;
            case "Surgical":
                return <Stethoscope className="h-4 w-4" />;
            case "Endodontic":
                return <Users className="h-4 w-4" />;
            case "Cosmetic":
                return <DollarSign className="h-4 w-4" />;
            case "Orthodontic":
                return <Circle className="h-4 w-4" />;
            case "Periodontal":
                return <Stethoscope className="h-4 w-4" />;
            case "Emergency":
                return <Clock className="h-4 w-4" />;
            case "Consultation":
                return <FileText className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <div className={className}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Treatment Templates
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <Card
                                key={template.id}
                                className="hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {template.name}
                                            </h3>
                                            <Badge
                                                className={`mt-1 ${template.color}`}
                                            >
                                                {getCategoryIcon(
                                                    template.category
                                                )}
                                                <span className="ml-1">
                                                    {template.category}
                                                </span>
                                            </Badge>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">
                                        {template.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {template.estimatedDuration} min
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="h-4 w-4" />$
                                            {template.estimatedCost}
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() =>
                                            handleTemplateSelect(template)
                                        }
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Use Template
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Template Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    className="max-w-2xl max-h-[80vh] overflow-y-auto"
                    aria-describedby="template-dialog-description"
                >
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            {selectedTemplate?.name} Template
                        </DialogTitle>
                        <div
                            id="template-dialog-description"
                            className="sr-only"
                        >
                            Detailed information about the{" "}
                            {selectedTemplate?.name} treatment template
                        </div>
                    </DialogHeader>

                    {selectedTemplate && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Description
                                </h3>
                                <p className="text-gray-600">
                                    {selectedTemplate.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Duration
                                    </h3>
                                    <p className="text-gray-600">
                                        {selectedTemplate.estimatedDuration}{" "}
                                        minutes
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Estimated Cost
                                    </h3>
                                    <p className="text-gray-600">
                                        ${selectedTemplate.estimatedCost}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Procedures
                                </h3>
                                <div className="space-y-2">
                                    {selectedTemplate.procedures.map(
                                        (procedure, index) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-gray-50 rounded-lg"
                                            >
                                                <p className="font-medium text-gray-900">
                                                    {procedure.step}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {procedure.notes}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {selectedTemplate.materials &&
                                selectedTemplate.materials.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Materials
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTemplate.materials &&
                                                selectedTemplate.materials.map(
                                                    (material, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                        >
                                                            {material}
                                                        </Badge>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                )}

                            {selectedTemplate.prescriptions &&
                                selectedTemplate.prescriptions.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Common Prescriptions
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTemplate.prescriptions &&
                                                selectedTemplate.prescriptions.map(
                                                    (prescription, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                        >
                                                            {prescription}
                                                        </Badge>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                )}

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Follow-up Notes
                                </h3>
                                <p className="text-gray-600">
                                    {selectedTemplate.followUpNotes}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={applyTemplate}
                                    className="flex-1"
                                >
                                    Apply Template
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
