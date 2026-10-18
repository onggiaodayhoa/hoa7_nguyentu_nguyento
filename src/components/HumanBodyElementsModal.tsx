import React, { useState } from 'react';
import { X, Heart, Sparkles, PieChart, Info, ShieldCheck, Flame } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HumanBodyElementsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'body' | 'history'>('body');

  if (!isOpen) return null;

  const mainElements = [
    { name: 'Oxygen (O)', percent: 65, color: '#3b82f6', role: 'Thành phần nước (H₂O) và hô hấp tế bào' },
    { name: 'Carbon (C)', percent: 18.5, color: '#6366f1', role: 'Nền tảng của protein, lipid, đường và DNA' },
    { name: 'Hydrogen (H)', percent: 9.5, color: '#06b6d4', role: 'Thành phần nước và các hợp chất sinh học' },
    { name: 'Nitrogen (N)', percent: 3.0, color: '#8b5cf6', role: 'Thành phần cấu tạo protein và acid nucleic' },
  ];

  const otherElements = [
    { name: 'Calcium (Ca)', percent: '1,5%', note: 'Xương, răng, sữa và dẫn truyền thần kinh' },
    { name: 'Phosphorus (P)', percent: '1,0%', note: 'Xương, năng lượng ATP' },
    { name: 'Potassium (K)', percent: '0,4%', note: 'Điện giải tế bào, cơ bắp tim mạch' },
    { name: 'Sulfur (S)', percent: '0,3%', note: 'Protein keratin trong tóc, móng' },
    { name: 'Sodium (Na)', percent: '0,2%', note: 'Cân bằng thể dịch, muối sinh lý' },
    { name: 'Chlorine (Cl)', percent: '0,2%', note: 'Acid dạ dày tiêu hóa' },
    { name: 'Magnesium (Mg)', percent: '0,1%', note: 'Hơn 300 enzyme sinh học' },
    { name: 'Iron (Fe)', percent: 'Vi lượng', note: 'Huyết sắc tố vận chuyển oxy trong máu' },
    { name: 'Iodine (I)', percent: '0,15 mg/ngày', note: 'Hoạt động bình thường của tuyến giáp' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-xl text-slate-800">
                Các Nguyên Tố Hoá Học Trong Đời Sống & Cơ Thể Người
              </h3>
              <p className="text-xs text-slate-500">
                Kiến thức SGK Khoa học tự nhiên 7 (Bài 3 trang 19 - 22)
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
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-3">
          <button
            onClick={() => setActiveTab('body')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'body'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Nguyên tố trong cơ thể người (96%)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Quan niệm lịch sử & Tên gọi Latin</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 flex-1">
          {activeTab === 'body' && (
            <div className="space-y-5">
              {/* 96% banner */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-md">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">
                  Đặc điểm cốt lõi (SGK trang 22)
                </span>
                <h4 className="text-lg sm:text-xl font-black mb-1">
                  4 Nguyên Tố Chiếm ~96% Trọng Lượng Cơ Thể: O, C, H, N
                </h4>
                <p className="text-xs sm:text-sm text-indigo-100">
                  Cơ thể chúng ta chủ yếu được cấu tạo từ nước và các đại phân tử sinh học có chứa Oxygen (65%), Carbon (18,5%), Hydrogen (9,5%) và Nitrogen (3%).
                </p>
              </div>

              {/* Bar breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Tỉ lệ % các nguyên tố chính:
                </span>
                <div className="space-y-2.5">
                  {mainElements.map(el => (
                    <div key={el.name} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-1.5">
                        <span className="text-slate-800">{el.name}</span>
                        <span className="font-mono text-indigo-600">{el.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${el.percent}%`, backgroundColor: el.color }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500">{el.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4% remaining and trace elements */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Các nguyên tố còn lại (~4%) & Nguyên tố vi lượng:
                  </span>
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    Iodine cần 0,15 mg/ngày
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {otherElements.map(el => (
                    <div key={el.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                        <span>{el.name}</span>
                        <span className="font-mono text-indigo-600">{el.percent}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 leading-tight block">
                        {el.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-900 text-sm mb-1">
                  Quan niệm cổ đại về "Nguyên tố":
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  &bull; <strong>Hy Lạp cổ đại:</strong> Tin rằng mọi vật tạo nên từ 4 nguyên tố: <em>Lửa, Không khí, Nước, Đất</em>.
                  <br />
                  &bull; <strong>Trung Hoa cổ đại:</strong> Thuyết ngũ hành giải thích thế giới tự nhiên gồm 5 nguyên tố: <em>Kim, Mộc, Thủy, Hỏa, Thổ</em>.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm">
                  118 Nguyên Tố & Số Hiệu Nguyên Tử (Z)
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Đến nay khoa học đã tìm ra <strong>118 nguyên tố hoá học</strong>. Mỗi nguyên tố có tính chất riêng biệt vì hạt nhân chứa số proton xác định (ví dụ: Chì có <strong>82 proton</strong>, Vàng có <strong>79 proton</strong>).
                </p>
              </div>

              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 space-y-2">
                <h4 className="font-bold text-indigo-900 text-sm">
                  Các kí hiệu hoá học có nguồn gốc từ tiếng Latin:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="bg-white p-2 rounded-lg border border-indigo-200">
                    <span className="font-bold text-indigo-700 block text-base">Na</span>
                    <span className="text-slate-600">Sodium (Natrium)</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-indigo-200">
                    <span className="font-bold text-indigo-700 block text-base">K</span>
                    <span className="text-slate-600">Potassium (Kalium)</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-indigo-200">
                    <span className="font-bold text-indigo-700 block text-base">Fe</span>
                    <span className="text-slate-600">Iron (Ferrum)</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-indigo-200">
                    <span className="font-bold text-indigo-700 block text-base">Cu</span>
                    <span className="text-slate-600">Copper (Cuprum)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
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
