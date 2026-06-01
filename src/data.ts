import { Book, ReadingSession, Activity, ArchitectureChoice, SystemChallenge } from './types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverColor: 'from-amber-500 to-orange-600',
    totalPages: 320,
    currentPage: 154,
    format: 'physical',
    status: 'reading',
    startDate: '2026-05-15',
  },
  {
    id: 'b2',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    coverColor: 'from-blue-600 to-indigo-800',
    totalPages: 612,
    currentPage: 245,
    format: 'digital',
    status: 'reading',
    startDate: '2026-04-01',
  },
  {
    id: 'b3',
    title: 'Deep Work',
    author: 'Cal Newport',
    coverColor: 'from-emerald-500 to-teal-700',
    totalPages: 304,
    currentPage: 304,
    format: 'physical',
    status: 'completed',
    startDate: '2026-03-10',
    endDate: '2026-04-12',
  },
  {
    id: 'b4',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverColor: 'from-purple-500 to-pink-600',
    totalPages: 476,
    currentPage: 0,
    format: 'digital',
    status: 'backlog',
  }
];

export const INITIAL_SESSIONS: ReadingSession[] = [
  {
    id: 's1',
    bookId: 'b1',
    bookTitle: 'Atomic Habits',
    pagesRead: 25,
    startPage: 0,
    endPage: 25,
    durationMinutes: 30,
    date: '2026-05-16',
    notes: 'The identity loop approach makes total sense. Small 1% changes matter.',
    format: 'physical',
  },
  {
    id: 's2',
    bookId: 'b1',
    bookTitle: 'Atomic Habits',
    pagesRead: 35,
    startPage: 25,
    endPage: 60,
    durationMinutes: 40,
    date: '2026-05-18',
    notes: 'Habit stacking concept is extremely actionable.',
    format: 'physical',
  },
  {
    id: 's3',
    bookId: 'b2',
    bookTitle: 'Designing Data-Intensive Applications',
    pagesRead: 45,
    startPage: 0,
    endPage: 45,
    durationMinutes: 65,
    date: '2026-05-20',
    notes: 'Diving deep into SSTables and LSM-Trees. Mind-bending database storage engines!',
    format: 'digital',
  },
  {
    id: 's4',
    bookId: 'b1',
    bookTitle: 'Atomic Habits',
    pagesRead: 40,
    startPage: 60,
    endPage: 100,
    durationMinutes: 45,
    date: '2026-05-24',
    notes: 'Read during evening commute. Focus has improved!',
    format: 'physical',
  },
  {
    id: 's5',
    bookId: 'b2',
    bookTitle: 'Designing Data-Intensive Applications',
    pagesRead: 50,
    startPage: 45,
    endPage: 95,
    durationMinutes: 60,
    date: '2026-05-28',
    notes: 'Understanding write-ahead logs, indexes, and B-trees over SSTables.',
    format: 'digital',
  },
  {
    id: 's6',
    bookId: 'b1',
    bookTitle: 'Atomic Habits',
    pagesRead: 54,
    startPage: 100,
    endPage: 154,
    durationMinutes: 48,
    date: '2026-05-31',
    notes: 'Advanced tracking techniques and habit tracking devices.',
    format: 'physical',
  },
  {
    id: 's7',
    bookId: 'b2',
    bookTitle: 'Designing Data-Intensive Applications',
    pagesRead: 150,
    startPage: 95,
    endPage: 245,
    durationMinutes: 180,
    date: '2026-06-01',
    notes: 'Weekend power reading. Covered Section 2 on Data Models & Query Languages.',
    format: 'digital',
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    userId: 'u1',
    userName: 'Sarah Chen (Dev)',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    bookTitle: 'Designing Data-Intensive Applications',
    bookAuthor: 'Martin Kleppmann',
    type: 'session',
    pages: 45,
    duration: 60,
    format: 'digital',
    timestamp: '2 hours ago',
    kudos: ['Devon', 'Elena'],
    comments: [
      { id: 'c1', userName: 'Devon', text: 'That textbook rules. Chapter 3 on storage engines is iconic!', timestamp: '1 hour ago' }
    ]
  },
  {
    id: 'a2',
    userId: 'u2',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    bookTitle: 'Crime and Punishment',
    bookAuthor: 'Fyodor Dostoevsky',
    type: 'session',
    pages: 32,
    duration: 45,
    format: 'physical',
    timestamp: '5 hours ago',
    kudos: ['Sarah Chen (Dev)', 'Marcus Aurelius', 'Alex'],
    comments: []
  },
  {
    id: 'a3',
    userId: 'u3',
    userName: 'Marcus Aurelius',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    bookTitle: 'Meditations',
    bookAuthor: 'Marcus Aurelius',
    type: 'completed',
    pages: 180,
    format: 'physical',
    timestamp: '1 day ago',
    kudos: ['Sarah Chen (Dev)', 'Elena Rostova', 'Devon'],
    comments: [
      { id: 'c2', userName: 'Alex', text: 'Bro finished his own book! Absolute power move.', timestamp: '18 hours ago' },
      { id: 'c3', userName: 'Sarah Chen (Dev)', text: 'Humble leadership lessons throughout. Masterpiece!', timestamp: '12 hours ago' }
    ]
  },
  {
    id: 'a4',
    userId: 'u4',
    userName: 'Alex Rivers',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    bookTitle: 'Dune',
    bookAuthor: 'Frank Herbert',
    type: 'started',
    format: 'digital',
    timestamp: '2 days ago',
    kudos: ['Marcus Aurelius'],
    comments: []
  }
];

