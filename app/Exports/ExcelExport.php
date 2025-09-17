<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class ExcelExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle, WithProperties, WithColumnFormatting
{
    private $data;
    private $headers;
    private $dataMapper;
    private $title;

    public function __construct($data, $headers, $dataMapper = null, $title = 'Report')
    {
        $this->data = $data;
        $this->headers = $headers;
        $this->dataMapper = $dataMapper;
        $this->title = $title;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        return $this->headers;
    }

    public function map($row): array
    {
        if ($this->dataMapper) {
            return ($this->dataMapper)($row);
        }
        
        // Default mapping - extract values based on headers
        $mapped = [];
        foreach ($this->headers as $header) {
            $key = strtolower(str_replace(' ', '_', $header));
            $mapped[] = $row->{$key} ?? 'N/A';
        }
        return $mapped;
    }

    public function styles(Worksheet $sheet)
    {
        $lastColumn = chr(64 + count($this->headers)); // Convert to letter (A, B, C, etc.)
        $lastRow = $this->data->count() + 1;

        return [
            // Header row styling
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '2563EB'] // Blue color
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
            ],
            
            // Data rows styling
            "A2:{$lastColumn}{$lastRow}" => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CCCCCC'],
                    ],
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],

            // Alternating row colors for better readability
            "A2:{$lastColumn}{$lastRow}" => [
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'F8F9FA']
                ],
            ],
        ];
    }

    public function title(): string
    {
        return $this->title;
    }

    public function properties(): array
    {
        return [
            'creator'        => 'Smile Suite',
            'lastModifiedBy' => 'Smile Suite',
            'title'          => $this->title,
            'description'    => 'Generated report from Smile Suite Clinic Management System',
            'subject'        => 'Clinic Report',
            'keywords'       => 'clinic,report,export,smile suite',
            'category'       => 'Reports',
            'manager'        => 'Smile Suite System',
            'company'        => 'Smile Suite',
        ];
    }

    public function columnFormats(): array
    {
        $formats = [];
        
        // Apply specific formatting based on header names
        foreach ($this->headers as $index => $header) {
            $columnLetter = chr(65 + $index); // A, B, C, etc.
            
            switch (strtolower($header)) {
                case 'amount':
                case 'cost':
                case 'price':
                case 'total':
                case 'revenue':
                case 'payment':
                case 'unit price':
                case 'total value':
                    $formats[$columnLetter] = NumberFormat::FORMAT_CURRENCY_USD_SIMPLE;
                    break;
                    
                case 'date':
                case 'created date':
                case 'payment date':
                case 'scheduled date':
                case 'start date':
                case 'end date':
                    $formats[$columnLetter] = NumberFormat::FORMAT_DATE_YYYYMMDD2;
                    break;
                    
                case 'percentage':
                case '%':
                    $formats[$columnLetter] = NumberFormat::FORMAT_PERCENTAGE_00;
                    break;
                    
                case 'quantity':
                case 'count':
                case 'number':
                    $formats[$columnLetter] = NumberFormat::FORMAT_NUMBER;
                    break;
            }
        }
        
        return $formats;
    }
}
