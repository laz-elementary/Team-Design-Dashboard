import { TeamCategory, DashboardStats, ProgramKerja, RecentActivity, ActivityLogItem, TaskSubItem } from '../types';
import { INITIAL_TEAMS, CLEAN_EMPTY_TEAMS, DEMO_TEAMS } from '../data/initialData';

const STORAGE_KEY = 'lazuardi_team_design_monitoring_clean_v1';

export function loadTeamsData(): TeamCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Default to 100% clean empty teams
      saveTeamsData(CLEAN_EMPTY_TEAMS);
      return CLEAN_EMPTY_TEAMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load teams data from localStorage:', e);
  }
  return CLEAN_EMPTY_TEAMS;
}

export function saveTeamsData(teams: TeamCategory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  } catch (e) {
    console.error('Failed to save teams data to localStorage:', e);
  }
}

export function clearAllData(): TeamCategory[] {
  // Clear all prokers, reflections, and logs from all teams while retaining team structure
  const emptyTeams: TeamCategory[] = CLEAN_EMPTY_TEAMS.map(team => ({
    ...team,
    prokers: [],
    reflections: [],
    lastUpdatedAt: undefined,
    lastUpdateText: undefined,
  }));
  saveTeamsData(emptyTeams);
  return emptyTeams;
}

export function loadDemoData(): TeamCategory[] {
  const seeded = seedInitialTeamsWithLogsAndSubtasks(DEMO_TEAMS);
  saveTeamsData(seeded);
  return seeded;
}

export function resetToDefaultData(): TeamCategory[] {
  return clearAllData();
}

export function getProkerProgress(proker: ProgramKerja): number {
  if (proker.status === 'Selesai') return 100;
  
  const milestones = proker.milestones || [];
  const subTasks = proker.subTasks || [];

  if (milestones.length === 0 && subTasks.length === 0) {
    if (proker.status === 'Belum Dimulai') return 0;
    if (proker.status === 'Dalam Perencanaan') return 25;
    if (proker.status === 'Sedang Berjalan') return 50;
    if (proker.status === 'Tahap Review') return 85;
    if (proker.status === 'Terkendala') return 35;
    return 0;
  }

  // Weight milestones 70% and subtasks 30% if both exist, or 100% of either
  if (milestones.length > 0 && subTasks.length > 0) {
    const mCompleted = milestones.filter(m => m.isCompleted).length;
    const mRate = mCompleted / milestones.length;
    const sCompleted = subTasks.filter(s => s.status === 'Done').length;
    const sRate = sCompleted / subTasks.length;
    return Math.round((mRate * 0.7 + sRate * 0.3) * 100);
  } else if (milestones.length > 0) {
    const mCompleted = milestones.filter(m => m.isCompleted).length;
    return Math.round((mCompleted / milestones.length) * 100);
  } else {
    const sCompleted = subTasks.filter(s => s.status === 'Done').length;
    return Math.round((sCompleted / subTasks.length) * 100);
  }
}

export function getTeamProgress(team: TeamCategory): number {
  if (team.prokers.length === 0) return 0;
  const total = team.prokers.reduce((acc, p) => acc + getProkerProgress(p), 0);
  return Math.round(total / team.prokers.length);
}

export function isProkerNeedsAttention(proker: ProgramKerja): boolean {
  if (proker.status === 'Terkendala') return true;
  if (proker.issue && proker.issue.hasIssue && !proker.issue.isResolved) return true;
  return false;
}

export function isNoUpdate7Days(proker: ProgramKerja): boolean {
  if (proker.status === 'Selesai') return false;
  if (typeof proker.daysSinceLastUpdate === 'number') {
    return proker.daysSinceLastUpdate >= 7;
  }
  const text = (proker.lastUpdatedAt || '').toLowerCase();
  if (text.includes('7 hari') || text.includes('10 hari') || text.includes('14 hari') || text.includes('2 minggu')) {
    return true;
  }
  return false;
}

export function isApproachingDeadline(proker: ProgramKerja): boolean {
  if (proker.status === 'Selesai') return false;
  const nextDueDate = proker.nextActionDueDate || '';
  if (nextDueDate.includes('8 September') || nextDueDate.includes('5 September') || nextDueDate.includes('3 hari')) {
    return true;
  }
  return false;
}

