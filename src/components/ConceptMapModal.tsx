import React from 'react';
import { X, Network, Atom, Sparkles, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptMapModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-xl text-slate-800">
                Sơ Đồ Tư Duy: Kết Hợp Liên Hoàn Bài 2 & Bài 3
              </h3>
              <p className="text-xs text-slate-500">
                Mối quan hệ bản chất: Từ Cấu Tạo Nguyên Tử (Bài 2) &rarr; Nguyên Tố Hoá Học (Bài 3)
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 flex-1">
          {/* Key Principle Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-2xl p-4 sm:p-5 shadow-md">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Điểm giao thoa cốt lõi của Chương I:
            </div>
            <p className="text-sm sm:text-base font-semibold leading-relaxed">
              &ldquo;Số proton trong hạt nhân nguyên tử (Bài 2) chính là <strong>Số hiệu nguyên tử Z</strong> của nguyên tố hoá học (Bài 3). Cứ các nguyên tử có <strong>cùng số hạt proton</strong> thì thuộc <strong>cùng một nguyên tố hoá học</strong>.&rdquo;
            </p>
          </div>

          {/* 3-Step Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {/* Step 1: Bài 2 */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[11px]">
                  BÀI 2: NGUYÊN TỬ
                </span>
                <Atom className="w-5 h-5 text-blue-600" />
              </div>

              <h4 className="font-black text-sm text-blue-950">
                1. Cấu Trúc Nguyên Tử
              </h4>

              <ul className="text-xs space-y-1.5 text-blue-900 leading-relaxed">
                <li>&bull; <strong>Hạt nhân ở tâm:</strong> gồm proton (+1) và neutron (0).</li>
                <li>&bull; <strong>Vỏ electron:</strong> các hạt mang điện âm (-1) xếp theo từng lớp.</li>
                <li>&bull; <strong>Mô hình Bo:</strong> Lớp 1 tối đa 2e, Lớp 2 tối đa 8e. Lớp ngoài cùng quyết định tính chất.</li>
                <li>&bull; <strong>Trung hòa điện:</strong> Số proton = Số electron (p = e).</li>
                <li>&bull; <strong>Khối lượng:</strong> 1p ≈ 1n ≈ 1 amu, khối lượng electron rất nhỏ &rarr; tập trung ở hạt nhân.</li>
              </ul>
            </div>

            {/* Step 2: Cầu nối Bài 2 -> Bài 3 */}
            <div className="bg-purple-50/70 border-2 border-purple-300 rounded-2xl p-4 space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[11px]">
                  CẦU NỐI BẢN CHẤT
                </span>
                <Network className="w-5 h-5 text-purple-600" />
              </div>

              <h4 className="font-black text-sm text-purple-950">
                2. Số Proton (p) = Số Hiệu (Z)
              </h4>

              <ul className="text-xs space-y-1.5 text-purple-900 leading-relaxed">
                <li>&bull; Mỗi nguyên tố chỉ có duy nhất <strong>một số hiệu nguyên tử $Z$</strong>.</li>
                <li>&bull; Ví dụ: Chì có $82p$ ($Z=82$), Vàng có $79p$ ($Z=79$).</li>
                <li>&bull; <strong>Đồng vị trong tự nhiên:</strong> Các nguyên tử cùng số $p$ có thể có số $n$ khác nhau:
                  <div className="mt-1 font-mono text-[11px] bg-white p-2 rounded-lg border border-purple-200">
                    Hydrogen: (1p, 0n), (1p, 1n), (1p, 2n)<br />
                    Oxygen: (8p, 8n), (8p, 9n), (8p, 10n)
                  </div>
                </li>
                <li>&bull; Dù số $n$ khác nhau dẫn đến khối lượng amu khác nhau, chúng vẫn thuộc cùng một nguyên tố!</li>
              </ul>
            </div>

            {/* Step 3: Bài 3 */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[11px]">
                  BÀI 3: NGUYÊN TỐ
                </span>
                <Layers className="w-5 h-5 text-emerald-600" />
              </div>

              <h4 className="font-black text-sm text-emerald-950">
                3. Nguyên Tố & Đời Sống
              </h4>

              <ul className="text-xs space-y-1.5 text-emerald-900 leading-relaxed">
                <li>&bull; <strong>118 nguyên tố</strong> đã tìm ra.</li>
                <li>&bull; <strong>20 nguyên tố đầu tiên:</strong> chuẩn IUPAC và khối lượng $amu$.</li>
                <li>&bull; <strong>Kí hiệu quốc tế:</strong> chữ đầu HOA, chữ sau thường (He, Na, Cl...).</li>
                <li>&bull; <strong>Nguồn gốc Latin:</strong> Sodium ($Na \leftarrow Natrium$), Potassium ($K \leftarrow Kalium$), Iron ($Fe \leftarrow Ferrum$)...</li>
                <li>&bull; <strong>Tạo nên cơ thể người:</strong> $96\%$ là C, H, O, N (Oxygen chiếm 65%). Sắt trong máu, Iodine cho tuyến giáp (0,15mg/ngày).</li>
              </ul>
            </div>
          </div>

          {/* Table of the 4 most abundant elements combining Lesson 2 & Lesson 3 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Bảng Tổng Hợp 4 Nguyên Tố Chính Trong Cơ Thể Người (Kết hợp Bài 2 & 3):
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-indigo-600 text-white font-bold">
                  <tr>
                    <th className="py-2 px-2.5">Nguyên tố (Bài 3)</th>
                    <th className="py-2 px-2.5 text-center">Kí hiệu</th>
                    <th className="py-2 px-2.5 text-center">Số proton (Z)</th>
                    <th className="py-2 px-2.5 text-center">Cấu hình electron (Bài 2)</th>
                    <th className="py-2 px-2.5 text-center">Khối lượng (amu)</th>
                    <th className="py-2 px-2.5 text-center">% Cơ thể người</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-white font-semibold">
                    <td className="py-2 px-2.5 text-slate-800">Oxygen</td>
                    <td className="py-2 px-2.5 text-center font-mono text-indigo-700 font-bold">O</td>
                    <td className="py-2 px-2.5 text-center font-mono">8</td>
                    <td className="py-2 px-2.5 text-center font-mono text-blue-600">[2, 6]</td>
                    <td className="py-2 px-2.5 text-center font-mono">16 amu</td>
                    <td className="py-2 px-2.5 text-center font-bold text-rose-600">65%</td>
                  </tr>
                  <tr className="hover:bg-white font-semibold">
                    <td className="py-2 px-2.5 text-slate-800">Carbon</td>
                    <td className="py-2 px-2.5 text-center font-mono text-indigo-700 font-bold">C</td>
                    <td className="py-2 px-2.5 text-center font-mono">6</td>
                    <td className="py-2 px-2.5 text-center font-mono text-blue-600">[2, 4]</td>
                    <td className="py-2 px-2.5 text-center font-mono">12 amu</td>
                    <td className="py-2 px-2.5 text-center font-bold text-rose-600">18,5%</td>
                  </tr>
                  <tr className="hover:bg-white font-semibold">
                    <td className="py-2 px-2.5 text-slate-800">Hydrogen</td>
                    <td className="py-2 px-2.5 text-center font-mono text-indigo-700 font-bold">H</td>
                    <td className="py-2 px-2.5 text-center font-mono">1</td>
                    <td className="py-2 px-2.5 text-center font-mono text-blue-600">[1]</td>
                    <td className="py-2 px-2.5 text-center font-mono">1 amu</td>
                    <td className="py-2 px-2.5 text-center font-bold text-rose-600">9,5%</td>
                  </tr>
                  <tr className="hover:bg-white font-semibold">
                    <td className="py-2 px-2.5 text-slate-800">Nitrogen</td>
                    <td className="py-2 px-2.5 text-center font-mono text-indigo-700 font-bold">N</td>
                    <td className="py-2 px-2.5 text-center font-mono">7</td>
                    <td className="py-2 px-2.5 text-center font-mono text-blue-600">[2, 5]</td>
                    <td className="py-2 px-2.5 text-center font-mono">14 amu</td>
                    <td className="py-2 px-2.5 text-center font-bold text-rose-600">3,0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
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
