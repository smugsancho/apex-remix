import React from 'react';
import { RivalNation, WarEvent } from '../types';

interface GeopoliticsProps {
  rivalNations: RivalNation[];
  intel: number;
  warEvents: WarEvent[];
  onSabotageNation: (id: string) => void;
  onJoinWar: (eventId: string, side: 'A' | 'B') => void;
}

export const Geopolitics: React.FC<GeopoliticsProps> = ({ 
  rivalNations, 
  intel, 
  warEvents, 
  onSabotageNation, 
  onJoinWar 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-widest text-emerald-500 glow-text border-b border-emerald-500/30 pb-4">{'>>'} GLOBAL_THEATER</h2>
      
      <div className="bg-black p-6 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
        <h3 className="font-bold text-red-500 tracking-widest mb-4">{'>>'} ACTIVE_CONFLICTS</h3>
        {warEvents.length === 0 ? (
          <div className="text-emerald-500/50 text-sm tracking-widest">{'>'} NO GLOBAL WARS DETECTED.</div>
        ) : (
          warEvents.map(w => (
            <div key={w.id} className="border border-red-500/30 p-4 mb-4 flex justify-between items-center bg-red-950/10">
              <div>
                <div className="font-bold text-lg text-red-400 tracking-wider">{w.name.toUpperCase()}</div>
                <div className="text-xs text-red-500/70">{w.factionA.toUpperCase()} VS {w.factionB.toUpperCase()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onJoinWar(w.id, 'A')} className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-black text-xs tracking-widest transition-colors">[ JOIN: {w.factionA} ]</button>
                <button onClick={() => onJoinWar(w.id, 'B')} className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-black text-xs tracking-widest transition-colors">[ JOIN: {w.factionB} ]</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
        {rivalNations.map(n => (
          <div key={n.id} className="bg-black p-4 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
            <div className="font-bold text-lg text-emerald-300 tracking-wider">{n.name.toUpperCase()}</div>
            <div className="text-xs text-emerald-500/70 mt-2">{'>'} SYS_TENSION: {n.tension}% | EST_POWER: {n.power}</div>
            <button onClick={() => onSabotageNation(n.id)} className="mt-6 px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black text-xs tracking-widest w-full transition-colors">
              [ INCITE_WAR : 100 INTEL ]
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

