import { useState } from 'react';
import { Upload, AlertCircle, Sparkles } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ProcessingAnimation from './components/ProcessingAnimation';
import SuccessState from './components/SuccessState';

type AppState = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

interface UploadResult {
  filename: string;
  message?: string;
  sheetLink?: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleFileSelect = async (file: File) => {
    setAppState('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload/extract`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Upload failed');
      }

      const data = await response.json();

      // Backend returns 202 Accepted with processing status
      setUploadResult({
        filename: data.filename || file.name,
        message: data.message || 'Screenshot accepted for processing',
      });

      // Show processing state, then complete after a delay
      // (Since backend processes in background and pushes to Google Sheets)
      setTimeout(() => {
        setAppState('processing');
        // Simulate processing time, then show success
        setTimeout(() => {
          setAppState('completed');
        }, 3000); // Adjust based on typical processing time
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setAppState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    }
  };

  const handleViewSheet = () => {
    // Open Google Sheet link (if available) or show message
    if (uploadResult?.sheetLink) {
      window.open(uploadResult.sheetLink, '_blank');
    } else {
      // Show message that data has been sent to Google Sheets
      alert('Your data has been processed and sent to Google Sheets. Check your configured sheet link.');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setUploadResult(null);
    setUploadProgress(0);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl mb-6 shadow-lg animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Profile Extractor
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Extract LinkedIn profile data from screenshots using AI vision and sync to Google Sheets
          </p>
        </header>

        <main className="bg-white rounded-3xl shadow-xl p-8 md:p-12 backdrop-blur-sm bg-opacity-90 border border-gray-100">
          {appState === 'idle' && (
            <FileUpload onFileSelect={handleFileSelect} />
          )}

          {appState === 'uploading' && (
            <div className="text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
                <Upload className="w-12 h-12 text-blue-600 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Uploading Document</h2>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-600">{uploadProgress}% complete</p>
            </div>
          )}

          {appState === 'processing' && (
            <ProcessingAnimation filename={uploadResult?.filename || ''} />
          )}

          {appState === 'completed' && (
            <SuccessState
              filename={uploadResult?.filename || ''}
              message={uploadResult?.message}
              sheetLink={uploadResult?.sheetLink}
              onViewSheet={handleViewSheet}
              onReset={handleReset}
            />
          )}

          {appState === 'error' && (
            <div className="text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Failed</h2>
              <p className="text-gray-600 mb-8">{errorMessage}</p>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          )}
        </main>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Qwen2.5-VL • AI-Powered Extraction • Data sent to Google Sheets</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
