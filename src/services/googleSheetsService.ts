import { QuizSubmission, GoogleSyncConfig } from '../types/chemistry';

const STORAGE_KEY_SUBMISSIONS = 'hoa7_submissions_cache_v1';
const STORAGE_KEY_CONFIG = 'hoa7_google_sync_config_v1';

export const DEFAULT_CONFIG: GoogleSyncConfig = {
  appsScriptUrl: '',
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
  autoSync: true,
  status: 'idle',
};

// Mẫu code Google Apps Script (Tập lệnh ứng dụng) chuẩn để người dùng copy 1-click
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * =========================================================================
 * BỘ TẬP LỆNH ỨNG DỤNG (GOOGLE APPS SCRIPT) ĐỒNG BỘ 2 CHIỀU "SỔ ĐIỂM & BÁO CÁO HỌC SINH"
 * Môn: Hóa học 7 - Bài Nguyên tử & Bảng tuần hoàn (GDPT 2018)
 * =========================================================================
 * HƯỚNG DẪN CÀI ĐẶT 3 BƯỚC:
 * 1. Mở Google Sheet của bạn -> Vào menu "Tiện ích mở rộng" (Extensions) -> "Apps Script"
 * 2. Xóa hết mã cũ, dán toàn bộ đoạn mã này vào -> Bấm Lưu (Ctrl + S)
 * 3. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment)
 *    - Chọn loại: "Ứng dụng web" (Web app)
 *    - Mô tả: "Đồng bộ sổ điểm Hóa học 7"
 *    - Người thực thi: "Tôi" (Me)
 *    - Ai có quyền truy cập: "Bất kỳ ai" (Anyone)
 *    - Bấm "Triển khai" -> Cấp quyền khi được hỏi -> Sao chép URL Ứng dụng web dán vào web app!
 * =========================================================================
 */

function setupSheetHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("So_Diem_Chi_Tiet");
  if (!sheet) {
    sheet = ss.insertSheet("So_Diem_Chi_Tiet");
  }
  
  // Thiết lập tiêu đề cột chuẩn
  const headers = [
    "Thời Gian",
    "Mã Học Sinh",
    "Họ Và Tên",
    "Lớp",
    "Trường",
    "Điểm Số (Thang 10)",
    "Số Câu Đúng",
    "Tổng Câu",
    "Xếp Loại",
    "Thời Gian Làm Bài (giây)",
    "Nhận Biết (Đúng/Tổng)",
    "Thông Hiểu (Đúng/Tổng)",
    "Vận Dụng (Đúng/Tổng)",
    "Chi Tiết Đáp Án"
  ];
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#3b82f6").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Xử lý khi ứng dụng gửi kết quả bài làm lên Google Sheet (Gửi 1 chiều hoặc 2 chiều)
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const sheet = setupSheetHeaders();
    let data;
    
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    
    if (data.action === "save_submission" || data.student) {
      const sub = data.submission || data;
      const student = sub.student || {};
      const breakdown = sub.breakdown || {};
      
      const newRow = [
        new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
        student.studentId || "HS" + Math.floor(Math.random() * 10000),
        student.fullName || "Ẩn danh",
        student.className || "Chưa rõ",
        student.schoolName || "THCS",
        sub.score !== undefined ? sub.score : 0,
        sub.correctCount !== undefined ? sub.correctCount : 0,
        sub.totalQuestions !== undefined ? sub.totalQuestions : 0,
        sub.ranking || "CHƯA XẾP LOẠI",
        sub.durationSeconds || 0,
        (breakdown.nhanBiet?.correct || 0) + "/" + (breakdown.nhanBiet?.total || 0),
        (breakdown.thongHieu?.correct || 0) + "/" + (breakdown.thongHieu?.total || 0),
        (breakdown.vanDung?.correct || 0) + "/" + (breakdown.vanDung?.total || 0),
        JSON.stringify(sub.answersDetail || {})
      ];
      
      sheet.appendRow(newRow);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Lưu điểm vào Google Sheet thành công!",
        studentName: student.fullName,
        score: sub.score
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Yêu cầu không hợp lệ"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Xử lý khi Giáo viên đăng nhập kéo dữ liệu 2 chiều về ứng dụng
function doGet(e) {
  try {
    const sheet = setupSheetHeaders();
    const rows = sheet.getDataRange().getValues();
    
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        total: 0,
        submissions: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = rows[0];
    const submissions = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[1] && !row[2]) continue; // bỏ qua hàng trống
      
      submissions.push({
        id: "sheet_row_" + i,
        submittedAt: row[0],
        student: {
          studentId: String(row[1]),
          fullName: String(row[2]),
          className: String(row[3]),
          schoolName: String(row[4]),
          startedAt: String(row[0])
        },
        score: Number(row[5]) || 0,
        correctCount: Number(row[6]) || 0,
        totalQuestions: Number(row[7]) || 0,
        ranking: String(row[8]),
        durationSeconds: Number(row[9]) || 0,
        syncedToGoogleSheet: true,
        syncedAt: String(row[0])
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      total: submissions.length,
      submissions: submissions
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

// Cấu trúc mẫu Google Sheets để người dùng tải hoặc tham khảo
export const SAMPLE_SHEET_COLUMNS = [
  { key: 'timestamp', name: 'Thời Gian', sample: '18/10/2026 14:30:00' },
  { key: 'studentId', name: 'Mã Học Sinh / SBD', sample: 'HS70105' },
  { key: 'fullName', name: 'Họ Và Tên', sample: 'Nguyễn Văn An' },
  { key: 'className', name: 'Lớp', sample: '7A1' },
  { key: 'schoolName', name: 'Trường', sample: 'THCS Lê Quý Đôn' },
  { key: 'score', name: 'Điểm Số (Thang 10)', sample: '9.5' },
  { key: 'correctCount', name: 'Số Câu Đúng', sample: '19' },
  { key: 'totalQuestions', name: 'Tổng Số Câu', sample: '20' },
  { key: 'ranking', name: 'Xếp Loại', sample: 'XUẤT SẮC' },
  { key: 'durationSeconds', name: 'Thời Gian Làm (giây)', sample: '185' },
  { key: 'nhanBiet', name: 'Phần Nhận Biết', sample: '5/5' },
  { key: 'thongHieu', name: 'Phần Thông Hiểu', sample: '10/10' },
  { key: 'vanDung', name: 'Phần Vận Dụng', sample: '4/5' },
];

// Dữ liệu mẫu ban đầu cho Sổ điểm
export const SEED_SUBMISSIONS: QuizSubmission[] = [
  {
    id: 'seed-1',
    student: {
      fullName: 'Nguyễn Trần Minh Anh',
      studentId: 'HS7001',
      className: '7A1',
      schoolName: 'THCS Lê Quý Đôn',
      startedAt: '2026-10-18T08:15:00',
      submittedAt: '2026-10-18T08:22:30',
    },
    score: 9.5,
    correctCount: 19,
    totalQuestions: 20,
    durationSeconds: 450,
    ranking: 'XUẤT SẮC',
    breakdown: {
      nhanBiet: { correct: 5, total: 5 },
      thongHieu: { correct: 10, total: 10 },
      vanDung: { correct: 4, total: 5 },
    },
    answersDetail: {},
    syncedToGoogleSheet: true,
    syncedAt: '2026-10-18T08:22:32',
  },
  {
    id: 'seed-2',
    student: {
      fullName: 'Trần Quang Dũng',
      studentId: 'HS7002',
      className: '7A1',
      schoolName: 'THCS Lê Quý Đôn',
      startedAt: '2026-10-18T08:30:00',
      submittedAt: '2026-10-18T08:39:10',
    },
    score: 8.5,
    correctCount: 17,
    totalQuestions: 20,
    durationSeconds: 550,
    ranking: 'GIỎI',
    breakdown: {
      nhanBiet: { correct: 5, total: 5 },
      thongHieu: { correct: 9, total: 10 },
      vanDung: { correct: 3, total: 5 },
    },
    answersDetail: {},
    syncedToGoogleSheet: true,
    syncedAt: '2026-10-18T08:39:15',
  },
  {
    id: 'seed-3',
    student: {
      fullName: 'Lê Hoàng Bảo Ngọc',
      studentId: 'HS7003',
      className: '7A2',
      schoolName: 'THCS Lê Quý Đôn',
      startedAt: '2026-10-18T09:00:00',
      submittedAt: '2026-10-18T09:07:45',
    },
    score: 10.0,
    correctCount: 20,
    totalQuestions: 20,
    durationSeconds: 465,
    ranking: 'XUẤT SẮC',
    breakdown: {
      nhanBiet: { correct: 5, total: 5 },
      thongHieu: { correct: 10, total: 10 },
      vanDung: { correct: 5, total: 5 },
    },
    answersDetail: {},
    syncedToGoogleSheet: true,
    syncedAt: '2026-10-18T09:07:50',
  },
  {
    id: 'seed-4',
    student: {
      fullName: 'Phạm Đức Duy',
      studentId: 'HS7004',
      className: '7A2',
      schoolName: 'THCS Lê Quý Đôn',
      startedAt: '2026-10-18T09:15:00',
      submittedAt: '2026-10-18T09:25:20',
    },
    score: 7.0,
    correctCount: 14,
    totalQuestions: 20,
    durationSeconds: 620,
    ranking: 'KHÁ',
    breakdown: {
      nhanBiet: { correct: 4, total: 5 },
      thongHieu: { correct: 8, total: 10 },
      vanDung: { correct: 2, total: 5 },
    },
    answersDetail: {},
    syncedToGoogleSheet: true,
    syncedAt: '2026-10-18T09:25:22',
  },
];

// Helper functions for Local Storage & Sync
export function getSavedConfig(): GoogleSyncConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Error reading config', err);
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(cfg: GoogleSyncConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cfg));
  } catch (err) {
    console.error('Error saving config', err);
  }
}

export function getCachedSubmissions(): QuizSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading cached submissions', err);
  }
  // Initialize with seed data on first visit
  saveCachedSubmissions(SEED_SUBMISSIONS);
  return SEED_SUBMISSIONS;
}

