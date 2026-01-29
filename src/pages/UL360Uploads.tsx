import React, { useState } from 'react';
import { Card } from '../components/Card';
import { StatusPill } from '../components/StatusPill';
import { Button } from '../components/Button';
import { MarketBadge } from '../components/MarketBadge';
import { useStore } from '../store/useStore';
import { formatDateTime } from '../utils/dateFormat';

export const UL360Uploads: React.FC = () => {
  const { ul360Tasks, updateUL360Task, addActivityLog } = useStore();
  const [selectedTask, setSelectedTask] = useState(ul360Tasks[0]?.id || null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const currentTask = ul360Tasks.find((t) => t.id === selectedTask);

  const handleDownload = () => {
    if (!currentTask) return;

    // Simulate download
    updateUL360Task(currentTask.id, { downloadCompleted: true });
    addActivityLog({
      actor: 'Human',
      action: 'Downloaded Upload File',
      market: currentTask.market,
      taskId: currentTask.id,
      details: currentTask.title,
    });
  };

  const handleUploadSuccess = () => {
    if (!currentTask) return;

    updateUL360Task(currentTask.id, {
      uploadCompleted: true,
      status: 'completed',
    });
    addActivityLog({
      actor: 'Human',
      action: 'Upload Successful',
      market: currentTask.market,
      taskId: currentTask.id,
      details: `Successfully uploaded ${currentTask.meterCount} meters`,
    });
  };

  const handleUploadPartial = () => {
    if (!currentTask) return;

    updateUL360Task(currentTask.id, {
      uploadCompleted: true,
      partialSuccess: true,
      errorReportRequired: true,
      status: 'attention',
    });
    addActivityLog({
      actor: 'Agent',
      action: 'Detected Partial Upload Success',
      market: currentTask.market,
      taskId: currentTask.id,
      details: `Upload completed with ${currentTask.errorCount || 0} errors requiring attention`,
    });
  };

  const handleErrorReportUpload = () => {
    if (!currentTask || !uploadedFile) return;

    updateUL360Task(currentTask.id, {
      errorReportUploaded: true,
      status: 'completed',
    });
    addActivityLog({
      actor: 'Human',
      action: 'Uploaded Error Report',
      market: currentTask.market,
      taskId: currentTask.id,
      details: `Uploaded correction file: ${uploadedFile.name}`,
    });
    setUploadedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Left Panel - Task List */}
      <div className="lg:col-span-1 overflow-y-auto">
        <h2 className="text-2xl font-bold text-segro-charcoal mb-4">UL 360 Upload Tasks</h2>
        <div className="space-y-3">
          {ul360Tasks.map((task) => (
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
              <p className="text-sm text-segro-midgray mb-3">{task.description}</p>
              <div className="flex gap-4 text-xs text-segro-midgray">
                <span>
                  <strong className="text-segro-charcoal">{task.meterCount}</strong> meters
                </span>
                {task.errorCount && (
                  <span className="text-segro-red">
                    <strong>{task.errorCount}</strong> errors
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Panel - Task Detail */}
      <div className="lg:col-span-2 overflow-y-auto">
        {currentTask ? (
          <Card accent="teal">
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

            {/* Task Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white rounded-lg">
              <div>
                <div className="text-xs text-segro-midgray mb-1">Created</div>
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
              <div>
                <div className="text-xs text-segro-midgray mb-1">Meter Count</div>
                <div className="text-sm font-semibold text-segro-charcoal">{currentTask.meterCount}</div>
              </div>
              {currentTask.errorCount && (
                <div>
                  <div className="text-xs text-segro-midgray mb-1">Error Count</div>
                  <div className="text-sm font-semibold text-segro-red">{currentTask.errorCount}</div>
                </div>
              )}
            </div>

            {/* Workflow Steps */}
            <div className="space-y-4">
              {/* Step 1: Download */}
              <Card
                accent={currentTask.downloadCompleted ? 'teal' : 'none'}
                className={`${!currentTask.downloadCompleted ? 'bg-white' : 'bg-segro-teal-accent/5'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          currentTask.downloadCompleted
                            ? 'bg-segro-teal-accent text-white'
                            : 'bg-segro-lightgray text-segro-midgray'
                        }`}
                      >
                        1
                      </div>
                      <h4 className="font-bold text-segro-charcoal">Download Upload File</h4>
                    </div>
                    <p className="text-sm text-segro-midgray ml-11 mb-3">
                      Download the generated meter data file for UL 360 upload
                    </p>
                    {!currentTask.downloadCompleted && (
                      <div className="ml-11">
                        <Button variant="primary" size="sm" onClick={handleDownload}>
                          Download File
                        </Button>
                      </div>
                    )}
                    {currentTask.downloadCompleted && (
                      <div className="ml-11 flex items-center gap-2 text-segro-teal-accent text-sm font-semibold">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Download completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Step 2: Upload to UL 360 */}
              <Card
                accent={currentTask.uploadCompleted ? 'teal' : 'none'}
                className={`${
                  !currentTask.downloadCompleted
                    ? 'opacity-50'
                    : currentTask.uploadCompleted
                    ? 'bg-segro-teal-accent/5'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          currentTask.uploadCompleted
                            ? 'bg-segro-teal-accent text-white'
                            : currentTask.downloadCompleted
                            ? 'bg-segro-red text-white'
                            : 'bg-segro-lightgray text-segro-midgray'
                        }`}
                      >
                        2
                      </div>
                      <h4 className="font-bold text-segro-charcoal">Upload to UL 360</h4>
                    </div>
                    <p className="text-sm text-segro-midgray ml-11 mb-3">
                      Upload the file to UL 360 platform and report the result
                    </p>
                    {currentTask.downloadCompleted && !currentTask.uploadCompleted && (
                      <div className="ml-11 flex gap-2">
                        <Button variant="secondary" size="sm" onClick={handleUploadSuccess}>
                          Upload Successful
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleUploadPartial}>
                          Partial Success
                        </Button>
                      </div>
                    )}
                    {currentTask.uploadCompleted && !currentTask.partialSuccess && (
                      <div className="ml-11 flex items-center gap-2 text-segro-teal-accent text-sm font-semibold">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Upload completed successfully</span>
                      </div>
                    )}
                    {currentTask.partialSuccess && (
                      <div className="ml-11 flex items-center gap-2 text-yellow-600 text-sm font-semibold">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Partial success - error report required</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Step 3: Upload Error Report (conditional) */}
              {currentTask.partialSuccess && currentTask.errorReportRequired && (
                <Card
                  accent={currentTask.errorReportUploaded ? 'teal' : 'yellow'}
                  className={`${currentTask.errorReportUploaded ? 'bg-segro-teal-accent/5' : 'bg-yellow-50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            currentTask.errorReportUploaded
                              ? 'bg-segro-teal-accent text-white'
                              : 'bg-yellow-500 text-white'
                          }`}
                        >
                          3
                        </div>
                        <h4 className="font-bold text-segro-charcoal">Upload Error Correction File</h4>
                      </div>
                      <p className="text-sm text-segro-midgray ml-11 mb-3">
                        Upload a corrected file for the {currentTask.errorCount} meters that failed
                      </p>
                      {!currentTask.errorReportUploaded && (
                        <div className="ml-11 space-y-3">
                          <div className="flex items-center gap-3">
                            <label className="flex-1 cursor-pointer">
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
                                      {uploadedFile ? uploadedFile.name : 'Drop file here or click to browse'}
                                    </div>
                                    <div className="text-xs text-segro-midgray">Excel files only</div>
                                  </div>
                                </div>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                              />
                            </label>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleErrorReportUpload}
                            disabled={!uploadedFile}
                          >
                            Upload & Complete
                          </Button>
                        </div>
                      )}
                      {currentTask.errorReportUploaded && (
                        <div className="ml-11 flex items-center gap-2 text-segro-teal-accent text-sm font-semibold">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Task completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </Card>
        ) : (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-segro-midgray">Select a task from the list to view details</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
