import React, { useState, useRef } from 'react';
import { Book, BookTheme, GenerateBookParams } from './types';
import { generateBookContent } from './services/geminiService';
import { ThemeSelector } from './components/ThemeSelector';
import { BookPreview } from './components/BookPreview';
import { BookOpen, Wand2, Download, Loader2, ChevronLeft, PenTool, Library, AlertCircle, Layers, AlignRight, Users, Type, FileText, ScrollText } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<GenerateBookParams>({
    topic: '',
    details: '',
    chapterCount: 5,
    audience: 'الجميع',
    languageStyle: 'مشوق وسهل'
  });
  
  const [selectedTheme, setSelectedTheme] = useState<BookTheme>(BookTheme.MODERN);
  const [generatedBook, setGeneratedBook] = useState<Book | null>(null);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate Book
  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError("الرجاء إدخال عنوان أو موضوع للكتاب");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const book = await generateBookContent(formData);
      setGeneratedBook(book);
      setStep(2); // Go to theme selection
    } catch (err) {
      setError("حدث خطأ أثناء إنشاء الكتاب. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PDF Download
  const handleDownloadPDF = () => {
    const element = document.getElementById('book-content');
    if (!element || !generatedBook) return;

    setIsDownloading(true);

    // Use setTimeout to allow the UI to update (show spinner) before the heavy PDF generation starts
    setTimeout(async () => {
      try {
        const opt = {
          margin: 15, // Margins in mm (Top, Left, Bottom, Right) - Solves the "space above and below" request
          filename: `${generatedBook.title.replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true, // Improves text sharpness
            scrollY: 0
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // CRITICAL: Prevents splitting text mid-element
        };

        // Use window.html2pdf loaded from CDN
        if (window.html2pdf) {
          await window.html2pdf().set(opt).from(element).save();
        } else {
          // Fallback to print
          window.print();
        }
      } catch (err) {
        console.error("Download failed", err);
        alert("حدث خطأ أثناء تحميل الملف");
      } finally {
        setIsDownloading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal pb-20">
      
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg text-white">
                <Library className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">مؤلف AI</span>
            </div>
            <div className="text-sm text-gray-500 hidden sm:block">
              أنشئ كتابك بلمسة زر
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600 font-bold' : 'text-gray-400'}`}>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>1</span>
              <span>المحتوى</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600 font-bold' : 'text-gray-400'}`}>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>2</span>
              <span>التصميم</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600 font-bold' : 'text-gray-400'}`}>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 3 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>3</span>
              <span>التحميل</span>
            </div>
          </div>
        </div>

        {/* Step 1: Content Generation */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-900 p-10 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold mb-4 leading-tight">استوديو التأليف الذكي</h1>
                  <p className="text-primary-100 text-lg opacity-90 max-w-xl">
                    صمم كتابك الخاص بدقة. املأ التفاصيل وسيقوم الذكاء الاصطناعي بالباقي.
                  </p>
                </div>
                <Wand2 className="absolute left-10 top-1/2 -translate-y-1/2 w-64 h-64 text-white opacity-5 rotate-12" />
              </div>
              
              <div className="p-8 lg:p-10 space-y-10">
                
                {/* Main Topic */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                    <PenTool className="w-5 h-5 text-primary-500" />
                    عنوان أو فكرة الكتاب
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    placeholder="مثال: رحلة إلى المريخ، دليل التسويق الرقمي..."
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary-500 focus:bg-white transition-all outline-none text-lg text-gray-800 shadow-sm"
                  />
                </div>

                {/* Creative Description Field */}
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <label className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                        <ScrollText className="w-5 h-5 text-purple-500" />
                        وصف الكتاب والمحتوى
                      </label>
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-lg font-medium">
                        أطلق العنان لخيالك ✨
                      </span>
                   </div>
                   
                   <div className="relative group">
                      {/* Glowing Effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-primary-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                      <div className="relative bg-white rounded-xl">
                         <textarea
                          name="details"
                          value={formData.details}
                          onChange={handleInputChange}
                          rows={5}
                          placeholder="صف هنا محتوى الكتاب بدقة...&#10;مثلاً: أريد كتاباً للأطفال عن ديناصور صغير يبحث عن أمه، يتضمن مواقف مضحكة ودروساً عن الصداقة. أو: كتاب تقني يشرح أساسيات البرمجة بلغة بسيطة..."
                          className="w-full px-6 py-5 rounded-xl bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-purple-500 transition-all outline-none text-gray-700 resize-none leading-relaxed placeholder:text-gray-400"
                        />
                        <div className="absolute bottom-4 left-4 opacity-20 pointer-events-none">
                          <PenTool className="w-6 h-6" />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Creative Page Count Slider */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                     <label className="flex items-center justify-between text-gray-800 font-bold mb-6">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-indigo-500" />
                          حجم الكتاب (عدد الصفحات)
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-indigo-600 font-black text-xl">
                             {formData.chapterCount * 2} <span className="text-sm font-medium text-gray-500">صفحة (تقريباً)</span>
                           </span>
                           <span className="text-xs text-gray-400 mt-1">
                             {formData.chapterCount} فصول
                           </span>
                        </div>
                      </label>
                      
                      <div className="relative px-2">
                        <input 
                          type="range" 
                          min="3" 
                          max="15" 
                          step="1"
                          name="chapterCount"
                          value={formData.chapterCount}
                          onChange={(e) => setFormData({...formData, chapterCount: parseInt(e.target.value)})}
                          className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 z-10 relative"
                        />
                        <div className="flex justify-between text-xs font-medium text-gray-400 mt-4">
                          <div className="flex flex-col items-center gap-1">
                             <div className={`w-1 h-3 bg-gray-300 rounded-full ${formData.chapterCount <= 5 ? 'bg-indigo-200' : ''}`}></div>
                             <span>كتيب صغير</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                             <div className={`w-1 h-3 bg-gray-300 rounded-full ${formData.chapterCount > 5 && formData.chapterCount < 10 ? 'bg-indigo-200' : ''}`}></div>
                             <span>متوسط</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                             <div className={`w-1 h-3 bg-gray-300 rounded-full ${formData.chapterCount >= 10 ? 'bg-indigo-200' : ''}`}></div>
                             <span>كتاب كامل</span>
                          </div>
                        </div>
                      </div>
                  </div>

                  {/* Selectors */}
                  <div className="space-y-5 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-bold mb-2 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        الجمهور المستهدف
                      </label>
                      <select
                        name="audience"
                        value={formData.audience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                      >
                        <option>الجميع</option>
                        <option>الأطفال (3-8 سنوات)</option>
                        <option>اليافعين (9-15 سنة)</option>
                        <option>الشباب والبالغين</option>
                        <option>المتخصصين والخبراء</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-bold mb-2 text-sm">
                        <Type className="w-4 h-4 text-gray-400" />
                        الأسلوب اللغوي
                      </label>
                      <select
                        name="languageStyle"
                        value={formData.languageStyle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                      >
                        <option>سردي ومشوق (قصصي)</option>
                        <option>بسيط وتعليمي (شرح)</option>
                        <option>رسمي وأكاديمي (بحثي)</option>
                        <option>أدبي وشاعري (نصوص)</option>
                        <option>تحفيزي وحماسي (تطوير ذات)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm animate-pulse">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-l from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-5 rounded-xl font-bold text-xl shadow-xl shadow-primary-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-7 h-7 animate-spin" />
                      جاري صياغة الكتاب...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-7 h-7" />
                      ابدأ التأليف الآن
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Features Grid */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-blue-200 transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                  <ScrollText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">محتوى مخصص</h3>
                <p className="text-sm text-gray-500">كتابة إبداعية بناءً على وصفك الدقيق</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-purple-200 transition-colors">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-3 text-purple-600 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">تحكم بالطول</h3>
                <p className="text-sm text-gray-500">اختر عدد الصفحات الذي يناسبك</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-green-200 transition-colors">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-3 text-green-600 group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">تصدير PDF</h3>
                <p className="text-sm text-gray-500">كتاب منسق وجاهز للطباعة فوراً</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Theme Selection */}
        {step === 2 && generatedBook && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-primary-500" />
                  تخصيص التصميم
                </h2>
                <ThemeSelector selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
              </div>
              
              <div className="flex gap-4">
                 <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    تعديل
                  </button>
                 <button
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                >
                  التالي: المعاينة
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-gray-200/50 p-4 rounded-2xl border border-gray-200 overflow-auto max-h-[800px]">
               <div className="scale-[0.8] origin-top transform-gpu">
                  <BookPreview book={generatedBook} theme={selectedTheme} />
               </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Download */}
        {step === 3 && generatedBook && (
          <div className="max-w-5xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                   <h1 className="text-2xl font-bold text-gray-900 mb-1">كتابك جاهز!</h1>
                   <p className="text-gray-500">يمكنك معاينة الكتاب وتحميله بصيغة PDF</p>
                </div>
                <div className="flex gap-3">
                   <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-lg text-gray-600 hover:bg-white transition-colors"
                   >
                      عودة للتصميم
                   </button>
                   <button
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      className={`bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-600/20 flex items-center gap-2 transition-transform active:scale-95 ${isDownloading ? 'opacity-75 cursor-wait' : ''}`}
                   >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          جاري التحميل...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          تحميل PDF
                        </>
                      )}
                   </button>
                </div>
             </div>

             <div className="bg-gray-300 rounded-3xl p-8 overflow-x-auto shadow-inner">
                {/* The ID here is targeted by html2pdf */}
                <BookPreview id="book-content" book={generatedBook} theme={selectedTheme} />
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;