import React from 'react';
import { Terminal, Save, BookOpen, AlertTriangle, Zap, Coins, Cpu, Flame, Radio } from 'lucide-react';
import { TabType, WorldEvent } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  credits: number;
  intel: number;
  techLevel: number;
  morale: number;
  tension: number;
  activeWorldEvent: WorldEvent | null;
  onOpenGuide: () => void;
  onSaveGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  credits, 
  intel, 
  techLevel, 
  morale, 
  tension, 
  activeWorldEvent, 
  onOpenGuide, 
  onSaveGame 
}) => {
  const navItems: { id: TabType; label: string; hasBadge?: boolean }[] = [
    { id: 'dashboard', label: 'COMMAND' },
    { id: 'missions', label: 'MISSIONS' },
    { id: 'events', label: 'WORLD EVENTS', hasBadge: !!activeWorldEvent },
    { id: 'roster', label: 'BARRACKS' },
    { id: 'armory', label: 'ARMORY' },
    { id: 'geopolitics', label: 'GEOPOLITICS' },
    { id: 'headquarters', label: 'HEADQUARTERS' },
  ];

  return (
    <header className="bg-black border-b-2 border-emerald-500/50 p-4 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-mono tracking-widest text-emerald-500 glow-text">APEX SYNDICATE OS</h1>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">v1.1.0</span>
              </div>
              <p className="text-xs text-emerald-500/70 font-mono tracking-widest">SECURE UPLINK ESTABLISHED // CONNECTION ENCRYPTED</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
            {/* World Event Status Pill in Header */}
            {activeWorldEvent ? (
              <div 
                onClick={() => setActiveTab('events')}
                className="cursor-pointer flex items-center gap-2 bg-red-950/40 border border-red-500/80 px-3 py-1.5 text-red-400 hover:bg-red-900/40 transition-colors animate-pulse"
                title="Global World Event in progress! Click to open World Events desk."
              >
                <Radio className="w-3.5 h-3.5 text-red-400" />
                <span className="font-bold tracking-wider uppercase text-[11px]">
                  CRISIS: {activeWorldEvent.title}
                </span>
                <span className="text-[10px] bg-red-500/20 px-1 border border-red-500/40 text-red-300 font-mono">
                  {Math.max(0, Math.ceil((activeWorldEvent.expiresAt - Date.now()) / 1000))}s
                </span>
              </div>
            ) : (
              <div 
                onClick={() => setActiveTab('events')}
                className="hidden xl:flex items-center gap-1.5 text-emerald-500/50 hover:text-emerald-400 cursor-pointer text-[11px] px-2 py-1 border border-emerald-500/20 transition-colors"
                title="Open World Events news desk"
              >
                <Radio className="w-3 h-3 text-emerald-500/40" />
                <span>STATUS: NOMINAL</span>
              </div>
            )}

            <div className="flex items-center gap-4 bg-black border border-emerald-500/30 px-4 py-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Coins className="w-4 h-4" />
                <span className="font-bold">${credits.toLocaleString()}</span>
              </div>
              <div className="w-px h-4 bg-emerald-500/30" />
              <div className="flex items-center gap-2 text-emerald-400">
                <Zap className="w-4 h-4" />
                <span className="font-bold">{intel} INTEL</span>
              </div>
              <div className="w-px h-4 bg-emerald-500/30" />
              <div className="flex items-center gap-2 text-emerald-400">
                <Cpu className="w-4 h-4" />
                <span className="font-bold">LVL {techLevel}</span>
              </div>
              <div className="w-px h-4 bg-emerald-500/30" />
              <div className="flex items-center gap-2 text-emerald-400">
                <Flame className="w-4 h-4" />
                <span className="font-bold">{morale}%</span>
              </div>
              <div className="w-px h-4 bg-emerald-500/30" />
              <div className="flex items-center gap-2 text-red-500 glow-text">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-bold">{tension}% TENSION</span>
              </div>
            </div>

            <button onClick={onSaveGame} className="flex items-center gap-2 px-4 py-2 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500 hover:text-black transition-colors font-bold uppercase">
              [ <Save className="w-4 h-4" /> SYS.SAVE ]
            </button>
            <button onClick={onOpenGuide} className="flex items-center gap-2 px-4 py-2 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500 hover:text-black transition-colors font-bold uppercase">
              [ <BookOpen className="w-4 h-4" /> DOCS ]
            </button>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 border-t border-emerald-500/20 pt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`font-mono text-sm uppercase transition flex items-center gap-1.5 shrink-0 ${
                activeTab === item.id ? 'text-emerald-300 font-bold glow-text border-b-2 border-emerald-400 pb-0.5' : 'text-emerald-500/60 hover:text-emerald-400'
              }`}
            >
              <span>[ {item.label} ]</span>
              {item.hasBadge && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

