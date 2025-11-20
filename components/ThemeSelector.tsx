import React from 'react';
import { BookTheme } from '../types';
import { Palette, BookOpen, Sparkles, Feather } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: BookTheme;
  onSelectTheme: (theme: BookTheme) => void;
}

const themes = [
  {
    id: BookTheme.CLASSIC,
    name: 'كلاسيكي',
    description: 'خط أميري، ورق كريمي، تصميم تقليدي',
    icon: <Feather className="w-6 h-6" />,
    color: 'bg-[#fdfbf7] border-orange-200 text-amber-900'
  },
  {
    id: BookTheme.MODERN,
    name: 'عصري',
    description: 'خط تجوال، ألوان مريحة، تصميم نظيف',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-white border-gray-200 text-slate-800'
  },
  {
    id: BookTheme.MINIMAL,
    name: 'بسيط',
    description: 'أبيض وأسود، تباين عالي للقراءة',
    icon: <Palette className="w-6 h-6" />,
    color: 'bg-zinc-50 border-zinc-300 text-black'
  },
  {
    id: BookTheme.KIDS,
    name: 'مرح',
    description: 'ألوان زاهية، خطوط كبيرة وواضحة',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'bg-sky-50 border-sky-200 text-indigo-900'
  }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onSelectTheme }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelectTheme(theme.id)}
          className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-right group
            ${selectedTheme === theme.id 
              ? 'border-primary-500 shadow-lg scale-[1.02]' 
              : 'border-transparent hover:border-gray-200 hover:bg-white/50 shadow-sm bg-white/30'
            }
          `}
        >
          <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-lg ${selectedTheme === theme.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
              {theme.icon}
            </div>
            {selectedTheme === theme.id && (
              <span className="absolute top-4 left-4 w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
            )}
          </div>
          <h3 className="font-bold text-lg mb-1">{theme.name}</h3>
          <p className="text-sm text-gray-500">{theme.description}</p>
          
          {/* Mini Preview */}
          <div className={`mt-3 p-2 rounded text-xs leading-relaxed ${theme.color} h-16 overflow-hidden opacity-80`}>
            بسم الله الرحمن الرحيم
            <br />
            هذا نص تجريبي لعرض شكل الكتاب وتنسيق الخطوط...
          </div>
        </button>
      ))}
    </div>
  );
};