import React, { useEffect } from 'react';
import { QuizSubmission } from '../types/chemistry';
import confetti from 'canvas-confetti';
import {
  Award,
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  CloudCheck,
  FileSpreadsheet,
  Share2,
  Printer,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface Props {
  submission: QuizSubmission;
  onRetake: () => void;
  onSyncToSheet: () => void;
  isSyncing: boolean;
  syncSuccess?: boolean;
}

export const QuizResults: React.FC<Props> = ({
  submission,
  onRetake,
  onSyncToSheet,
  isSyncing,
  syncSuccess,
}) => {
  useEffect(() => {
    if (submission.score >= 8.0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore confetti errors
      }
    }
  }, [submission.score]);

  const getRankBadge = () => {
    switch (submission.ranking) {
      case 'XUẤT SẮC':
        return {
          bg: 'from-amber-500 to-yellow-400 text-amber-950',
          border: 'border-yellow-300',
          title: 'Xuất Sắc - Đỉnh Cao Hoá Học!',
          desc: 'Em đã nắm vững toàn bộ lý thuyết Rutherford - Bohr và 20 nguyên tố đầu tiên!',
        };
      case 'GIỎI':
        return {
          bg: 'from-emerald-500 to-teal-400 text-emerald-950',
          border: 'border-emerald-300',
          title: 'Giỏi - Rất Tốt!',
          desc: 'Em đã hiểu rất chắc kiến thức nguyên tử và quy tắc kí hiệu hoá học.',
        };
      case 'KHÁ':
        return {
          bg: 'from-blue-500 to-indigo-400 text-blue-950',
          border: 'border-blue-300',
          title: 'Khá - Tiến Bộ Lớn!',
          desc: 'Em hãy ôn lại một vài kí hiệu và cách sắp xếp electron để đạt điểm tối đa nhé.',
        };
      case 'ĐẠT':
        return {
          bg: 'from-orange-500 to-amber-400 text-orange-950',
          border: 'border-orange-300',
          title: 'Đạt Yêu Cầu',
          desc: 'Em cần luyện tập thêm phần sửa sai kí hiệu và so sánh các nguyên tử cùng nguyên tố.',
        };
      default:
        return {
          bg: 'from-rose-500 to-pink-400 text-rose-950',
          border: 'border-rose-300',
          title: 'Cần Cố Gắng Thêm',
          desc: 'Hãy xem lại phần giải thích chi tiết bên dưới và thử làm lại bài nhé!',
        };
    }
  };

  const rankInfo = getRankBadge();
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs < 10 ? '0' : ''}${secs} giây`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Banner Kết Quả Chấm Điểm */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex flex-col items-center justify-center shadow-xl shadow-indigo-600/30 shrink-0">
              <span className="text-3xl font-black font-mono leading-none">
                {submission.score.toFixed(1)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 mt-1">
                Thang Điểm 10
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 mb-2">
                <Trophy className="w-3.5 h-3.5" />
                <span>PHIẾU CHẤM ĐIỂM HỌC TẬP TỰ ĐỘNG</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
                {submission.student.fullName}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500 mt-1">
                <span>Lớp: <strong className="text-slate-700">{submission.student.className}</strong></span>
                <span>Mã HS: <strong className="font-mono text-slate-700">{submission.student.studentId}</strong></span>
                <span>Trường: <strong className="text-slate-700">{submission.student.schoolName}</strong></span>
              </div>
            </div>
          </div>

          {/* Ranking Pill */}
          <div className="text-center md:text-right">
            <div
              className={`inline-block px-4 py-2 rounded-2xl bg-gradient-to-r ${rankInfo.bg} font-black text-sm sm:text-base shadow-md uppercase tracking-wider`}
            >
              Xếp loại: {submission.ranking}
            </div>
            <p className="text-xs text-slate-500 mt-2 max-w-xs text-center md:text-right">
              {rankInfo.desc}
            </p>
          </div>
        </div>

        {/* 3 Cognitive Level Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100">
            <span className="text-xs font-bold text-blue-700 block mb-1">
              1. Nhận Biết (Rutherford - Bohr, amu)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-black text-blue-900">
                {submission.breakdown.nhanBiet.correct} / {submission.breakdown.nhanBiet.total}
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {Math.round((submission.breakdown.nhanBiet.correct / (submission.breakdown.nhanBiet.total || 1)) * 100)}%
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100">
            <span className="text-xs font-bold text-emerald-700 block mb-1">
              2. Thông Hiểu (20 Nguyên Tố Đầu Tiên)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-black text-emerald-900">
                {submission.breakdown.thongHieu.correct} / {submission.breakdown.thongHieu.total}
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                {Math.round((submission.breakdown.thongHieu.correct / (submission.breakdown.thongHieu.total || 1)) * 100)}%
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100">
            <span className="text-xs font-bold text-purple-700 block mb-1">
              3. Vận Dụng (So Sánh & Sửa Sai Kí Hiệu)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-black text-purple-900">
                {submission.breakdown.vanDung.correct} / {submission.breakdown.vanDung.total}
              </span>
              <span className="text-xs font-semibold text-purple-600">
                {Math.round((submission.breakdown.vanDung.correct / (submission.breakdown.vanDung.total || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Sync and Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-600 font-medium">
              Thời gian hoàn thành: <strong>{formatTime(submission.durationSeconds)}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onSyncToSheet}
              disabled={isSyncing}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs ${
                syncSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>
                {isSyncing
                  ? 'Đang đồng bộ...'
                  : syncSuccess
                  ? '✓ Đã đồng bộ Google Sheet'
                  : 'Đồng bộ kết quả vào Google Sheet'}
              </span>
            </button>

            <button
              onClick={handlePrint}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>In kết quả</span>
            </button>

            <button
              onClick={onRetake}
              type="button"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm bài lại (Đảo đề mới)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
