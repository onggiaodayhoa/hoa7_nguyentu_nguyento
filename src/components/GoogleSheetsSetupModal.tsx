import React, { useState } from 'react';
import { GoogleSyncConfig } from '../types/chemistry';
import {
  GOOGLE_APPS_SCRIPT_TEMPLATE,
  SAMPLE_SHEET_COLUMNS,
  saveConfig,
} from '../services/googleSheetsService';
import {
  X,
  Copy,
  Check,
  FileSpreadsheet,
  ExternalLink,
  Code2,
  HelpCircle,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSyncConfig;
  onSaveConfig: (cfg: GoogleSyncConfig) => void;
}

export const GoogleSheetsSetupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [appsScriptUrl, setAppsScriptUrl] = useState(config.appsScriptUrl || '');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(config.spreadsheetUrl || '');
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'template' | 'script'>('guide');
  const [testStatus, setTestStatus] = useState<{
    loading: boolean;
    result?: 'success' | 'error';
    message?: string;
  }>({ loading: false });

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleTestConnection = async () => {
    if (!appsScriptUrl.trim()) {
      setTestStatus({
        loading: false,
        result: 'error',
        message: 'Vui lòng dán URL Tập lệnh ứng dụng (Web App URL) vào ô trên!',
      });
      return;
    }

    setTestStatus({ loading: true });
    try {
      const url = appsScriptUrl.includes('?')
        ? `${appsScriptUrl}&t=${Date.now()}`
        : `${appsScriptUrl}?t=${Date.now()}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'success') {
        setTestStatus({
          loading: false,
          result: 'success',
          message: 'Kết nối thành công! Google Sheet đã sẵn sàng nhận dữ liệu.',
        });
      } else {
        setTestStatus({
          loading: false,
          result: 'error',
          message: data.message || 'Script phản hồi nhưng trạng thái không hợp lệ.',
        });
      }
    } catch (err: any) {
      // Due to Google Apps Script CORS redirects, if network error occurs, we advise setting access to Anyone
      setTestStatus({
        loading: false,
        result: 'error',
        message:
          'Không thể kết nối. Hãy đảm bảo bạn đã chọn "Ai có quyền truy cập: Bất kỳ ai (Anyone)" khi Triển khai ứng dụng web.',
      });
    }
  };

  const handleSave = () => {
    const updated: GoogleSyncConfig = {
      ...config,
      appsScriptUrl: appsScriptUrl.trim(),
      spreadsheetUrl: spreadsheetUrl.trim(),
      status: 'idle',
    };
    saveConfig(updated);
    onSaveConfig(updated);
    onClose();
  };

  const handleDownloadSampleCsv = () => {
    const headers = SAMPLE_SHEET_COLUMNS.map(c => `"${c.name}"`).join(',');
    const sampleRow = SAMPLE_SHEET_COLUMNS.map(c => `"${c.sample}"`).join(',');
    const content = '\uFEFF' + headers + '\r\n' + sampleRow;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mau_Trang_Tinh_Hoa_Hoc_7.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-slate-800">
                Cài Đặt Đồng Bộ 2 Chiều Google Sheets & Tập Lệnh Ứng Dụng
              </h3>
              <p className="text-xs text-slate-500">
                Tự động lưu điểm học sinh & cho phép giáo viên kiểm tra sổ điểm mọi lúc
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

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-3">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>1. Hướng dẫn cài đặt</span>
          </button>

          <button
            onClick={() => setActiveTab('template')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'template'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>2. Cấu trúc Tệp mẫu Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'script'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>3. Mã Tập Lệnh (Apps Script)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 flex-1">
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-emerald-900 text-xs sm:text-sm leading-relaxed">
                <span className="font-bold block text-sm mb-1">
                  💡 Cách hoạt động của hệ thống đồng bộ:
                </span>
                Khi học sinh nộp bài, ứng dụng sẽ gửi dữ liệu trực tiếp vào Google Sheet của thầy cô. Khi thầy cô mở trang web, hệ thống tự động kéo dữ liệu mới nhất về <strong>Sổ Điểm & Báo Cáo Học Sinh</strong>.
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="text-xs sm:text-sm">
                    <strong>Tạo Google Trang tính mới:</strong> Truy cập{' '}
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5"
                    >
                      sheets.new <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    để tạo một trang tính mới. Đặt tên là <em>"Sổ Điểm & Báo Cáo Học Sinh - Hóa Học 7"</em>.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="text-xs sm:text-sm">
                    <strong>Mở Tập Lệnh Ứng Dụng (Apps Script):</strong> Trên menu Google Sheets, vào <strong>Tiện ích mở rộng (Extensions)</strong> &rarr; <strong>Apps Script</strong>.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="text-xs sm:text-sm">
                    <strong>Dán mã lệnh:</strong> Chuyển sang tab <strong>3. Mã Tập Lệnh</strong> ở trên, bấm nút <strong>"Sao chép toàn bộ mã"</strong> và dán đè vào trình soạn thảo Apps Script, sau đó ấn biểu tượng Lưu (Ctrl + S).
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div className="text-xs sm:text-sm">
                    <strong>Triển khai Web App:</strong> Bấm nút màu xanh <strong>Triển khai (Deploy)</strong> &rarr; <strong>Tùy chọn triển khai mới (New deployment)</strong>:
                    <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-600 text-xs">
                      <li>Loại: <strong>Ứng dụng web (Web app)</strong></li>
                      <li>Người thực thi (Execute as): <strong>Tôi (Me)</strong></li>
                      <li>Ai có quyền truy cập (Who has access): <strong>Bất kỳ ai (Anyone)</strong> (để học sinh gửi bài được)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </span>
                  <div className="text-xs sm:text-sm">
                    <strong>Dán URL vào ô bên dưới:</strong> Sao chép <strong>URL ứng dụng web</strong> (có dạng <code>https://script.google.com/macros/s/.../exec</code>) và dán vào đây:
                  </div>
                </div>
              </div>

              {/* URL Input & Test */}
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  URL Tập Lệnh Ứng Dụng (Apps Script Web App URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={appsScriptUrl}
                    onChange={e => setAppsScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testStatus.loading}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testStatus.loading ? 'animate-spin' : ''}`} />
                    <span>{testStatus.loading ? 'Đang thử...' : 'Kiểm tra'}</span>
                  </button>
                </div>

                {testStatus.message && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      testStatus.result === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {testStatus.result === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{testStatus.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'template' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    Tệp Mẫu Google Sheets: "So_Diem_Chi_Tiet"
                  </h4>
                  <p className="text-xs text-slate-500">
                    Bao gồm đầy đủ các trường dữ liệu theo quy chuẩn sổ điểm THCS
                  </p>
                </div>

                <button
                  onClick={handleDownloadSampleCsv}
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải tệp mẫu (.CSV / Excel)</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-600 text-white font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Cột</th>
                      <th className="py-2.5 px-3">Tên Tiêu Đề</th>
                      <th className="py-2.5 px-3">Ví Dụ Dữ Liệu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SAMPLE_SHEET_COLUMNS.map((col, idx) => (
                      <tr key={col.key} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono text-slate-400 font-bold">
                          {String.fromCharCode(65 + idx)}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800">
                          {col.name}
                        </td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">
                          {col.sample}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    Mã Nguồn Google Apps Script (Tập Lệnh Ứng Dụng)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ đầy đủ doPost (nhận bài nộp) và doGet (kéo sổ điểm 2 chiều)
                  </p>
                </div>

                <button
                  onClick={handleCopyScript}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép toàn bộ mã</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[300px] border border-slate-800">
                <pre>{GOOGLE_APPS_SCRIPT_TEMPLATE}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-semibold"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30"
          >
            Lưu Cấu Hình Đồng Bộ
          </button>
        </div>
      </div>
    </div>
  );
};
