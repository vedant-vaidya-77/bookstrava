import React, { useState } from 'react';
import { Book, ReadingSession } from '../types';
import { BookOpen, Plus, Clock, AlignLeft, Smartphone, FileText, CheckCircle, Sparkles, Trophy, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  books: Book[];
  sessions: ReadingSession[];
  onAddSession: (bookId: string, pages: number, duration: number, notes: string) => void;
  onAddBook: (title: string, author: string, totalPages: number, format: 'physical' | 'digital') => void;
  dailyPageGoal: number;
}

export default function Dashboard({ books, sessions, onAddSession, onAddBook, dailyPageGoal }: DashboardProps) {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [pagesRead, setPagesRead] = useState<number>(20);
  const [duration, setDuration] = useState<number>(30);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Add Book dialog state
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPages, setNewPages] = useState<number>(300);
  const [newFormat, setNewFormat] = useState<'physical' | 'digital'>('physical');

  // Filter books in progress
  const activeBooks = books.filter(b => b.status === 'reading');
  const backlogBooks = books.filter(b => b.status === 'backlog');
  const completedBooks = books.filter(b => b.status === 'completed');

  // Calculate today's pages read
  const todayStr = '2026-06-01'; // Simulated "current time" for system
  const todayPages = sessions
    .filter(s => s.date === todayStr)
    .reduce((acc, s) => acc + s.pagesRead, 0);

  const goalPercent = Math.min(Math.round((todayPages / dailyPageGoal) * 100), 100);

  // Auto-fill selected book when active books changes
  React.useEffect(() => {
    if (activeBooks.length > 0 && !selectedBookId) {
      setSelectedBookId(activeBooks[0].id);
    }
  }, [activeBooks, selectedBookId]);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedBookId) {
      setErrorMsg('Please select a book to log reading.');
      return;
    }

    const book = books.find(b => b.id === selectedBookId);
    if (!book) return;

    const remainingPages = book.totalPages - book.currentPage;
    if (pagesRead <= 0) {
      setErrorMsg('Pages read must be greater than 0.');
      return;
    }
    if (pagesRead > remainingPages) {
      setErrorMsg(`You only have ${remainingPages} pages left in this book.`);
      return;
    }
    if (duration <= 0) {
      setErrorMsg('Duration must be greater than 0 minutes.');
      return;
    }

    onAddSession(selectedBookId, pagesRead, duration, notes);
    
    // Reset form parameters
    setNotes('');
    setPagesRead(20);
    setDuration(30);
    
    // Update select book if previous gets finished
    const updatedBook = books.find(b => b.id === selectedBookId);
    if (updatedBook && updatedBook.currentPage + pagesRead >= updatedBook.totalPages) {
      const nextActive = activeBooks.find(b => b.id !== selectedBookId);
      setSelectedBookId(nextActive ? nextActive.id : '');
    }
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || newPages <= 0) return;
    onAddBook(newTitle, newAuthor, newPages, newFormat);
    setNewTitle('');
    setNewAuthor('');
    setNewPages(300);
    setIsAddingBook(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="dashboard-tab">
      
      {/* 3. Perfect Grid: Hero Goal & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Goal Ring & Streaks Summary */}
        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-none flex flex-col items-center justify-between col-span-1 min-h-[320px]" id="dashboard-card-goal">
          <div className="w-full flex items-center justify-between border-b border-white/5 pb-3 mb-2">
            <h3 className="text-xs font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2 font-mono">
              <Trophy className="w-4 h-4 text-[#FC5200] animate-pulse" />
              DAILY TARGET STATUS
            </h3>
            <span className="text-[10px] font-mono text-[#FC5200] bg-[#FC5200]/10 border border-[#FC5200]/20 px-2.5 py-0.5 rounded font-black uppercase tracking-wider">
              4 Days Active
            </span>
          </div>

          <div className="relative w-44 h-44 flex items-center justify-center my-4">
            {/* SVG Arc for Ring Tracker */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-white/5"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#FC5200]"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * goalPercent) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              <span className="text-5xl font-black text-white font-display tracking-tighter leading-none italic">
                {todayPages}
              </span>
              <span className="text-[10px] text-white/40 font-mono font-bold tracking-widest uppercase mt-1">
                / {dailyPageGoal} PAGES
              </span>
            </div>
          </div>

          <div className="text-center w-full mt-2">
            {goalPercent >= 100 ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-550/20 font-black uppercase tracking-wider px-3 py-1 rounded">
                <CheckCircle className="w-3.5 h-3.5" /> Target Achieved! Kudos Dispatched
              </span>
            ) : (
              <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
                Track <span className="font-mono font-bold text-white text-sm">{(dailyPageGoal - todayPages)}</span> more pages to secure today's metric & maintain your streak score.
              </p>
            )}
          </div>
        </div>
 
        {/* Strava Quick Logging Interface */}
        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-none col-span-1 lg:col-span-2 flex flex-col justify-between" id="dashboard-card-log">
          <div className="border-b border-white/5 pb-3 mb-4">
            <h3 className="text-xs font-black uppercase text-white/40 tracking-[0.2em] flex items-center gap-2 font-mono">
              <Clock className="w-4 h-4 text-[#FC5200]" />
              LOG DAILY WORKOUT
            </h3>
            <p className="text-xs text-white/50 mt-1">Record incremental pages mutated today to prompt automatic social timeline updates.</p>
          </div>

          {activeBooks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white/5 border border-white/10 rounded-xl space-y-4">
              <BookOpen className="w-12 h-12 text-[#FC5200] animate-bounce" />
              <p className="text-sm text-white/60 font-semibold uppercase tracking-wider">No Active Books on Your Reading Shelf</p>
              <button 
                onClick={() => setIsAddingBook(true)} 
                className="text-xs bg-[#FC5200] hover:bg-[#ff641a] text-black font-black uppercase italic tracking-wider px-5 py-2.5 rounded transition-all cursor-pointer"
              >
                Add Your First Book
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Book Select */}
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 font-mono">Select Active Book</label>
                  <select 
                    value={selectedBookId} 
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#FC5200] focus:border-transparent font-medium"
                    style={{ colorScheme: 'dark' }}
                  >
                    {activeBooks.map(b => (
                      <option key={b.id} value={b.id} className="bg-[#080808] text-white">
                        {b.title} ({b.currentPage}/{b.totalPages} pgs)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pages logged */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 font-mono">Pages Read</label>
                    <input 
                      type="number" 
                      value={pagesRead} 
                      onChange={(e) => setPagesRead(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#FC5200] text-center font-bold font-mono"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 font-mono">Duration (mins)</label>
                    <input 
                      type="number" 
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#FC5200] text-center font-bold font-mono"
                      min="1"
                    />
                  </div>
                </div>

              </div>

              {/* Dynamic Reading Format Feedback Badge */}
              <div className="flex items-center justify-between text-[11px] py-1 border-t border-white/5 pt-3">
                <span className="text-white/40 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  FORMAT: <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded uppercase font-mono">
                    {books.find(b => b.id === selectedBookId)?.format === 'physical' ? '📚 Physical copy' : '📱 Digital doc'}
                  </span>
                </span>
                {pagesRead > 0 && duration > 0 && (
                  <span className="text-[#FC5200] font-mono font-bold uppercase tracking-wider bg-[#FC5200]/10 border border-[#FC5200]/20 px-2 py-0.5 rounded">
                    PACE: {Math.round((duration / pagesRead) * 10) / 10} min / pg
                  </span>
                )}
              </div>

              {/* Workout notes */}
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 font-mono">Share thoughts / Margin Scribbles</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How was this session? Learn anything groundbreaking? (Will post to feed)"
                  className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-3.5 py-3 text-xs placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#FC5200]"
                  rows={2}
                />
              </div>

              {errorMsg && (
                <div className="text-[#FC5200] text-xs font-bold bg-[#FC5200]/15 p-2.5 rounded border border-[#FC5200]/25">
                  ⚠️ {errorMsg}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-[#FC5200] hover:bg-[#ff641a] text-black font-black uppercase italic tracking-wider text-xs py-3.5 rounded-xl transition-all shadow-md shadow-[#FC5200]/10 hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> LOG READING WORKOUT
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Currently Reading Stack */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h2 className="text-md font-black tracking-wider text-white uppercase flex items-center gap-2 font-display">
            <BookOpen className="w-5 h-5 text-[#FC5200]" /> CURRENTLY TRACKING
          </h2>
          <button 
            onClick={() => setIsAddingBook(true)}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white px-4 py-2.5 rounded-lg transition-all cursor-pointer border border-white/10"
          >
            <Plus className="w-3.5 h-3.5" /> NEW ACTIVE BOOK
          </button>
        </div>

        {activeBooks.length === 0 ? (
          <div className="border border-dashed border-white/10 bg-[#080808] rounded-2xl p-12 text-center text-white/50">
            <BookOpen className="mx-auto h-12 w-12 text-white/20 mb-2" />
            <p className="text-sm font-semibold uppercase tracking-wider">No active book workouts. Add a book to populate the shelf.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {activeBooks.map(book => {
                const percent = Math.min(Math.round((book.currentPage / book.totalPages) * 100), 100);
                return (
                  <motion.div 
                    layout
                    key={book.id}
                    className="bg-[#080808] border border-white/10 rounded-2xl p-5 shadow-none hover:border-white/20 transition-all flex gap-4 pr-6 relative overflow-hidden"
                  >
                    {/* Visual Book Cover Widget */}
                    <div className={`w-24 h-32 bg-gradient-to-br ${book.coverColor} rounded-xl shadow-md flex flex-col justify-between p-3 flex-shrink-0 text-white relative`}>
                      <span className="text-[8px] font-mono tracking-[0.2em] font-black uppercase opacity-60 select-none">READING</span>
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-black line-clamp-2 leading-tight tracking-tight uppercase italic">{book.title}</h4>
                        <p className="text-[8px] font-mono tracking-tight opacity-95 truncate">{book.author}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        {book.format === 'physical' ? (
                          <FileText className="w-3 h-3 opacity-90" />
                        ) : (
                          <Smartphone className="w-3 h-3 opacity-90" />
                        )}
                        <span className="text-[9px] font-mono font-black">{percent}%</span>
                      </div>
                    </div>

                    {/* Book Metadata and Progress Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">
                            {book.format === 'physical' ? 'Physical Copy' : 'Digital Screen'}
                          </span>
                          <span className="text-[10px] bg-[#FC5200]/10 text-[#FC5200] border border-[#FC5200]/20 font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
                            IN PROGRESS
                          </span>
                        </div>
                        <h3 className="text-md font-black text-white leading-snug tracking-tight uppercase italic mt-1.5">{book.title}</h3>
                        <p className="text-xs text-white/50 font-semibold">{book.author}</p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider">
                            Pages <span className="font-bold text-white">{book.currentPage}</span> of {book.totalPages}
                          </span>
                          <span className="text-xs font-black text-[#FC5200] italic">
                            {percent}% DONE
                          </span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-[#FC5200] h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Library Backlog Grid */}
      {backlogBooks.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] font-mono">Library Backlog & Wants-To-Read ({backlogBooks.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {backlogBooks.map(book => (
              <div key={book.id} className="bg-[#080808] border border-white/10 rounded-xl p-4 flex gap-3 items-center justify-between">
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className="font-black text-white truncate text-xs uppercase italic tracking-tight">{book.title}</h4>
                  <p className="text-[11px] text-white/50 truncate font-medium">{book.author}</p>
                  <span className="inline-block text-[9px] text-[#FC5200] mt-1 font-mono uppercase font-bold tracking-wider">{book.format} • {book.totalPages} pages</span>
                </div>
                <button 
                  onClick={() => {
                    book.status = 'reading';
                    book.startDate = todayStr;
                    onAddSession(book.id, 0, 0, ''); // trigger refreshing
                  }}
                  className="bg-white/10 hover:bg-[#FC5200] hover:text-black hover:border-transparent text-white border border-white/10 text-[9px] font-black uppercase tracking-wider px-3.5 py-2 rounded transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                >
                  START
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal / Dialog for Add Book */}
      <AnimatePresence>
        {isAddingBook && (
          <div className="fixed inset-0 bg-[#050505]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#080808] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-black text-white text-sm uppercase tracking-[0.15em] flex items-center gap-2 font-display">
                  <Sparkles className="w-5 h-5 text-[#FC5200]" /> ADD NEW WORKOUT TARGET
                </h3>
                <button 
                  onClick={() => setIsAddingBook(false)}
                  className="text-white/40 hover:text-white text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBook} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-mono font-black text-white/40 uppercase tracking-wider mb-1.5">Book Title / Manual Course</label>
                  <input 
                    type="text" 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Sapiens, Beyond Good & Evil"
                    className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-[#FC5200]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-black text-white/40 uppercase tracking-wider mb-1.5 font-sans">Author / Authoritarian</label>
                  <input 
                    type="text" 
                    value={newAuthor} 
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g., Friedrich Nietzsche"
                    className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-[#FC5200]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-black text-white/40 uppercase tracking-wider mb-1.5">Total Pages</label>
                    <input 
                      type="number" 
                      value={newPages} 
                      onChange={(e) => setNewPages(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-3 py-2 text-xs text-center font-bold font-mono"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-black text-white/40 uppercase tracking-wider mb-1.5">Format Type</label>
                    <div className="flex bg-[#050505] border border-white/10 p-0.5 rounded-xl text-center">
                      <button
                        type="button"
                        onClick={() => setNewFormat('physical')}
                        className={`flex-1 text-[10px] py-1.5 font-black uppercase rounded-lg transition-all cursor-pointer ${newFormat === 'physical' ? 'bg-[#FC5200] text-black font-black' : 'text-white/40 hover:text-white'}`}
                      >
                        Physical
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewFormat('digital')}
                        className={`flex-1 text-[10px] py-1.5 font-black uppercase rounded-lg transition-all cursor-pointer ${newFormat === 'digital' ? 'bg-[#FC5200] text-black font-black' : 'text-white/40 hover:text-white'}`}
                      >
                        Digital
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#FC5200] hover:bg-[#ff641a] text-black font-black uppercase italic tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-xs mt-2"
                >
                  ADD TO RUNNING TRACKS
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
