import { ExternalLink, CheckCircle, RefreshCw, FileSpreadsheet, AlertTriangle } from 'lucide-react';

interface SuccessStateProps {
  filename: string;
  message?: string;
  sheetLink?: string;
  onViewSheet: () => void;
  onReset: () => void;
}

function SuccessState({ filename, message, sheetLink, onViewSheet, onReset }: SuccessStateProps) {
  return (
    <div className="text-center animate-scale-in">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75"></div>
        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-2">Processing Complete!</h2>
      <p className="text-gray-600 mb-4">Your screenshot has been processed and data extracted</p>
      {message && (
        <p className="text-sm text-gray-500 mb-8">{message}</p>
      )}

      <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl border-2 border-blue-200">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
            <FileSpreadsheet className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800">{filename}</p>
            <p className="text-sm text-gray-600">Data sent to Google Sheets</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-blue-200">
          <div>
            <div className="text-lg font-bold text-blue-600">Extracted</div>
            <div className="text-xs text-gray-600">Profile Data</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-600">Structured</div>
            <div className="text-xs text-gray-600">JSON Format</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">Synced</div>
            <div className="text-xs text-gray-600">Google Sheets</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onViewSheet}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-5 h-5" />
          View Google Sheet
        </button>
        <button
          onClick={onReset}
          className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600">
          Profile data has been extracted using AI vision and automatically synced to your Google Sheet
        </p>
        {sheetLink && (
          <p className="text-xs text-blue-600 mt-2 break-all">
            Sheet: <a href={sheetLink} target="_blank" rel="noopener noreferrer" className="underline">{sheetLink}</a>
          </p>
        )}
      </div>
    </div>
  );
}

export default SuccessState;
