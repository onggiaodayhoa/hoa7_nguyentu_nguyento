import {
  TheoryQuestion,
  ElementSymbolQuiz,
  SymbolCorrectionQuiz,
  CompareAtomQuiz,
  AtomCardItem,
} from '../types/chemistry';

// PHẦN 1: NHẬN BIẾT - Điền khuyết lý thuyết Bài 2 & Bài 3
export const THEORY_QUESTIONS: TheoryQuestion[] = [
  {
    id: 'nb_rutherford_bohr_1',
    level: 'nhan_biet',
    topic: 'rutherford_bohr',
    title: 'Mô hình nguyên tử của Rutherford – Bohr',
    textWithBlanks:
      'Theo mô hình Rutherford – Bohr, nguyên tử có cấu tạo rỗng. Hạt nhân nằm ở tâm mang điện tích {{b1}}, còn các electron mang điện tích {{b2}} chuyển động xung quanh hạt nhân theo từng {{b3}}.',
    blanks: [
      { id: 'b1', blankIndex: 1, correctAnswer: 'dương', acceptableAnswers: ['dương', 'mang điện dương', '+'] },
      { id: 'b2', blankIndex: 2, correctAnswer: 'âm', acceptableAnswers: ['âm', 'mang điện âm', '-'] },
      { id: 'b3', blankIndex: 3, correctAnswer: 'lớp', acceptableAnswers: ['lớp', 'lớp electron', 'vỏ'] },
    ],
    keywords: ['dương', 'âm', 'lớp', 'trung hòa', 'hút', 'đẩy', 'đường tròn'],
    explanation:
      'Theo SGK KNTT bài 2: Rutherford – Bohr chỉ ra nguyên tử có hạt nhân ở tâm mang điện tích dương và các electron mang điện tích âm chuyển động xung quanh hạt nhân theo từng lớp khác nhau.',
    atomModelZ: 6,
  },
  {
    id: 'nb_rutherford_bohr_2',
    level: 'nhan_biet',
    topic: 'rutherford_bohr',
    title: 'Sắp xếp electron trong các lớp vỏ nguyên tử',
    textWithBlanks:
      'Lớp electron trong cùng (gần hạt nhân nhất) chứa tối đa {{b1}} electron và bị hạt nhân hút {{b2}} nhất. Lớp thứ hai chứa tối đa {{b3}} electron. Số electron ở lớp {{b4}} quyết định tính chất hoá học của nguyên tử.',
    blanks: [
      { id: 'b1', blankIndex: 1, correctAnswer: '2', acceptableAnswers: ['2', 'hai'] },
      { id: 'b2', blankIndex: 2, correctAnswer: 'mạnh', acceptableAnswers: ['mạnh', 'chặt'] },
      { id: 'b3', blankIndex: 3, correctAnswer: '8', acceptableAnswers: ['8', 'tám'] },
      { id: 'b4', blankIndex: 4, correctAnswer: 'ngoài cùng', acceptableAnswers: ['ngoài cùng', 'lớp ngoài cùng'] },
    ],
    keywords: ['2', 'mạnh', '8', 'ngoài cùng', 'yếu', 'trong cùng', '4', '18'],
    explanation:
      'Lớp thứ nhất chứa tối đa 2e (bị hút mạnh nhất), lớp thứ hai chứa tối đa 8e. Các electron ở lớp ngoài cùng quyết định tính chất hoá học của nguyên tố.',
    atomModelZ: 17,
  },
  {
    id: 'nb_atomic_mass_1',
    level: 'nhan_biet',
    topic: 'atomic_mass_amu',
    title: 'Khối lượng nguyên tử và đơn vị amu',
    textWithBlanks:
      'Khối lượng nguyên tử được đo bằng đơn vị quốc tế là {{b1}} (đơn vị khối lượng nguyên tử). Một proton và một neutron đều có khối lượng xấp xỉ bằng {{b2}} amu. Do khối lượng của electron rất bé (khoảng 0,00055 amu) nên khối lượng nguyên tử tập trung chủ yếu ở {{b3}}.',
    blanks: [
      { id: 'b1', blankIndex: 1, correctAnswer: 'amu', acceptableAnswers: ['amu', 'AMU'] },
      { id: 'b2', blankIndex: 2, correctAnswer: '1', acceptableAnswers: ['1', 'một'] },
      { id: 'b3', blankIndex: 3, correctAnswer: 'hạt nhân', acceptableAnswers: ['hạt nhân', 'hạt nhân nguyên tử'] },
    ],
    keywords: ['amu', '1', 'hạt nhân', 'gam', 'kg', 'vỏ nguyên tử', '0', '12'],
    explanation:
      'amu (atomic mass unit) là đơn vị chuẩn đo khối lượng nguyên tử. 1p ≈ 1n ≈ 1 amu. Khối lượng electron coi như không đáng kể nên khối lượng nguyên tử gần bằng khối lượng hạt nhân.',
  },
  {
    id: 'nb_element_concept_1',
    level: 'nhan_biet',
    topic: 'element_concept',
    title: 'Khái niệm nguyên tố hoá học & Số hiệu nguyên tử (Bài 3)',
    textWithBlanks:
      'Đến nay, người ta đã tìm ra {{b1}} nguyên tố hoá học. Các nguyên tử có cùng số proton trong hạt nhân đều thuộc cùng một nguyên tố hoá học. Số proton trong hạt nhân chính là {{b2}} nguyên tử. Mỗi nguyên tố chỉ có duy nhất một số hiệu này.',
    blanks: [
      { id: 'b1', blankIndex: 1, correctAnswer: '118', acceptableAnswers: ['118', 'một trăm mười tám'] },
      { id: 'b2', blankIndex: 2, correctAnswer: 'số hiệu', acceptableAnswers: ['số hiệu', 'số hiệu nguyên tử', 'Z'] },
    ],
    keywords: ['118', 'số hiệu', '92', 'khối lượng', 'chu kì', 'nhóm', '108'],
    explanation:
      'SGK KNTT Bài 3 trang 19: Đến nay tìm ra 118 nguyên tố hoá học. Số proton trong hạt nhân chính là số hiệu nguyên tử (Z). Mỗi nguyên tố chỉ có duy nhất một số hiệu nguyên tử.',
  },
  {
    id: 'nb_body_elements_1',
    level: 'nhan_biet',
    topic: 'body_elements',
    title: 'Các nguyên tố hoá học tạo nên cơ thể người (Bài 3)',
    textWithBlanks:
      'Bốn nguyên tố gồm carbon (C), oxygen (O), hydrogen (H) và nitrogen (N) chiếm khoảng {{b1}}% trọng lượng cơ thể người. Trong đó nguyên tố chiếm tỉ lệ cao nhất là {{b2}} (khoảng 65%). Hằng ngày con người cần khoảng 0,15 miligam nguyên tố {{b3}} cho hoạt động bình thường của tuyến giáp.',
    blanks: [
      { id: 'b1', blankIndex: 1, correctAnswer: '96', acceptableAnswers: ['96', '96%'] },
      { id: 'b2', blankIndex: 2, correctAnswer: 'oxygen', acceptableAnswers: ['oxygen', 'oxi', 'O'] },
      { id: 'b3', blankIndex: 3, correctAnswer: 'iodine', acceptableAnswers: ['iodine', 'iot', 'I'] },
    ],
    keywords: ['96', 'oxygen', 'iodine', '75', 'carbon', 'iron', 'calcium', '50'],
    explanation:
      'SGK KNTT Bài 3 trang 22: C, O, H, N chiếm ~96% cơ thể người (O chiếm 65%, C chiếm 18.5%, H chiếm 9.5%, N chiếm 3%). Tuyến giáp cần khoảng 0.15 mg iodine mỗi ngày.',
  },
  {
    id: 'nb_latin_symbols_1',
    level: 'nhan_biet',
    topic: 'latin_symbols',
    title: 'Kí hiệu hoá học có nguồn gốc từ tiếng Latin (Bài 3)',
    textWithBlanks:
      'Một số nguyên tố có kí hiệu xuất phát từ tên Latin: nguyên tố sodium (tên Latin là natrium) có kí hiệu là {{b1}}; nguyên tố potassium (tên Latin là kalium) có kí hiệu là {{b2}}; nguyên tố iron (tên Latin là ferrum) có kí hiệu là {{b3}}.',
    blanks: [
      { id: 'b1', blankIndex: 1, correctAnswer: 'Na', acceptableAnswers: ['Na', 'na'] },
      { id: 'b2', blankIndex: 2, correctAnswer: 'K', acceptableAnswers: ['K', 'k'] },
      { id: 'b3', blankIndex: 3, correctAnswer: 'Fe', acceptableAnswers: ['Fe', 'fe'] },
    ],
    keywords: ['Na', 'K', 'Fe', 'So', 'Po', 'Ir', 'Cu', 'Ag'],
    explanation:
      'SGK KNTT Bài 3 trang 21: Sodium có tên Latin là natrium -> Na; potassium có tên Latin là kalium -> K; iron có tên Latin là ferrum -> Fe.',
  },
  {
    id: 'comb_bai2_bai3_1',
    level: 'nhan_biet',
    topic: 'ket_hop_bai2_bai3',
    title: 'Kết Hợp Bài 2 & Bài 3: Từ cấu tạo nguyên tử đến nguyên tố hoá học',
    textWithBlanks:
      'Nguyên tử của nguyên tố chlorine có số hiệu nguyên tử Z = {{b1}}. Trong hạt nhân chlorine có 17 proton và 18 neutron, nên khối lượng nguyên tử xấp xỉ bằng {{b2}} amu. Vỏ nguyên tử gồm 17 electron sắp xếp vào 3 lớp: lớp trong 2e, lớp giữa 8e, và lớp ngoài cùng có {{b3}} electron. Kí hiệu hoá học chuẩn là {{b4}}.',
    blanks: [
      { id: 'b1', blankIndex: 1, correctAnswer: '17', acceptableAnswers: ['17'] },
      { id: 'b2', blankIndex: 2, correctAnswer: '35,5', acceptableAnswers: ['35,5', '35.5', '35'] },
      { id: 'b3', blankIndex: 3, correctAnswer: '7', acceptableAnswers: ['7', 'bảy'] },
      { id: 'b4', blankIndex: 4, correctAnswer: 'Cl', acceptableAnswers: ['Cl', 'cl'] },
    ],
    keywords: ['17', '35,5', '7', 'Cl', 'CL', '8', '32', '35'],
    explanation:
      'Kết hợp Bài 2 & 3: Chlorine có Z = 17 (17p, 17e), 3 lớp e (2, 8, 7), khối lượng ≈ 35,5 amu (17p + 18n), kí hiệu hoá học là Cl.',
    atomModelZ: 17,
  },
  {
    id: 'comb_bai2_bai3_2',
    level: 'nhan_biet',
    topic: 'ket_hop_bai2_bai3',
    title: 'Kết Hợp Bài 2 & Bài 3: Nguyên tố tạo nên sự sống & mô hình Bohr',
    textWithBlanks:
      'Carbon là nguyên tố trung tâm của sự sống (chiếm 18,5% cơ thể người), có kí hiệu là C và số hiệu nguyên tử Z = {{b1}}. Theo mô hình Rutherford – Bohr, vỏ nguyên tử carbon có 2 lớp electron: lớp trong cùng có {{b2}} electron và lớp ngoài cùng có {{b3}} electron. Khối lượng của nguyên tử carbon là {{b4}} amu.',
    blanks: [
      { id: 'b1', blankIndex: 1, correctAnswer: '6', acceptableAnswers: ['6', 'sáu'] },
      { id: 'b2', blankIndex: 2, correctAnswer: '2', acceptableAnswers: ['2', 'hai'] },
      { id: 'b3', blankIndex: 3, correctAnswer: '4', acceptableAnswers: ['4', 'bốn'] },
      { id: 'b4', blankIndex: 4, correctAnswer: '12', acceptableAnswers: ['12', 'mười hai'] },
    ],
    keywords: ['6', '2', '4', '12', '14', '8', '16', '10'],
    explanation:
      'Kết hợp Bài 2 & 3: Carbon có Z = 6 (6p, 6e), lớp vỏ (2, 4) với 4e lớp ngoài cùng, khối lượng là 12 amu (6p + 6n), chiếm 18.5% cơ thể người.',
    atomModelZ: 6,
  },
  {
    id: 'comb_bai2_bai3_3',
    level: 'nhan_biet',
    topic: 'ket_hop_bai2_bai3',
    title: 'Kết Hợp Bài 2 & Bài 3: Khối lượng nguyên tử & Các dạng nguyên tử của Hydrogen',
    textWithBlanks:
      'Trong tự nhiên, nguyên tố hydrogen có 3 loại nguyên tử cùng có 1 proton nhưng có số neutron lần lượt là 0, 1 hoặc 2. Vì khối lượng tập trung ở hạt nhân (1p ≈ 1n ≈ 1 amu) nên khối lượng của 3 loại nguyên tử này lần lượt là {{b1}} amu, {{b2}} amu và {{b3}} amu. Chúng đều thuộc cùng nguyên tố hydrogen vì có cùng số {{b4}}.',
    blanks: [
      { id: 'b1', blankIndex: 1, correctAnswer: '1', acceptableAnswers: ['1', '1 amu'] },
      { id: 'b2', blankIndex: 2, correctAnswer: '2', acceptableAnswers: ['2', '2 amu'] },
      { id: 'b3', blankIndex: 3, correctAnswer: '3', acceptableAnswers: ['3', '3 amu'] },
      { id: 'b4', blankIndex: 4, correctAnswer: 'proton', acceptableAnswers: ['proton', 'hạt proton', 'p'] },
    ],
    keywords: ['1', '2', '3', 'proton', 'neutron', 'electron', '4', 'amu'],
    explanation:
      'Kết hợp Bài 2 & 3: Khối lượng hạt nhân tạo nên khối lượng nguyên tử (1p ≈ 1 amu, 1n ≈ 1 amu). Ba nguyên tử H có khối lượng 1, 2, 3 amu nhưng đều có p = 1 nên cùng thuộc một nguyên tố hoá học.',
    atomModelZ: 1,
  },
];

