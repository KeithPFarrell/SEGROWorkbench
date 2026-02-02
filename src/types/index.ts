// Core types for SEGRO Sustainability Workbench

export type Market = 'UK' | 'CZ' | 'DE' | 'ES' | 'FR' | 'IT' | 'NL' | 'PL';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'attention' | 'stale';

export type CycleStatus = 'current' | 'pending' | 'stale';

export interface MeterDataCycle {
  id: string;
  market: Market;
  period: string; // e.g., "December 2025"
  date: string; // DD/MM/YY format
  status: CycleStatus;
  qualityScore: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  market: Market;
  status: TaskStatus;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  requiresDownload?: boolean;
  downloadCompleted?: boolean;
  uploadRequired?: boolean;
  uploadCompleted?: boolean;
  meterCount?: number;
  errorCount?: number;
  fixNote?: string;
}

export interface UL360Task extends Task {
  type: 'upload';
  fileUrl?: string;
  partialSuccess?: boolean;
  errorReportRequired?: boolean;
  errorReportUploaded?: boolean;
}

export interface MeterExceptionTask extends Task {
  type: 'meter-exception';
  missingMeterCount: number;
  exceptionFileGenerated?: boolean;
  registryImported?: boolean;
  reprocessingTriggered?: boolean;
}

export interface ValidationTask extends Task {
  type: 'validation';
  errorType: string;
  errorDetails: string;
  auditFileUploaded?: boolean;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  actor: 'Agent' | 'Human';
  username?: string; // For Human actors, stores the actual username
  action: string;
  market: Market;
  taskId?: string;
  details?: string;
}

export interface ArchiveFile {
  id: string;
  filename: string;
  cycle?: string;
  market: Market;
  generatedAt: string;
  size: string;
  type: 'upload' | 'exception' | 'audit';
  downloadUrl: string;
  fileData?: File; // Store the actual uploaded file
}

export interface WorkflowStage {
  id: string;
  title: string;
  description: string;
  taskCount: number;
  meterCount: number;
  status: 'success' | 'warning' | 'pending';
}

export interface AuditRequest {
  market: Market;
  query: string;
  response?: string;
}
