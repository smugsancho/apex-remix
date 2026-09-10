import React from 'react';
import { PlayerTroop, WeaponItem } from '../types';
import { Shield, Crosshair, PlusCircle } from 'lucide-react';

interface RosterProps {
  troops: PlayerTroop[];
  weapons: WeaponItem[];
  credits: number;
  onUpgradeGear: (c: string, cost: number) => void;
  onDischargeTroops: (c: string, amount: number) => void;
  onHireTroop: (troopClass: string, amount: number) => void;
}

export const Roster: React.FC<RosterProps> = ({ troops, weapons, credits, onHireTroop }) => {
  const getHireCost = (className: string) => {
    switch (className) {
      case 'Assault': return 1500;
      case 'Sniper': return 2500;
      case 'Juggernaut': return 5000;
      case 'Hacker': return 3500;
      case 'Medic': return 2000;
      default: return 1000;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-widest text-emerald-500 glow-text">{'>>'} BARRACKS_OVERVIEW</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {troops.map((t) => {
          const equippedWeapon = weapons.find(w => w.weapon.id === t.equippedWeaponId);
          const hireCost = getHireCost(t.class);
          return (
          <div key={t.class} className="bg-black border border-emerald-500/50 p-4 flex flex-col gap-4 shadow-[0_0_10px_rgba(16,185,129,0.05)] transition-colors hover:bg-emerald-500/5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-emerald-500/30 flex items-center justify-center bg-emerald-500/10"><Shield className="text-emerald-500" /></div>
                <div>
                  <div className="font-bold text-lg text-emerald-400 tracking-wider">UNIT: {t.class.toUpperCase()}</div>
                  <div className="text-xs text-emerald-500/70">PWR: {t.basePower} | LVL: {t.level}</div>
                  <div className="text-[10px] text-blue-400 mt-1 italic opacity-80">{t.passiveDesc}</div>
                  {equippedWeapon ? (
                    <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                      <Crosshair className="w-3 h-3" /> WPN: {equippedWeapon.weapon.name} (x{equippedWeapon.weapon.powerMultiplier})
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-500 mt-1">NO WEAPON EQUIPPED</div>
                  )}
                </div>
              </div>
              <div className="text-right border-l border-emerald-500/30 pl-4 min-w-[80px]">
                <div className="text-xs text-emerald-500/70 tracking-widest">ACTIVE</div>
                <div className="text-2xl font-bold text-emerald-400 glow-text">{t.count}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-emerald-500/20 pt-3">
              <div className="text-xs text-emerald-500/60 font-mono tracking-widest">
                HIRING COST: <span className={credits >= hireCost ? 'text-emerald-400' : 'text-red-500'}>${hireCost.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => onHireTroop(t.class, 1)}
                disabled={credits < hireCost}
                className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-colors disabled:opacity-50 disabled:bg-transparent disabled:text-zinc-500 disabled:border-zinc-800 disabled:cursor-not-allowed"
              >
                <PlusCircle className="w-3 h-3" /> [ HIRE +1 ]
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};
