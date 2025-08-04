
import { ReportData } from './types';

export const TOPIC_KEYS: { key: keyof ReportData, title: string }[] = [
    { key: 'financialSustainability', title: 'Flujos y Sostenibilidad Financiera' },
    { key: 'pricingRegulation', title: 'Regulación de Precios de Medicamentos' },
    { key: 'newTherapiesAccess', title: 'Acceso y Regulación de Nuevas Terapias' },
];
