
export enum Sentiment {
  Positive = 'Positivo',
  Negative = 'Negativo',
  Neutral = 'Neutral'
}

export interface Finding {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  sentiment: Sentiment;
  pharmaImpact: string;
  keyActor: string;
  isHighPriority: boolean;
}

export interface ReportData {
  executiveSummary: string;
  criticalAlerts: string[];
  financialSustainability: Finding[];
  pricingRegulation: Finding[];
  newTherapiesAccess: Finding[];
}

export interface GroundingSource {
    uri: string;
    title: string;
}
