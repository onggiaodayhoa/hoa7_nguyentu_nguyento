import React, { useState } from 'react';
import { StudentInfo } from '../types/chemistry';
import { UserCheck, GraduationCap, School, Hash, ArrowRight, BookOpen } from 'lucide-react';

interface Props {
  initialInfo?: StudentInfo | null;
  onSave: (info: StudentInfo) => void;
  isOpen: boolean;
}

export const StudentInfoModal: React.FC<Props> = ({ initialInfo, onSave, isOpen }) => {
  const [fullName, setFullName] = useState(initialInfo?.fullName || '');
  const [className, setClassName] = useState(initialInfo?.className || '7A1');
  const [studentId, setStudentId] = useState(
    initialInfo?.studentId || `HS${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [schoolName, setSchoolName] = useState(
    initialInfo?.schoolName || 'THCS Kết Nối Tri Thức'
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Vui lòng nhập Họ và tên học sinh để vào làm bài!');
      return;
    }
    setError('');
    onSave({
      fullName: fullName.trim(),
      className: className.trim(),
      studentId: studentId.trim(),
      schoolName: schoolName.trim(),
      startedAt: new Date().toISOString(),
    });
  };

  const commonClasses = ['7A1', '7A2', '7A3', '7A4', '7B', '7C'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
              Bắt đầu bài tập trực tuyến
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Thông Tin Thí Sinh
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          Vui lòng điền thông tin của em trước khi bắt đầu. Điểm số và thời gian làm bài sẽ được tự động chấm và lưu vào <strong>Sổ Điểm & Báo Cáo Học Sinh</strong> của lớp.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-500" />
              Họ và tên học sinh <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-semibold text-slate-800 outline-hidden transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Lớp học <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-1.5 mb-1.5 flex-wrap">
                {commonClasses.slice(0, 4).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setClassName(c)}
                    className={`px-2 py-0.5 text-xs rounded-md font-semibold transition-all ${
                      className === c
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                type="text"
                required
                value={className}
                onChange={e => setClassName(e.target.value)}
                placeholder="7A1"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 text-sm font-semibold outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-indigo-500" />
                Mã học sinh / SBD
              </label>
              <div className="h-6 mb-1.5 flex items-center">
                <span className="text-[10px] text-slate-400">Tự sinh mã ngẫu nhiên</span>
              </div>
              <input
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="HS7001"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 text-sm font-mono font-semibold outline-hidden uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <School className="w-4 h-4 text-indigo-500" />
              Trường học
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              placeholder="THCS Kết Nối Tri Thức"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-sm font-medium text-slate-800 outline-hidden"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Bắt Đầu Làm Bài & Tính Điểm</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
