import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MarketBadge } from '../components/MarketBadge';
import { formatDateTime } from '../utils/dateFormat';
import { Market } from '../types';
import { useStore } from '../store/useStore';
import * as XLSX from 'xlsx';

export const FilesArchive: React.FC = () => {
  const [filterMarket, setFilterMarket] = useState<Market | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'upload' | 'exception' | 'audit'>('all');
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const { archiveFiles } = useStore();
  const markets: Market[] = ['UK', 'CZ', 'DE', 'ES', 'FR', 'IT', 'NL', 'PL'];

  const handleDownload = (file: typeof archiveFiles[0]) => {
    // Generate realistic meter data based on file type and market
    const generateMeterData = () => {
      // Generate 50-100 rows of realistic meter data
      const rowCount = Math.floor(Math.random() * 51) + 50;
      const meterType = file.filename.toLowerCase().includes('gas') ? 'Gas' : 'Electricity';
      const valueUnits = meterType === 'Gas' ? 'kWh (gas)' : 'kWh (electricity)';

      const data = [];
      for (let i = 0; i < rowCount; i++) {
        data.push({
          'Meter Name': `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          'Region SID': `${Math.floor(Math.random() * 90000000) + 10000000}`,
          'Start date': '01/12/2025',
          'End date': '31/12/2025',
          'Value': Math.floor(Math.random() * 5000),
          'Meter Type': meterType,
          'Value Units': valueUnits
        });
      }

      return data;
    };

    const generateExceptionData = () => {
      const exceptionTypes = ['Missing Meter', 'Invalid Reading', 'Duplicate Entry', 'Data Gap'];
      const statuses = ['Open', 'In Progress', 'Resolved'];
      const rowCount = Math.floor(Math.random() * 31) + 20;

      const data = [];
      for (let i = 0; i < rowCount; i++) {
        data.push({
          'Meter ID': `MTR-${Math.floor(Math.random() * 900000) + 100000}`,
          'Site Name': `Site ${Math.floor(Math.random() * 500) + 1}`,
          'Exception Type': exceptionTypes[Math.floor(Math.random() * exceptionTypes.length)],
          'Status': statuses[Math.floor(Math.random() * statuses.length)],
          'Notes': `Exception detected on ${new Date().toLocaleDateString('en-GB')}`
        });
      }

      return data;
    };

    const generateAuditData = () => {
      const actions = ['File Upload', 'Data Validation', 'Exception Resolution', 'Audit Review', 'Data Export'];
      const users = ['System Agent', 'ESG Manager', 'Data Analyst', 'Compliance Officer'];
      const rowCount = Math.floor(Math.random() * 41) + 30;

      const data = [];
      for (let i = 0; i < rowCount; i++) {
        const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        data.push({
          'Timestamp': timestamp.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          'User': users[Math.floor(Math.random() * users.length)],
          'Action': actions[Math.floor(Math.random() * actions.length)],
          'Market': file.market,
          'Details': `${actions[Math.floor(Math.random() * actions.length)]} completed successfully`
        });
      }

      return data;
    };

    // Determine content type and generate appropriate data
    let data: any[];

    if (file.type === 'upload') {
      data = generateMeterData();
    } else if (file.type === 'exception') {
      data = generateExceptionData();
    } else if (file.type === 'audit') {
      data = generateAuditData();
    } else {
      data = generateMeterData();
    }

    // Create Excel workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Set column widths for better readability
    const columnWidths = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
    worksheet['!cols'] = columnWidths;

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, file.filename);
  };

  const filteredFiles = archiveFiles.filter((file) => {
    const matchesMarket = filterMarket === 'all' || file.market === filterMarket;
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesMarket && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'exception':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'audit':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'upload':
        return 'text-segro-teal-accent bg-segro-teal-accent/10';
      case 'exception':
        return 'text-yellow-600 bg-yellow-50';
      case 'audit':
        return 'text-segro-red bg-segro-red/10';
      default:
        return 'text-segro-midgray bg-segro-lightgray';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-segro-charcoal mb-2">Files Archive</h1>
        <p className="text-segro-midgray">
          Library of generated upload files sorted by cycle and market
        </p>
      </div>

      {/* Filters */}
      <Card accent="none">
        <div className="flex flex-wrap items-center gap-4">
          {/* Market Filter */}
          <div>
            <label className="block text-xs font-semibold text-segro-midgray mb-2">FILTER BY MARKET</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterMarket('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filterMarket === 'all'
                    ? 'bg-segro-red text-white'
                    : 'bg-segro-offwhite text-segro-midgray hover:bg-segro-lightgray'
                }`}
              >
                All
              </button>
              {markets.map((market) => (
                <button
                  key={market}
                  onClick={() => setFilterMarket(market)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    filterMarket === market
                      ? 'bg-segro-red text-white'
                      : 'bg-segro-offwhite text-segro-midgray hover:bg-segro-lightgray'
                  }`}
                >
                  {market}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-12 bg-segro-lightgray"></div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-segro-midgray mb-2">FILTER BY TYPE</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filterType === 'all'
                    ? 'bg-segro-red text-white'
                    : 'bg-segro-offwhite text-segro-midgray hover:bg-segro-lightgray'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('upload')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filterType === 'upload'
                    ? 'bg-segro-red text-white'
                    : 'bg-segro-offwhite text-segro-midgray hover:bg-segro-lightgray'
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setFilterType('exception')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filterType === 'exception'
                    ? 'bg-segro-red text-white'
                    : 'bg-segro-offwhite text-segro-midgray hover:bg-segro-lightgray'
                }`}
              >
                Exception
              </button>
              <button
                onClick={() => setFilterType('audit')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filterType === 'audit'
                    ? 'bg-segro-red text-white'
                    : 'bg-segro-offwhite text-segro-midgray hover:bg-segro-lightgray'
                }`}
              >
                Audit
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <Card key={file.id} accent="none" hover>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getTypeColor(file.type)}`}>
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <MarketBadge market={file.market} size="sm" />
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${getTypeColor(file.type)}`}
                    >
                      {file.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-segro-charcoal text-sm mb-1 truncate" title={file.filename}>
                    {file.filename}
                  </h3>
                  <div className="text-xs text-segro-midgray mb-3">
                    <div>{file.cycle}</div>
                    <div>{formatDateTime(file.generatedAt)}</div>
                    <div className="font-semibold">{file.size}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewFile(file.id)}
                      className="flex-1 text-xs"
                    >
                      Preview
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(file)}
                      className="flex-1 text-xs"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-segro-midgray">No files match the selected filters</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-segro-charcoal/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >
          <Card accent="teal" className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-segro-charcoal">File Preview</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-segro-midgray hover:text-segro-charcoal"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-segro-lightgray rounded-lg p-8 text-center">
              <svg className="w-16 h-16 text-segro-midgray mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-segro-midgray">File preview would be displayed here</p>
              <p className="text-sm text-segro-midgray mt-2">
                {archiveFiles.find((f) => f.id === previewFile)?.filename}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={() => setPreviewFile(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
