import React, { useState } from 'react';
import { Card } from '../components/Card';
import { StatusPill } from '../components/StatusPill';
import { Button } from '../components/Button';
import { MarketBadge } from '../components/MarketBadge';
import { useStore } from '../store/useStore';
import { formatDateTime } from '../utils/dateFormat';

export const DataValidation: React.FC = () => {
  const { validationTasks, updateValidationTask, addActivityLog } = useStore();
  const [selectedTask, setSelectedTask] = useState(validationTasks[0]?.id || null);
  const [fixNote, setFixNote] = useState('');
  const [uploadedAudit, setUploadedAudit] = useState<File | null>(null);

  const currentTask = validationTasks.find((t) => t.id === selectedTask);

  const handleAuditUpload = () => {
    if (!currentTask || !uploadedAudit || !fixNote.trim()) return;

    updateValidationTask(currentTask.id, {
      auditFileUploaded: true,
      fixNote: fixNote,
      status: 'completed',
    });
    addActivityLog({
      actor: 'Human',
      action: 'Uploaded Manual Audit File',
      market: currentTask.market,
      taskId: currentTask.id,
      details: `Fix note: ${fixNote}`,
    });
    setFixNote('');
    setUploadedAudit(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedAudit(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-segro-charcoal mb-2">Data Validation Errors</h1>
        <p className="text-segro-midgray">
          Review data quality issues, add fix notes, and upload manual audit files
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="space-y-3">
          {validationTasks.map((task) => (
            <Card
              key={task.id}
              accent={task.status === 'attention' ? 'yellow' : task.status === 'completed' ? 'teal' : 'red'}
              hover
              onClick={() => setSelectedTask(task.id)}
              className={`cursor-pointer ${selectedTask === task.id ? 'ring-2 ring-segro-teal' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MarketBadge market={task.market} />
                  <StatusPill status={task.status} />
                </div>
              </div>
              <h3 className="font-bold text-segro-charcoal mb-2">{task.title}</h3>
              <div className="text-sm">
                <span className="text-segro-red font-bold">{task.meterCount}</span>
                <span className="text-segro-midgray"> meters affected</span>
              </div>
              <div className="mt-2 text-xs text-segro-midgray">
                <span className="font-semibold">{task.errorType}</span>
              </div>
            </Card>
          ))}

          {validationTasks.length === 0 && (
            <Card accent="teal">
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-segro-teal-accent mx-auto mb-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-segro-charcoal font-semibold">No validation errors</p>
                <p className="text-sm text-segro-midgray mt-1">All data quality checks passed</p>
              </div>
            </Card>
          )}
        </div>

        {/* Task Detail */}
        <div className="lg:col-span-2">
          {currentTask ? (
            <Card accent="yellow">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <MarketBadge market={currentTask.market} size="md" />
                    <h2 className="text-2xl font-bold text-segro-charcoal">{currentTask.title}</h2>
                  </div>
                  <p className="text-segro-midgray">{currentTask.description}</p>
                </div>
                <StatusPill status={currentTask.status} />
              </div>

              {/* Error Details */}
              <div className="bg-red-50 border-l-4 border-segro-red p-4 mb-6 rounded">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-segro-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">{currentTask.errorType}</h4>
                    <p className="text-sm text-red-800">{currentTask.errorDetails}</p>
                    <div className="mt-2 text-sm text-red-900">
                      <strong>{currentTask.meterCount} meters</strong> require attention
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white rounded-lg">
                <div>
                  <div className="text-xs text-segro-midgray mb-1">Detected</div>
                  <div className="text-sm font-semibold text-segro-charcoal">
                    {formatDateTime(currentTask.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-segro-midgray mb-1">Last Updated</div>
                  <div className="text-sm font-semibold text-segro-charcoal">
                    {formatDateTime(currentTask.updatedAt)}
                  </div>
                </div>
              </div>

              {/* Resolution Workflow */}
              {!currentTask.auditFileUploaded ? (
                <Card accent="none" className="bg-white">
                  <h3 className="font-bold text-segro-charcoal mb-4">Resolve Validation Error</h3>

                  <div className="space-y-4">
                    {/* Step 1: Review Errors */}
                    <div className="flex items-start gap-3 p-4 bg-segro-offwhite rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-segro-teal-accent text-white flex items-center justify-center font-bold flex-shrink-0">
                        ✓
                      </div>
                      <div>
                        <h4 className="font-bold text-segro-charcoal mb-1">Review Error Details</h4>
                        <p className="text-sm text-segro-midgray">
                          Analyze the {currentTask.meterCount} meters with {currentTask.errorType.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Add Fix Note */}
                    <div className="space-y-3">
                      <label className="block">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-segro-red text-white flex items-center justify-center font-bold text-sm">
                            2
                          </div>
                          <span className="font-bold text-segro-charcoal">What did you fix?</span>
                          <span className="text-segro-red text-sm">*</span>
                        </div>
                        <textarea
                          value={fixNote}
                          onChange={(e) => setFixNote(e.target.value)}
                          placeholder="Describe the corrections made to resolve the data quality issues..."
                          className="w-full h-24 p-3 border border-segro-lightgray rounded-lg text-sm resize-none focus:ring-2 focus:ring-segro-teal focus:border-transparent"
                        />
                      </label>
                    </div>

                    {/* Step 3: Upload Manual Audit */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-segro-red text-white flex items-center justify-center font-bold text-sm">
                          3
                        </div>
                        <span className="font-bold text-segro-charcoal">Upload Manual Audit File</span>
                        <span className="text-segro-red text-sm">*</span>
                      </div>
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-segro-midgray rounded-lg p-4 hover:border-segro-teal transition-colors">
                          <div className="flex items-center gap-3">
                            <svg
                              className="w-6 h-6 text-segro-midgray"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <div>
                              <div className="text-sm font-semibold text-segro-charcoal">
                                {uploadedAudit ? uploadedAudit.name : 'Drop audit file or click to browse'}
                              </div>
                              <div className="text-xs text-segro-midgray">Excel or PDF files</div>
                            </div>
                          </div>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".xlsx,.xls,.pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>

                    <Button
                      variant="secondary"
                      onClick={handleAuditUpload}
                      disabled={!fixNote.trim() || !uploadedAudit}
                      className="w-full"
                    >
                      Submit & Mark as Completed
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card accent="teal" className="bg-segro-teal-accent/5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-segro-teal-accent text-white flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-segro-charcoal mb-2">Task Completed</h3>
                      <p className="text-sm text-segro-midgray mb-3">
                        Validation errors have been resolved and manual audit file uploaded
                      </p>
                      {currentTask.fixNote && (
                        <div className="bg-white p-3 rounded-lg">
                          <div className="text-xs text-segro-midgray mb-1">Fix Note:</div>
                          <div className="text-sm text-segro-charcoal">{currentTask.fixNote}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          ) : validationTasks.length > 0 ? (
            <Card accent="none">
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-segro-midgray mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-segro-midgray">Select a task from the list to view details</p>
              </div>
            </Card>
          ) : (
            <Card accent="teal">
              <div className="text-center py-16">
                <svg
                  className="w-20 h-20 text-segro-teal-accent mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xl font-bold text-segro-charcoal mb-2">All Clear!</h3>
                <p className="text-segro-midgray">No data validation errors detected</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
