import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MarketBadge } from '../components/MarketBadge';
import { CircularProgress } from '../components/CircularProgress';
import { FileUploadModal } from '../components/FileUploadModal';
import { meterDataCycles } from '../mock/data';
import { useStore } from '../store/useStore';
import { Market } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showAuditChat, setShowAuditChat] = useState(false);
  const [auditQuery, setAuditQuery] = useState('');
  const [auditResponse, setAuditResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { ul360Tasks, meterExceptionTasks, validationTasks, addArchiveFile, addActivityLog } = useStore();

  const handleAuditRequest = async () => {
    if (!auditQuery.trim()) return;

    setIsProcessing(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = `Based on the UK meter data for December 2025:

• Total meters processed: 345
• Success rate: 98%
• Meters with exceptions: 17
• Data quality issues: 12 meters with incomplete consumption data

The agent has identified 17 meters missing from the registry (UK1230 deactivation) and flagged 12 meters with missing values that require manual review. The orchestration system has automatically generated exception files and is awaiting human approval to proceed with registry updates.

Recommended next steps:
1. Review the exception file for the 17 missing meters
2. Import the corrected registry from UL 360
3. Approve the reprocessing workflow for the 12 meters with data quality issues`;

    setAuditResponse(response);
    setIsProcessing(false);
  };

  const handleFileUpload = (file: File, market: Market) => {
    // Determine file type based on filename
    const filename = file.name.toLowerCase();
    let fileType: 'upload' | 'exception' | 'audit' = 'upload';

    if (filename.includes('exception')) {
      fileType = 'exception';
    } else if (filename.includes('audit')) {
      fileType = 'audit';
    }

    // Format file size
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      }
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    };

    // Add to archive files
    addArchiveFile({
      filename: file.name,
      market,
      size: formatFileSize(file.size),
      type: fileType,
      downloadUrl: `/api/files/${file.name}`,
    });

    // Add activity log entry
    addActivityLog({
      actor: 'Human',
      action: 'Uploaded Meter Data File',
      market,
      details: `${file.name} uploaded`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-segro-charcoal via-segro-charcoal to-segro-midgray rounded-2xl p-14 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-segro-red opacity-5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Sustainability Workbench</h1>
          <div className="flex items-center gap-2 text-segro-teal-accent">
            <div className="w-2 h-2 bg-segro-teal-accent rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold">Live orchestration monitoring</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Workflow Visualization */}
        <div className="lg:col-span-3 space-y-6">
          {/* Meter Data Transposition Workflow */}
          <div className="bg-segro-offwhite rounded-2xl p-4 border-2 border-segro-lightgray">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-segro-teal-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <h2 className="text-xl font-bold text-segro-charcoal">
                Meter Data Transposition for UL 360
              </h2>
            </div>
            <p className="text-segro-midgray text-sm mb-4">
              Import meter data from registries, validate exceptions, and upload to UL 360 platform
            </p>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Import New Meter Data Card */}
              <div className="bg-segro-teal/5 rounded-2xl p-4 border-l-4 border-segro-teal">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-segro-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-segro-charcoal">
                    Import New Meter Data
                  </div>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full bg-segro-teal text-white py-1.5 px-3 rounded-lg font-semibold text-sm hover:bg-segro-teal-accent transition-colors"
                  >
                    Import Data
                  </button>
                </div>
              </div>

              {/* UL 360 Upload Tasks */}
              <div
                onClick={() => navigate('/ul360-uploads')}
                className="bg-white rounded-2xl p-4 border border-segro-lightgray border-l-4 border-l-segro-teal cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-segro-teal-accent">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-segro-charcoal text-base mb-1">UL 360 Upload</div>
                    <div className="text-3xl font-bold text-segro-charcoal mb-1">
                      {ul360Tasks.length} <span className="text-base font-normal text-segro-midgray">tasks</span>
                    </div>
                    <div className="text-base text-segro-midgray">
                      {ul360Tasks.reduce((sum, task) => sum + (task.meterCount || 0), 0)} meters
                    </div>
                  </div>
                </div>
              </div>

              {/* Meter Exception Tasks */}
              <div
                onClick={() => navigate('/meter-exceptions')}
                className="bg-white rounded-2xl p-4 border border-segro-lightgray border-l-4 border-l-yellow-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-yellow-600">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-segro-charcoal text-base mb-1">Meter Exception</div>
                    <div className="text-3xl font-bold text-segro-charcoal mb-1">
                      {meterExceptionTasks.length} <span className="text-base font-normal text-segro-midgray">tasks</span>
                    </div>
                    <div className="text-base text-segro-midgray">
                      {meterExceptionTasks.reduce((sum, task) => sum + (task.missingMeterCount || 0), 0)} meters
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Validation Tasks */}
              <div
                onClick={() => navigate('/data-validation')}
                className="bg-white rounded-2xl p-4 border border-segro-lightgray border-l-4 border-l-yellow-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-yellow-600">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-segro-charcoal text-base mb-1">Data Validation</div>
                    <div className="text-3xl font-bold text-segro-charcoal mb-1">
                      {validationTasks.length} <span className="text-base font-normal text-segro-midgray">task</span>
                    </div>
                    <div className="text-base text-segro-midgray">
                      {validationTasks.reduce((sum, task) => sum + (task.meterCount || 0), 0)} meters
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Site Data Reconciliation */}
          <div className="bg-segro-offwhite rounded-2xl p-4 border-2 border-segro-lightgray">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-segro-teal-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-xl font-bold text-segro-charcoal">
                Site Data Reconciliation
              </h2>
            </div>
            <p className="text-segro-midgray text-sm mb-4">
              Import reconciliation data, validate admin tasks, and sync with UL 360
            </p>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Import Reconciliation Data Card */}
              <div className="bg-segro-teal/5 rounded-2xl p-4 border-l-4 border-segro-teal">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-segro-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-segro-charcoal">
                    Import Reconciliation Data
                  </div>
                  <button className="w-full bg-segro-teal text-white py-1.5 px-3 rounded-lg font-semibold text-sm hover:bg-segro-teal-accent transition-colors">
                    Import Data
                  </button>
                </div>
              </div>

              {/* Admin Validation Tasks */}
              <div className="bg-white rounded-2xl p-4 border border-segro-lightgray border-l-4 border-l-yellow-500">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-yellow-600">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-segro-charcoal text-base mb-1">Admin Validation</div>
                    <div className="text-3xl font-bold text-segro-charcoal mb-1">
                      3 <span className="text-base font-normal text-segro-midgray">tasks</span>
                    </div>
                    <div className="text-base text-segro-midgray">
                      22 meters
                    </div>
                  </div>
                </div>
              </div>

              {/* UL 360 Upload Tasks (Reconciliation) */}
              <div className="bg-white rounded-2xl p-4 border border-segro-lightgray border-l-4 border-l-segro-teal">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-segro-teal-accent">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-segro-charcoal text-base mb-1">UL 360 Upload</div>
                    <div className="text-3xl font-bold text-segro-charcoal mb-1">
                      1 <span className="text-base font-normal text-segro-midgray">task</span>
                    </div>
                    <div className="text-base text-segro-midgray">
                      5 meters
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Quality Scoreboard */}
          <Card accent="none">
            <h2 className="text-xl font-bold text-segro-charcoal mb-4">Data Quality Scoreboard</h2>
            <p className="text-segro-midgray text-sm mb-6">
              Overall data quality metrics by market
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {meterDataCycles.map((cycle) => (
                <div key={cycle.id} className="flex flex-col items-center">
                  <CircularProgress value={cycle.qualityScore} size={100} label={cycle.market} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Audit & Cycle Details */}
        <div className="space-y-6">
          {/* Process Audit Request */}
          <Card accent="teal" className="bg-gradient-to-br from-segro-teal to-segro-teal-accent text-white">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-bold">Process Audit Request</h3>
            </div>

            {!showAuditChat ? (
              <Button
                variant="primary"
                onClick={() => setShowAuditChat(true)}
                className="w-full !bg-segro-red !text-white hover:!bg-segro-red-dark"
              >
                Request Audit
              </Button>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={auditQuery}
                  onChange={(e) => setAuditQuery(e.target.value)}
                  placeholder="Ask about meter audits, data quality, or processing status..."
                  className="w-full h-24 p-3 rounded-lg text-segro-charcoal text-sm resize-none"
                  disabled={isProcessing}
                />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAuditRequest}
                    disabled={isProcessing || !auditQuery.trim()}
                    className="flex-1 !bg-segro-red !text-white hover:!bg-segro-red-dark"
                  >
                    {isProcessing ? 'Processing...' : 'Submit'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAuditChat(false);
                      setAuditQuery('');
                      setAuditResponse('');
                    }}
                    className="!border-white !text-white hover:!bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>

                {auditResponse && (
                  <div className="mt-3 p-4 bg-white rounded-lg text-segro-charcoal text-sm max-h-64 overflow-y-auto">
                    <div className="flex items-start gap-2 mb-2">
                      <svg className="w-5 h-5 text-segro-teal-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <div className="whitespace-pre-line">{auditResponse}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Meter Data Cycle Details */}
          <Card accent="none">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-segro-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="font-bold text-segro-charcoal">Meter Data Cycle Details</h3>
            </div>

            <div className="space-y-3">
              {meterDataCycles.slice(0, 8).map((cycle) => {
                // Determine alarm clock color based on status
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'current':
                      return 'text-green-500';
                    case 'pending':
                      return 'text-yellow-500';
                    case 'stale':
                      return 'text-red-500';
                    default:
                      return 'text-segro-midgray';
                  }
                };

                return (
                  <div
                    key={cycle.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-segro-lightgray"
                  >
                    <div className="flex items-center gap-3">
                      <MarketBadge market={cycle.market} />
                      <div>
                        <div className="text-sm text-segro-midgray">{cycle.date}</div>
                      </div>
                    </div>
                    <svg
                      className={`w-6 h-6 ${getStatusColor(cycle.status)}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {/* Alarm clock with bells */}
                      <path d="M12 6c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
                      <path d="M13 9h-2v4l3.5 2.1.7-1.2-2.2-1.3V9z" />
                      {/* Left bell */}
                      <path d="M4.5 4.5l-1.4 1.4 2.1 2.1 1.4-1.4z" />
                      {/* Right bell */}
                      <path d="M19.5 4.5l-2.1 2.1 1.4 1.4 2.1-2.1z" />
                      {/* Top button */}
                      <circle cx="12" cy="4" r="1" />
                    </svg>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-segro-lightgray">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-segro-teal-accent rounded-full"></div>
                  <span className="text-segro-midgray">Current month data uploaded</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-segro-midgray">Data pending processing for this month</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-segro-red rounded-full"></div>
                  <span className="text-segro-midgray">Data not processed in a month or more</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};
