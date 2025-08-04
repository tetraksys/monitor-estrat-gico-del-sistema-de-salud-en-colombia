
import React, { useState, useCallback } from 'react';
import { generateReport } from '../services/geminiService';
import { ReportData, GroundingSource } from '../types';
import ReportView from './ReportView';
import Spinner from './Spinner';
import ExportButtons from './ExportButtons';
import { BrainCircuit, AlertTriangle, BarChartBig } from 'lucide-react';


const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setReportData(null);
    setGroundingSources([]);

    try {
      const result = await generateReport();
      if (result.reportData) {
        setReportData(result.reportData);
      }
      if (result.sources) {
        setGroundingSources(result.sources);
      }
    } catch (err) {
      console.error("Error generating report:", err);
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado al generar el informe. Por favor, intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="container mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-700">Panel de Control Semanal</h2>
            <p className="text-slate-500 mt-1">Genere un nuevo informe para obtener el análisis más reciente del sistema de salud.</p>
          </div>
          <div className="flex items-center space-x-4">
             {reportData && <ExportButtons reportData={reportData} />}
            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Generando...
                </>
              ) : (
                <>
                 <BrainCircuit className="w-5 h-5 mr-2" />
                  Generar Informe
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow" role="alert">
          <div className="flex">
            <div className="py-1">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-4"/>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
         <div className="mt-6 text-center text-slate-600">
            <div className="flex justify-center items-center flex-col bg-white p-8 rounded-lg shadow-md border">
                <Spinner size="lg" />
                <p className="text-lg font-semibold mt-4">Analizando Fuentes de Datos...</p>
                <p className="text-sm text-slate-500">El motor de IA está recopilando y resumiendo información. Esto puede tardar un momento.</p>
            </div>
        </div>
      )}

      {reportData && (
        <div id="report-content" className="mt-6">
          <ReportView reportData={reportData} groundingSources={groundingSources} />
        </div>
      )}

      {!isLoading && !reportData && !error && (
        <div className="mt-6 text-center bg-white p-12 rounded-lg shadow-lg border border-slate-200">
          <div className="flex flex-col items-center justify-center">
            <BarChartBig className="w-16 h-16 text-blue-500 opacity-70 mb-4" />
            <h3 className="text-2xl font-bold text-slate-700">ARKA 360</h3>
            <p className="mt-2 text-slate-600">Datos, precisión, y contexto en acción.</p>
          </div>
        </div>
      )}

      <footer className="mt-8 text-right text-sm italic text-slate-500">
        Policy insight developed by Julio César Puentes
        <br />
        powered by ChatGPT and Google AI Studio
      </footer>

    </div>
  );
};

export default Dashboard;