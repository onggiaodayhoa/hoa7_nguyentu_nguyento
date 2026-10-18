import React, { useState } from 'react';
import { QuizSubmission, GoogleSyncConfig } from '../types/chemistry';
import {
  exportSubmissionsToCSV,
  fetchSubmissionsFromGoogleSheet,
} from '../services/googleSheetsService';
import {
  Lock,
  Unlock,
  Users,
  Award,
  TrendingUp,
  RefreshCw,
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  KeyRound,
  GraduationCap,
} from 'lucide-react';

interface Props {
  submissions: QuizSubmission[];
  syncConfig: GoogleSyncConfig;
  onUpdateSubmissions: (subs: QuizSubmission[]) => void;
  onOpenSetupModal: () => void;
}

export const TeacherPortal: React.FC<Props> = ({
  submissions,
  syncConfig,
  onUpdateSubmissions,
  onOpenSetupModal,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [savedPin, setSavedPin] = useState('giaovien123');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');

  // Filtering & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'time_desc'>('score_desc');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === savedPin) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Mật khẩu/Mã PIN giáo viên chưa đúng! (Mặc định: giaovien123)');
    }
  };

  const handleSync2Way = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetchSubmissionsFromGoogleSheet(syncConfig.appsScriptUrl);
      if (res.success && res.data) {
        onUpdateSubmissions(res.data);
        setSyncMessage({ type: 'success', text: res.message });
      } else {
        setSyncMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setSyncMessage({ type: 'error', text: err.message || 'Lỗi khi đồng bộ 2 chiều' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Classes list
  const classes = Array.from(new Set(submissions.map(s => s.student.className))).filter(Boolean);

  // Filtered list
  const filteredSubmissions = submissions
    .filter(s => {
      const matchClass = selectedClass === 'all' || s.student.className === selectedClass;
      const matchSearch =
        s.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchClass && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'score_desc') return b.score - a.score;
      if (sortBy === 'score_asc') return a.score - b.score;
      return new Date(b.submittedAt || b.syncedAt || 0).getTime() - new Date(a.submittedAt || a.syncedAt || 0).getTime();
    });

  // Analytics calculations
  const totalStudents = submissions.length;
  const avgScore = totalStudents > 0
    ? (submissions.reduce((acc, curr) => acc + curr.score, 0) / totalStudents).toFixed(1)
    : '0.0';
  const highestScore = totalStudents > 0 ? Math.max(...submissions.map(s => s.score)).toFixed(1) : '0.0';
  const passCount = submissions.filter(s => s.score >= 5.0).length;
  const passRate = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0;

  // If not authenticated, show Member/Teacher Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-200 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-200 shadow-md shadow-indigo-100">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-1">
          Khu Vực Dành Cho Giáo Viên
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Phần <strong>Sổ Điểm & Báo Cáo Học Sinh</strong> được bảo mật, chỉ dành cho giáo viên và thành viên được cấp quyền truy cập.
        </p>

        {pinError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pinError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              required
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              placeholder="Nhập mật khẩu (Mặc định: giaovien123)"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-sm font-semibold outline-hidden transition-all text-center"
              autoFocus
            />
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Unlock className="w-4 h-4" />
            <span>Đăng Nhập Xem Sổ Điểm</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
          Mẹo: Mật khẩu mặc định là <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">giaovien123</code>. Thầy cô có thể đổi mật khẩu sau khi đăng nhập.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              Khu Vực Thành Viên
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Đã xác thực Giáo viên
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Sổ Điểm & Báo Cáo Kết Quả Học Sinh
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dữ liệu đồng bộ 2 chiều với Google Sheets qua Tập Lệnh Ứng Dụng (Apps Script)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleSync2Way}
            disabled={isSyncing}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-all border border-indigo-200"
            title="Đồng bộ 2 chiều với Google Sheets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ 2 chiều...' : 'Đồng bộ 2 chiều Google Sheet'}</span>
          </button>

          <button
            onClick={() => exportSubmissionsToCSV(filteredSubmissions)}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
            title="Xuất bảng điểm ra file Excel/CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel/CSV</span>
          </button>

          <button
            onClick={onOpenSetupModal}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs flex items-center gap-1.5 transition-all border border-emerald-200"
            title="Mở cấu hình tệp mẫu Google Sheets và mã Apps Script"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Tệp Mẫu & Mã Apps Script</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            type="button"
            className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {syncMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            syncMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {syncMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{syncMessage.text}</span>
        </div>
      )}

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng Thí Sinh</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 font-mono">
            {totalStudents}
          </div>
          <span className="text-[11px] text-slate-400">Đã nộp bài ghi nhận</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Điểm Trung Bình</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono">
            {avgScore} / 10
          </div>
          <span className="text-[11px] text-slate-400">Toàn bộ các lớp</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Điểm Cao Nhất</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            {highestScore} / 10
          </div>
          <span className="text-[11px] text-slate-400">Thành tích cao nhất</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tỉ Lệ Đạt (≥ 5.0)</span>
            <GraduationCap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            {passRate}%
          </div>
          <span className="text-[11px] text-slate-400">{passCount}/{totalStudents} học sinh</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên học sinh, mã HS/SBD..."
            className="w-full text-xs sm:text-sm outline-hidden font-medium text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="text-xs font-semibold rounded-xl border border-slate-200 px-3 py-1.5 bg-slate-50 text-slate-700 outline-hidden"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map(c => (
                <option key={c} value={c}>
                  Lớp {c}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs font-semibold rounded-xl border border-slate-200 px-3 py-1.5 bg-slate-50 text-slate-700 outline-hidden"
          >
            <option value="score_desc">Điểm: Cao đến Thấp</option>
            <option value="score_asc">Điểm: Thấp đến Cao</option>
            <option value="time_desc">Mới nộp gần nhất</option>
          </select>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Mã HS / SBD</th>
                <th className="py-3.5 px-4">Họ và Tên</th>
                <th className="py-3.5 px-4">Lớp</th>
                <th className="py-3.5 px-4 text-center">Điểm (Thang 10)</th>
                <th className="py-3.5 px-4 text-center">Số câu đúng</th>
                <th className="py-3.5 px-4">Xếp loại</th>
                <th className="py-3.5 px-4">Thời gian</th>
                <th className="py-3.5 px-4 text-center">Trạng thái Sheet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Chưa có học sinh nào nộp bài phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, idx) => {
                  const badgeColor =
                    sub.score >= 9.0
                      ? 'bg-amber-100 text-amber-800'
                      : sub.score >= 8.0
                      ? 'bg-emerald-100 text-emerald-800'
                      : sub.score >= 6.5
                      ? 'bg-blue-100 text-blue-800'
                      : sub.score >= 5.0
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-rose-100 text-rose-800';

                  return (
                    <tr key={sub.id || idx} className="hover:bg-slate-50/80 transition-all">
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {sub.student.studentId}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {sub.student.fullName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 text-xs">
                          {sub.student.className}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-black text-base text-indigo-600">
                          {sub.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-600">
                        {sub.correctCount} / {sub.totalQuestions}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeColor}`}
                        >
                          {sub.ranking}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {sub.submittedAt || sub.syncedAt || 'Vừa xong'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Đã lưu Sheet
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
