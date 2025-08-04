import React, { useState } from 'react';
import { ReportData } from '../types';
import { exportToPdf, exportToExcel } from '../services/exportService';
import Spinner from './Spinner';
import { FileDown, FileText } from 'lucide-react';

interface ExportButtonsProps {
  reportData: ReportData;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ reportData }) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportToPdf();
    } catch (error) {
        console.error("Failed to export PDF", error);
        // The service layer now handles alerting the user for known errors.
    } finally {
        setIsExportingPdf(false);
    }
  };

  const handleExportExcel = () => {
    setIsExportingExcel(true);
    try {
      exportToExcel(reportData);
    } catch(error) {
        console.error("Failed to export Excel", error);
        alert("Hubo un error al generar el archivo Excel.");
    } finally {
        setIsExportingExcel(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleExportPdf}
        disabled={isExportingPdf || isExportingExcel}
        className="flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
      >
        {isExportingPdf ? <Spinner /> : <FileDown className="w-5 h-5 mr-2" />}
        PDF
      </button>
      <button
        onClick={handleExportExcel}
        disabled={isExportingPdf || isExportingExcel}
        className="flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
      >
        {isExportingExcel ? <Spinner /> : <FileText className="w-5 h-5 mr-2" />}
        Excel
      </button>
    </div>
  );
};

export default ExportButtons;