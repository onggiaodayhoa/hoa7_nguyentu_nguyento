import React, { useState } from 'react';
import { FIRST_20_ELEMENTS } from '../data/elementsData';
import { ChemicalElement } from '../types/chemistry';
import { Atom, Orbit, Sparkles, Info } from 'lucide-react';

interface Props {
  initialZ?: number;
  interactive?: boolean;
}

export const AtomicModelViewer: React.FC<Props> = ({ initialZ = 6, interactive = true }) => {
  const [selectedZ, setSelectedZ] = useState<number>(initialZ);

  const element: ChemicalElement =
    FIRST_20_ELEMENTS.find(el => el.z === selectedZ) || FIRST_20_ELEMENTS[5]; // Default Carbon

  const quickElements = [1, 2, 6, 7, 8, 11, 17, 20];

  // Shell radius constants
  const center = 160;
  const shellRadii = [50, 85, 120, 145];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-indigo-500/30">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-indigo-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
            <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              Mô Hình Nguyên Tử Rutherford – Bohr
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-medium border border-indigo-400/30">
                Mô phỏng 2D Động
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Quan sát electron chuyển động trên các lớp quanh hạt nhân
            </p>
          </div>
        </div>

        {interactive && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Chọn nguyên tố:</span>
            {quickElements.map(z => {
              const el = FIRST_20_ELEMENTS.find(e => e.z === z);
              if (!el) return null;
              return (
                <button
                  key={z}
                  onClick={() => setSelectedZ(z)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedZ === z
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-105'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {el.symbol} ({el.z})
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* SVG Canvas Atom Animation */}
        <div className="lg:col-span-7 flex justify-center items-center py-2 relative">
          <svg viewBox="0 0 320 320" className="w-full max-w-[300px] sm:max-w-[320px] aspect-square overflow-visible">
            {/* Background subtle glow */}
            <circle cx={center} cy={center} r={140} fill="url(#coreGlow)" opacity={0.3} />
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="nucleusGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="60%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </radialGradient>
              <radialGradient id="electronGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="70%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </radialGradient>
            </defs>

            {/* Electron Shells (Orbits) */}
            {element.electronShells.map((eCount, shellIdx) => {
              const radius = shellRadii[shellIdx];
              return (
                <g key={`shell-${shellIdx}`}>
                  {/* Orbit line */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeDasharray={shellIdx === 0 ? 'none' : '4 4'}
                    opacity={0.45}
                  />

                  {/* Shell Label */}
                  <text
                    x={center}
                    y={center - radius - 5}
                    textAnchor="middle"
                    fill="#a5b4fc"
                    fontSize="9"
                    fontWeight="600"
                    opacity={0.8}
                  >
                    Lớp {shellIdx + 1}: {eCount}e
                  </text>

                  {/* Rotating Group for electrons in this shell */}
                  <g
                    style={{
                      transformOrigin: `${center}px ${center}px`,
                      animation: `spinElectron ${14 + shellIdx * 8}s linear infinite ${
                        shellIdx % 2 === 1 ? 'reverse' : 'normal'
                      }`,
                    }}
                  >
                    {Array.from({ length: eCount }).map((_, eIdx) => {
                      const angle = (2 * Math.PI * eIdx) / eCount;
                      const ex = center + radius * Math.cos(angle);
                      const ey = center + radius * Math.sin(angle);
                      return (
                        <g key={`e-${shellIdx}-${eIdx}`}>
                          {/* Electron Glow */}
                          <circle cx={ex} cy={ey} r={6} fill="#60a5fa" opacity={0.4} />
                          {/* Electron Core */}
                          <circle cx={ex} cy={ey} r={4.5} fill="url(#electronGrad)" />
                          {/* Minus symbol */}
                          <text
                            x={ex}
                            y={ey + 2}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="7"
                            fontWeight="bold"
                          >
                            -
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </g>
              );
            })}

            {/* Nucleus at the Center */}
            <circle
              cx={center}
              cy={center}
              r={24}
              fill="url(#nucleusGrad)"
              className="drop-shadow-lg"
            />
            {/* Pulsing ring around nucleus */}
            <circle
              cx={center}
              cy={center}
              r={28}
              fill="none"
              stroke="#ef4444"
              strokeWidth="1"
              opacity={0.5}
            />

            {/* Nucleus Text (e.g., +6, p=6, n=6) */}
            <text
              x={center}
              y={center - 3}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              fontWeight="bold"
            >
              +{element.protons}
            </text>
            <text
              x={center}
              y={center + 10}
              textAnchor="middle"
              fill="#fef08a"
              fontSize="8.5"
              fontWeight="600"
            >
              {element.protons}p, {element.neutrons}n
            </text>
          </svg>
        </div>

        {/* Element Details & Rutherford-Bohr Theory Card */}
        <div className="lg:col-span-5 space-y-3 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-indigo-300 font-mono">
              {element.symbol}
            </span>
            <span className="text-sm font-bold text-white">
              {element.nameIupac} ({element.nameTraditional || element.nameIupac})
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              Z = {element.z}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Hạt nhân:</span>
              <span className="font-semibold text-rose-300">
                {element.protons} proton (+) & {element.neutrons} neutron (0)
              </span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Vỏ nguyên tử:</span>
              <span className="font-semibold text-blue-300">
                {element.electrons} electron (-)
              </span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Phân bố các lớp:</span>
              <span className="font-mono font-semibold text-indigo-300">
                {element.electronShells.join(' , ')} (Lớp ngoài: {element.valenceElectrons}e)
              </span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Khối lượng xấp xỉ:</span>
              <span className="font-mono font-semibold text-amber-300">
                {element.atomicMass} amu
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-indigo-900/40 border border-indigo-400/20 text-indigo-200 leading-relaxed text-[11px]">
            <span className="font-semibold text-white flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 inline" />
              Điểm lý thuyết quan trọng:
            </span>
            Nguyên tử <strong>trung hoà về điện</strong> (Số p = Số e = {element.protons}). Khối lượng electron rất nhỏ nên khối lượng nguyên tử tập trung hầu hết ở <strong>hạt nhân ({element.atomicMass} amu)</strong>.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spinElectron {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
