import React, { useState } from 'react';
import { ATOM_CARDS_DATA } from '../data/questionsData';
import { AtomCardItem } from '../types/chemistry';
import { shuffleArray } from '../utils/shuffle';
import {
  Boxes,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TargetBox {
  z: number;
  symbol: string;
  name: string;
}

const TARGET_BOXES: TargetBox[] = [
  { z: 1, symbol: 'H', name: 'Hydrogen' },
  { z: 6, symbol: 'C', name: 'Carbon' },
  { z: 7, symbol: 'N', name: 'Nitrogen' },
  { z: 8, symbol: 'O', name: 'Oxygen' },
  { z: 19, symbol: 'K', name: 'Potassium' },
  { z: 20, symbol: 'Ca', name: 'Calcium' },
];

export const CardSortingGame: React.FC = () => {
  const [unassignedCards, setUnassignedCards] = useState<AtomCardItem[]>(() =>
    shuffleArray(ATOM_CARDS_DATA)
  );
  // Map of box Z -> Array of card IDs
  const [boxAssignments, setBoxAssignments] = useState<Record<number, string[]>>({
    1: [],
    6: [],
    7: [],
    8: [],
    19: [],
    20: [],
  });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Restart
  const handleReset = () => {
    setUnassignedCards(shuffleArray(ATOM_CARDS_DATA));
    setBoxAssignments({ 1: [], 6: [], 7: [], 8: [], 19: [], 20: [] });
    setSelectedCardId(null);
    setIsCompleted(false);
    setFeedback(null);
  };

  // Select card to place
  const handleCardClick = (cardId: string) => {
    if (selectedCardId === cardId) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(cardId);
      setFeedback('Hãy nhấp vào một trong các ô nguyên tố bên dưới để xếp thẻ vào!');
    }
  };

  // Place selected card into target box
  const handleBoxClick = (targetZ: number) => {
    if (!selectedCardId) return;

    const card = unassignedCards.find(c => c.id === selectedCardId);
    if (!card) return;

    // Check if card is correct for this box
    if (card.elementZ === targetZ) {
      // Correct!
      setBoxAssignments(prev => ({
        ...prev,
        [targetZ]: [...prev[targetZ], card.id],
      }));
      const remaining = unassignedCards.filter(c => c.id !== selectedCardId);
      setUnassignedCards(remaining);
      setSelectedCardId(null);
      setFeedback(`Chính xác! Thẻ ${card.label} có ${card.p} proton, thuộc về nguyên tố ${card.elementName} (${card.elementSymbol}).`);

      if (remaining.length === 0) {
        setIsCompleted(true);
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch {}
      }
    } else {
      // Wrong box
      setFeedback(`Chưa đúng rồi! Thẻ ${card.label} có ${card.p} proton, hãy kiểm tra lại xem số proton này tương ứng với nguyên tố nào nhé.`);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                SGK KNTT Bài 3 (Trang 20)
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Hoạt động tương tác</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              Trò Chơi: Xếp 12 Tấm Thẻ Nguyên Tử Vào Các Ô Nguyên Tố
            </h3>
          </div>
        </div>

        <button
          onClick={handleReset}
          type="button"
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Làm lại từ đầu</span>
        </button>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        <strong>Nhiệm vụ:</strong> Quan sát số proton trong mỗi thẻ nguyên tử (ví dụ: thẻ <code>A (1p, 0n)</code> có 1 proton). Hãy nhấp vào thẻ, sau đó nhấp vào ô nguyên tố tương ứng có cùng số proton trong hạt nhân.
      </p>

      {/* Feedback banner */}
      {feedback && (
        <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Completion celebratory state */}
      {isCompleted && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg space-y-2">
          <div className="flex items-center gap-2 font-black text-base sm:text-lg">
            <CheckCircle2 className="w-6 h-6 text-yellow-300" />
            <span>Chúc mừng em! Em đã xếp thành công cả 12 thẻ vào 6 ô nguyên tố!</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            <strong>Kết luận rút ra từ hoạt động (SGK trang 20):</strong>
            <br />
            1. Xếp được <strong>6 ô vuông</strong>: Hydrogen (H), Carbon (C), Nitrogen (N), Oxygen (O), Potassium (K), Calcium (Ca).
            <br />
            2. Các nguyên tử thuộc cùng một nguyên tố hoá học có thể có số neutron khác nhau (như A, D, E thuộc H; Q, R, T thuộc O; Y, Z thuộc K), nhưng bắt buộc phải có <strong>cùng số hạt proton</strong>!
          </p>
        </div>
      )}

      {/* Unassigned Cards Pool */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Các tấm thẻ cần xếp ({unassignedCards.length} thẻ còn lại):
          </span>
          {selectedCardId && (
            <span className="text-xs font-semibold text-indigo-600 animate-pulse">
              Đang chọn thẻ &bull; Nhấp ô nguyên tố bên dưới để đặt thẻ vào
            </span>
          )}
        </div>

        {unassignedCards.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
            Tất cả 12 thẻ đã được xếp vào đúng ô nguyên tố!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {unassignedCards.map(card => {
              const isSelected = selectedCardId === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  type="button"
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-mono text-xs sm:text-sm font-bold border transition-all active:scale-95 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 ring-4 ring-indigo-200'
                      : 'bg-slate-50 hover:bg-indigo-50 text-slate-800 border-slate-300 hover:border-indigo-300 shadow-2xs'
                  }`}
                >
                  <span>{card.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 6 Target Boxes (Grid responsive on web & mobile) */}
      <div>
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
          6 Ô Vuông Nguyên Tố Hoá Học:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TARGET_BOXES.map(box => {
            const placedCardIds = boxAssignments[box.z] || [];
            const placedCards = ATOM_CARDS_DATA.filter(c => placedCardIds.includes(c.id));
            const isTargetHighlight = Boolean(selectedCardId);

            return (
              <div
                key={box.z}
                onClick={() => handleBoxClick(box.z)}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[140px] cursor-pointer ${
                  isTargetHighlight
                    ? 'border-indigo-400 bg-indigo-50/50 hover:bg-indigo-100 hover:border-indigo-600 shadow-sm'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      Z = {box.z}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      ({box.z}p)
                    </span>
                  </div>

                  <div className="text-center my-1">
                    <span className="font-mono text-xl sm:text-2xl font-black text-indigo-700">
                      {box.symbol}
                    </span>
                    <div className="text-xs font-bold text-slate-700 truncate">
                      {box.name}
                    </div>
                  </div>
                </div>

                {/* Placed cards chips inside this box */}
                <div className="mt-2 pt-2 border-t border-slate-200/80 space-y-1">
                  {placedCards.length === 0 ? (
                    <span className="text-[10px] text-slate-400 italic block text-center">
                      (Chưa có thẻ)
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {placedCards.map(c => (
                        <span
                          key={c.id}
                          className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold"
                        >
                          {c.id.replace('card_', '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
