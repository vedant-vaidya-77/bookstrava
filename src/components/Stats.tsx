import React from 'react';
import { ReadingSession, Book } from '../types';
import { AlignLeft, TrendingUp, Award, Smartphone, FileText, CheckCircle, BarChart2 } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsProps {
  sessions: ReadingSession[];
  books: Book[];
}

export default function Stats({ sessions, books }: StatsProps) {
  // Aggregate calculations
  const totalPagesRead = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalSessions = sessions.length;
  
  // Avg read speed (pages per hour = pagesRead / (minutes / 60))
  const avgSpeed = totalMinutes > 0 ? Math.round((totalPagesRead / (totalMinutes / 60)) * 10) / 10 : 0;
  
  // Format breakdown: calculate percentage physical vs digital
  const physicalPages = sessions.filter(s => s.format === 'physical').reduce((sum, s) => sum + s.pagesRead, 0);
  const digitalPages = sessions.filter(s => s.format === 'digital').reduce((sum, s) => sum + s.pagesRead, 0);
  const physicalPercent = totalPagesRead > 0 ? Math.round((physicalPages / totalPagesRead) * 100) : 50;
  const digitalPercent = totalPagesRead > 0 ? 100 - physicalPercent : 50;

  // Let's build a beautiful 7-day pages-read analytics bar graph
  // Last 7 days counting back from 2026-06-01 (May 26 to June 1)
  const last7Days = [
    { dateStr: '2026-05-26', name: 'Tue' },
    { dateStr: '2026-05-27', name: 'Wed' },
    { dateStr: '2026-05-28', name: 'Thu' },
    { dateStr: '2026-05-29', name: 'Fri' },
    { dateStr: '2026-05-30', name: 'Sat' },
    { dateStr: '2026-05-31', name: 'Sun' },
    { dateStr: '2026-06-01', name: 'Mon' },
  ];

  const graphData = last7Days.map(day => {
    const dailyPages = sessions
      .filter(s => s.date === day.dateStr)
      .reduce((sum, s) => sum + s.pagesRead, 0);
    return {
      ...day,
      pages: dailyPages,
    };
  });

  const maxPages = Math.max(...graphData.map(d => d.pages), 50);

  // Completed books counter
  const completedCount = books.filter(b => b.status === 'completed').length;

  return (
    <div className="space-y-8 animate-fadeIn" id="stats-tab">
      
      {/* Visual Banners / Grid highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Card 1 */}
        <div className="bg-[#080808] border border-white/10 rounded-xl p-5 shadow-none space-y-1">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">Total Logged</span>
          <p className="text-3xl font-black text-white font-display italic tracking-tighter">{totalPagesRead} <span className="text-xs font-mono font-medium text-white/40 uppercase tracking-widest">pages</span></p>
          <div className="text-[10px] uppercase tracking-wider text-[#FC5200] bg-[#FC5200]/10 border border-[#FC5200]/20 px-2 py-0.5 rounded font-black inline-flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this week
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-[#080808] border border-white/10 rounded-xl p-5 shadow-none space-y-1">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">Time spent</span>
          <p className="text-3xl font-black text-white font-display italic tracking-tighter">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </p>
          <div className="text-[10px] text-white/40 font-mono font-black uppercase tracking-wider">
            Across {totalSessions} workouts
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-[#080808] border border-white/10 rounded-xl p-5 shadow-none space-y-1">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">Avg Pace</span>
          <p className="text-3xl font-black text-white font-display italic tracking-tighter">{avgSpeed} <span className="text-xs font-mono font-medium text-white/40 uppercase tracking-widest">pgs/hr</span></p>
          <div className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-black inline-flex items-center gap-1">
            Highly Active
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-[#080808] border border-white/10 rounded-xl p-5 shadow-none space-y-1">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">Completions</span>
          <p className="text-3xl font-black text-white font-display italic tracking-tighter">{completedCount} <span className="text-xs font-mono font-medium text-white/40 uppercase tracking-widest">books</span></p>
          <div className="text-[10px] text-white/80 bg-white/10 border border-white/10 px-2.5 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1 font-black">
            <Award className="w-3.5 h-3.5 text-[#FC5200]" /> Strava Master
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7 Days Workout Volume Bar Graph */}
        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-none col-span-1 lg:col-span-2 space-y-4" id="stats-card-history">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-2">
            <div>
              <h3 className="text-xs font-black uppercase text-white/40 tracking-[0.15em] flex items-center gap-2 font-display">
                <BarChart2 className="w-4 h-4 text-[#FC5200]" />
                Reading Workout Logs (Past 7 Days)
              </h3>
              <p className="text-xs text-white/50 mt-1">Consistency counts! See pages read day by day.</p>
            </div>
            <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-white/10 border border-white/10 px-2 py-0.5 rounded text-white-400">Pages Count</span>
          </div>

          <div className="h-44 flex items-end justify-between pt-6 px-2">
            {graphData.map((d, idx) => {
              const heightPercent = Math.max((d.pages / maxPages) * 100, 4); // minimum height so day bar stays visible
              return (
                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                  {/* Tooltip value */}
                  <div className="absolute bottom-full mb-1 bg-black border border-white/15 text-white text-[9px] font-mono font-black py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-10">
                    {d.pages} pages read
                  </div>
                  
                  {/* Bar */}
                  <motion.div 
                    className={`w-10 rounded-t-lg transition-colors cursor-pointer ${d.dateStr === '2026-06-01' ? 'bg-[#FC5200] hover:bg-[#ff641a]' : 'bg-white/10 hover:bg-[#FC5200]/70'}`}
                    style={{ height: `${heightPercent}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                  />

                  {/* Day Header */}
                  <span className="text-[10px] text-white/40 mt-2 font-mono font-black uppercase select-none">{d.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Physical vs Digital format breakdown circular slider */}
        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-none flex flex-col justify-between" id="stats-card-ratio">
          <div className="border-b border-white/5 pb-3 mb-3">
            <h3 className="text-xs font-black uppercase text-white tracking-[0.15em] font-display">
              Reading Format Ratio
            </h3>
            <p className="text-xs text-white/50 mt-1">Comparison based on pages read across digital screens and physical pages.</p>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center space-y-4 py-3">
            <div className="w-full flex items-center justify-between px-2 gap-4">
              {/* Physical Progress */}
              <div className="text-center space-y-1">
                <div className="bg-white/5 text-[#FC5200] rounded-lg p-2.5 inline-block border border-white/10">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-[9px] text-white/40 font-black uppercase tracking-wider font-mono">Physical</p>
                <p className="text-md font-black text-white italic">{physicalPages} <span className="text-[10px] font-mono font-bold text-white/40">pgs</span></p>
                <span className="text-[10px] font-mono font-black text-[#FC5200] bg-[#FC5200]/10 border border-[#FC5200]/20 px-2 py-0.5 rounded-full">{physicalPercent}%</span>
              </div>

              {/* Progress visual bar */}
              <div className="flex-1 space-y-2 max-w-[120px]">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                  <div className="bg-[#FC5200] h-full" style={{ width: `${physicalPercent}%` }} />
                  <div className="bg-white/60 h-full" style={{ width: `${digitalPercent}%` }} />
                </div>
                <p className="text-[9px] text-center text-white/40 uppercase font-mono tracking-wider">Contribution</p>
              </div>

              {/* Digital Progress */}
              <div className="text-center space-y-1">
                <div className="bg-white/5 text-white/80 rounded-lg p-2.5 inline-block border border-white/10">
                  <Smartphone className="w-5 h-5" />
                </div>
                <p className="text-[9px] text-white/40 font-black uppercase tracking-wider font-mono">Digital</p>
                <p className="text-md font-black text-white italic">{digitalPages} <span className="text-[10px] font-mono font-bold text-white/40">pgs</span></p>
                <span className="text-[10px] font-mono font-black text-white/80 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">{digitalPercent}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
            <p className="text-xs text-white/60 leading-relaxed text-center">
              {physicalPercent > digitalPercent ? (
                <>You read mostly <strong className="text-[#FC5200]">physical books</strong>. That classic paper smell drives your daily reading streak!</>
              ) : (
                <>You read mostly <strong className="text-white">digital documents</strong>. The responsive screens and screen lighting help you read faster!</>
              )}
            </p>
          </div>
        </div>

      </div>

      {/* Historical Reading sessions list */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-[#FC5200] uppercase tracking-[0.2em] font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#FC5200]" />
          READING WORKOUT HISTORY (ALL SESSIONS)
        </h3>
        
        <div className="bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#050505] border-b border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">
                  <th className="px-5 py-4">Book Title</th>
                  <th className="px-5 py-4 text-center">Date</th>
                  <th className="px-5 py-4 text-center">Work Metric</th>
                  <th className="px-5 py-4 text-center">Pace</th>
                  <th className="px-5 py-4">Scribbled Thoughts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions.slice().reverse().map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-black uppercase italic text-white tracking-tight text-xs">{s.bookTitle}</td>
                    <td className="px-5 py-4 text-center text-xs font-mono font-bold text-white/40">{s.date}</td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-white">
                      <span className="bg-white/10 border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold mr-2 inline-block">
                        {s.format === 'physical' ? '📚 PHYS' : '📱 DIGI'}
                      </span>
                      {s.pagesRead} pgs / {s.durationMinutes} min
                    </td>
                    <td className="px-5 py-4 text-center text-xs font-mono font-bold text-[#FC5200]">
                      {s.pagesRead > 0 ? `${Math.round((s.durationMinutes / s.pagesRead) * 10) / 10} m/p` : 'N/A'}
                    </td>
                    <td className="px-5 py-4 text-xs text-white/60 leading-relaxed max-w-sm font-medium">
                      {s.notes || <span className="text-white/20 italic">No thoughts shared</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