// PHẦN 2: THÔNG HIỂU - 20 nguyên tố đầu tiên & Khối lượng amu
export const ELEMENT_QUIZZES: ElementSymbolQuiz[] = [
  {
    id: 'th_elem_1',
    level: 'thong_hieu',
    z: 1,
    elementName: 'Hydrogen (Z=1, 1 amu)',
    correctSymbol: 'H',
    options: ['H', 'He', 'Hy', 'Hd'],
    explanation: 'Hydrogen có Z=1, kí hiệu là H, nguyên tử khối xấp xỉ 1 amu.',
  },
  {
    id: 'th_elem_2',
    level: 'thong_hieu',
    z: 2,
    elementName: 'Helium (Z=2, 4 amu)',
    correctSymbol: 'He',
    options: ['He', 'H', 'Hl', 'Hm'],
    explanation: 'Helium có Z=2, kí hiệu là He (H viết hoa, e viết thường), nguyên tử khối 4 amu.',
  },
  {
    id: 'th_elem_6',
    level: 'thong_hieu',
    z: 6,
    elementName: 'Carbon (Z=6, 12 amu)',
    correctSymbol: 'C',
    options: ['C', 'Ca', 'Cb', 'Cr'],
    explanation: 'Carbon có Z=6, kí hiệu là C, chiếm 18.5% cơ thể người, nguyên tử khối 12 amu.',
  },
  {
    id: 'th_elem_7',
    level: 'thong_hieu',
    z: 7,
    elementName: 'Nitrogen (Z=7, 14 amu)',
    correctSymbol: 'N',
    options: ['N', 'Ni', 'Na', 'Nt'],
    explanation: 'Nitrogen có Z=7, kí hiệu là N, chiếm 78% không khí, nguyên tử khối 14 amu.',
  },
  {
    id: 'th_elem_8',
    level: 'thong_hieu',
    z: 8,
    elementName: 'Oxygen (Z=8, 16 amu)',
    correctSymbol: 'O',
    options: ['O', 'Ox', 'Og', 'On'],
    explanation: 'Oxygen có Z=8, kí hiệu là O, chiếm tới 65% khối lượng cơ thể người!',
  },
  {
    id: 'th_elem_11',
    level: 'thong_hieu',
    z: 11,
    elementName: 'Sodium (Z=11, Natri, 23 amu)',
    correctSymbol: 'Na',
    options: ['Na', 'So', 'Sd', 'N'],
    explanation: 'Sodium có nguồn gốc từ Natrium, kí hiệu là Na (N hoa, a thường), 23 amu.',
  },
  {
    id: 'th_elem_12',
    level: 'thong_hieu',
    z: 12,
    elementName: 'Magnesium (Z=12, 24 amu)',
    correctSymbol: 'Mg',
    options: ['Mg', 'Ma', 'Mn', 'Ms'],
    explanation: 'Magnesium có Z=12, kí hiệu là Mg, nguyên tử khối 24 amu.',
  },
  {
    id: 'th_elem_13',
    level: 'thong_hieu',
    z: 13,
    elementName: 'Aluminium (Z=13, Nhôm, 27 amu)',
    correctSymbol: 'Al',
    options: ['Al', 'Am', 'An', 'Au'],
    explanation: 'Aluminium có Z=13, kí hiệu là Al (A hoa, l thường), nguyên tử khối 27 amu.',
  },
  {
    id: 'th_elem_17',
    level: 'thong_hieu',
    z: 17,
    elementName: 'Chlorine (Z=17, Clo, 35.5 amu)',
    correctSymbol: 'Cl',
    options: ['Cl', 'Ch', 'Cr', 'C'],
    explanation: 'Chlorine có Z=17, kí hiệu là Cl (C hoa, l thường), nguyên tử khối 35,5 amu.',
  },
  {
    id: 'th_elem_19',
    level: 'thong_hieu',
    z: 19,
    elementName: 'Potassium (Z=19, Kali, 39 amu)',
    correctSymbol: 'K',
    options: ['K', 'P', 'Po', 'Pt'],
    explanation: 'Potassium có nguồn gốc từ Kalium, kí hiệu là K (K in hoa), nguyên tử khối 39 amu.',
  },
  {
    id: 'th_elem_20',
    level: 'thong_hieu',
    z: 20,
    elementName: 'Calcium (Z=20, Canxi, 40 amu)',
    correctSymbol: 'Ca',
    options: ['Ca', 'C', 'Cl', 'Cu'],
    explanation: 'Calcium có Z=20, kí hiệu là Ca (C hoa, a thường), có nhiều trong xương và sữa hộp.',
  },
];

