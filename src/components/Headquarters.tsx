import React from 'react';
import { HQUpgrade } from '../types';
import { Building2, TrendingUp, Cpu, Lock, Check } from 'lucide-react';

interface HeadquartersProps {
  upgrades: HQUpgrade[];
  credits: number;
  intel: number;
  rebirths: number;
  passiveIncome: number;
  onPurchaseUpgrade: (id: string) => void;
}

export const Headquarters: React.FC<HeadquartersProps> = ({ upgrades, credits, intel, rebirths, passiveIncome, onPurchaseUpgrade }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-widest text-emerald-500 glow-text flex items-center gap-2">
          <Building2 className="w-6 h-6" /> {'>>'} HQ_COMMAND_CENTER
        </h2>
        <div className="bg-emerald-500/10 border border-emerald-500 p-3 flex items-center gap-4 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          <div>
            <span className="text-emerald-500/70 text-xs tracking-widest block">PASSIVE REVENUE</span>
            <span className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> +${passiveIncome.toLocaleString()}<span className="text-xs">/hr</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-black border border-emerald-500/30 p-6 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
        <h3 className="text-lg font-bold text-emerald-400 mb-4 tracking-widest">SYNDICATE INFRASTRUCTURE</h3>
        
        <div className="space-y-4">
          {upgrades.map((upgrade) => {
            const meetsRebirths = rebirths >= upgrade.requiredRebirths;
            const canAfford = credits >= upgrade.costCredits && intel >= upgrade.costIntel;
            
            return (
              <div key={upgrade.id} className={`border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                upgrade.owned 
                  ? 'border-emerald-500/20 bg-emerald-500/5' 
                  : meetsRebirths 
                    ? 'border-emerald-500/50 bg-black hover:bg-emerald-500/5' 
                    : 'border-zinc-800 bg-zinc-900/50 opacity-70'
              }`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-bold tracking-wider ${upgrade.owned ? 'text-emerald-300' : meetsRebirths ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {upgrade.name}
                    </h4>
                    {!meetsRebirths && <Lock className="w-4 h-4 text-rose-500" />}
                  </div>
                  <p className={`text-sm ${upgrade.owned ? 'text-emerald-500/60' : meetsRebirths ? 'text-emerald-500/80' : 'text-zinc-600'}`}>
                    {upgrade.description}
                  </p>
                  <div className="text-xs mt-2 flex items-center gap-3">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +${upgrade.incomeBoost.toLocaleString()}/hr
                    </span>
                    {!meetsRebirths && (
                      <span className="text-rose-500 font-bold flex items-center gap-1">
                        REQUIRES REBOOT LVL {upgrade.requiredRebirths}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex md:flex-col items-center gap-4 min-w-[200px]">
                  {!upgrade.owned && meetsRebirths && (
                    <div className="flex gap-4 text-sm font-mono w-full justify-between">
                      <span className={credits >= upgrade.costCredits ? "text-emerald-400" : "text-rose-500"}>
                        ${upgrade.costCredits.toLocaleString()}
                      </span>
                      <span className={intel >= upgrade.costIntel ? "text-blue-400" : "text-rose-500 flex items-center gap-1"}>
                        <Cpu className="w-3 h-3" /> {upgrade.costIntel}
                      </span>
                    </div>
                  )}
                  
                  {upgrade.owned ? (
                    <div className="w-full py-2 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-center font-bold tracking-widest flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> [ INSTALLED ]
                    </div>
                  ) : (
                    <button
                      onClick={() => onPurchaseUpgrade(upgrade.id)}
                      disabled={!meetsRebirths || !canAfford}
                      className={`w-full py-2 font-bold tracking-widest uppercase border transition-colors ${
                        !meetsRebirths
                          ? 'border-zinc-800 text-zinc-600 bg-transparent'
                          : canAfford
                            ? 'border-emerald-500 text-black bg-emerald-500 hover:bg-emerald-400'
                            : 'border-rose-500/50 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20'
                      }`}
                    >
                      {!meetsRebirths ? '[ LOCKED ]' : canAfford ? '[ ALLOCATE ]' : '[ INSUFFICIENT ]'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
