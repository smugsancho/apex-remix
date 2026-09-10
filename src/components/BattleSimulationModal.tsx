import React, { useState, useEffect, useRef } from 'react';
import { ActiveMission, PlayerTroop, WeaponItem } from '../types';

interface BattleSimulationModalProps {
  activeMission: ActiveMission;
  troops: PlayerTroop[];
  weapons: WeaponItem[];
  onComplete: (success: boolean) => void;
  onClose: () => void;
}

export const BattleSimulationModal: React.FC<BattleSimulationModalProps> = ({ activeMission, troops, weapons, onComplete, onClose }) => {
  const [now, setNow] = useState(Date.now());
  const [minigameScore, setMinigameScore] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  const elapsed = (now - activeMission.startTime) / 1000;
  const progress = Math.min(100, Math.floor((elapsed / activeMission.mission.durationSeconds) * 100));
  const isComplete = progress >= 100;
  
  const squadPower = Math.floor(activeMission.assignedTroops.reduce((acc, t) => {
    const troopInfo = troops.find(tr => tr.class === t.class);
    const base = troopInfo?.basePower || 10;
    
    let multiplier = 1;
    if (troopInfo?.equippedWeaponId) {
      const weaponObj = weapons.find(w => w.weapon.id === troopInfo.equippedWeaponId);
      if (weaponObj) multiplier = weaponObj.weapon.powerMultiplier;
    }
    
    return acc + (t.count * base * multiplier);
  }, 0)) + minigameScore;
  
  const success = squadPower >= activeMission.mission.recommendedPower * 0.8 || Math.random() < 0.85;

  // Generate terminal logs based on progress
  useEffect(() => {
    const newLogs: string[] = [
      `> UPLINK ESTABLISHED TO [${activeMission.mission.targetNation.toUpperCase()}] SECURE SERVERS...`,
      `> OPERATION: ${activeMission.mission.title.toUpperCase()}`,
      `> TOTAL DEPLOYED POWER: ${squadPower} | EST DEFENSE: ${activeMission.mission.recommendedPower}`,
      `> INITIATING BREACH SEQUENCE...`
    ];

    if (progress > 10) newLogs.push(`> DEPLOYING ADVANCE RECON... [ OK ]`);
    if (progress > 25) newLogs.push(`> BYPASSING FIREWALL... [ OK ]`);
    if (progress > 40) newLogs.push(`> ENCOUNTERING ENEMY RESISTANCE... ENGAGING.`);
    if (progress > 60) newLogs.push(`> COMBAT EFFICIENCY MAINTAINED. PUSHING TO PRIMARY TARGET...`);
    if (progress > 80) newLogs.push(`> EXTRACTING DATA ARCHIVES... STANDBY.`);
    if (progress >= 100) {
      if (success) {
        newLogs.push(`> MISSION ACCOMPLISHED. CASUALTIES MINIMAL.`);
        newLogs.push(`> READY FOR DEBRIEF.`);
      } else {
        newLogs.push(`> CRITICAL FAILURE. HEAVY CASUALTIES DETECTED.`);
        newLogs.push(`> FORCING EMERGENCY EXFIL...`);
      }
    }

    setLogs(newLogs);
  }, [progress, squadPower, success, activeMission]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black border-2 border-emerald-500 max-w-2xl w-full p-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] crt-overlay">
        
        <div className="flex justify-between items-center border-b border-emerald-500/50 pb-4 mb-4">
          <h3 className="text-xl font-bold text-emerald-400 tracking-widest">{'>>'} LIVE_FEED_UPLINK</h3>
          <div className="text-emerald-500 animate-pulse">● REC</div>
        </div>

        <div className="bg-zinc-950 border border-emerald-500/30 h-48 overflow-y-auto p-4 font-mono text-sm space-y-2 mb-6">
          {logs.map((log, i) => (
            <div key={i} className={log.includes('FAILURE') ? 'text-red-500' : 'text-emerald-400'}>
              {log}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
        
        {/* Minigame for Extreme/Nightmare missions */}
        {activeMission.mission.requiresMinigame && !isComplete && (
          <div className="p-4 bg-black border border-amber-500/50 text-center mb-6">
            <div className="text-amber-400 font-bold mb-4 tracking-widest">{'>'} ICE_DETECTION_CRITICAL - OVERRIDE REQUIRED</div>
            <button onClick={() => setMinigameScore(minigameScore + 10)} className="px-6 py-3 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black active:scale-95 transition-all font-bold tracking-widest w-full">
              [ HACK_NODE : {minigameScore} PWR ]
            </button>
          </div>
        )}

        <div className="mb-2 flex justify-between text-xs text-emerald-500/70 tracking-widest">
          <span>OPERATION_PROGRESS</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-black h-4 border border-emerald-500/50 p-0.5 mb-6">
          <div className={`h-full transition-all duration-500 ${isComplete ? (success ? 'bg-emerald-500' : 'bg-red-500') : 'bg-emerald-500/70'}`} style={{ width: `${progress}%` }} />
        </div>
        
        {isComplete ? (
          <button onClick={() => onComplete(success)} className="w-full py-4 bg-emerald-500 text-black font-bold tracking-widest uppercase hover:bg-emerald-400 transition-colors">
            [ INITIATE_DEBRIEF ]
          </button>
        ) : (
          <button onClick={onClose} className="w-full py-3 border border-emerald-500/30 text-emerald-500/50 hover:text-emerald-500 hover:border-emerald-500 transition-colors text-sm tracking-widest">
            [ BACKGROUND_PROCESS ]
          </button>
        )}
      </div>
    </div>
  );
};
