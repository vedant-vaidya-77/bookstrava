import React, { useState } from 'react';
import { ArchitectureChoice, SystemChallenge } from '../types';
import { ARCHITECTURE_CHOICES, SYSTEM_CHALLENGES } from '../data';
import { Smartphone, Network, Code, AlertTriangle, Cpu, Database, Sparkles, TrendingUp, HelpCircle, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface SystemDesignProps {
  onAskArchitect: (customQuestion: string) => void;
  architectAnswer: string;
  isAsking: boolean;
  systemVariables: {
    platform: string;
    database: string;
    syncPolicy: string;
  };
  setSystemVariables: React.Dispatch<React.SetStateAction<{
    platform: string;
    database: string;
    syncPolicy: string;
  }>>;
}

export default function SystemDesign({ 
  onAskArchitect, 
  architectAnswer, 
  isAsking,
  systemVariables,
  setSystemVariables 
}: SystemDesignProps) {
  // Local state for interactive choices
  const [selectedPlatformId, setSelectedPlatformId] = useState<'web' | 'native' | 'hybrid'>('web');
  const [challenges, setChallenges] = useState<SystemChallenge[]>(SYSTEM_CHALLENGES);
  
  // Custom architect question state
  const [customQuestion, setCustomQuestion] = useState('');

  const activePlatform = ARCHITECTURE_CHOICES.find(p => p.id === selectedPlatformId)!;

  // Toggle dynamic solutions inside individual challenges
  const handleToggleSolution = (challengeId: string, solutionName: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          solutions: ch.solutions.map(sol => ({
            ...sol,
            isSelected: sol.name === solutionName
          }))
        };
      }
      return ch;
    }));
  };

  // Calculate dynamic system indexes based on configurations chosen
  // 1. Calculate Complexity Score based on selection
  let complexityScore = 40;
  if (selectedPlatformId === 'native') complexityScore += 40;
  if (selectedPlatformId === 'hybrid') complexityScore += 20;

  // Additional modifiers from the challenge selection
  challenges.forEach(ch => {
    const selectedSol = ch.solutions.find(s => s.isSelected);
    if (selectedSol) {
      if (selectedSol.name.includes('CRDT') || selectedSol.name.includes('Fanout')) {
        complexityScore += 15;
      } else {
        complexityScore += 5;
      }
    }
  });

  return (
    <div className="space-y-8 animate-fadeIn text-white" id="system-design-tab">
      
      {/* Introduction Block */}
      <div className="bg-[#080808] text-white rounded-2xl p-6 border border-white/10 shadow-none space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Code className="w-40 h-40" />
        </div>
        
        <span className="text-[9px] font-black uppercase font-mono tracking-[0.2em] text-[#FC5200] bg-[#FC5200]/10 px-2.5 py-0.5 rounded border border-[#FC5200]/20">
          Whiteboard Mode
        </span>
        <h2 className="text-xl font-black uppercase italic text-white font-display tracking-tight">System Design & Strategic Trade-offs</h2>
        <p className="text-xs text-white/50 leading-relaxed max-w-3xl">
          To build a standard reading activity logger like Strava, we must address critical engineering hurdles. What platform holds product-market fit? How do we sync digital percentages to physical pages offline? Explore platforms, simulate architectural plans, and ask our Principal AI systems architect custom reviews.
        </p>

        {/* Dynamic State Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3.5 border-t border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider">
          <div>
            <span className="text-white/40 block text-[9px] font-mono">Deploy Platform:</span>
            <span className="font-extrabold text-[#FC5200]">{selectedPlatformId} Application</span>
          </div>
          <div>
            <span className="text-white/40 block text-[9px] font-mono">Database Profile:</span>
            <span className="font-extrabold text-white">{systemVariables.database}</span>
          </div>
          <div>
            <span className="text-white/40 block text-[9px] font-mono">Database Sync Mode:</span>
            <span className="font-extrabold text-white">{systemVariables.syncPolicy}</span>
          </div>
          <div>
            <span className="text-white/40 block text-[9px] font-mono">Calculated Complexity:</span>
            <span className="font-extrabold text-red-400">{complexityScore} / 120 (Medium)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Platform Strategy Controls */}
        <div className="space-y-6 col-span-1 lg:col-span-2">
          
          <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-none space-y-4 text-left">
            <h3 className="text-xs font-black text-[#FC5200] uppercase tracking-[0.15em] font-mono flex items-center gap-2 border-b border-white/5 pb-3">
              <Smartphone className="w-4.5 h-4.5 text-[#FC5200]" />
              1. Platform Selection Strategy
            </h3>
            
            {/* Nav pills for platform */}
            <div className="grid grid-cols-3 bg-[#050505] border border-white/10 p-1 rounded-xl text-center gap-1">
              {ARCHITECTURE_CHOICES.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPlatformId(p.id);
                    setSystemVariables(prev => ({
                      ...prev,
                      platform: p.title
                    }));
                  }}
                  className={`py-2 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all cursor-pointer ${selectedPlatformId === p.id ? 'bg-[#FC5200] text-black italic' : 'text-white/60 hover:text-white'}`}
                >
                  {p.id === 'web' ? '💻 Web' : p.id === 'native' ? '📱 Mobile' : '⚛️ Hybrid'}
                </button>
              ))}
            </div>

            {/* Platform Details widget */}
            <div className="bg-[#050505] rounded-xl p-4 border border-white/5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-white text-sm uppercase italic tracking-tight leading-tight">{activePlatform.title}</h4>
                  <p className="text-[10px] text-white/40 font-mono mt-1 font-bold">{activePlatform.subtitle}</p>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-white/15 text-white px-2 py-0.5 rounded">Cost: {activePlatform.cost}</span>
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Speed: {activePlatform.timeToMarket}</span>
                </div>
              </div>

              {/* Offline capacity */}
              <div className="space-y-1">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.15em] font-mono">Offline Synchronization Strategy:</span>
                <p className="text-xs text-white/70 leading-relaxed font-sans">{activePlatform.offlineSupport}</p>
              </div>

              {/* Developer Verdict */}
              <div className="space-y-1 border-t border-white/10 pt-3">
                <span className="text-[9px] font-black text-[#FC5200] uppercase tracking-[0.15em] font-mono">Architect's Verdict:</span>
                <p className="text-xs text-white/60 italic leading-relaxed font-sans">{activePlatform.verdict}</p>
              </div>

              {/* Technology Recommendation Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activePlatform.recommendedTech.map((tech, i) => (
                  <span key={i} className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/80 bg-white/10 border border-white/10 px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* System engineering variables adjust panel */}
          <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-none space-y-4 text-left">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.15em] font-mono flex items-center gap-2 border-b border-white/5 pb-3">
              <Database className="w-4.5 h-4.5 text-blue-400" />
              2. Core Infrastructure Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Variable A: Data storage choice */}
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.15em] font-mono">Database Type Selection</label>
                <div className="grid grid-cols-2 gap-2 bg-[#050505] p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setSystemVariables(v => ({ ...v, database: "Firestore NoSQL" }))}
                    className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${systemVariables.database === "Firestore NoSQL" ? "bg-[#FC5200] text-black italic font-black" : "text-white/60 hover:text-white"}`}
                  >
                    NoSQL Firestore
                  </button>
                  <button
                    onClick={() => setSystemVariables(v => ({ ...v, database: "PostgreSQL Relational" }))}
                    className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${systemVariables.database === "PostgreSQL Relational" ? "bg-[#FC5200] text-black italic font-black" : "text-white/60 hover:text-white"}`}
                  >
                    Relational PostgreSQL
                  </button>
                </div>
                <p className="text-[10px] leading-relaxed text-white/50 font-sans">
                  {systemVariables.database === "Firestore NoSQL" 
                    ? "Great for instant offline local document store and real-time feeds." 
                    : "Ideal for complex statistics aggregation, reading streaks, and joint relations."}
                </p>
              </div>

              {/* Variable B: Sync synchronization protocol */}
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.15em] font-mono">Storage Sync Mode</label>
                <div className="grid grid-cols-2 gap-2 bg-[#050505] p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setSystemVariables(v => ({ ...v, syncPolicy: "Standard HTTP REST" }))}
                    className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${systemVariables.syncPolicy === "Standard HTTP REST" ? "bg-[#FC5200] text-black italic font-black" : "text-white/60 hover:text-white"}`}
                  >
                    Standard REST
                  </button>
                  <button
                    onClick={() => setSystemVariables(v => ({ ...v, syncPolicy: "JSON event sourcing" }))}
                    className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${systemVariables.syncPolicy === "JSON event sourcing" ? "bg-[#FC5200] text-black italic font-black" : "text-white/60 hover:text-white"}`}
                  >
                    Event Sourcing
                  </button>
                </div>
                <p className="text-[10px] leading-relaxed text-white/50 font-sans">
                  {systemVariables.syncPolicy === "Standard HTTP REST" 
                    ? "Saves battery, pushes changes at intervals. Overwriting creates conflicts."
                    : "Pushes unique logs asynchronously. Restores histories chronologically dynamically."}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic System Constraints visual meters */}
        <div className="col-span-1 space-y-6">
          <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-none space-y-4 text-left">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.15em] font-mono border-b border-white/5 pb-3">
              Performance Estimator
            </h3>
            
            <div className="space-y-4">
              {/* Meter 1: Client Overhead */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] font-black uppercase">
                  <span className="text-white/40">Client Battery Overhead</span>
                  <span className={selectedPlatformId === 'native' ? 'text-emerald-400' : 'text-amber-400'}>
                    {selectedPlatformId === 'native' ? 'Efficient' : 'Moderate'}
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${selectedPlatformId === 'native' ? 'bg-[#FC5200] w-[90%]' : 'bg-white/40 w-[60%]'}`} 
                  />
                </div>
              </div>

              {/* Meter 2: Database Storage cost */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] font-black uppercase">
                  <span className="text-white/40">Database Overhead</span>
                  <span className={systemVariables.syncPolicy.includes("event") ? 'text-red-400' : 'text-emerald-400'}>
                    {systemVariables.syncPolicy.includes("event") ? 'O(n) Incremental' : 'Minimal'}
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${systemVariables.syncPolicy.includes("event") ? 'bg-red-500 w-[80%]' : 'bg-[#FC5200] w-[30%]'}`} 
                  />
                </div>
              </div>

              {/* Meter 3: Time To Market Index */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] font-black uppercase">
                  <span className="text-white/40">Speed To Market</span>
                  <span className={selectedPlatformId === 'web' ? 'text-[#FC5200]' : selectedPlatformId === 'hybrid' ? 'text-amber-400' : 'text-red-400'}>
                    {selectedPlatformId === 'web' ? 'Instant Release' : selectedPlatformId === 'hybrid' ? 'Quick Store' : 'Long Cycles'}
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${selectedPlatformId === 'web' ? 'bg-white w-[95%]' : selectedPlatformId === 'hybrid' ? 'bg-[#FC5200]/80 w-[70%]' : 'bg-red-500 w-[35%]'}`} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-lg text-xs leading-relaxed text-white/50 italic font-sans">
              <strong>Architect Tip:</strong> Restricting initial release scope to {selectedPlatformId === 'web' ? "Web App / PWA" : "Hybrid App Store wrapper"} gets your offline-reading feed in testers' hands within 2 weeks instead of several months of native compilation.
            </div>
          </div>
        </div>

      </div>

      {/* 2. Challenge Board: Interactive evaluation cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-white/45 uppercase tracking-[0.2em] font-mono flex items-center gap-1.5 pt-4">
          <AlertTriangle className="w-4 h-4 text-[#FC5200]" />
          3. CORE TECHNICAL CHALLENGES & SELECTED SOLVES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map(ch => {
            const selectedSol = ch.solutions.find(s => s.isSelected)!;
            return (
              <div key={ch.id} className="bg-[#080808] border border-white/10 rounded-2xl p-5 shadow-none space-y-4 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-start justify-between">
                    <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${ch.difficulty === 'Extreme' ? 'bg-red-500/10 text-red-400' : ch.difficulty === 'Hard' ? 'bg-orange-500/10 text-orange-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {ch.difficulty} Complexity
                    </span>
                    <span className="text-[9px] font-mono text-white/30 font-black uppercase">Topic</span>
                  </div>

                  <h4 className="font-extrabold uppercase italic tracking-tight text-white text-sm mt-3">{ch.title}</h4>
                  <p className="text-xs text-white/60 leading-relaxed mt-2 font-sans">{ch.description}</p>
                </div>

                {/* Sub-Selector for SOLUTIONS */}
                <div className="space-y-2 pt-3.5 border-t border-white/10">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.15em] block font-mono">SELECT ARCHITECTURAL PLAN:</span>
                  
                  {ch.solutions.map(sol => (
                    <button
                      key={sol.name}
                      onClick={() => handleToggleSolution(ch.id, sol.name)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs leading-snug font-medium transition-all cursor-pointer ${sol.isSelected ? 'bg-white text-black border-white font-black' : 'bg-[#050505] border-white/10 text-white/60 hover:bg-white/5'}`}
                    >
                      <div className="font-extrabold mb-1 flex items-center justify-between text-[11px] uppercase tracking-tight">
                        {sol.name}
                        {sol.isSelected && <span className="text-[9px] text-[#FC5200] font-mono font-black tracking-wider uppercase">✓ Active</span>}
                      </div>
                      <p className={`text-[10px] leading-relaxed ${sol.isSelected ? 'text-black/70' : 'text-white/40'}`}>{sol.description.substring(0, 110)}...</p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