export function getFormattedCurrentTime(): string {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day} ${month} · ${hours}.${minutes}`;
}

export function calculateDashboardStats(teams: TeamCategory[]): DashboardStats {
  let totalMembers = 0;
  let totalProker = 0;
  let completedProker = 0;
  let inProgressProker = 0;
  let notStartedProker = 0;
  let needsAttentionProker = 0;
  let noUpdate7DaysProker = 0;
  let approachingDeadlineProker = 0;
  let totalReflections = 0;
  let totalRatingSum = 0;
  let totalMilestonesSum = 0;
  let completedMilestonesSum = 0;

  const uniqueMemberNames = new Set<string>();

  teams.forEach(team => {
    team.members.forEach(m => uniqueMemberNames.add(m.name.trim().toLowerCase()));
    
    totalProker += team.prokers.length;
    team.prokers.forEach(p => {
      if (p.milestones && p.milestones.length > 0) {
        totalMilestonesSum += p.milestones.length;
        completedMilestonesSum += p.milestones.filter(m => m.isCompleted).length;
      } else {
        totalMilestonesSum += 1;
        if (p.status === 'Selesai') completedMilestonesSum += 1;
      }

      if (isProkerNeedsAttention(p)) {
        needsAttentionProker++;
      } else if (p.status === 'Selesai') {
        completedProker++;
      } else if (p.status === 'Sedang Berjalan' || p.status === 'Tahap Review') {
        inProgressProker++;
      } else {
        notStartedProker++;
      }

      if (isNoUpdate7Days(p)) {
        noUpdate7DaysProker++;
      }

      if (isApproachingDeadline(p)) {
        approachingDeadlineProker++;
      }

      if (p.reflection) {
        totalReflections++;
        if (p.reflection.rating) totalRatingSum += p.reflection.rating;
      }
    });

    totalReflections += (team.reflections || []).length;
    (team.reflections || []).forEach(r => {
      totalRatingSum += r.rating;
    });
  });

  totalMembers = uniqueMemberNames.size;
  const averageSatisfaction = totalReflections > 0 ? Number((totalRatingSum / totalReflections).toFixed(1)) : 5.0;
  const overallCompletionRate = totalMilestonesSum > 0 
    ? Math.round((completedMilestonesSum / totalMilestonesSum) * 100) 
    : (totalProker > 0 ? Math.round((completedProker / totalProker) * 100) : 0);

  return {
    totalTeams: teams.length,
    totalMembers,
    totalProker,
    completedProker,
    inProgressProker,
    notStartedProker,
    needsAttentionProker,
    noUpdate7DaysProker,
    approachingDeadlineProker,
    overallCompletionRate,
    totalReflections,
    averageSatisfaction,
  };
}

export function getRecentActivities(teams: TeamCategory[]): RecentActivity[] {
  const activities: RecentActivity[] = [];

  teams.forEach(t => {
    t.prokers.forEach(p => {
      if (p.activityLogs && p.activityLogs.length > 0) {
        p.activityLogs.slice(0, 3).forEach(log => {
          activities.push({
            id: log.id,
            dateStr: log.timestamp,
            timeStr: '',
            prokerId: p.id,
            prokerTitle: p.title,
            teamId: t.id,
            teamName: t.shortName,
            pic: log.author || p.pic,
            actionText: log.actionText,
          });
        });
      } else if (p.lastUpdateText) {
        activities.push({
          id: `act-${p.id}`,
          dateStr: p.lastUpdatedAt || 'Hari ini',
          timeStr: '',
          prokerId: p.id,
          prokerTitle: p.title,
          teamId: t.id,
          teamName: t.shortName,
          pic: p.pic,
          actionText: p.lastUpdateText,
        });
      }
    });
  });

  return activities;
}

export function exportDataAsJSON(teams: TeamCategory[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(teams, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `team_design_monitoring_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function seedInitialTeamsWithLogsAndSubtasks(rawTeams: TeamCategory[]): TeamCategory[] {
  return rawTeams.map(t => {
    return {
      ...t,
      prokers: t.prokers.map(p => {
        let logs: ActivityLogItem[] = p.activityLogs || [];
        let subTasks: TaskSubItem[] = p.subTasks || [];

        return {
          ...p,
          daysSinceLastUpdate: 1,
          activityLogs: logs,
          subTasks,
        };
      })
    };
  });
}
