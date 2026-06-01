export interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string; // Dynamic cover colors for customized polished look
  totalPages: number;
  currentPage: number;
  format: 'physical' | 'digital';
  status: 'reading' | 'completed' | 'backlog';
  startDate?: string;
  endDate?: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  bookTitle: string;
  pagesRead: number;
  startPage: number;
  endPage: number;
  durationMinutes: number;
  date: string;
  notes?: string;
  format: 'physical' | 'digital';
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  bookTitle: string;
  bookAuthor: string;
  type: 'session' | 'completed' | 'started';
  pages?: number;
  duration?: number;
  format: 'physical' | 'digital';
  timestamp: string;
  kudos: string[]; // List of names/userIDs who applauded
  comments: {
    id: string;
    userName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface ReadingGoal {
  dailyPages: number;
  yearlyBooks: number;
}

export interface ArchitectureChoice {
  id: 'web' | 'native' | 'hybrid';
  title: string;
  subtitle: string;
  cost: 'Low' | 'Medium' | 'High';
  timeToMarket: 'Fast' | 'Medium' | 'Slow';
  performance: 'Good' | 'Native' | 'Excellent';
  offlineSupport: string;
  keyChallenges: string[];
  recommendedTech: string[];
  verdict: string;
}

export interface SystemChallenge {
  id: string;
  title: string;
  icon: string;
  difficulty: 'Medium' | 'Hard' | 'Extreme';
  description: string;
  systemImpact: string;
  solutions: {
    name: string;
    description: string;
    isSelected: boolean;
  }[];
}
