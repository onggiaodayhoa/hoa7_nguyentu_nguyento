import React, { useState } from 'react';
import { Shuffle, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  keywords: string[];
  usedKeywords: string[];
  activeBlankId: string | null;
  onSelectKeyword: (word: string) => void;
  onShuffle: () => void;
}

export const KeywordBank: React.FC<Props> = ({
  keywords,
  usedKeywords,
  activeBlankId,
  onSelectKeyword,
  onShuffle,
}) => {
  // Mobile collapse state to prevent blocking the screen
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-5 shadow-lg border border-indigo-100 transition-all">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
          className="flex items-center gap-2 text-left flex-1"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-base text-slate-800 flex items-center gap-1.5 flex-wrap">
              <span>Ngân Hàng Từ Khóa</span>
              <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Đã trộn ngẫu nhiên
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {activeBlankId
                ? 'Nhấp một từ bên dưới để điền nhanh vào ô đang chọn'
                : 'Nhấp chọn ô trống trong câu hỏi & chọn từ để điền'}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onShuffle}
            type="button"
            title="Trộn lại các từ khóa"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold transition-all border border-slate-200 active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Trộn lại</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
            className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 sm:hidden"
            title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chips Container */}
      {isExpanded && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 sm:gap-2 max-h-[140px] sm:max-h-[180px] overflow-y-auto">
          {keywords.map((word, idx) => {
            const isUsed = usedKeywords.includes(word.toLowerCase());
            return (
              <button
                key={`${word}-${idx}`}
                onClick={() => onSelectKeyword(word)}
                type="button"
                className={`group px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center gap-1 shrink-0 active:scale-95 ${
                  isUsed
                    ? 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-65'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border-indigo-200 hover:border-indigo-600 shadow-2xs'
                }`}
              >
                <span>{word}</span>
                {isUsed && <CheckCircle2 className="w-3 h-3 text-slate-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
