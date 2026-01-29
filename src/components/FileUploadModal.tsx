import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Market } from '../types';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, market: Market, cycle: string) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market>('UK');
  const [cycle, setCycle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const markets: Market[] = ['UK', 'CZ', 'DE', 'ES', 'FR', 'IT', 'NL', 'PL'];

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (validExtensions.includes(fileExtension)) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid Excel or CSV file (.xlsx, .xls, .csv)');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile && cycle.trim()) {
      onUpload(selectedFile, selectedMarket, cycle);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setCycle('');
    setSelectedMarket('UK');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-segro-teal p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-segro-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Import Meter Data</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Drop Zone */}
          <div>
            <label className="block text-sm font-semibold text-segro-charcoal mb-2">
              Select File
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-segro-teal bg-segro-teal/5 scale-105'
                  : 'border-segro-lightgray hover:border-segro-teal hover:bg-segro-teal/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-segro-teal/10 rounded-xl mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-segro-teal" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-segro-charcoal">{selectedFile.name}</p>
                    <p className="text-sm text-segro-midgray">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="text-sm text-segro-red hover:underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-segro-lightgray/50 rounded-xl mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-segro-midgray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-segro-charcoal">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-sm text-segro-midgray">
                      Supports Excel (.xlsx, .xls) and CSV files
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Market Selection */}
          <div>
            <label className="block text-sm font-semibold text-segro-charcoal mb-2">
              Market
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value as Market)}
              className="w-full px-4 py-3 border border-segro-lightgray rounded-lg focus:outline-none focus:ring-2 focus:ring-segro-teal focus:border-transparent"
            >
              {markets.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
          </div>

          {/* Cycle Input */}
          <div>
            <label className="block text-sm font-semibold text-segro-charcoal mb-2">
              Billing Cycle
            </label>
            <input
              type="text"
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              placeholder="e.g., January 2026"
              className="w-full px-4 py-3 border border-segro-lightgray rounded-lg focus:outline-none focus:ring-2 focus:ring-segro-teal focus:border-transparent"
            />
            <p className="text-xs text-segro-midgray mt-1">
              Enter the billing cycle period for this data
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleUploadClick}
              disabled={!selectedFile || !cycle.trim()}
              className="flex-1 !bg-segro-teal !text-white hover:!bg-segro-teal-accent disabled:!bg-segro-lightgray disabled:!text-segro-midgray"
            >
              Upload File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
