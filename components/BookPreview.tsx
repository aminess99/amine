import React from 'react';
import { Book, BookTheme } from '../types';

interface BookPreviewProps {
  book: Book;
  theme: BookTheme;
  id?: string;
}

export const BookPreview: React.FC<BookPreviewProps> = ({ book, theme, id }) => {
  
  const getThemeClasses = () => {
    switch (theme) {
      case BookTheme.CLASSIC:
        return {
          container: 'bg-[#fdfbf7] text-slate-900 font-amiri',
          title: 'text-5xl text-amber-900 font-bold mb-4 border-b-4 border-amber-900/20 pb-6 inline-block',
          author: 'text-2xl text-amber-800 italic',
          chapterTitle: 'text-3xl text-amber-900 font-bold mb-6 mt-8 decoration-amber-500/30 underline decoration-4 underline-offset-8',
          body: 'text-lg leading-[2.2] text-slate-800 text-justify',
          pageNumber: 'text-amber-900/50',
          divider: 'border-amber-900/10'
        };
      case BookTheme.MINIMAL:
        return {
          container: 'bg-white text-black font-kufi',
          title: 'text-6xl font-black tracking-tighter mb-4',
          author: 'text-xl text-gray-600 uppercase tracking-widest',
          chapterTitle: 'text-4xl font-bold mb-8 mt-12 border-l-8 border-black pl-4',
          body: 'text-lg leading-relaxed text-gray-900 text-justify font-light',
          pageNumber: 'text-gray-300',
          divider: 'border-gray-100'
        };
      case BookTheme.KIDS:
        return {
          container: 'bg-sky-50 text-indigo-900 font-tajawal',
          title: 'text-6xl text-indigo-600 font-extrabold mb-4 drop-shadow-sm',
          author: 'text-2xl text-pink-500 font-bold',
          chapterTitle: 'text-4xl text-indigo-500 font-bold mb-6 mt-8 bg-white/50 inline-block px-6 py-2 rounded-full shadow-sm',
          body: 'text-xl leading-[2] text-indigo-900 text-right',
          pageNumber: 'text-indigo-300',
          divider: 'border-indigo-100'
        };
      case BookTheme.MODERN:
      default:
        return {
          container: 'bg-white text-slate-800 font-tajawal',
          title: 'text-5xl text-slate-900 font-bold mb-2 bg-gradient-to-l from-primary-600 to-blue-800 bg-clip-text text-transparent',
          author: 'text-xl text-slate-500 font-medium',
          chapterTitle: 'text-3xl text-slate-800 font-bold mb-6 mt-10 flex items-center gap-3 before:content-[""] before:w-2 before:h-8 before:bg-primary-500 before:rounded-full',
          body: 'text-lg leading-loose text-slate-600 text-justify',
          pageNumber: 'text-slate-300',
          divider: 'border-slate-100'
        };
    }
  };

  const styles = getThemeClasses();

  return (
    <div id={id} className={`w-full max-w-[210mm] mx-auto shadow-2xl transition-all duration-500 ${styles.container}`}>
      
      {/* Cover Page */}
      {/* Reduced padding from 20mm to 12mm because we added 15mm margin in PDF settings */}
      <div className="min-h-[297mm] p-[12mm] flex flex-col justify-between items-center text-center relative overflow-hidden page-break">
        {/* Decorative Elements based on theme */}
        {theme === BookTheme.CLASSIC && (
           <div className="absolute inset-0 border-[20px] border-double border-amber-900/10 m-8 pointer-events-none"></div>
        )}
        {theme === BookTheme.KIDS && (
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        )}

        <div className="flex-1 flex flex-col justify-center z-10 w-full">
          <h1 className={styles.title}>{book.title}</h1>
          <div className={`w-32 h-1 mx-auto my-8 rounded-full ${theme === BookTheme.KIDS ? 'bg-pink-400' : 'bg-current opacity-20'}`}></div>
          <p className={styles.author}>تأليف: {book.author}</p>
        </div>

        <div className="z-10 max-w-md mx-auto opacity-80">
          <p className="text-lg mb-8">{book.description}</p>
          <div className="text-sm opacity-50">
            تم الإنشاء بواسطة منصة مؤلف
            <br />
            {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>
      </div>

      {/* Content Pages */}
      {/* Adjusted padding to work with PDF margin */}
      <div className="p-[12mm]">
        {book.chapters.map((chapter, index) => (
          <div key={index} className="mb-16 page-break">
            <h2 className={styles.chapterTitle}>
              <span className="opacity-30 text-sm ml-4 font-normal">الفصل {index + 1}</span>
              <br />
              {chapter.title}
            </h2>
            <div className={styles.body}>
              {chapter.content.split('\n').map((paragraph, pIndex) => (
                 // Added 'break-inside-avoid' to prevent sentence splitting
                 paragraph.trim() && <p key={pIndex} className="mb-6 break-inside-avoid">{paragraph}</p>
              ))}
            </div>
            
            {index < book.chapters.length - 1 && (
              <div className={`my-12 border-b-2 border-dashed w-1/3 mx-auto ${styles.divider}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Footer/End */}
      <div className={`text-center py-8 text-sm opacity-40 border-t ${styles.divider} mx-[20mm]`}>
        نهاية الكتاب
      </div>
    </div>
  );
};