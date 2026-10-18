import React, { useState } from 'react';
import { FIRST_20_ELEMENTS } from '../data/elementsData';
import { ChemicalElement } from '../types/chemistry';
import { X, Search, Sparkles, BookOpen, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement?: (z: number) => void;
}

export const ElementsReferenceModal: React.FC<Props> = ({ isOpen, onClose, onSelectElement }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEl, setSelectedEl] = useState<ChemicalElement | null>(null);

  if (!isOpen) return null;

  const filtered = FIRST_20_ELEMENTS.filter(
    el =>
      el.nameIupac.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (el.nameTraditional && el.nameTraditional.toLowerCase().includes(searchTerm.toLowerCase())) ||
      el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.z.toString() === searchTerm.trim()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-slate-800">
                Bảng 20 Nguyên Tố Hoá Học Đầu Tiên (Z = 1 &rarr; 20)
              </h3>
              <p className="text-xs text-slate-500">
                Chuẩn danh pháp quốc tế IUPAC & SGK Khoa học tự nhiên 7 (GDPT 2018)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo kí hiệu (H, He, Na...), tên IUPAC hoặc số Z..."
            className="w-full text-xs sm:text-sm bg-transparent outline-hidden font-medium text-slate-800"
          />
        </div>

        {/* Grid of Elements */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {filtered.map(el => {
            return (
              <button
                key={el.z}
                onClick={() => {
                  setSelectedEl(el);
                  if (onSelectElement) onSelectElement(el.z);
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all hover:shadow-md group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-mono font-bold text-slate-500">Z = {el.z}</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                    {el.atomicMass} amu
                  </span>
                </div>

                <div className="text-center my-1.5">
                  <span className="font-mono text-2xl font-black text-indigo-700 group-hover:scale-110 transition-transform inline-block">
                    {el.symbol}
                  </span>
                </div>

                <div className="text-center">
                  <div className="font-bold text-xs text-slate-800 truncate">
                    {el.nameIupac}
                  </div>
                  {el.nameTraditional && (
                    <div className="text-[10px] text-slate-500 truncate">
                      ({el.nameTraditional})
                    </div>
                  )}
                  <div className="text-[10px] text-indigo-600 font-mono mt-1 font-semibold">
                    e: [{el.electronShells.join(',')}]
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Element detail drawer if clicked */}
        {selectedEl && (
          <div className="p-4 bg-indigo-950 text-white border-t border-indigo-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-black text-indigo-300">
                {selectedEl.symbol}
              </span>
              <div>
                <strong className="text-sm text-white">
                  {selectedEl.nameIupac} ({selectedEl.nameTraditional})
                </strong>
                <p className="text-slate-300 text-[11px]">{selectedEl.funFact}</p>
              </div>
            </div>
            <div className="font-mono text-[11px] text-indigo-200 bg-white/10 px-3 py-1.5 rounded-xl">
              Hạt nhân: {selectedEl.protons}p, {selectedEl.neutrons}n | Khối lượng: {selectedEl.atomicMass} amu
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-bold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
