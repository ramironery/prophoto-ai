
import React, { useState, useCallback, useRef } from 'react';
import { AppStatus, GenerationResult } from './types';
import { transformImage } from './geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file.");
      return;
    }

    setStatus(AppStatus.GENERATING);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      try {
        const transformedUrl = await transformImage(base64Data, file.type);
        setResult({
          originalUrl: base64Data,
          imageUrl: transformedUrl
        });
        setStatus(AppStatus.SUCCESS);
      } catch (err) {
        setError("Transformation failed. Please try again later.");
        setStatus(AppStatus.ERROR);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      setStatus(AppStatus.ERROR);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ProPhoto AI</h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Examples</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Elevate Your <span className="text-blue-600">Professional Identity</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transform casual photos into stunning, LinkedIn-ready professional headshots in seconds. AI-powered suit fitting and posture correction.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          {status === AppStatus.IDLE || status === AppStatus.ERROR ? (
            <div className="p-12 text-center">
              <div 
                onClick={triggerFileInput}
                className="group cursor-pointer border-2 border-dashed border-slate-200 rounded-xl p-16 transition-all hover:border-blue-400 hover:bg-blue-50/50"
              >
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload your photo</h3>
                <p className="text-slate-500 mb-6">Drag and drop or click to browse files</p>
                <div className="flex justify-center gap-4 text-xs font-medium text-slate-400">
                  <span className="bg-slate-100 px-3 py-1 rounded-full">JPG</span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full">PNG</span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full">WEBP</span>
                </div>
              </div>
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
                accept="image/*"
              />
            </div>
          ) : status === AppStatus.GENERATING ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Crafting your professional look...</h3>
              <p className="text-slate-500 max-w-sm">
                Our AI is currently tailoring your suit, adjusting your posture, and optimizing the lighting for a perfect headshot.
              </p>
              <div className="mt-8 flex gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Comparison View */}
                <div className="space-y-6">
                  <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner aspect-square">
                    <img 
                      src={result?.imageUrl} 
                      alt="Transformed Profile" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      Professional Result
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = result?.imageUrl || '';
                          link.download = 'professional-headshot.png';
                          link.click();
                        }}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download HD
                      </button>
                      <button 
                        onClick={reset}
                        className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all active:scale-95"
                      >
                        Try Another
                      </button>
                    </div>
                  </div>
                </div>

                {/* Benefits/Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Your New Professional Identity</h3>
                    <p className="text-slate-600 leading-relaxed">
                      We've analyzed your original photo and enhanced it with:
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { title: "Smart Suit Fitting", desc: "Digital tailoring for a perfectly aligned business suit.", icon: "👔" },
                      { title: "Posture Correction", desc: "Subtle adjustments to make you look more confident and engaged.", icon: "🧍" },
                      { title: "Studio Lighting", desc: "Optimized brightness and contrast for professional clarity.", icon: "💡" },
                      { title: "Premium Background", desc: "Modern office aesthetic for immediate visual impact.", icon: "🏢" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                        <div className="text-2xl">{item.icon}</div>
                        <div>
                          <h4 className="font-bold text-slate-800">{item.title}</h4>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-slate-400 text-sm">
          <p>© 2024 ProPhoto AI. Powered by Google Gemini 2.5 Flash Image.</p>
          <div className="mt-4 flex justify-center gap-4">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
            <a href="#" className="hover:text-slate-600">Support</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
