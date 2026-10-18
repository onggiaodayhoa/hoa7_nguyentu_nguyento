import React from 'react';
import {
  TheoryQuestion,
  ElementSymbolQuiz,
  CompareAtomQuiz,
  SymbolCorrectionQuiz,
} from '../types/chemistry';
import { Check, X, HelpCircle, ShieldCheck, Wrench, Sparkles, BookOpen } from 'lucide-react';
import { isAnswerCorrect } from '../utils/shuffle';

// 1. Component câu hỏi Điền Khuyết Lý Thuyết (Nhận biết)
interface TheoryCardProps {
  question: TheoryQuestion;
  questionIndex: number;
  userAnswers: Record<string, string>;
  activeBlankId: string | null;
  onSelectBlank: (blankId: string) => void;
  onAnswerChange: (blankId: string, value: string) => void;
  isSubmitted: boolean;
}

export const TheoryQuestionCard: React.FC<TheoryCardProps> = ({
  question,
  questionIndex,
  userAnswers,
  activeBlankId,
  onSelectBlank,
  onAnswerChange,
  isSubmitted,
}) => {
  // Render text with interactive input blanks
  const renderTextWithInputs = () => {
    const parts = question.textWithBlanks.split(/(\{\{b\d+\}\})/g);

    return parts.map((part, idx) => {
      const match = part.match(/\{\{(b\d+)\}\}/);
      if (match) {
        const blankId = match[1];
        const blankItem = question.blanks.find(b => b.id === blankId);
        const val = userAnswers[`${question.id}_${blankId}`] || '';
        const isCurrentActive = activeBlankId === `${question.id}_${blankId}`;

        const isCorrect =
          isSubmitted &&
          blankItem &&
          isAnswerCorrect(val, blankItem.correctAnswer, blankItem.acceptableAnswers);

        return (
          <span key={idx} className="inline-block mx-1.5 my-1">
            <input
              type="text"
              disabled={isSubmitted}
              value={val}
              onClick={() => onSelectBlank(`${question.id}_${blankId}`)}
              onChange={e => onAnswerChange(`${question.id}_${blankId}`, e.target.value)}
              placeholder={`(ô trống ${blankItem?.blankIndex})`}
              className={`min-w-[100px] sm:min-w-[120px] max-w-[170px] px-3 py-1 text-center font-bold text-sm rounded-lg border transition-all outline-hidden ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-400 ring-2 ring-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-400 ring-2 ring-rose-200'
                  : isCurrentActive
                  ? 'bg-amber-50 text-amber-900 border-amber-500 ring-4 ring-amber-300/40 shadow-xs scale-105'
                  : 'bg-white text-indigo-900 border-slate-300 hover:border-indigo-400 focus:border-indigo-600 shadow-2xs'
              }`}
            />
            {isSubmitted && blankItem && (
              <span
                className={`inline-flex items-center ml-1 text-xs font-bold px-1.5 py-0.5 rounded ${
                  isCorrect
                    ? 'text-emerald-700 bg-emerald-100'
                    : 'text-rose-700 bg-rose-100'
                }`}
              >
                {isCorrect ? (
                  <Check className="w-3.5 h-3.5 inline mr-0.5" />
                ) : (
                  <>
                    <X className="w-3.5 h-3.5 inline mr-0.5" />
                    Đúng: {blankItem.correctAnswer}
                  </>
                )}
              </span>
            )}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
            {questionIndex + 1}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Nhận Biết (Điền Khuyết)
          </span>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base">
            {question.title}
          </h4>
        </div>
      </div>

      <div className="text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 mb-3">
        {renderTextWithInputs()}
      </div>

      {isSubmitted && (
        <div className="mt-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-start gap-2.5">
          <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Kiến thức SGK:</span>
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Component câu hỏi Ghép Kí Hiệu 20 Nguyên Tố (Thông hiểu)
interface ElementQuizCardProps {
  quiz: ElementSymbolQuiz;
  index: number;
  selectedAnswer?: string;
  onSelect: (symbol: string) => void;
  isSubmitted: boolean;
}

export const ElementQuizCard: React.FC<ElementQuizCardProps> = ({
  quiz,
  index,
  selectedAnswer,
  onSelect,
  isSubmitted,
}) => {
  const isCorrect = isSubmitted && selectedAnswer === quiz.correctSymbol;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
            {index + 1}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Thông Hiểu (Kí hiệu hoá học)
          </span>
        </div>
        <span className="font-mono text-xs text-slate-400 font-semibold">
          Z = {quiz.z}
        </span>
      </div>

      <p className="text-slate-800 font-semibold text-sm sm:text-base mb-4">
        Kí hiệu hoá học chính xác của nguyên tố{' '}
        <span className="text-indigo-600 font-bold underline decoration-indigo-300">
          {quiz.elementName}
        </span>{' '}
        là gì?
      </p>

      {/* Options grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-2">
        {quiz.options.map(option => {
          const isChosen = selectedAnswer === option;
          const isTargetCorrect = isSubmitted && option === quiz.correctSymbol;

          let btnStyle = 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
          if (isChosen && !isSubmitted) {
            btnStyle = 'bg-indigo-600 text-white border-indigo-600 shadow-sm';
          } else if (isSubmitted) {
            if (isTargetCorrect) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-sm font-bold';
            } else if (isChosen && !isTargetCorrect) {
              btnStyle = 'bg-rose-500 text-white border-rose-500 line-through';
            } else {
              btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
            }
          }

          return (
            <button
              key={option}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelect(option)}
              className={`py-2.5 px-4 rounded-xl border text-sm sm:text-base font-mono font-bold transition-all flex items-center justify-center gap-2 ${btnStyle}`}
            >
              <span>{option}</span>
              {isSubmitted && isTargetCorrect && <Check className="w-4 h-4" />}
              {isSubmitted && isChosen && !isTargetCorrect && <X className="w-4 h-4" />}
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div
          className={`mt-3 p-3 rounded-xl text-xs sm:text-sm flex items-start gap-2 ${
            isCorrect
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {isCorrect ? 'Tuyệt vời!' : `Đáp án đúng là ${quiz.correctSymbol}:`}
            </span>{' '}
            {quiz.explanation}
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Component So Sánh Các Nguyên Tử Cùng Nguyên Tố (Vận dụng)
interface CompareCardProps {
  quiz: CompareAtomQuiz;
  index: number;
  selectedIndex?: number;
  onSelect: (optionIdx: number) => void;
  isSubmitted: boolean;
}

export const CompareAtomCard: React.FC<CompareCardProps> = ({
  quiz,
  index,
  selectedIndex,
  onSelect,
  isSubmitted,
}) => {
  const isCorrect = isSubmitted && selectedIndex === quiz.correctIndex;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
          {index + 1}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          Vận Dụng (So Sánh Nguyên Tử)
        </span>
        <h4 className="font-bold text-slate-800 text-sm sm:text-base">
          {quiz.title}
        </h4>
      </div>

      {/* Comparison table between Atom A and Atom B */}
      <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="font-bold text-indigo-700 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            {quiz.atomA.name}
          </div>
          <div className="space-y-0.5 text-xs text-slate-600 font-mono">
            <div>Số hạt proton (p): <strong>{quiz.atomA.p}</strong></div>
            <div>Số hạt neutron (n): <strong>{quiz.atomA.n}</strong></div>
            <div>Số hạt electron (e): <strong>{quiz.atomA.e}</strong></div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="font-bold text-purple-700 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            {quiz.atomB.name}
          </div>
          <div className="space-y-0.5 text-xs text-slate-600 font-mono">
            <div>Số hạt proton (p): <strong>{quiz.atomB.p}</strong></div>
            <div>Số hạt neutron (n): <strong>{quiz.atomB.n}</strong></div>
            <div>Số hạt electron (e): <strong>{quiz.atomB.e}</strong></div>
          </div>
        </div>
      </div>

      <p className="text-slate-800 font-semibold text-sm sm:text-base mb-3">
        {quiz.question}
      </p>

      {/* Options */}
      <div className="space-y-2">
        {quiz.options.map((opt, optIdx) => {
          const isChosen = selectedIndex === optIdx;
          const isTargetCorrect = isSubmitted && optIdx === quiz.correctIndex;

          let style = 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
          if (isChosen && !isSubmitted) {
            style = 'bg-indigo-50 text-indigo-800 border-indigo-400 ring-2 ring-indigo-200 font-semibold';
          } else if (isSubmitted) {
            if (isTargetCorrect) {
              style = 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-200 font-bold';
            } else if (isChosen && !isTargetCorrect) {
              style = 'bg-rose-50 text-rose-800 border-rose-400 line-through';
            } else {
              style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
            }
          }

          return (
            <button
              key={optIdx}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelect(optIdx)}
              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-2.5 ${style}`}
            >
              <span className="font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-black/5 shrink-0 mt-0.5">
                {String.fromCharCode(65 + optIdx)}
              </span>
              <span className="flex-1 leading-snug">{opt}</span>
              {isSubmitted && isTargetCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              {isSubmitted && isChosen && !isTargetCorrect && <X className="w-4 h-4 text-rose-600 shrink-0" />}
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div
          className={`mt-3 p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2 ${
            isCorrect
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Giải thích: </span>
            {quiz.explanation}
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Component Thám Tử Sửa Sai Kí Hiệu Hoá Học (Vận dụng)
interface SymbolCorrectionCardProps {
  quiz: SymbolCorrectionQuiz;
  index: number;
  userChoice?: 'dung' | 'sai';
  userFixedText?: string;
  onChoiceChange: (choice: 'dung' | 'sai') => void;
  onFixedTextChange: (text: string) => void;
  isSubmitted: boolean;
}

export const SymbolCorrectionCard: React.FC<SymbolCorrectionCardProps> = ({
  quiz,
  index,
  userChoice,
  userFixedText = '',
  onChoiceChange,
  onFixedTextChange,
  isSubmitted,
}) => {
  const isChoiceCorrect =
    isSubmitted &&
    ((quiz.isCorrect && userChoice === 'dung') ||
      (!quiz.isCorrect && userChoice === 'sai'));

  const isFixCorrect =
    isSubmitted &&
    (!quiz.isCorrect
      ? userFixedText.trim() === quiz.correctSymbol
      : true);

  const isTotalCorrect = isChoiceCorrect && isFixCorrect;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
            {index + 1}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Vận Dụng (Sửa Sai Kí Hiệu)
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {quiz.elementName}
        </span>
      </div>

      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-4 flex items-center justify-between">
        <span className="text-xs text-slate-600">
          Kí hiệu học sinh ghi vào vở:
        </span>
        <span className="font-mono text-xl sm:text-2xl font-black px-4 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 shadow-2xs">
          {quiz.wrongOrGivenSymbol}
        </span>
      </div>

      <p className="text-slate-800 font-semibold text-xs sm:text-sm mb-3">
        Theo em, cách viết kí hiệu trên là ĐÚNG hay SAI? Nếu SAI, hãy sửa lại cho đúng chuẩn:
      </p>

      {/* Choice Buttons: Đúng / Sai */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          type="button"
          disabled={isSubmitted}
          onClick={() => onChoiceChange('dung')}
          className={`py-2 px-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            userChoice === 'dung'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Viết ĐÚNG</span>
        </button>

        <button
          type="button"
          disabled={isSubmitted}
          onClick={() => onChoiceChange('sai')}
          className={`py-2 px-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            userChoice === 'sai'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Viết SAI (cần sửa)</span>
        </button>
      </div>

      {/* If marked as 'sai', input to correct it */}
      {userChoice === 'sai' && (
        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 mb-2">
          <label className="block text-xs font-bold text-amber-900 mb-1">
            Kí hiệu đúng cần sửa thành:
          </label>
          <input
            type="text"
            disabled={isSubmitted}
            value={userFixedText}
            onChange={e => onFixedTextChange(e.target.value)}
            placeholder={`Sửa ${quiz.wrongOrGivenSymbol} thành...`}
            className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white font-mono font-bold text-sm text-slate-800 outline-hidden focus:ring-2 focus:ring-amber-400"
          />
        </div>
      )}

      {isSubmitted && (
        <div
          className={`mt-3 p-3 rounded-xl text-xs sm:text-sm ${
            isTotalCorrect
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 mb-1">
            {isTotalCorrect ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                Chính xác!
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-rose-600" />
                Kí hiệu chuẩn là: <span className="font-mono font-black">{quiz.correctSymbol}</span>
              </>
            )}
          </div>
          <p className="text-xs leading-relaxed">{quiz.commonMistakeExplanation}</p>
        </div>
      )}
    </div>
  );
};