export const ARCHITECTURE_CHOICES: ArchitectureChoice[] = [
  {
    id: 'web',
    title: 'Progressive Web App (PWA)',
    subtitle: 'HTML5, React/Vite, Tailwind inside container or S3 bucket + CloudFront',
    cost: 'Low',
    timeToMarket: 'Fast',
    performance: 'Good',
    offlineSupport: 'Capable via Service Workers & Cache Storage API. Offline logging writes to IndexedDB and syncs back.',
    keyChallenges: [
      'No native background sync guarantees on iOS (Safari limits background tasks).',
      'Requires explicit user bookmarking to look like a phone application.',
      'Performance can lag with complex rendering or layout components on low-end screens.'
    ],
    recommendedTech: ['React Client', 'Service Workers (workbox)', 'IndexedDB (idb)', 'Tailwind CSS', 'Firebase Cloud Hooks'],
    verdict: 'Excellent starting point for a Minimum Viable Product (MVP). Cheap to implement, operates in browser, allows rapid changes without waiting for App Store approvals.'
  },
  {
    id: 'native',
    title: 'Fully Native App (Swift / Kotlin)',
    subtitle: 'iOS Swift + SwiftUI, Android Kotlin + Jetpack Compose',
    cost: 'High',
    timeToMarket: 'Slow',
    performance: 'Excellent',
    offlineSupport: 'Flawless native SQLite / Room / CoreData cache. Complete control over local background synchronization threads.',
    keyChallenges: [
      'Dual codebases mean duplicated efforts, bug tracking, and resource expenditure.',
      'Slow app store approval times limits rapid feature iteration.',
      'High onboarding cost (requires physical Mac, separate developer licenses).'
    ],
    recommendedTech: ['SwiftUI', 'Jetpack Compose', 'gRPC-Web (high-speed sync)', 'SQLite', 'NodeJS / Go backend server'],
    verdict: 'Ideal long-term state once Product-Market Fit is proven. Best-in-class tactile response, optimal battery efficiency, flawless lockscreen widgets for daily page streaks.'
  },
  {
    id: 'hybrid',
    title: 'Cross-Platform Framework (React Native / Flutter)',
    subtitle: 'Single TypeScript/Dart codebase compiled to native wrappers',
    cost: 'Medium',
    timeToMarket: 'Medium',
    performance: 'Native',
    offlineSupport: 'Robust. Easily shares offline-first DB schemas (WatermelonDB / MMKV) and background workers across both operating systems.',
    keyChallenges: [
      'Third-party dependency breakage on major iOS / Android OS updates.',
      'Complex bridge configuration for micro-interactions (like custom physical camera OCR scans).'
    ],
    recommendedTech: ['React Native (or Expo)', 'WatermelonDB (SQLite model)', 'Tailwind (NativeWind)', 'Firebase JS SDK / Supabase'],
    verdict: 'Highly recommended for Bookstrava. Retains 95% single-codebase speed benefits while outputting standalone app artifacts into Google Play & Apple App stores.'
  }
];

