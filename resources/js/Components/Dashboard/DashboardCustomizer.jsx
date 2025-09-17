import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Switch } from '@/Components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
    Settings, 
    GripVertical, 
    Eye, 
    EyeOff, 
    RotateCcw,
    Save
} from 'lucide-react';

const SortableItem = ({ id, children, isVisible, onToggleVisibility }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg ${
                isDragging ? 'shadow-lg' : 'shadow-sm'
            }`}
        >
            <div className="flex items-center space-x-3">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                    {children}
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    checked={isVisible}
                    onCheckedChange={onToggleVisibility}
                />
                {isVisible ? (
                    <Eye className="h-4 w-4 text-green-600" />
                ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                )}
            </div>
        </div>
    );
};

const DashboardCustomizer = ({ 
    widgets, 
    onLayoutChange, 
    onVisibilityChange,
    onResetLayout,
    onSaveLayout 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localWidgets, setLocalWidgets] = useState(widgets);
    const [hasChanges, setHasChanges] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setLocalWidgets((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                setHasChanges(true);
                return newOrder;
            });
        }
    };

    const handleToggleVisibility = (widgetId) => {
        setLocalWidgets((items) =>
            items.map((item) =>
                item.id === widgetId
                    ? { ...item, visible: !item.visible }
                    : item
            )
        );
        setHasChanges(true);
    };

    const handleSave = () => {
        if (onLayoutChange) {
            onLayoutChange(localWidgets);
        }
        if (onSaveLayout) {
            onSaveLayout(localWidgets);
        }
        setHasChanges(false);
        setIsOpen(false);
    };

    const handleReset = () => {
        if (onResetLayout) {
            const resetWidgets = onResetLayout();
            setLocalWidgets(resetWidgets);
            setHasChanges(true);
        }
    };

    const handleCancel = () => {
        setLocalWidgets(widgets);
        setHasChanges(false);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Customize</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Customize Dashboard</DialogTitle>
                    <DialogDescription>
                        Drag to reorder widgets and toggle visibility. Changes will be saved to your preferences.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={localWidgets.map(w => w.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {localWidgets.map((widget) => (
                                    <SortableItem
                                        key={widget.id}
                                        id={widget.id}
                                        isVisible={widget.visible}
                                        onToggleVisibility={() => handleToggleVisibility(widget.id)}
                                    >
                                        {widget.title}
                                    </SortableItem>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <div className="flex items-center justify-between pt-4 border-t">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="flex items-center space-x-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span>Reset</span>
                        </Button>
                        
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={!hasChanges}
                                className="flex items-center space-x-2"
                            >
                                <Save className="h-4 w-4" />
                                <span>Save</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DashboardCustomizer;
