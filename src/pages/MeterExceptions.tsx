import React, { useState } from 'react';
import { Card } from '../components/Card';
import { StatusPill } from '../components/StatusPill';
import { Button } from '../components/Button';
import { MarketBadge } from '../components/MarketBadge';
import { useStore } from '../store/useStore';

export const MeterExceptions: React.FC = () => {
  const { meterExceptionTasks, updateMeterExceptionTask, addActivityLog } = useStore();
  const [selectedTask, setSelectedTask] = useState(meterExceptionTasks[0]?.id || null);
  const [uploadedRegistry, setUploadedRegistry] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentTask = meterExceptionTasks.find((t) => t.id === selectedTask);

  const handleGenerateException = async () => {
    if (!currentTask) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    updateMeterExceptionTask(currentTask.id, {
      exceptionFileGenerated: true,
    });
    addActivityLog({
      actor: 'Agent',
      action: 'Generated Exception File',
      market: currentTask.market,
      taskId: currentTask.id,
      details: `Exception file created for ${currentTask.missingMeterCount} missing meters`,
    });
    setIsProcessing(false);
  };

  const handleRegistryUpload = () => {
    if (!currentTask || !uploadedRegistry) return;

    updateMeterExceptionTask(currentTask.id, {
      registryImported: true,
    });
    addActivityLog({
      actor: 'Human',
      action: 'Imported Corrected Registry',
      market: currentTask.market,
      taskId: currentTask.id,
      details: `Uploaded registry file: ${uploadedRegistry.name}`,
    });
    setUploadedRegistry(null);
  };

  const handleReprocess = async () => {
    if (!currentTask) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    updateMeterExceptionTask(currentTask.id, {
      reprocessingTriggered: true,
      status: 'completed',
    });
    addActivityLog({
      actor: 'Agent',
      action: 'Reprocessed Meter Data',
      market: currentTask.market,
      taskId: currentTask.id,
      details: `Reprocessing ${currentTask.missingMeterCount} meters after registry update`,
    });
    setIsProcessing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedRegistry(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-segro-charcoal mb-2">Meter Registry Exceptions</h1>
        <p className="text-segro-midgray">
          Identify missing meters, download exception files, and import corrected registries from UL 360
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="space-y-3">
          {meterExceptionTasks.map((task) => (
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
                <span className="text-segro-red font-bold">{task.missingMeterCount}</span>
                <span className="text-segro-midgray"> missing meters</span>
              </div>
            </Card>
          ))}
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

              {/* Alert */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-1">Missing Meters Detected</h4>
                    <p className="text-sm text-yellow-800">
                      The agent has identified <strong>{currentTask.missingMeterCount} meters</strong> that are missing
                      from the UL 360 registry. These must be resolved before meter data can be uploaded.
                    </p>
                  </div>
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-4">
                {/* Step 1: Identify Missing Meters */}
                <Card accent="teal" className="bg-segro-teal-accent/5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-segro-teal-accent text-white flex items-center justify-center font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-segro-charcoal mb-2">Identify Missing Meters</h4>
                      <p className="text-sm text-segro-midgray mb-2">
                        Agent automatically detected missing meters during data validation
                      </p>
                      <div className="text-sm text-segro-teal-accent font-semibold">
                        Identified {currentTask.missingMeterCount} missing meters
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Step 2: Generate Exception File */}
                <Card
                  accent={currentTask.exceptionFileGenerated ? 'teal' : 'none'}
                  className={currentTask.exceptionFileGenerated ? 'bg-segro-teal-accent/5' : 'bg-white'}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                        currentTask.exceptionFileGenerated
                          ? 'bg-segro-teal-accent text-white'
                          : 'bg-segro-red text-white'
                      }`}
                    >
                      {currentTask.exceptionFileGenerated ? '✓' : '2'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-segro-charcoal mb-2">Download Exception File</h4>
                      <p className="text-sm text-segro-midgray mb-3">
                        Generate and download a file listing all missing meters for UL 360 review
                      </p>
                      {!currentTask.exceptionFileGenerated && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleGenerateException}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Generating...' : 'Download Exception File'}
                        </Button>
                      )}
                      {currentTask.exceptionFileGenerated && (
                        <div className="text-sm text-segro-teal-accent font-semibold">
                          Exception file downloaded successfully
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Step 3: Import Corrected Registry */}
                <Card
                  accent={currentTask.registryImported ? 'teal' : 'none'}
                  className={`${
                    !currentTask.exceptionFileGenerated
                      ? 'opacity-50'
                      : currentTask.registryImported
                      ? 'bg-segro-teal-accent/5'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                        currentTask.registryImported
                          ? 'bg-segro-teal-accent text-white'
                          : currentTask.exceptionFileGenerated
                          ? 'bg-segro-red text-white'
                          : 'bg-segro-lightgray text-segro-midgray'
                      }`}
                    >
                      {currentTask.registryImported ? '✓' : '3'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-segro-charcoal mb-2">Import Corrected Registry from UL 360</h4>
                      <p className="text-sm text-segro-midgray mb-3">
                        After adding the missing meters in UL 360, import the updated registry file
                      </p>
                      {currentTask.exceptionFileGenerated && !currentTask.registryImported && (
                        <div className="space-y-3">
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
                                    {uploadedRegistry ? uploadedRegistry.name : 'Drop registry file or click to browse'}
                                  </div>
                                  <div className="text-xs text-segro-midgray">Excel files from UL 360</div>
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
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleRegistryUpload}
                            disabled={!uploadedRegistry}
                          >
                            Import Registry
                          </Button>
                        </div>
                      )}
                      {currentTask.registryImported && (
                        <div className="text-sm text-segro-teal-accent font-semibold">
                          Registry imported successfully
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Step 4: Reprocess Meter Data */}
                <Card
                  accent={currentTask.reprocessingTriggered ? 'teal' : 'none'}
                  className={`${
                    !currentTask.registryImported
                      ? 'opacity-50'
                      : currentTask.reprocessingTriggered
                      ? 'bg-segro-teal-accent/5'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                        currentTask.reprocessingTriggered
                          ? 'bg-segro-teal-accent text-white'
                          : currentTask.registryImported
                          ? 'bg-segro-red text-white'
                          : 'bg-segro-lightgray text-segro-midgray'
                      }`}
                    >
                      {currentTask.reprocessingTriggered ? '✓' : '4'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-segro-charcoal mb-2">Reprocess Meter Data</h4>
                      <p className="text-sm text-segro-midgray mb-3">
                        Trigger the agent to reprocess meter data with the updated registry
                      </p>
                      {currentTask.registryImported && !currentTask.reprocessingTriggered && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleReprocess}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Reprocess Meter Data'}
                        </Button>
                      )}
                      {currentTask.reprocessingTriggered && (
                        <div className="text-sm text-segro-teal-accent font-semibold">
                          Task completed - Meters reprocessed successfully
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-segro-midgray">Select a task from the list to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
