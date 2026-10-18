import React from 'react';
import { StudentInfo } from '../types/chemistry';
import {
  Atom,
  GraduationCap,
  FileSpreadsheet,
  Layers,
  Heart,
  Boxes,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';

interface Props {
  activeTab: 'quiz' | 'cards_game' | 'atom_viewer' | 'teacher_portal';
  setActiveTab: (tab: 'quiz' | 'cards_game' | 'atom_viewer' | 'teacher_portal') => void;
  student: StudentInfo | null;
  onOpenStudentModal: () => void;
  onOpenSheetsSetup: () => void;
  onOpenElementsModal: () => void;
  onOpenBodyElementsModal: () => void;
  onOpenConceptMapModal: () => void;
  isSheetConfigured: boolean;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  student,
  onOpenStudentModal,
  onOpenSheetsSetup,
  onOpenElementsModal,
  onOpenBodyElementsModal,
  onOpenConceptMapModal,
  isSheetConfigured,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Top brand row */}
        <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand */}
          <button
            onClick={() => setActiveTab('quiz')}
            className="flex items-center gap-2 text-left group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Atom className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-800 text-sm sm:text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                  HÓA HỌC 7
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  Bài 2 & 3 KNTT
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden md:block">
                Nguyên Tử & Nguyên Tố Hoá Học
              </p>
            </div>
          </button>

          {/* Quick Info Modals on Mobile & Desktop */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenBodyElementsModal}
              type="button"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-all border border-rose-200"
              title="Xem nguyên tố trong cơ thể người (96%)"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600" />
              <span className="hidden sm:inline">Cơ Thể Người</span>
            </button>

            <button
              onClick={onOpenConceptMapModal}
              type="button"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-all border border-indigo-200"
              title="Sơ đồ tư duy liên kết Bài 2 & Bài 3"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
              <span className="hidden md:inline">Sơ Đồ Bài 2 & 3</span>
            </button>

            <button
              onClick={onOpenElementsModal}
              type="button"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all"
              title="Bảng 20 nguyên tố đầu tiên"
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
              <span className="hidden lg:inline">20 Nguyên Tố</span>
            </button>

            <button
              onClick={onOpenSheetsSetup}
              type="button"
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border ${
                isSheetConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
              title="Cài đặt Google Sheets & Tập lệnh ứng dụng"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xl:inline">
                {isSheetConfigured ? 'Sheet: Đã kết nối' : 'Cài Google Sheet'}
              </span>
            </button>

            {/* Student Name Pill */}
            <button
              onClick={onOpenStudentModal}
              type="button"
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-all border border-indigo-200/60 shrink-0"
              title="Thông tin thí sinh"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                {student ? student.fullName.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
              </div>
              <span className="max-w-[70px] sm:max-w-[100px] truncate text-[11px] sm:text-xs">
                {student ? student.fullName : 'Thí sinh'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom tab row (Horizontal scroll on phone) */}
        <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-1 sm:gap-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Bài Tập Điền (3 Mức Độ)</span>
          </button>

          <button
            onClick={() => setActiveTab('cards_game')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'cards_game'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Xếp 12 Thẻ Nguyên Tử (Trang 20)</span>
          </button>

          <button
            onClick={() => setActiveTab('atom_viewer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'atom_viewer'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>Mô Hình Bo (Rutherford - Bohr)</span>
          </button>

          <button
            onClick={() => setActiveTab('teacher_portal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'teacher_portal'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Sổ Điểm & Báo Cáo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
