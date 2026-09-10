import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Roster } from './components/Roster';
import { Missions } from './components/Missions';
import { Academy } from './components/Academy';
import { Armory } from './components/Armory';
import { Geopolitics } from './components/Geopolitics';
import { Headquarters } from './components/Headquarters';
import { InteractiveGuide } from './components/InteractiveGuide';
import { BattleSimulationModal } from './components/BattleSimulationModal';
import { StoryMode } from './components/StoryMode';
import { StrategicMap } from './components/StrategicMap';
import { CheatBoard } from './components/CheatBoard';
import { WorldEventsView } from './components/WorldEventsView';
import { PlayerTroop, Mission, ActiveMission, RivalNation, TabType, StoryChapter, TerritoryNode, WeaponItem, WarEvent, HQUpgrade, WorldEvent } from './types';
import { generateRandomWorldEvent } from './data/worldEvents';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [simulatingMission, setSimulatingMission] = useState<ActiveMission | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  
  // Syndicate Resources
  const [credits, setCredits] = useState<number>(6500);
  const [intel, setIntel] = useState<number>(200);
  const [techLevel, setTechLevel] = useState<number>(1);
  const [morale, setMorale] = useState<number>(92);
  const [tension, setTension] = useState<number>(45);
  const [rebirths, setRebirths] = useState<number>(0);

  // Global World Events System
  const [activeWorldEvent, setActiveWorldEvent] = useState<WorldEvent | null>(() => {
    const initial = generateRandomWorldEvent();
    return initial;
  });
  const [eventHistory, setEventHistory] = useState<WorldEvent[]>(() => {
    const initial = generateRandomWorldEvent();
    return [initial];
  });
  const [nextEventTimestamp, setNextEventTimestamp] = useState<number>(0);

  // Weapons & Troops
  const [weapons, setWeapons] = useState<WeaponItem[]>([]);
  const [troops, setTroops] = useState<PlayerTroop[]>([
    { class: 'Assault', count: 10, level: 1, basePower: 10, equippedWeaponId: null, passiveDesc: '+10% Combat Power' },
    { class: 'Sniper', count: 5, level: 1, basePower: 15, equippedWeaponId: null, passiveDesc: '+15% Success Chance' },
    { class: 'Juggernaut', count: 2, level: 1, basePower: 25, equippedWeaponId: null, passiveDesc: '-50% Casualties' },
    { class: 'Hacker', count: 3, level: 1, basePower: 8, equippedWeaponId: null, passiveDesc: '+25% Intel Rewards' },
    { class: 'Medic', count: 4, level: 1, basePower: 5, equippedWeaponId: null, passiveDesc: '20% Revive Chance on Death' },
  ]);

  const [hqUpgrades, setHqUpgrades] = useState<HQUpgrade[]>([
    { id: 'hq_1', name: 'Black Market Front', description: 'Generates passive credit income by fencing illicit goods.', costCredits: 20000, costIntel: 50, requiredRebirths: 0, incomeBoost: 500, owned: false },
    { id: 'hq_2', name: 'Offshore Server Farm', description: 'Mines crypto and launders money automatically.', costCredits: 75000, costIntel: 200, requiredRebirths: 1, incomeBoost: 2500, owned: false },
    { id: 'hq_3', name: 'Global Extortion Network', description: 'Taxes minor crime syndicates globally.', costCredits: 250000, costIntel: 800, requiredRebirths: 3, incomeBoost: 10000, owned: false },
    { id: 'hq_4', name: 'Orbital Mining Claim', description: 'Harvests rare materials from low orbit.', costCredits: 1000000, costIntel: 3000, requiredRebirths: 5, incomeBoost: 50000, owned: false },
    { id: 'hq_5', name: 'Singularity Forge', description: 'Produces infinite value from quantum anomalies.', costCredits: 5000000, costIntel: 10000, requiredRebirths: 10, incomeBoost: 500000, owned: false },
  ]);

  const passiveIncomeRate = hqUpgrades.filter(u => u.owned).reduce((acc, u) => acc + u.incomeBoost, 0);

  useEffect(() => {
    if (passiveIncomeRate > 0) {
      const interval = setInterval(() => {
        setCredits(prev => prev + (passiveIncomeRate / 3600)); // Every second, add 1/3600 of hourly income
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [passiveIncomeRate]);

  // Periodic World Events Engine
  useEffect(() => {
    const eventInterval = setInterval(() => {
      const now = Date.now();

      // Check if current world event expired
      if (activeWorldEvent && now >= activeWorldEvent.expiresAt) {
        setActiveWorldEvent(null);
        // Set cooldown before next event triggers (15 to 25 seconds)
        const cooldownMs = (15 + Math.floor(Math.random() * 10)) * 1000;
        setNextEventTimestamp(now + cooldownMs);
      } 
      // Check if cooldown has finished and no active event exists
      else if (!activeWorldEvent) {
        if (nextEventTimestamp === 0 || now >= nextEventTimestamp) {
          const newEvent = generateRandomWorldEvent();
          setActiveWorldEvent(newEvent);
          setEventHistory(prev => [newEvent, ...prev.filter(e => e.id !== newEvent.id)].slice(0, 15));
          // Apply tension change with safety bounds 5 - 100
          setTension(prev => Math.max(5, Math.min(100, prev + newEvent.tensionChange)));
          // Also fluctuate rival nations tension
          setRivalNations(prev => prev.map(n => ({
            ...n,
            tension: Math.max(10, Math.min(100, n.tension + Math.floor(newEvent.tensionChange * 0.7)))
          })));
        }
      }
    }, 1000);

    return () => clearInterval(eventInterval);
  }, [activeWorldEvent, nextEventTimestamp]);

  const handleTriggerWorldEvent = () => {
    const newEvent = generateRandomWorldEvent(activeWorldEvent?.title);
    setActiveWorldEvent(newEvent);
    setEventHistory(prev => [newEvent, ...prev.filter(e => e.id !== newEvent.id)].slice(0, 15));
    setTension(prev => Math.max(5, Math.min(100, prev + newEvent.tensionChange)));
    setRivalNations(prev => prev.map(n => ({
      ...n,
      tension: Math.max(10, Math.min(100, n.tension + Math.floor(newEvent.tensionChange * 0.7)))
    })));
  };

  const handleClearWorldEvent = () => {
    setActiveWorldEvent(null);
    setNextEventTimestamp(Date.now() + 20000);
  };

  const handleDisinformationCampaign = () => {
    if (intel >= 50) {
      setIntel(prev => prev - 50);
      setTension(prev => Math.max(5, prev - 15));
      setRivalNations(prev => prev.map(n => ({
        ...n,
        tension: Math.max(10, n.tension - 10)
      })));
    }
  };

  const handlePurchaseHQUpgrade = (id: string) => {
    const upgrade = hqUpgrades.find(u => u.id === id);
    if (upgrade && credits >= upgrade.costCredits && intel >= upgrade.costIntel && !upgrade.owned) {
      setCredits(c => c - upgrade.costCredits);
      setIntel(i => i - upgrade.costIntel);
      setHqUpgrades(hqUpgrades.map(u => u.id === id ? { ...u, owned: true } : u));
    }
  };

  // Missions
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMissions, setActiveMissions] = useState<ActiveMission[]>([]);
  const [generatingMission, setGeneratingMission] = useState<boolean>(false);

  // Story Chapters
  const [storyChapters, setStoryChapters] = useState<StoryChapter[]>([
    { id: 'ch_1', actNumber: 1, title: 'Act I', subtitle: 'Base', description: 'desc', objective: 'obj', rewardCredits: 4000, rewardIntel: 60, unlocked: true, completed: false }
  ]);

  // Territories Map
  const [territories, setTerritories] = useState<TerritoryNode[]>([]);

  // Rival Nations & Wars
  const [warEvents, setWarEvents] = useState<WarEvent[]>([]);
  const [rivalNations, setRivalNations] = useState<RivalNation[]>([
    { id: 'nat_1', name: 'The Technocratic Syndicate of Vorex', ideology: 'Cybernetic Transhumanism', tension: 58, power: 890, status: 'Proxy Clash' },
    { id: 'nat_2', name: 'The Iron Directorate', ideology: 'Brutalist Militarism', tension: 72, power: 950, status: 'Cold War' },
    { id: 'nat_3', name: 'Neo-Shanghai Conglomerate', ideology: 'Corporate Hyper-Capitalism', tension: 42, power: 810, status: 'Cold War' },
    { id: 'nat_4', name: 'Aethelgard Republic', ideology: 'Decayed Democracy', tension: 49, power: 760, status: 'Vulnerable' },
  ]);

  // Debrief Modal State
  const [debriefResult, setDebriefResult] = useState<{
    title: string;
    success: boolean;
    summary: string;
    rewards: { credits: number; intel: number; tech: number };
  } | null>(null);

  const handleSaveGame = () => {
    setSaveToast("Saved");
    setTimeout(() => setSaveToast(null), 3500);
  };

  useEffect(() => {
    // Initial missions load
    handleGenerateNewMission();
  }, []);

  const handleGenerateNewMission = async () => {
    setGeneratingMission(true);
    setTimeout(() => {
      const newMissions: Mission[] = [
        { id: 'm1'+Math.random(), title: 'Proxy Skirmish', client: 'Aethelgard', targetNation: 'Vorex', description: 'Attack outpost and retrieve encryption key', difficulty: 'Moderate', recommendedPower: 200, rewards: {credits: 3000, intel: 50, tech: 10}, durationSeconds: 30, requiresMinigame: false },
        { id: 'm2'+Math.random(), title: 'Neural Hack', client: 'Anonymous', targetNation: 'Neo-Shanghai', description: 'Steal proprietary quantum AI source weights', difficulty: 'Extreme', recommendedPower: 500, rewards: {credits: 6000, intel: 100, tech: 25}, durationSeconds: 60, requiresMinigame: true },
        { id: 'm3'+Math.random(), title: 'High-Value Assassination', client: 'Iron Directorate', targetNation: 'Aethelgard', description: 'Eliminate rogue military minister in armored convoy', difficulty: 'Suicide Mission', recommendedPower: 800, rewards: {credits: 10000, intel: 150, tech: 50}, durationSeconds: 90, requiresMinigame: true },
      ];
      setMissions(newMissions);
      setGeneratingMission(false);
    }, 1000);
  };

  const handleDeployMission = (mission: Mission, deployment: {class: string, count: number}[]) => {
    // Deplete troops
    setTroops(prev => prev.map(t => {
      const dep = deployment.find(d => d.class === t.class);
      if (dep) return { ...t, count: Math.max(0, t.count - dep.count) };
      return t;
    }));
    setMissions(missions.filter((m) => m.id !== mission.id));
    setActiveMissions([...activeMissions, { missionId: mission.id, mission, assignedTroops: deployment as any, startTime: Date.now(), durationSeconds: mission.durationSeconds, successProbability: 80 }]);
  };

  const handleResolveMission = (missionId: string) => {
    const active = activeMissions.find((a) => a.missionId === missionId);
    if (!active) return;
    setSimulatingMission(active);
  };

  const handleCompleteSimulation = (success: boolean) => {
    if (!simulatingMission) return;
    const active = simulatingMission;
    setSimulatingMission(null);

    const hasJuggernaut = active.assignedTroops.some(d => d.class === 'Juggernaut' && d.count > 0);
    const hasMedic = active.assignedTroops.some(d => d.class === 'Medic' && d.count > 0);
    const hasHacker = active.assignedTroops.some(d => d.class === 'Hacker' && d.count > 0);

    // Return troops with passives
    setTroops(prev => prev.map(t => {
      const dep = active.assignedTroops.find(d => d.class === t.class);
      if (dep) {
        let survived = success ? dep.count : Math.floor(dep.count * 0.5);
        let lost = dep.count - survived;
        
        // Juggernaut passive: -50% casualties
        if (hasJuggernaut && lost > 0) {
          const savedByJugg = Math.floor(lost * 0.5);
          survived += savedByJugg;
          lost -= savedByJugg;
        }
        
        // Medic passive: 20% flat chance to revive any fallen
        if (hasMedic && lost > 0) {
          const revived = Array.from({length: lost}).filter(() => Math.random() < 0.2).length;
          survived += revived;
        }

        return { ...t, count: t.count + survived };
      }
      return t;
    }));

    setActiveMissions(activeMissions.filter((a) => a.missionId !== active.missionId));

    if (success) {
      // Hacker passive: +25% intel rewards
      const hackerBonus = hasHacker ? 1.25 : 1;

      // World Event Multipliers
      const eventCreditMult = activeWorldEvent ? activeWorldEvent.creditMultiplier : 1.0;
      const eventIntelMult = activeWorldEvent ? activeWorldEvent.intelMultiplier : 1.0;
      
      const earnedCredits = Math.round(active.mission.rewards.credits * (1 + rebirths * 0.5) * eventCreditMult);
      const earnedIntel = Math.round(active.mission.rewards.intel * (1 + rebirths * 0.5) * hackerBonus * eventIntelMult);
      
      setCredits(credits + earnedCredits);
      setIntel(intel + earnedIntel);

      const eventNote = activeWorldEvent 
        ? ` [World Event '${activeWorldEvent.title}' Modifiers Applied: x${eventCreditMult.toFixed(2)} Credits, x${eventIntelMult.toFixed(2)} Intel]` 
        : '';

      setDebriefResult({ 
        title: active.mission.title, 
        success: true, 
        summary: `Mission Accomplished! Operatives extracted safely with target assets.${eventNote}`, 
        rewards: { credits: earnedCredits, intel: earnedIntel, tech: active.mission.rewards.tech } 
      });
    } else {
      setDebriefResult({ 
        title: active.mission.title, 
        success: false, 
        summary: "Mission Failed. High Casualties sustained under overwhelming enemy defense.", 
        rewards: { credits: 0, intel: 0, tech: 0 } 
      });
    }
  };

  const handleRebirth = () => {
    setRebirths(rebirths + 1);
    setCredits(6500);
    setIntel(200);
    setTechLevel(1);
    setWeapons([]);
    setMissions([]);
    setActiveMissions([]);
    setWarEvents([]);
    setTroops([
      { class: 'Assault', count: 10, level: 1, basePower: 10, equippedWeaponId: null, passiveDesc: '+10% Combat Power' },
      { class: 'Sniper', count: 5, level: 1, basePower: 15, equippedWeaponId: null, passiveDesc: '+15% Success Chance' },
      { class: 'Juggernaut', count: 2, level: 1, basePower: 25, equippedWeaponId: null, passiveDesc: '-50% Casualties' },
      { class: 'Hacker', count: 3, level: 1, basePower: 8, equippedWeaponId: null, passiveDesc: '+25% Intel Rewards' },
      { class: 'Medic', count: 4, level: 1, basePower: 5, equippedWeaponId: null, passiveDesc: '20% Revive Chance on Death' },
    ]);
  };

  const handleJoinWar = (eventId: string, side: 'A' | 'B') => {
    setWarEvents(warEvents.map(w => w.id === eventId ? { ...w, playerSide: side } : w));
    setDebriefResult({ title: "War Joined", success: true, summary: `You have officially entered the global conflict on side ${side}. Prepare your troops.`, rewards: { credits: 0, intel: 0, tech: 0 } });
  };

  const handleSabotageNation = (id: string) => {
    // Generate a war event when you declare war
    if (intel >= 100) {
      setIntel(intel - 100);
      setWarEvents([...warEvents, { id: 'war_'+Math.random(), name: 'Global Syndicate War', factionA: 'Apex Syndicate', factionB: 'Rival Nation', playerSide: 'A', status: 'Active', rewardCredits: 50000, rewardIntel: 500, requiredPower: 1000 }]);
    }
  };

  const handleHireTroop = (troopClass: string, amount: number) => {
    let cost = 1000;
    switch (troopClass) {
      case 'Assault': cost = 1500; break;
      case 'Sniper': cost = 2500; break;
      case 'Juggernaut': cost = 5000; break;
      case 'Hacker': cost = 3500; break;
      case 'Medic': cost = 2000; break;
    }
    const totalCost = cost * amount;
    if (credits >= totalCost) {
      setCredits(c => c - totalCost);
      setTroops(troops.map(t => t.class === troopClass ? { ...t, count: t.count + amount } : t));
    }
  };

  const handleOpenCrate = (tier: number) => {
    let cost = 15000;
    let weaponTier: 'Standard' | 'Advanced' | 'Prototype' = 'Standard';
    if (tier === 2) { cost = 60000; weaponTier = 'Advanced'; }
    if (tier === 3) { cost = 300000; weaponTier = 'Prototype'; }
    
    if (credits >= cost) {
      setCredits(credits - cost);
      
      const rand = Math.random();
      let rarity: string = 'Common';
      let powerMultiplier = 1.1;

      // Boundless check (0.1% chance)
      if (Math.random() < 0.001) {
        rarity = 'Boundless';
        powerMultiplier = 10.0;
      } else {
        if (tier === 1) {
          // Common to Legendary
          if (rand < 0.5) { rarity = 'Common'; powerMultiplier = 1.1; }
          else if (rand < 0.8) { rarity = 'Rare'; powerMultiplier = 1.3; }
          else if (rand < 0.95) { rarity = 'Epic'; powerMultiplier = 1.6; }
          else { rarity = 'Legendary'; powerMultiplier = 2.0; }
        } else if (tier === 2) {
          // Epic to Mythical
          if (rand < 0.6) { rarity = 'Epic'; powerMultiplier = 1.6; }
          else if (rand < 0.9) { rarity = 'Legendary'; powerMultiplier = 2.0; }
          else { rarity = 'Mythical'; powerMultiplier = 2.6; }
        } else if (tier === 3) {
          // Legendary to Divine
          if (rand < 0.6) { rarity = 'Legendary'; powerMultiplier = 2.0; }
          else if (rand < 0.85) { rarity = 'Mythical'; powerMultiplier = 2.6; }
          else if (rand < 0.98) { rarity = 'Exotic'; powerMultiplier = 3.5; }
          else { rarity = 'Divine'; powerMultiplier = 5.0; }
        }
      }

      // Weapon Names Generation
      const weaponNamesByRarity: Record<string, string[]> = {
        'Common': ['AK-47', 'M16A4', 'Glock 19', 'MP5', 'Mossberg 500'],
        'Rare': ['Vector CRB', 'SPAS-12', 'Desert Eagle', 'P90', 'M4A1 Tactical'],
        'Epic': ['SCAR-H', 'Kriss Super V', 'Barrett M82', 'AA-12 Auto', 'HK416'],
        'Legendary': ['Railgun Prototype', 'Plasma Rifle', 'Gauss Cannon', 'Laser Gatling', 'EMP Launcher'],
        'Mythical': ['Dark Matter Blaster', 'Singularity Projector', 'Neutron Repeater', 'Void Piercer'],
        'Exotic': ['Quantum Destabilizer', 'Nanite Swarm Hive', 'Tachyon Lance'],
        'Divine': ['Wrath of the Heavens', 'Aegis Obliterator', 'Starfall Cannon'],
        'Boundless': ['The Reality Fracture', 'Omega Protocol', 'Genesis Engine']
      };

      const getWeaponName = (rar: string) => {
        const pool = weaponNamesByRarity[rar] || weaponNamesByRarity['Common'];
        return pool[Math.floor(Math.random() * pool.length)];
      };

      const weaponId = 'wpn_' + Math.random().toString(36).substring(2, 9);
      const generatedName = getWeaponName(rarity);
      const newWeapon = {
        id: weaponId,
        name: generatedName,
        tier: weaponTier,
        rarity: rarity as any,
        powerMultiplier
      };
      
      setWeapons([...weapons, { weapon: newWeapon, count: 1 }]);
      setDebriefResult({ title: "Weapon Crate Opened!", success: true, summary: `You acquired a new weapon: ${newWeapon.name} (Multiplier: x${powerMultiplier})`, rewards: { credits: 0, intel: 0, tech: 0 } });
    }
  };

  const handleEquipWeapon = (weaponId: string, troopClass: string) => {
    setTroops(troops.map(t => t.class === troopClass ? { ...t, equippedWeaponId: weaponId } : t));
  };

  const handleCheatAddWeapon = () => {
    const weaponId = 'wpn_cheat_' + Math.random().toString(36).substring(2, 9);
    const newWeapon = {
      id: weaponId,
      name: `Boundless Debug Weaponry`,
      tier: 'Prototype' as const,
      rarity: 'Boundless' as const,
      powerMultiplier: 10.0
    };
    setWeapons([...weapons, { weapon: newWeapon, count: 1 }]);
    setDebriefResult({ title: "Cheat Used", success: true, summary: "Boundless weapon spawned.", rewards: { credits: 0, intel: 0, tech: 0 } });
  };

  return (
    <div className="min-h-screen bg-black text-emerald-500 font-mono crt-overlay">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        credits={credits} 
        intel={intel} 
        techLevel={techLevel} 
        morale={morale} 
        tension={tension} 
        activeWorldEvent={activeWorldEvent}
        onOpenGuide={() => {}} 
        onSaveGame={handleSaveGame} 
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            troops={troops} 
            rebirths={rebirths} 
            onRebirth={handleRebirth} 
            missions={missions} 
            activeMissions={activeMissions} 
            credits={credits} 
            intel={intel} 
            tension={tension} 
            activeWorldEvent={activeWorldEvent}
            setActiveTab={setActiveTab} 
            onRefreshMissions={handleGenerateNewMission} 
          />
        )}
        {activeTab === 'roster' && (
          <Roster 
            troops={troops} 
            weapons={weapons} 
            credits={credits} 
            onHireTroop={handleHireTroop} 
            onUpgradeGear={()=>{}} 
            onDischargeTroops={()=>{}} 
          />
        )}
        {activeTab === 'missions' && (
          <Missions 
            missions={missions} 
            troops={troops} 
            activeMissions={activeMissions} 
            activeWorldEvent={activeWorldEvent}
            onDeployMission={handleDeployMission} 
            onResolveMission={handleResolveMission} 
            onGenerateNewMission={handleGenerateNewMission} 
            generatingMission={generatingMission} 
          />
        )}
        {activeTab === 'events' && (
          <WorldEventsView 
            activeEvent={activeWorldEvent} 
            eventHistory={eventHistory} 
            tension={tension} 
            intel={intel} 
            credits={credits} 
            onTriggerEvent={handleTriggerWorldEvent} 
            onClearEvent={handleClearWorldEvent} 
            onDisinformationCampaign={handleDisinformationCampaign} 
          />
        )}
        {activeTab === 'armory' && (
          <Armory 
            rebirths={rebirths} 
            weapons={weapons} 
            troops={troops} 
            credits={credits} 
            onOpenCrate={handleOpenCrate} 
            onEquipWeapon={handleEquipWeapon} 
          />
        )}
        {activeTab === 'geopolitics' && (
          <Geopolitics 
            rivalNations={rivalNations} 
            intel={intel} 
            warEvents={warEvents} 
            onSabotageNation={handleSabotageNation} 
            onJoinWar={handleJoinWar} 
          />
        )}
        {activeTab === 'headquarters' && (
          <Headquarters 
            upgrades={hqUpgrades} 
            credits={credits} 
            intel={intel} 
            rebirths={rebirths} 
            passiveIncome={passiveIncomeRate} 
            onPurchaseUpgrade={handlePurchaseHQUpgrade} 
          />
        )}
      </main>
      
      <CheatBoard 
        onAddCredits={(amount) => setCredits(c => c + amount)}
        onAddIntel={(amount) => setIntel(i => i + amount)}
        onForceReboot={handleRebirth}
        onAddTestWeapon={handleCheatAddWeapon}
        onTriggerWorldEvent={handleTriggerWorldEvent}
        onClearWorldEvent={handleClearWorldEvent}
      />

      {simulatingMission && (
        <BattleSimulationModal 
          activeMission={simulatingMission} 
          troops={troops} 
          weapons={weapons} 
          onComplete={handleCompleteSimulation} 
          onClose={() => setSimulatingMission(null)} 
        />
      )}
      
      {debriefResult && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black border border-emerald-500 max-w-lg w-full p-6 shadow-[0_0_15px_rgba(16,185,129,0.2)] crt-overlay">
            <h3 className="text-xl font-bold tracking-widest text-emerald-400 mb-4 border-b border-emerald-500/50 pb-2">{'>>'} {debriefResult.title.toUpperCase()}</h3>
            <p className="text-emerald-500/80 mb-6">{debriefResult.summary.toUpperCase()}</p>
            <button onClick={() => setDebriefResult(null)} className="w-full py-3 bg-emerald-500 text-black font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors">
              [ ACKNOWLEDGE ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

