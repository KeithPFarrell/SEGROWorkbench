import {
  MeterDataCycle,
  UL360Task,
  MeterExceptionTask,
  ValidationTask,
  ActivityLogEntry,
  ArchiveFile,
  WorkflowStage
} from '../types';

// Meter Data Cycles for European Markets
export const meterDataCycles: MeterDataCycle[] = [
  { id: '1', market: 'UK', period: 'January 2026', date: '28/01/26', status: 'current', qualityScore: 98 },
  { id: '2', market: 'CZ', period: 'December 2025', date: '01/12/25', status: 'pending', qualityScore: 95 },
  { id: '3', market: 'DE', period: 'November 2025', date: '15/11/25', status: 'stale', qualityScore: 87 },
  { id: '4', market: 'FR', period: 'October 2025', date: '08/10/25', status: 'stale', qualityScore: 73 },
  { id: '5', market: 'PL', period: 'October 2025', date: '12/10/25', status: 'stale', qualityScore: 71 },
  { id: '6', market: 'NL', period: 'September 2025', date: '22/09/25', status: 'stale', qualityScore: 76 },
  { id: '7', market: 'ES', period: 'October 2025', date: '03/10/25', status: 'stale', qualityScore: 70 },
  { id: '8', market: 'IT', period: 'November 2025', date: '18/11/25', status: 'stale', qualityScore: 78 },
];

// UL360 Upload Tasks
export const ul360Tasks: UL360Task[] = [
  {
    id: 'ul360-1',
    type: 'upload',
    title: 'Upload to UL360',
    description: 'Upload meter data for consumption',
    market: 'UK',
    status: 'pending',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
    requiresDownload: true,
    downloadCompleted: false,
    uploadRequired: true,
    uploadCompleted: false,
    meterCount: 608,
    fileUrl: '/api/download/uk-dec-2025-electricity.xlsx',
  },
];

// Meter Registry Exception Tasks
export const meterExceptionTasks: MeterExceptionTask[] = [
  {
    id: 'exception-1',
    type: 'meter-exception',
    title: 'Meter Registry Exceptions',
    description: 'Identify and resolve missing meters in UK registry',
    market: 'UK',
    status: 'attention',
    createdAt: '2026-01-12T10:15:00Z',
    updatedAt: '2026-01-19T11:30:00Z',
    missingMeterCount: 30,
    meterCount: 30,
    exceptionFileGenerated: false,
    registryImported: false,
    reprocessingTriggered: false,
  },
];

// Data Validation Error Tasks
export const validationTasks: ValidationTask[] = [
  {
    id: 'validation-1',
    type: 'validation',
    title: 'Data Validation Errors',
    description: 'Review and correct the data validation errors flagged below.',
    market: 'UK',
    status: 'attention',
    createdAt: '2026-01-17T10:00:00Z',
    updatedAt: '2026-01-20T09:15:00Z',
    errorType: 'Data Validation Errors',
    errorDetails: '8 meters have data issues and have not been included in the UL360 upload file. These meters can\'t be processed until the validation errors have been reviewed and corrected.',
    meterCount: 8,
    auditFileUploaded: false,
  },
];

