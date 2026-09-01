export type DesignThinkingPhase = 'Empathize' | 'Define' | 'Ideate' | 'Prototype' | 'Test' | 'Completed';

export type ProkerStatus = 'Belum Dimulai' | 'Dalam Perencanaan' | 'Sedang Berjalan' | 'Tahap Review' | 'Selesai' | 'Terkendala';

export type PriorityLevel = 'Rendah' | 'Sedang' | 'Tinggi' | 'Mendesak' | 'High' | 'Medium' | 'Low';
export type ProkerPriority = PriorityLevel;

export type IssueCategory = 'Koordinasi' | 'SDM' | 'Waktu' | 'Budget' | 'Sarana' | 'Approval' | 'Lainnya';

export type ActiveTab = 'overview' | 'teams' | 'programs' | 'timeline' | 'attention' | 'reflection';

export type UserRole = 'kepsek' | 'admin';

export interface ProkerIssue {
  hasIssue: boolean;
  category?: IssueCategory;
  description?: string;
  createdAt?: string;
  isResolved?: boolean;
  resolvedAt?: string;
  principalComment?: string;
  principalCommentedAt?: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  isCompleted: boolean;
  targetDate?: string;
  completedAt?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: string; // 'gdrive' | 'canva' | 'doc' | 'image' | 'link'
  url: string;
  uploadedAt?: string;
}

export interface ProkerReflection {
  whatWentWell: string;
  whatNeedsImprovement: string;
  challenges?: string;
  recommendationNextYear: string;
  recommendationsForNextYear?: string;
  rating?: number; // 1-5
  submittedBy?: string;
  submittedAt?: string;
  evidenceUrl?: string;
  evidenceTitle?: string;
  principalFeedback?: string;
  principalReviewedAt?: string;
  isReviewed?: boolean;
}

export interface TaskSubItem {
  id: string;
  title: string;
  programId?: string;
  programTitle?: string;
  teamId?: string;
  assignedTo: string; // Member name
  assignedBy: string; // PIC name
  dueDate?: string; // e.g. "7 September"
  status: 'To Do' | 'In Progress' | 'Done';
  evidenceUrl?: string;
  evidenceTitle?: string;
  completedAt?: string;
  notes?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string; // e.g. "1 Sep · 09.15" or ISO string
  author?: string;
  actorName?: string;
  actionText: string;
  type?: 'progress' | 'milestone' | 'issue_reported' | 'issue_resolved' | 'evidence' | 'task_completed' | 'completed' | 'feedback';
}

export type ReflectionData = ProkerReflection;

export interface ProgramKerja {
  id: string;
  teamId: string;
  title: string;
  description?: string;
  pic: string;
  coPics?: string[];
  status: ProkerStatus;
  designPhase: DesignThinkingPhase;
  priority: PriorityLevel;
  targetMonth?: string;
  startDate?: string;
  targetDate?: string; // e.g. "2026-10-30"
  deliverables?: string[];
  milestones: MilestoneItem[];
  subTasks?: TaskSubItem[];
  issue?: ProkerIssue;
  evidenceLinks?: EvidenceItem[];
  evidences?: EvidenceItem[];
  nextAction?: string;
  nextActionDueDate?: string; // e.g. "8 September"
  reflection?: ProkerReflection;
  notes?: string;
  lastUpdateText?: string;
  lastUpdatedAt?: string;
  lastUpdatedAtISO?: string;
  updatedAt?: string;
  daysSinceLastUpdate?: number;
  activityLogs?: ActivityLogItem[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  specialty?: string;
  assignedProkerIds?: string[];
}

export interface TeamReflection {
  id: string;
  teamId: string;
  prokerId?: string;
  prokerTitle?: string;
  author: string;
  date: string;
  period: string;
  whatWentWell: string;
  challenges: string;
  improvements: string;
  rating: number;
  stakeholderFeedback?: string;
  aiAnalysis?: string;
  createdAt: string;
}

export interface TeamCategory {
  id: string;
  name: string;
  shortName: string;
  type: 'core_team' | 'yearly_event' | 'paralel' | 'special_task';
  description: string;
  iconName: string;
  accentColor: string;
  members: TeamMember[];
  prokers: ProgramKerja[];
  reflections: TeamReflection[];
  designThinkingGoal?: string;
  driveFolderUrl?: string;
  driveFolderName?: string;
  lastUpdateText?: string;
  lastUpdatedAt?: string;
}

export interface DashboardStats {
  totalTeams: number;
  totalMembers: number;
  totalProker: number;
  completedProker: number;
  inProgressProker: number;
  notStartedProker: number;
  needsAttentionProker: number;
  noUpdate7DaysProker: number;
  approachingDeadlineProker: number;
  overallCompletionRate: number;
  totalReflections: number;
  averageSatisfaction: number;
}

export interface RecentActivity {
  id: string;
  dateStr: string;
  timeStr?: string;
  prokerId: string;
  prokerTitle: string;
  teamId: string;
  teamName: string;
  pic: string;
  actionText: string;
}