export function saveCachedSubmissions(submissions: QuizSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
  } catch (err) {
    console.error('Error caching submissions', err);
  }
}

/**
 * Gửi bài làm học sinh lên Google Sheet thông qua Apps Script Web App
 */
export async function sendSubmissionToGoogleSheet(
  submission: QuizSubmission,
  scriptUrl?: string
): Promise<{ success: boolean; message: string }> {
  const url = (scriptUrl || getSavedConfig().appsScriptUrl || '').trim();

  // If no script URL configured, mark local as pending
  if (!url) {
    return {
      success: false,
      message: 'Chưa cấu hình URL Tập lệnh ứng dụng Google Sheets. Đã lưu vào bộ nhớ cục bộ an toàn.',
    };
  }

  try {
    const payload = {
      action: 'save_submission',
      submission: submission,
    };

    // Google Apps Script redirect handling with standard fetch
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // Standard cross-origin pattern for Google Apps Script Web App
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Đồng bộ kết quả lên Google Sheet thành công!',
    };
  } catch (err: any) {
    console.error('Error sending to Google Sheet:', err);
    return {
      success: false,
      message: `Lỗi kết nối: ${err?.message || 'Không thể gửi dữ liệu'}`,
    };
  }
}

/**
 * Kéo dữ liệu 2 chiều từ Google Sheet về Sổ Điểm
 */
export async function fetchSubmissionsFromGoogleSheet(
  scriptUrl?: string
): Promise<{ success: boolean; data?: QuizSubmission[]; message: string }> {
  const url = (scriptUrl || getSavedConfig().appsScriptUrl || '').trim();

  if (!url) {
    return {
      success: false,
      message: 'Chưa cấu hình URL Tập lệnh ứng dụng Google Sheets.',
    };
  }

  try {
    const fetchUrl = url.includes('?') ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;
    const res = await fetch(fetchUrl);
    if (!res.ok) {
      throw new Error(`HTTP status ${res.status}`);
    }
    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.submissions)) {
      // Merge with local submissions
      const local = getCachedSubmissions();
      const map = new Map<string, QuizSubmission>();
      local.forEach(s => map.set(s.student.studentId + '_' + s.student.fullName, s));
      json.submissions.forEach((s: QuizSubmission) => {
        map.set(s.student.studentId + '_' + s.student.fullName, s);
      });
      const merged = Array.from(map.values());
      saveCachedSubmissions(merged);

      return {
        success: true,
        data: merged,
        message: `Đã đồng bộ ${json.submissions.length} bài nộp từ Google Sheet!`,
      };
    }
    return {
      success: false,
      message: json.message || 'Phản hồi từ Google Sheet không hợp lệ',
    };
  } catch (err: any) {
    console.error('Error fetching from Google Sheet:', err);
    return {
      success: false,
      message: `Không thể đọc dữ liệu: ${err.message || 'Lỗi mạng hoặc CORS'}. Đang dùng dữ liệu lưu tạm.`,
    };
  }
}

/**
 * Xuất dữ liệu Sổ Điểm ra file CSV tương thích Excel với UTF-8 BOM
 */
export function exportSubmissionsToCSV(submissions: QuizSubmission[]): void {
  const headers = [
    'Thời Gian Nộp',
    'Mã Học Sinh',
    'Họ Và Tên',
    'Lớp',
    'Trường',
    'Điểm Số',
    'Số Câu Đúng',
    'Tổng Số Câu',
    'Xếp Loại',
    'Thời Gian Làm (giây)',
    'Nhận Biết',
    'Thông Hiểu',
    'Vận Dụng',
  ];

  const rows = submissions.map(sub => [
    `"${sub.submittedAt || sub.syncedAt || new Date().toLocaleString('vi-VN')}"`,
    `"${sub.student.studentId}"`,
    `"${sub.student.fullName}"`,
    `"${sub.student.className}"`,
    `"${sub.student.schoolName}"`,
    sub.score,
    sub.correctCount,
    sub.totalQuestions,
    `"${sub.ranking}"`,
    sub.durationSeconds,
    `"${sub.breakdown.nhanBiet.correct}/${sub.breakdown.nhanBiet.total}"`,
    `"${sub.breakdown.thongHieu.correct}/${sub.breakdown.thongHieu.total}"`,
    `"${sub.breakdown.vanDung.correct}/${sub.breakdown.vanDung.total}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `So_Diem_Hoa_Hoc_7_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