// PHẦN 3: VẬN DỤNG - So sánh các nguyên tử cùng nguyên tố
export const COMPARE_ATOM_QUIZZES: CompareAtomQuiz[] = [
  {
    id: 'vd_comp_1',
    level: 'van_dung',
    title: 'So sánh nguyên tử cùng nguyên tố (Đồng vị)',
    atomA: { name: 'Nguyên tử X', p: 6, n: 6, e: 6 },
    atomB: { name: 'Nguyên tử Y', p: 6, n: 8, e: 6 },
    question: 'Nguyên tử X và nguyên tử Y có thuộc cùng một nguyên tố hoá học không? Vì sao?',
    options: [
      'Có thuộc cùng một nguyên tố (Carbon), vì chúng có cùng số proton trong hạt nhân (p = 6).',
      'Không thuộc cùng một nguyên tố, vì số hạt neutron khác nhau (6 khác 8).',
      'Không thuộc cùng một nguyên tố, vì khối lượng nguyên tử khác nhau.',
      'Chỉ thuộc cùng nguyên tố khi số neutron bằng số proton.',
    ],
    correctIndex: 0,
    explanation:
      'Chính xác! Nguyên tố hoá học là tập hợp các nguyên tử có cùng số proton trong hạt nhân. Nguyên tử X và Y đều có p = 6 nên đều là nguyên tử của nguyên tố Carbon (đồng vị của nhau).',
  },
  {
    id: 'vd_comp_lead_gold',
    level: 'van_dung',
    title: 'So sánh số proton giữa Chì (lead) và Vàng (gold)',
    atomA: { name: 'Nguyên tử Chì (Lead)', p: 82, n: 125, e: 82 },
    atomB: { name: 'Nguyên tử Vàng (Gold)', p: 79, n: 118, e: 79 },
    question: 'Một mẫu chì nguyên chất và mẫu vàng nguyên chất có số proton lần lượt là 82 và 79. Điều này chứng minh điều gì?',
    options: [
      'Chì và Vàng là hai nguyên tố hoá học hoàn toàn khác nhau vì mỗi nguyên tố có số proton trong hạt nhân xác định và duy nhất.',
      'Chì có thể biến thành Vàng bằng phản ứng hóa học thông thường.',
      'Cả hai đều cùng một nguyên tố kim loại nặng.',
      'Hai mẫu chất này có cùng số hiệu nguyên tử.',
    ],
    correctIndex: 0,
    explanation:
      'SGK KNTT trang 19: Mỗi nguyên tố hoá học có số proton xác định (Chì có 82p, Vàng có 79p). Mỗi nguyên tố chỉ có duy nhất một số hiệu nguyên tử!',
  },
  {
    id: 'vd_comp_oxygen_isotopes',
    level: 'van_dung',
    title: 'Các dạng nguyên tử của Oxygen trong tự nhiên',
    atomA: { name: 'Oxygen-16', p: 8, n: 8, e: 8 },
    atomB: { name: 'Oxygen-18', p: 8, n: 10, e: 8 },
    question: 'Trong tự nhiên, các nguyên tử oxygen cùng có 8 proton nhưng có thể có 8 neutron hoặc 10 neutron. Tại sao chúng vẫn thuộc cùng một nguyên tố oxygen?',
    options: [
      'Vì chúng có cùng 8 proton trong hạt nhân (số hiệu nguyên tử Z = 8 không đổi).',
      'Vì chúng có cùng số hạt neutron.',
      'Vì chúng có khối lượng nguyên tử giống hệt nhau.',
      'Vì số electron ở lớp ngoài cùng của chúng khác nhau.',
    ],
    correctIndex: 0,
    explanation:
      'SGK KNTT trang 19: Các nguyên tử thuộc cùng một nguyên tố hoá học có thể có số neutron khác nhau, nhưng bắt buộc phải có cùng số proton trong hạt nhân.',
  },
  {
    id: 'vd_comp_2',
    level: 'van_dung',
    title: 'Nhận diện nguyên tử khác nguyên tố',
    atomA: { name: 'Nguyên tử M', p: 11, n: 12, e: 11 },
    atomB: { name: 'Nguyên tử Q', p: 12, n: 12, e: 12 },
    question: 'M và Q có cùng số neutron là 12. Vậy M và Q có thuộc cùng một nguyên tố hoá học không?',
    options: [
      'Không thuộc cùng một nguyên tố hoá học, vì số proton khác nhau (M có 11p là Sodium, Q có 12p là Magnesium).',
      'Có thuộc cùng một nguyên tố hoá học vì chúng có cùng số hạt neutron là 12.',
      'Có thuộc cùng một nguyên tố vì đều là kim loại ở chu kì 3.',
      'Không thể kết luận được nếu chưa biết số electron.',
    ],
    correctIndex: 0,
    explanation:
      'Số neutron KHÔNG quyết định nguyên tố hoá học. Chỉ có số hạt proton quyết định nguyên tố hoá học. M có 11p (Sodium) còn Q có 12p (Magnesium) nên là 2 nguyên tố khác nhau.',
  },
];

