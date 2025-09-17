import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Badge } from '@/Components/ui/badge';
import {
    Download,
    FileText,
    FileSpreadsheet,
    Loader2,
    CheckCircle,
    AlertCircle,
    ChevronDown,
} from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ExportButton({ 
    exportRoute, 
    filters = {}, 
    className = '',
    variant = 'outline',
    size = 'sm',
    disabled = false,
    showLabel = true,
    clinic
}) {
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState(null);

    const handleExport = async (format) => {
        setIsExporting(true);
        setExportStatus(null);

        try {
            // Build the export URL with filters and format
            const params = new URLSearchParams({
                ...filters,
                format: format
            });

            const exportUrl = `${exportRoute}?${params.toString()}`;
            
            // Create a temporary link to trigger download
            const link = document.createElement('a');
            link.href = exportUrl;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setExportStatus('success');
            setTimeout(() => setExportStatus(null), 3000);
        } catch (error) {
            console.error('Export failed:', error);
            setExportStatus('error');
            setTimeout(() => setExportStatus(null), 3000);
        } finally {
            setIsExporting(false);
        }
    };

    const getStatusIcon = () => {
        switch (exportStatus) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                );
        }
    };

    const getStatusText = () => {
        switch (exportStatus) {
            case 'success':
                return 'Export Complete';
            case 'error':
                return 'Export Failed';
            default:
                return isExporting ? 'Exporting...' : (showLabel ? 'Export' : '');
        }
    };

    const getButtonVariant = () => {
        switch (exportStatus) {
            case 'success':
                return 'default';
            case 'error':
                return 'destructive';
            default:
                return variant;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={getButtonVariant()}
                    size={size}
                    disabled={disabled || isExporting}
                    className={`gap-2 transition-all duration-300 ${className} ${
                        exportStatus === 'success' 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : exportStatus === 'error'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : ''
                    }`}
                >
                    {getStatusIcon()}
                    {getStatusText()}
                    {!isExporting && !exportStatus && (
                        <ChevronDown className="w-3 h-3 ml-1" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                    className="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                >
                    <FileText className="w-4 h-4 mr-3 text-blue-600" />
                    <div className="flex flex-col flex-1">
                        <span className="font-medium text-gray-900">CSV Format</span>
                        <span className="text-xs text-gray-500">
                            Comma-separated values • Universal compatibility
                        </span>
                    </div>
                    <Badge variant="outline" className="ml-auto text-xs border-blue-200 text-blue-700">
                        .csv
                    </Badge>
                </DropdownMenuItem>

                <DropdownMenuItem 
                    onClick={() => handleExport('excel')}
                    disabled={isExporting}
                    className="cursor-pointer hover:bg-green-50 transition-colors duration-200"
                >
                    <FileSpreadsheet className="w-4 h-4 mr-3 text-green-600" />
                    <div className="flex flex-col flex-1">
                        <span className="font-medium text-gray-900">Excel Format</span>
                        <span className="text-xs text-gray-500">
                            Professional formatting • Charts & styling
                        </span>
                    </div>
                    <Badge variant="outline" className="ml-auto text-xs border-green-200 text-green-700">
                        .xlsx
                    </Badge>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                        <span>Clinic ID:</span>
                        <span className="font-mono">{clinic?.id || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <span>Filters:</span>
                        <span className="font-mono">
                            {Object.keys(filters).length > 0 ? 'Applied' : 'None'}
                        </span>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