// Activity Log
export const activityLog: ActivityLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-01-20T14:35:00Z',
    actor: 'Agent',
    action: 'Generated UK Electricity Upload File',
    market: 'UK',
    taskId: 'ul360-1',
    details: '345 meters processed successfully',
  },
  {
    id: 'log-2',
    timestamp: '2026-01-20T13:22:00Z',
    actor: 'Human',
    username: 'David Dunbar',
    action: 'Uploaded Error Report',
    market: 'CZ',
    taskId: 'ul360-2',
    details: 'Uploaded correction file for 12 failed meters',
  },
  {
    id: 'log-3',
    timestamp: '2026-01-20T11:45:00Z',
    actor: 'Agent',
    action: 'Detected Missing Meters',
    market: 'UK',
    taskId: 'exception-1',
    details: 'Identified 17 meters missing from registry',
  },
  {
    id: 'log-4',
    timestamp: '2026-01-20T09:15:00Z',
    actor: 'Human',
    username: 'Stefan Butler',
    action: 'Reviewed Data Validation Errors',
    market: 'UK',
    taskId: 'validation-1',
    details: 'Reviewed 12 meters with missing values',
  },
  {
    id: 'log-5',
    timestamp: '2026-01-19T16:30:00Z',
    actor: 'Agent',
    action: 'Triggered Data Reprocessing',
    market: 'FR',
    taskId: 'exception-3',
    details: 'Reprocessing 23 meters after registry update',
  },
  {
    id: 'log-6',
    timestamp: '2026-01-19T14:20:00Z',
    actor: 'Human',
    username: 'Gabriella Zepf',
    action: 'Downloaded Upload File',
    market: 'UK',
    taskId: 'ul360-1',
    details: 'UK December 2025 electricity upload file',
  },
  {
    id: 'log-7',
    timestamp: '2026-01-18T14:22:00Z',
    actor: 'Agent',
    action: 'Detected Partial Upload Success',
    market: 'CZ',
    taskId: 'ul360-2',
    details: 'Upload completed with 12 errors requiring attention',
  },
  {
    id: 'log-8',
    timestamp: '2026-01-17T16:45:00Z',
    actor: 'Agent',
    action: 'Generated Exception File',
    market: 'FR',
    taskId: 'exception-3',
    details: 'Exception file created for 23 missing meters',
  },
];

// Files Archive
export const archiveFiles: ArchiveFile[] = [
  {
    id: 'file-1',
    filename: 'UL360 Upload File - 2026-01-19.csv',
    cycle: 'December 2025',
    market: 'UK',
    generatedAt: '2026-01-19T14:35:00Z',
    size: '2.3 MB',
    type: 'upload',
    downloadUrl: '/api/files/uk-dec-2025.xlsx',
  },
  {
    id: 'file-2',
    filename: 'CZ Gas Exception Report - November 25.xlsx',
    cycle: 'November 2025',
    market: 'CZ',
    generatedAt: '2026-01-18T11:20:00Z',
    size: '1.1 MB',
    type: 'exception',
    downloadUrl: '/api/files/cz-nov-2025-exceptions.xlsx',
  },
  {
    id: 'file-3',
    filename: 'FR Missing Meters Exception - October 25.xlsx',
    cycle: 'October 2025',
    market: 'FR',
    generatedAt: '2026-01-17T16:45:00Z',
    size: '890 KB',
    type: 'exception',
    downloadUrl: '/api/files/fr-oct-2025-exceptions.xlsx',
  },
  {
    id: 'file-4',
    filename: 'UK Data Quality Audit - December 25.pdf',
    cycle: 'December 2025',
    market: 'UK',
    generatedAt: '2026-01-20T09:00:00Z',
    size: '456 KB',
    type: 'audit',
    downloadUrl: '/api/files/uk-dec-2025-audit.pdf',
  },
  {
    id: 'file-5',
    filename: 'UL360 Upload File - 2026-01-15.csv',
    cycle: 'November 2025',
    market: 'DE',
    generatedAt: '2026-01-15T10:30:00Z',
    size: '3.1 MB',
    type: 'upload',
    downloadUrl: '/api/files/de-nov-2025.xlsx',
  },
];

// Workflow Stages for Dashboard
export const workflowStages: WorkflowStage[] = [
  {
    id: 'import',
    title: 'Import New Meter Data',
    description: 'Import country meter data, validate exceptions, and upload to UL360 platform',
    taskCount: 2,
    meterCount: 8,
    status: 'success',
  },
  {
    id: 'ul360-upload',
    title: 'UL360 Upload Tasks',
    description: 'Process and upload meter consumption data to UL360',
    taskCount: 2,
    meterCount: 525,
    status: 'success',
  },
  {
    id: 'exceptions',
    title: 'Meter Exception Tasks',
    description: 'Resolve missing meters and registry discrepancies',
    taskCount: 5,
    meterCount: 81,
    status: 'warning',
  },
  {
    id: 'validation',
    title: 'Data Validation Tasks',
    description: 'Review and correct data quality issues',
    taskCount: 1,
    meterCount: 12,
    status: 'warning',
  },
];