export const SYSTEM_CHALLENGES: SystemChallenge[] = [
  {
    id: 'sync-physical-digital',
    title: 'Physical vs. Digital Progress Tracking',
    icon: 'BookOpen',
    difficulty: 'Medium',
    description: 'Physical books represent progress via page index (e.g., page 110 of 320). Amazon Kindle uses "Locations" or proprietary metric systems. Kobo devices output floating percentages. Audiobooks use remaining hours/seconds. How does "Bookstrava" display a singular consolidated timeline/streak chart?',
    systemImpact: 'Incorrect formulas lead to active streaks resetting, frustrates users when transitioning formats.',
    solutions: [
      {
        name: 'Normalised Word Units (Word & Paragraph mapping)',
        description: 'Standardise an internal "Reading Page" representation to 250 words. During book indexing, standard metadata tracks average words per chapter. Digital readers compute words scrolled / 250, physical readers insert page * 250 words. Results are normalized, accurate, and completely format-agnostic.',
        isSelected: true,
      },
      {
        name: 'Linear Translation Interpolation',
        description: 'Store progress simply as a relative float [0.0 - 1.0]. A user on page 50 of 200 physical book is 25% complete. Kindle at location 4,000 of 16,000 is 25%. Standardize stats as visual "percentages read", and convert back to absolute pages dynamically based on book format when rendering details.',
        isSelected: false,
      }
    ]
  },
  {
    id: 'offline-reconciliation',
    title: 'Offline Conflict Resolution & Clock Skew',
    icon: 'Radio',
    difficulty: 'Hard',
    description: 'Bookstrava users log progress during tube/subway commutes with zero cellular signal. They log on multiple offline devices (e.g. tablet at home, phone on train). When they get online, how do we reconcile overlapping or out-of-order logs without double-counting pages or corrupting graphs?',
    systemImpact: 'Clock skews and double-logging create impossible stats (e.g., read 800 pages in 5 minutes), invalidating social highscores.',
    solutions: [
      {
        name: 'Event-Sourcing with UUID-keyed Log Streams',
        description: 'Instead of mutating a single "bookState" document directly, every session is a unique, immutable "read-event" object with start/end timezone-independent timestamps and client-side generated UUIDs. The database replays events chronologically on the server, ignoring duplicates (idempotency check) and automatically joining fragmented timelines.',
        isSelected: true,
      },
      {
        name: 'CRDT (Conflict-Free Replicated Data Type) State',
        description: 'Implement PN-Counters (Positive-Negative) for pages read and LWW (Last-Write-Wins) for book status variables. State reconciliation resolves deterministically across standard nodes without needing specialized chronological replay servers.',
        isSelected: false,
      }
    ]
  },
  {
    id: 'high-scale-feed',
    title: 'High-Throughput Activity Feed Fanout',
    icon: 'Zap',
    difficulty: 'Extreme',
    description: 'Just like Strava, the core retention loop is logging a read, which immediately notifies friends. As membership scales (e.g., 50 million active users), calculating feed merges on-the-fly inside relational databases (`JOIN users USING followers WHERE...`) will saturate CPU and throttle page loads to 5+ seconds.',
    systemImpact: 'Slow feeds kill the dopamine loop, reducing social sharing and degrading user engagement.',
    solutions: [
      {
        name: 'Fanout-on-Write (Pre-computed Redis Cache Pipeline)',
        description: 'When a user logs a reading session, an asynchronous regional queue worker runs immediately. It identifies their active followers, looks up their user-specific Redis timeline feed, and inserts the new activity ID into their feed lists. Feed retrieval is an instantaneous O(1) list checkout. We boundary-limit users with high friend counts (pushing to passive polling instead of immediate fanout).',
        isSelected: true,
      },
      {
        name: 'Fanout-on-Read with Columnar Memory Indices',
        description: 'Store all activity stream elements inside a optimized chronological column engine. Apply high-efficiency indexes on following relationships. When a user requests their homepage, execute highly-parallel in-memory query filters, relying heavily on localized geographic clusters and global CDN caching.',
        isSelected: false,
      }
    ]
  }
];
