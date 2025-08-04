import React from 'react';
import { ReportData, Finding, Sentiment, GroundingSource } from '../types';
import { TOPIC_KEYS } from '../constants';
import { AlertTriangle, FileText, Newspaper, LinkIcon, User, Brain, ExternalLink } from 'lucide-react';


const SentimentBadge: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
  const baseClasses = 'text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full';
  const sentimentClasses = {
    [Sentiment.Positive]: 'bg-green-100 text-green-800',
    [Sentiment.Negative]: 'bg-red-100 text-red-800',
    [Sentiment.Neutral]: 'bg-slate-100 text-slate-800',
  };
  return <span className={`${baseClasses} ${sentimentClasses[sentiment]}`}>{sentiment}</span>;
};

const FindingCard: React.FC<{ finding: Finding }> = ({ finding }) => (
  <div className={`bg-white rounded-lg shadow-md border p-5 mb-4 transition-all hover:shadow-lg ${finding.isHighPriority ? 'border-amber-400' : 'border-slate-200'}`}>
    {finding.isHighPriority && (
      <div className="flex items-center text-amber-600 font-bold text-sm mb-2">
        <AlertTriangle className="w-4 h-4 mr-2" />
        ALERTA DE ALTO IMPACTO
      </div>
    )}
    <h4 className="text-lg font-bold text-slate-800">{finding.title}</h4>
    <div className="flex items-center text-sm text-slate-500 my-2 flex-wrap gap-x-4 gap-y-1">
      <SentimentBadge sentiment={finding.sentiment} />
      <div className="flex items-center"><User className="w-4 h-4 mr-1.5" /> <strong>Actor Clave:</strong><span className="ml-1">{finding.keyActor}</span></div>
      <div className="flex items-center"><Newspaper className="w-4 h-4 mr-1.5" /> <strong>Fuente:</strong><span className="ml-1">{finding.source}</span></div>
    </div>
    <p className="text-slate-600 mb-3">{finding.summary}</p>
    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
      <div className="flex items-center text-blue-800 font-semibold text-sm">
        <Brain className="w-4 h-4 mr-2" />
        Análisis de Impacto para la Industria Farmacéutica
      </div>
      <p className="text-blue-700 text-sm mt-1">{finding.pharmaImpact}</p>
    </div>
    <a href={finding.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-3 font-semibold">
      Ver fuente original
      <ExternalLink className="w-4 h-4 ml-1.5" />
    </a>
  </div>
);

const ReportView: React.FC<{ reportData: ReportData; groundingSources: GroundingSource[] }> = ({ reportData, groundingSources }) => {
  return (
    <div className="space-y-8">
      {/* Executive Summary & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg border border-slate-200">
          <div className="flex items-center text-xl font-bold text-slate-700 mb-3">
             <FileText className="w-6 h-6 mr-3 text-blue-600" />
             Resumen Ejecutivo
          </div>
          <p className="text-slate-600 leading-relaxed">{reportData.executiveSummary}</p>
        </div>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg shadow-lg">
           <div className="flex items-center text-xl font-bold text-red-700 mb-3">
             <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
             Alertas Críticas
          </div>
          {reportData.criticalAlerts.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-red-800">
              {reportData.criticalAlerts.map((alert, index) => <li key={index}>{alert}</li>)}
            </ul>
          ) : (
            <p className="text-slate-600">No se detectaron alertas críticas esta semana.</p>
          )}
        </div>
      </div>
      
      {/* Topics */}
      {TOPIC_KEYS.map(({ key, title }) => {
        const findings = reportData[key as keyof Omit<ReportData, 'executiveSummary' | 'criticalAlerts'>] as Finding[];
        if (!findings || findings.length === 0) return null;
        
        return (
          <div key={key} className="bg-slate-100/70 p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-700 mb-4 pb-2 border-b-2 border-blue-200">{title}</h3>
            <div>
              {findings.map((finding, index) => <FindingCard key={index} finding={finding} />)}
            </div>
          </div>
        );
      })}

       {/* Grounding Sources */}
      {groundingSources.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
          <div className="flex items-center text-xl font-bold text-slate-700 mb-3">
             <LinkIcon className="w-6 h-6 mr-3 text-slate-500" />
             Fuentes Consultadas
          </div>
           <ul className="space-y-2">
              {groundingSources.map((source, index) => (
                <li key={index} className="text-sm">
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline hover:text-blue-800 break-all">
                    <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{source.title || source.uri}</span>
                  </a>
                </li>
              ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default ReportView;