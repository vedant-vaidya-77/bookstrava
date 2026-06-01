import React, { useState, useEffect } from 'react';
import { Book, ReadingSession, Activity } from './types';
import { INITIAL_BOOKS, INITIAL_SESSIONS, INITIAL_ACTIVITIES } from './data';
import Dashboard from './components/Dashboard';
import Stats from './components/Stats';
import Social from './components/Social';
import SystemDesign from './components/SystemDesign';
import ArchitectChat from './components/ArchitectChat';
import { BookOpen, BarChart2, Share2, HelpCircle, GraduationCap, Settings, Heart, MessageSquare, Compass, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const COVER_GRADIENTS = [
  'from-amber-500 to-orange-600',
  'from-blue-600 to-indigo-800',
  'from-emerald-500 to-teal-700',
  'from-purple-500 to-pink-600',
  'from-indigo-500 to-purple-700',
  'from-rose-500 to-red-600',
  'from-teal-600 to-cyan-700',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stats' | 'social' | 'system-design'>('dashboard');

  // Core Persistence States
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('bookstrava_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [sessions, setSessions] = useState<ReadingSession[]>(() => {
    const saved = localStorage.getItem('bookstrava_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('bookstrava_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // State for System design chatbot & configuration variables
  const [systemVariables, setSystemVariables] = useState({
    platform: 'Progressive Web App (PWA)',
    database: 'Firestore NoSQL',
    syncPolicy: 'JSON event sourcing'
  });

  const [architectAnswer, setArchitectAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Sync state mutations cleanly back into LocalStorage
  useEffect(() => {
    localStorage.setItem('bookstrava_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('bookstrava_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('bookstrava_activities', JSON.stringify(activities));
  }, [activities]);

  const dailyPageGoal = 30;

  // Add reading workout session
  const handleAddSession = (bookId: string, pages: number, duration: number, notes: string) => {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return;

    const book = books[bookIndex];
    const prevPage = book.currentPage;
    const nextPage = Math.min(book.currentPage + pages, book.totalPages);
    const hasCompleted = nextPage >= book.totalPages;

    // 1. Immutable Book update
    const updatedBooks = [...books];
    updatedBooks[bookIndex] = {
      ...book,
      currentPage: nextPage,
      status: hasCompleted ? 'completed' : 'reading',
      endDate: hasCompleted ? '2026-06-01' : undefined
    };
    setBooks(updatedBooks);

    // 2. Append new session
    const workoutUuid = 'sess-' + Date.now();
    const newSession: ReadingSession = {
      id: workoutUuid,
      bookId,
      bookTitle: book.title,
      pagesRead: pages,
      startPage: prevPage,
      endPage: nextPage,
      durationMinutes: duration,
      date: '2026-06-01', // simulated current workout date
      notes: notes || undefined,
      format: book.format,
    };
    setSessions(prev => [...prev, newSession]);

    // 3. Trigger Strava social activity post
    const activityUuid = 'act-' + Date.now();
    const selfActivity: Activity = {
      id: activityUuid,
      userId: 'host-user',
      userName: 'Vedant (You)',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      bookTitle: book.title,
      bookAuthor: book.author,
      type: hasCompleted ? 'completed' : 'session',
      pages: pages,
      duration: duration || undefined,
      format: book.format,
      timestamp: 'Just now',
      kudos: [],
      comments: []
    };
    setActivities(prev => [selfActivity, ...prev]);
  };

  // Create new Book logic
  const handleAddBook = (title: string, author: string, totalPages: number, format: 'physical' | 'digital') => {
    const defaultColor = COVER_GRADIENTS[Math.floor(Math.random() * COVER_GRADIENTS.length)];
    const bookUuid = 'book-' + Date.now();
    const newBook: Book = {
      id: bookUuid,
      title,
      author,
      coverColor: defaultColor,
      totalPages,
      currentPage: 0,
      format,
      status: 'reading',
      startDate: '2026-06-01'
    };
    
    setBooks(prev => [newBook, ...prev]);

    // Add activity for starting research on book
    const actUuid = 'act-' + Date.now() + '-start';
    const startAct: Activity = {
      id: actUuid,
      userId: 'host-user',
      userName: 'Vedant (You)',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      bookTitle: title,
      bookAuthor: author,
      type: 'started',
      format,
      timestamp: 'Just now',
      kudos: [],
      comments: []
    };
    setActivities(prev => [startAct, ...prev]);
  };

  // Kudos toggle (Claps) logic
  const handleAddKudos = (activityId: string, userName: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id === activityId) {
        const alreadyKudosed = act.kudos.includes(userName);
        return {
          ...act,
          kudos: alreadyKudosed 
            ? act.kudos.filter(u => u !== userName) 
            : [...act.kudos, userName]
        };
      }
      return act;
    }));
  };

  // Feed comment posting
  const handleAddComment = (activityId: string, userName: string, text: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id === activityId) {
        return {
          ...act,
          comments: [
            ...act.comments,
            { id: 'comm-' + Date.now(), userName, text, timestamp: 'Just now' }
          ]
        };
      }
      return act;
    }));
  };

  // Simulate friends' activity trigger
  const handleSimulateActivity = () => {
    const list = [
      { userName: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120", bookTitle: "Crime and Punishment", bookAuthor: "Fyodor Dostoevsky", type: "session" as const, pages: 35, duration: 50, format: "physical" as const },
      { userName: "Devon Miller", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120", bookTitle: "Clean Code", bookAuthor: "Robert C. Martin", type: "session" as const, pages: 48, duration: 60, format: "digital" as const },
      { userName: "Sarah Chen (Dev)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120", bookTitle: "Refactoring", bookAuthor: "Martin Fowler", type: "session" as const, pages: 20, duration: 25, format: "digital" as const },
      { userName: "Marcus Aurelius", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120", bookTitle: "Letters from a Stoic", bookAuthor: "Seneca", type: "completed" as const, pages: 240, format: "physical" as const }
    ];

    const pick = list[Math.floor(Math.random() * list.length)];
    const actUuid = 'act-sim-' + Date.now();
    const activityPost: Activity = {
      id: actUuid,
      userId: 'user-friend-' + Date.now(),
      userName: pick.userName,
      userAvatar: pick.avatar,
      bookTitle: pick.bookTitle,
      bookAuthor: pick.bookAuthor,
      type: pick.type,
      pages: pick.pages,
      duration: pick.duration,
      format: pick.format,
      timestamp: 'Just now',
      kudos: [],
      comments: []
    };

    setActivities(prev => [activityPost, ...prev]);
  };

  // Contact System Architect API proxy (server side)
  const handleAskArchitect = async (questionText: string) => {
    setIsAsking(true);
    setArchitectAnswer('');

    try {
      const response = await fetch('/api/ask-architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          systemVariables
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error code ' + response.status);
      }

      const data = await response.json();
      setArchitectAnswer(data.answer);

    } catch (err) {
      console.warn("Backend API offline or failed, serving detailed fallback response:", err);
      // Resilience / Fallback responses for key questions
      setTimeout(() => {
        let answerText = "System Architect Fallback Policy active.\n\nHere is a highly professional review on this design factor under your currently adjusted deployment settings:\n\n";
        
        if (questionText.toLowerCase().includes('web vs app') || questionText.toLowerCase().includes('pwa')) {
          answerText += `To prove Product-Market Fit for Bookstrava, launching an initial Progressive Web App (PWA) under a single React + TypeScript codebase is highly recommended. PWAs completely bypass App Store entry fees, compilation review queues, and allow instant remote CSS/TS revisions to be pulled straight from the container. Adding a Service Worker resolves the offline tracking of books efficiently; when a user boards a subway/tube, progress can be temporarily logged to browser-side IndexedDB databases, then synchronized atomically via background fetch triggers when network packets are re-established. Swift/native Swift UI should follow purely as a phase 2 expansion once reader metrics indicate persistent daily page logging habits.`;
        } else if (questionText.toLowerCase().includes('fanout') || questionText.toLowerCase().includes('scale')) {
          answerText += `Generating collaborative feeds under massive read volume (e.g., 100K active followers viewing reading streaks simultaneously) represents an extreme database bottleneck. Conducting active SQL relations queries (SELECT * FROM activities WHERE author_id IN (friends_ids) ORDER BY time DESC) at runtime will saturate indexing threads. Strava solves this through a 'Fanout-on-Write' paradigm: when a reader completes a logging workout, an asynchronous messaging worker (e.g., bullmq / sidekiq) identifies their active followers, looks up their user-specific feed caches (hosted inside memory-resident Redis cluster lists), and immediately pushes the activity ID to those lists. Reading the chronological feed then becomes a lightning-fast O(1) fetch, assuring sub-100ms loading speeds for followers.`;
        } else if (questionText.toLowerCase().includes('firestore') || questionText.toLowerCase().includes('schema')) {
          answerText += `A Firestore NoSQL deployment is exceptional for flexible book models. Here is the suggested structure:\n\n- /users/{userId}/public -> (display name, total pages counted, streak days counter)\n- /users/{userId}/books/{bookId} -> (book static document, total pages, format_type, status: 'reading')\n- /users/{userId}/sessions/{sessionId} -> (logged session object, duration, startPage, endPage, date, notes)\n- /activities/{activityId} -> (global social timeline collection, userName, bookTitle, pagesRead, kudosList: Array, commentsSubcollection: Sub)\n\nRules must securely evaluate resource states. To prevent database wallet leaks, prevent client-delegated feeds; enforce that reading get operations strictly verify that other requests match friend lists.`;
        } else {
          answerText += `Under your specified system setting of ${systemVariables.platform} running on ${systemVariables.database} utilizing a ${systemVariables.syncPolicy} policy, your architectural design is positioned for solid performance. For offline reading reconciliation, the ${systemVariables.syncPolicy} choice resolves file collisions cleanly. If conflicts occur due to overlapping sessions, event-sourcing ensures you replay atomic logs sequentially instead of writing over total completed stats directly, which blocks impossible updates (like reading 300 pages in 0 minutes).`;
        }

        setArchitectAnswer(answerText);
      }, 1000);

    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#FC5200]/30 relative overflow-x-hidden">
      
      {/* Decorative Bold Typography Background Tag */}
      <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none select-none z-0">
        <div className="text-[160px] md:text-[230px] font-black leading-none tracking-tighter uppercase font-display select-none">
          READ
        </div>
      </div>

      {/* Navigation Header inspired by PACS fitness stats page */}
      <header className="bg-[#080808] border-b border-white/10 sticky top-0 z-40 backdrop-blur-md relative">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-[#FC5200] font-black text-3xl tracking-tighter italic select-none">
              PACE
            </div>
            <div className="h-6 w-px bg-white/20 hidden md:block" />
            <div>
              <h1 className="text-sm font-black leading-none text-white tracking-wider flex items-center gap-1.5 uppercase font-display">
                BOOKSTRAVA
                <span className="text-[10px] bg-[#FC5200] text-black font-extrabold px-2.5 py-0.5 rounded-sm tracking-tighter">ATHLETIC</span>
              </h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono mt-0.5">High-Performance Literacy Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black uppercase text-white/90">Vedant (You)</p>
              <p className="text-[9px] text-[#FC5200] uppercase tracking-widest font-mono font-bold">Level 42 Reader</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FC5200] to-[#FF8C00] shadow-md shadow-[#FC5200]/20" />
          </div>
        </div>
      </header>

      {/* Primary Workspace Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8 relative z-10">
        
        {/* Navigation Tabs Bar - Bold Typography Theme Styling */}
        <div className="flex flex-wrap md:flex-nowrap border border-white/10 gap-1 bg-[#080808] p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#FC5200] text-black shadow-md font-black italic' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <Compass className="w-4 h-4" /> Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer ${activeTab === 'stats' ? 'bg-[#FC5200] text-black shadow-md font-black italic' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <BarChart2 className="w-4 h-4" /> Reading Stats
          </button>
          
          <button 
            onClick={() => setActiveTab('social')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer ${activeTab === 'social' ? 'bg-[#FC5200] text-black shadow-md font-black italic' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <Share2 className="w-4 h-4" /> Friends Feed
          </button>
          
          <button 
            onClick={() => setActiveTab('system-design')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer ${activeTab === 'system-design' ? 'bg-white text-black shadow-md font-black italic' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <GraduationCap className="w-4 h-4" /> Blueprint Hub
          </button>
        </div>

        {/* Dynamic Tab Render Area */}
        <div className="min-h-[480px]">
          {activeTab === 'dashboard' && (
            <Dashboard 
              books={books} 
              sessions={sessions} 
              onAddSession={handleAddSession}
              onAddBook={handleAddBook}
              dailyPageGoal={dailyPageGoal}
            />
          )}

          {activeTab === 'stats' && (
            <Stats 
              sessions={sessions}
              books={books}
            />
          )}

          {activeTab === 'social' && (
            <Social 
              activities={activities}
              onAddKudos={handleAddKudos}
              onAddComment={handleAddComment}
              onSimulateActivity={handleSimulateActivity}
            />
          )}

          {activeTab === 'system-design' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="system-architect-view">
              <div className="col-span-1 lg:col-span-2">
                <SystemDesign 
                  onAskArchitect={handleAskArchitect}
                  architectAnswer={architectAnswer}
                  isAsking={isAsking}
                  systemVariables={systemVariables}
                  setSystemVariables={setSystemVariables}
                />
              </div>
              <div className="col-span-1">
                <div className="sticky top-24">
                  <ArchitectChat 
                    onAskArchitect={handleAskArchitect}
                    architectAnswer={architectAnswer}
                    isAsking={isAsking}
                    systemVariables={systemVariables}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      <footer className="bg-[#080808] border-t border-white/10 py-8 mt-16 text-center text-xs text-white/30 font-medium">
        <p className="uppercase tracking-[0.2em] font-mono text-[10px]">BOOKSTRAVA TELEMETRY LABS &copy; 2026</p>
        <p className="mt-1 text-white/20 italic">Designed with bold fitness typography & real-time system architecture insights.</p>
        <p className="mt-3 font-mono text-[9px] text-[#FC5200]">PORT 3000 INGRESS • CLOUD ROUTER STANDBY</p>
      </footer>

    </div>
  );
}