// PHẦN 3: VẬN DỤNG - Thám tử sửa sai các kí hiệu nguyên tố đã học
export const SYMBOL_CORRECTION_QUIZZES: SymbolCorrectionQuiz[] = [
  {
    id: 'vd_fix_1',
    level: 'van_dung',
    wrongOrGivenSymbol: 'CL',
    elementName: 'Chlorine (Clo)',
    isCorrect: false,
    correctSymbol: 'Cl',
    commonMistakeExplanation: 'Sai quy tắc viết hoa cả 2 chữ cái! Chữ cái đầu viết hoa (C), chữ thứ hai phải viết thường (l) -> Cl.',
  },
  {
    id: 'vd_fix_2',
    level: 'van_dung',
    wrongOrGivenSymbol: 'ca',
    elementName: 'Calcium (Canxi)',
    isCorrect: false,
    correctSymbol: 'Ca',
    commonMistakeExplanation: 'Sai quy tắc viết thường chữ cái đầu! Chữ cái đầu bắt buộc phải viết hoa (C) -> Ca.',
  },
  {
    id: 'vd_fix_3',
    level: 'van_dung',
    wrongOrGivenSymbol: 'AL',
    elementName: 'Aluminium (Nhôm)',
    isCorrect: false,
    correctSymbol: 'Al',
    commonMistakeExplanation: 'Chữ thứ hai (L) bị viết hoa! Kí hiệu đúng của Nhôm là Al.',
  },
  {
    id: 'vd_fix_4',
    level: 'van_dung',
    wrongOrGivenSymbol: 'Na',
    elementName: 'Sodium (Natri)',
    isCorrect: true,
    correctSymbol: 'Na',
    commonMistakeExplanation: 'Chính xác! N viết hoa và a viết thường xuất phát từ tên Latin Natrium, hoàn toàn đúng chuẩn quốc tế.',
  },
  {
    id: 'vd_fix_5',
    level: 'van_dung',
    wrongOrGivenSymbol: 'FE',
    elementName: 'Iron (Sắt - Ferrum)',
    isCorrect: false,
    correctSymbol: 'Fe',
    commonMistakeExplanation: 'Sai vì viết hoa cả 2 chữ cái (FE). Kí hiệu đúng là Fe (E phải viết thường).',
  },
  {
    id: 'vd_fix_6',
    level: 'van_dung',
    wrongOrGivenSymbol: 'mg',
    elementName: 'Magnesium (Magie)',
    isCorrect: false,
    correctSymbol: 'Mg',
    commonMistakeExplanation: 'Chữ cái m viết thường là sai! Chữ cái đầu luôn viết hoa -> Mg.',
  },
  {
    id: 'vd_fix_7',
    level: 'van_dung',
    wrongOrGivenSymbol: 'K',
    elementName: 'Potassium (Kali - Kalium)',
    isCorrect: true,
    correctSymbol: 'K',
    commonMistakeExplanation: 'Đúng! Nguyên tố gồm 1 chữ cái thì viết in hoa (K xuất phát từ Kalium).',
  },
  {
    id: 'vd_fix_8',
    level: 'van_dung',
    wrongOrGivenSymbol: 'SI',
    elementName: 'Silicon (Silic)',
    isCorrect: false,
    correctSymbol: 'Si',
    commonMistakeExplanation: 'Sai vì viết hoa chữ I! Kí hiệu đúng của Silicon là Si.',
  },
];

