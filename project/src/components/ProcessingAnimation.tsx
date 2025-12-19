import { useEffect, useState } from 'react';
import { FileText, Scan, Database, CheckCircle2 } from 'lucide-react';

interface ProcessingAnimationProps {
  filename: string;
}

function ProcessingAnimation({ filename }: ProcessingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Scan, label: 'Analyzing Screenshot', color: 'blue' },
    { icon: FileText, label: 'Extracting Profiles', color: 'emerald' },
    { icon: Database, label: 'Structuring Data', color: 'orange' },
    { icon: CheckCircle2, label: 'Syncing to Sheets', color: 'green' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center animate-scale-in">
      <div className="relative mb-8">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full relative animate-pulse-slow">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 opacity-20 animate-ping"></div>

          <div className="relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`
                    absolute inset-0 flex items-center justify-center transition-all duration-500
                    ${index === currentStep ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                  `}
                >
                  <Icon className={`w-16 h-16 text-${step.color}-600`} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute -inset-4">
          <div className="w-full h-full rounded-full border-4 border-transparent border-t-blue-500 animate-spin-slow"></div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Document</h2>
      <p className="text-gray-600 mb-8">{filename}</p>

      <div className="space-y-3 max-w-md mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className={`
                flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                ${isActive ? `bg-${step.color}-50 border-2 border-${step.color}-300 scale-105` : 'bg-gray-50 border-2 border-transparent'}
              `}
            >
              <div
                className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive ? `bg-${step.color}-500` : isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <Icon className="w-5 h-5 text-white" />
                )}
              </div>

              <div className="flex-1 text-left">
                <p
                  className={`
                    font-semibold transition-colors duration-300
                    ${isActive ? `text-${step.color}-700` : 'text-gray-700'}
                  `}
                >
                  {step.label}
                </p>
              </div>

              {isActive && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-700">
          AI vision processing typically takes 5-15 seconds depending on image complexity
        </p>
      </div>
    </div>
  );
}

export default ProcessingAnimation;
