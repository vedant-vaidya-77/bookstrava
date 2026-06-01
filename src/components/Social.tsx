import React, { useState } from 'react';
import { Activity } from '../types';
import { Heart, MessageCircle, Share2, Sparkles, Send, Award, BookOpen, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SocialProps {
  activities: Activity[];
  onAddKudos: (activityId: string, userName: string) => void;
  onAddComment: (activityId: string, userName: string, text: string) => void;
  onSimulateActivity: () => void;
}

export default function Social({ activities, onAddKudos, onAddComment, onSimulateActivity }: SocialProps) {
  const [activeCommentBoxId, setActiveCommentBoxId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const currentUserName = 'Vedant (You)';

  const handleCommentSubmit = (e: React.FormEvent, activityId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(activityId, currentUserName, commentText.trim());
    setCommentText('');
    setActiveCommentBoxId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="social-tab">
      
      {/* Social Title & Controls banner */}
      <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-none" id="social-hero">
        <div className="space-y-1">
          <h2 className="text-xl font-black uppercase italic tracking-wider font-display flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#FC5200]" /> BOOKSTRAVA ACTIVITY FEED
          </h2>
          <p className="text-xs text-white/50 leading-relaxed font-sans">Spot your friends' literal daily pages milestones, leaves, commentaries & streaks.</p>
        </div>

        <button 
          onClick={onSimulateActivity}
          className="bg-[#FC5200] hover:bg-[#ff641a] text-black font-black uppercase italic text-xs px-5 py-3 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 animate-pulse" /> SIMULATE FRIEND WORKOUT
        </button>
      </div>

      {/* Main Feed Container */}
      <div className="max-w-2xl mx-auto space-y-6" id="social-feed-container">
        {activities.length === 0 ? (
          <div className="border border-dashed border-white/10 bg-[#080808] rounded-2xl p-12 text-center text-white/40">
            <UserPlus className="mx-auto w-12 h-12 text-white/20 mb-2" />
            <p className="text-sm font-semibold uppercase tracking-wider">Your Feed Is Currently Empty</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {activities.map((act) => {
              const hasKudosed = act.kudos.includes(currentUserName);
              
              return (
                <motion.div 
                  layout
                  key={act.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#080808] border border-white/10 rounded-2xl p-5 shadow-none space-y-4 text-left relative overflow-hidden"
                >
                  
                  {/* Activity Log Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={act.userAvatar} 
                        alt={act.userName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0 object-cover"
                      />
                      <div>
                        <h4 className="font-black uppercase italic font-display tracking-tight text-white text-sm leading-tight flex items-center gap-1.5">
                          {act.userName}
                          {act.type === 'completed' && (
                            <span className="text-[9px] bg-[#FC5200]/20 text-[#FC5200] font-extrabold uppercase px-2 py-0.5 rounded border border-[#FC5200]/30 inline-flex items-center gap-0.5">
                              <Award className="w-2.5 h-2.5" /> FINISHED
                            </span>
                          )}
                        </h4>
                        <span className="text-[9px] text-white/40 font-bold font-mono uppercase">{act.timestamp}</span>
                      </div>
                    </div>

                    <span className="text-[9px] uppercase font-bold font-mono tracking-wider bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-white/60 flex items-center gap-1">
                      {act.format === 'physical' ? '📚 Physical' : '📱 Digital'}
                    </span>
                  </div>

                  {/* Activity Body */}
                  <div className="bg-[#050505] p-4 border border-white/5 rounded-xl space-y-1.5 relative">
                    <p className="text-sm text-white/80 leading-snug font-sans">
                      {act.type === 'completed' ? (
                        <>Finished reading <span className="font-extrabold uppercase italic text-white">"{act.bookTitle}"</span> by {act.bookAuthor}!</>
                      ) : act.type === 'started' ? (
                        <>Started tracking a new workout session for <span className="font-extrabold uppercase italic text-white">"{act.bookTitle}"</span> by {act.bookAuthor}.</>
                      ) : (
                        <>Completed a book workout: Read <span className="font-black text-[#FC5200] text-lg italic mr-1">{act.pages}</span> pages of <span className="font-extrabold uppercase italic text-white">"{act.bookTitle}"</span>{act.duration ? ` in ${act.duration} minutes` : ''}.</>
                      )}
                    </p>
                    
                    {act.type === 'session' && act.pages && act.duration && (
                      <div className="text-[10px] text-white/40 font-mono font-bold uppercase tracking-wider pt-1 border-t border-white/5">
                        Pace: {Math.round((act.duration / act.pages) * 10) / 10} min per page • Avg Speed: {Math.round((act.pages / (act.duration / 60)))} pages/hour
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-6 border-y border-white/5 py-3 text-xs text-white/50">
                    {/* Clap / Kudos button */}
                    <button 
                      onClick={() => onAddKudos(act.id, currentUserName)}
                      className={`flex items-center gap-1.5 font-black uppercase tracking-wider font-mono text-[11px] transition-transform cursor-pointer hover:scale-105 active:scale-95 ${hasKudosed ? 'text-[#FC5200]' : 'text-white/40 hover:text-white'}`}
                    >
                      <Heart className={`w-4 h-4 ${hasKudosed ? 'fill-[#FC5200] stroke-[#FC5200]' : 'stroke-white/40'}`} />
                      <span>{act.kudos.length} LEAFS</span>
                    </button>

                    {/* Comment Reveal */}
                    <button 
                      onClick={() => {
                        setActiveCommentBoxId(activeCommentBoxId === act.id ? null : act.id);
                        setCommentText('');
                      }}
                      className="flex items-center gap-1.5 font-black uppercase tracking-wider font-mono text-[11px] hover:text-white transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 stroke-white/45" />
                      <span>{act.comments.length} COMMENTS</span>
                    </button>
                  </div>

                  {/* Leaf givers summary string */}
                  {act.kudos.length > 0 && (
                    <div className="text-[9px] font-mono text-white/30 uppercase tracking-wider italic">
                      Applauded by <span className="font-bold text-white/60">{act.kudos.join(', ')}</span>
                    </div>
                  )}

                  {/* Comments Stack */}
                  {act.comments.length > 0 && (
                    <div className="space-y-2 mt-3 pl-3 border-l-2 border-[#FC5200]/30 bg-[#050505]/50 p-2.5 rounded-xl">
                      {act.comments.map((comment) => (
                        <div key={comment.id} className="text-xs leading-relaxed">
                          <span className="font-black text-white">{comment.userName}: </span>
                          <span className="text-white/75">{comment.text}</span>
                          <span className="text-[9px] font-mono font-bold text-white/30 ml-2">({comment.timestamp})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Write Comment Box */}
                  <AnimatePresence>
                    {activeCommentBoxId === act.id && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={(e) => handleCommentSubmit(e, act.id)}
                        className="flex mt-3 gap-2 overflow-hidden items-center"
                      >
                        <input 
                          type="text" 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a congratulatory comment..."
                          className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FC5200]"
                        />
                        <button 
                          type="submit"
                          className="p-2 px-4 bg-white hover:bg-white/90 text-black font-black uppercase text-[10px] rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Send className="w-3 h-3" /> SEND
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}

