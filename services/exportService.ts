import { ReportData, Finding } from '../types';
import { TOPIC_KEYS } from '../constants';

// These are globals loaded from index.html
declare const html2pdf: any;
declare const XLSX: any;


export const exportToPdf = (): Promise<void> => {
    const element = document.getElementById('report-content');
    
    if (!element) {
        const errorMsg = "Export failed: Element with id 'report-content' not found.";
        console.error(errorMsg);
        alert("Hubo un error al generar el PDF: no se encontró el contenido del informe.");
        return Promise.reject(new Error(errorMsg));
    }

    const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right in inches
        filename:     'informe-estrategico-salud.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#f8fafc' /* bg-slate-50 */ },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    return html2pdf().from(element).set(opt).save();
};


export const exportToExcel = (reportData: ReportData) => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ["Resumen Ejecutivo"],
      [reportData.executiveSummary],
      [],
      ["Alertas Críticas"],
      ...reportData.criticalAlerts.map(alert => [alert])
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen");

    // Findings Sheets
    TOPIC_KEYS.forEach(({ key, title }) => {
        const findings = reportData[key as keyof Omit<ReportData, 'executiveSummary'|'criticalAlerts'>] as Finding[];
        if (findings && findings.length > 0) {
            const dataForSheet = findings.map(f => ({
                'Título': f.title,
                'Resumen': f.summary,
                'Impacto para Pharma': f.pharmaImpact,
                'Sentimiento': f.sentiment,
                'Actor Clave': f.keyActor,
                'Fuente': f.source,
                'URL': f.sourceUrl,
                'Alta Prioridad': f.isHighPriority ? 'Sí' : 'No',
            }));
            const ws = XLSX.utils.json_to_sheet(dataForSheet);
            XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 30)); // Sheet names have 31 char limit
        }
    });

    XLSX.writeFile(wb, "informe-estrategico-salud.xlsx");
};