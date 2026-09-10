import React, { useState, useEffect } from 'react';
import { PlayerTroop, Mission, ActiveMission, MercenaryClass, WorldEvent } from '../types';
import { Play, CheckCircle2, Crosshair, TerminalSquare, Coins, Zap } from 'lucide-react';

interface MissionsProps {
  missions: Mission[];
  troops: PlayerTroop[];
  activeMissions: ActiveMission[];
  activeWorldEvent?: WorldEvent | null;
  onDeployMission: (m: Mission, d: {class: string, count: number}[]) => void;
  onResolveMission: (id: string) => void;
  onGenerateNewMission: () => void;
  generatingMission: boolean;
}

export const Missions: React.FC<MissionsProps> = ({ 
  missions, 
  troops, 
  activeMissions, 
  activeWorldEvent, 
  onDeployMission, 
  onResolveMission, 
  onGenerateNewMission, 
  generatingMission 
}) => {
  const [deployments, setDeployments] = useState<{[key: string]: number}>({});
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = (mission: Mission) => {
    const deploymentList = Object.entries(deployments)
      .filter(([_, count]) => (count as number) > 0)
      .map(([c, count]) => ({ class: c as MercenaryClass, count: count as number }));
    if (deploymentList.length > 0) {
      onDeployMission(mission, deploymentList);
      setDeployments({});
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
      case 'Moderate': return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
      case 'Extreme': return 'text-orange-500 border-orange-500/50 bg-orange-500/10';
      case 'Suicide Mission': return 'text-red-500 border-red-500/50 bg-red-500/10 font-bold glow-text';
      case 'Nightmare': return 'text-purple-500 border-purple-500/50 bg-purple-500/10 font-bold glow-text';
      default: return 'text-emerald-500 border-emerald-500/30';
    }
  };

  const creditMult = activeWorldEvent ? activeWorldEvent.creditMultiplier : 1.0;
  const intelMult = activeWorldEvent ? activeWorldEvent.intelMultiplier : 1.0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-emerald-500/30 pb-4">
        <h2 className="text-xl font-bold tracking-widest text-emerald-500 glow-text">{'>>'} ACTIVE_CONTRACTS</h2>
        <button onClick={onGenerateNewMission} disabled={generatingMission} className="px-4 py-2 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black font-bold uppercase tracking-widest disabled:opacity-50 transition-colors">
          {generatingMission ? '[ DECRYPTING SIGNAL... ]' : '[ PING BROKERS ]'}
        </button>
      </div>

      <div className="space-y-4">
        {activeMissions.map((act) => {
          const elapsed = (now - act.startTime) / 1000;
          const progress = Math.min(100, Math.floor((elapsed / act.mission.durationSeconds) * 100));
          const isComplete = progress >= 100;
          
          return (
            <div key={act.missionId} className="bg-black border border-emerald-500 p-4 flex justify-between items-center shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <div className="flex-1 mr-4">
                <div className="font-bold text-emerald-400 tracking-widest">{act.mission.title.toUpperCase()}</div>
                <div className="text-xs text-emerald-500 mt-2 bg-black h-2 w-full max-w-sm border border-emerald-500/50">
                  <div className={`h-full ${isComplete ? 'bg-emerald-500' : 'bg-emerald-500/50'}`} style={{width: `${progress}%`}} />
                </div>
              </div>
              <button onClick={() => onResolveMission(act.missionId)} className={`px-4 py-2 font-bold tracking-widest border transition-colors ${isComplete ? 'bg-emerald-500 text-black border-emerald-500' : 'text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/10'}`}>
                {isComplete ? '[ RESOLVE_OP ]' : '[ OPEN_LINK ]'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {missions.map((m) => {
          const estCredits = Math.round(m.rewards.credits * creditMult);
          const estIntel = Math.round(m.rewards.intel * intelMult);

          return (
            <div key={m.id} className="bg-black border border-emerald-500/30 p-4 flex flex-col gap-4 shadow-[0_0_10px_rgba(16,185,129,0.05)] transition-colors hover:bg-emerald-500/5">
              <div>
                <div className={`text-xs tracking-widest mb-2 border-b pb-1 inline-block pr-4 ${getDifficultyColor(m.difficulty)}`}>
                  CLASS: {m.difficulty.toUpperCase()}
                </div>
                <div className="font-bold text-emerald-300 tracking-wider text-lg">{m.title}</div>
                <div className="text-xs text-emerald-500/70 mt-2">{m.description}</div>
              </div>

              {/* Target & Est Defense */}
              <div className="bg-emerald-950/20 p-3 border border-emerald-500/20 text-xs space-y-1.5">
                <div className="text-red-400">{'>'} TARGET: {m.targetNation.toUpperCase()}</div>
                <div className="text-amber-400">{'>'} EST_DEFENSE: {m.recommendedPower}</div>
              </div>

              {/* Reward Breakdown with Event Multipliers */}
              <div className="bg-black border border-emerald-500/30 p-2.5 text-xs font-mono space-y-1">
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest">CONTRACT REWARDS:</div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5" /> Credits:</span>
                  <span className="font-bold">
                    ${estCredits.toLocaleString()}
                    {creditMult !== 1.0 && (
                      <span className={`text-[10px] ml-1.5 px-1 ${creditMult > 1 ? 'text-emerald-300 bg-emerald-500/20' : 'text-red-300 bg-red-500/20'}`}>
                        ({creditMult.toFixed(2)}x)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-cyan-400">
                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Intel:</span>
                  <span className="font-bold">
                    {estIntel} TB
                    {intelMult !== 1.0 && (
                      <span className={`text-[10px] ml-1.5 px-1 ${intelMult > 1 ? 'text-cyan-300 bg-cyan-500/20' : 'text-red-300 bg-red-500/20'}`}>
                        ({intelMult.toFixed(2)}x)
                      </span>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-emerald-500/30 pt-4">
                <div className="text-xs text-emerald-500/70 tracking-widest mb-3">{'>'} ALLOCATE UNITS:</div>
                {troops.map(t => (
                  <div key={t.class} className="flex justify-between items-center text-xs">
                    <span className="text-emerald-400">{t.class.toUpperCase()} ({t.count})</span>
                    <input type="number" min="0" max={t.count} 
                      className="w-16 bg-black border border-emerald-500/50 px-2 py-1 text-emerald-500 text-right focus:outline-none focus:border-emerald-400" 
                      value={deployments[t.class] || ''}
                      onChange={(e) => setDeployments({...deployments, [t.class]: parseInt(e.target.value) || 0})}
                    />
                  </div>
                ))}
                <button onClick={() => handleDeploy(m)} className="w-full mt-4 py-2 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black font-bold text-xs tracking-widest transition-colors">
                  [ EXECUTE_DEPLOYMENT ]
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