// DỮ LIỆU HOẠT ĐỘNG 12 TẤM THẺ NGUYÊN TỬ (SGK Bài 3 trang 20)
export const ATOM_CARDS_DATA: AtomCardItem[] = [
  { id: 'card_A', label: 'A (1p, 0n)', p: 1, n: 0, elementZ: 1, elementName: 'Hydrogen', elementSymbol: 'H' },
  { id: 'card_D', label: 'D (1p, 1n)', p: 1, n: 1, elementZ: 1, elementName: 'Hydrogen', elementSymbol: 'H' },
  { id: 'card_E', label: 'E (1p, 2n)', p: 1, n: 2, elementZ: 1, elementName: 'Hydrogen', elementSymbol: 'H' },
  { id: 'card_G', label: 'G (6p, 6n)', p: 6, n: 6, elementZ: 6, elementName: 'Carbon', elementSymbol: 'C' },
  { id: 'card_L', label: 'L (6p, 8n)', p: 6, n: 8, elementZ: 6, elementName: 'Carbon', elementSymbol: 'C' },
  { id: 'card_M', label: 'M (7p, 7n)', p: 7, n: 7, elementZ: 7, elementName: 'Nitrogen', elementSymbol: 'N' },
  { id: 'card_Q', label: 'Q (8p, 8n)', p: 8, n: 8, elementZ: 8, elementName: 'Oxygen', elementSymbol: 'O' },
  { id: 'card_R', label: 'R (8p, 9n)', p: 8, n: 9, elementZ: 8, elementName: 'Oxygen', elementSymbol: 'O' },
  { id: 'card_T', label: 'T (8p, 10n)', p: 8, n: 10, elementZ: 8, elementName: 'Oxygen', elementSymbol: 'O' },
  { id: 'card_X', label: 'X (20p, 20n)', p: 20, n: 20, elementZ: 20, elementName: 'Calcium', elementSymbol: 'Ca' },
  { id: 'card_Y', label: 'Y (19p, 20n)', p: 19, n: 20, elementZ: 19, elementName: 'Potassium', elementSymbol: 'K' },
  { id: 'card_Z', label: 'Z (19p, 21n)', p: 19, n: 21, elementZ: 19, elementName: 'Potassium', elementSymbol: 'K' },
];
