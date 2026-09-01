import React, { useState, useEffect } from 'react';
import { TeamCategory, ProgramKerja, TeamMember, UserRole, TaskSubItem, ReflectionData } from './types';
import { 
  loadTeamsData, 
  saveTeamsData, 
  clearAllData,
  loadDemoData,
  calculateDashboardStats, 
  exportDataAsJSON,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { SimpleDashboardView } from './components/SimpleDashboardView';
import { EditDriveModal } from './components/EditDriveModal';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { UpdateProgressModal } from './components/UpdateProgressModal';
import { AddProkerModal } from './components/AddProkerModal';
import { AddMemberModal } from './components/AddMemberModal';
import { AssignTaskModal } from './components/AssignTaskModal';
import { MarkCompletedModal } from './components/MarkCompletedModal';
import { AIChatDrawer } from './components/AIChatDrawer';

export function App() {
  const [teams, setTeams] = useState<TeamCategory[]>(() => loadTeamsData());
  const [userRole, setUserRole] = useState<UserRole>('kepsek');

  // Modal states
  const [activeProkerDetail, setActiveProkerDetail] = useState<{ teamId: string; prokerId: string } | null>(null);
  const [updatingProker, setUpdatingProker] = useState<{ teamId: string; prokerId: string } | null>(null);
  const [isAddProkerOpen, setIsAddProkerOpen] = useState<boolean>(false);
  const [addProkerDefaultTeamId, setAddProkerDefaultTeamId] = useState<string | undefined>(undefined);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState<boolean>(false);
  const [addMemberTeamId, setAddMemberTeamId] = useState<string | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [aiContext, setAiContext] = useState<{ teamName?: string; prokerTitle?: string } | undefined>(undefined);

  // Modal states for Assign Task & Mark Completed & Edit Drive
  const [assignTaskTarget, setAssignTaskTarget] = useState<{ teamId: string; prokerId: string } | null>(null);
  const [markCompletedTarget, setMarkCompletedTarget] = useState<{ teamId: string; prokerId: string } | null>(null);
  const [editingDriveTeam, setEditingDriveTeam] = useState<TeamCategory | null>(null);

  // Sync to local storage
  useEffect(() => {
    saveTeamsData(teams);
  }, [teams]);

  // Handlers
  const handleSaveDriveUrl = (teamId: string, driveUrl: string) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        driveFolderUrl: driveUrl,
      };
    }));
  };

  const handleSelectProgram = (teamId: string, prokerId: string) => {
    setActiveProkerDetail({ teamId, prokerId });
  };

  const handleOpenUpdateProgress = (teamId: string, prokerId: string) => {
    setActiveProkerDetail(null);
    setUpdatingProker({ teamId, prokerId });
  };

  const handleOpenAssignTask = (teamId: string, prokerId: string) => {
    setAssignTaskTarget({ teamId, prokerId });
  };

  const handleOpenMarkCompleted = (teamId: string, prokerId: string) => {
    setMarkCompletedTarget({ teamId, prokerId });
  };

  const handleToggleMilestone = (teamId: string, prokerId: string, milestoneId: string) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      const updatedProkers = t.prokers.map(p => {
        if (p.id !== prokerId) return p;
        const updatedMilestones = (p.milestones || []).map(m => {
          if (m.id === milestoneId) {
            const nextDone = !m.isCompleted;
            return {
              ...m,
              isCompleted: nextDone,
              completedAt: nextDone ? 'Hari ini' : undefined,
            };
          }
          return m;
        });

        const allDone = updatedMilestones.length > 0 && updatedMilestones.every(m => m.isCompleted);
        const newStatus = allDone ? 'Selesai' : (p.status === 'Belum Dimulai' ? 'Sedang Berjalan' : p.status);

        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: 'Hari ini',
          actorName: p.pic,
          actionText: `Mengubah checklist milestone`,
        };

        return {
          ...p,
          milestones: updatedMilestones,
          status: newStatus,
          lastUpdatedAt: 'Hari ini',
          lastUpdateText: `Milestone diperbarui`,
          activityLogs: [newLog, ...(p.activityLogs || [])],
        };
      });

      return {
        ...t,
        prokers: updatedProkers,
        lastUpdatedAt: 'Hari ini',
      };
    }));
  };

  const handleToggleSubTask = (teamId: string, prokerId: string, taskId: string) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        prokers: t.prokers.map(p => {
          if (p.id !== prokerId) return p;
          const updatedSubTasks = (p.subTasks || []).map(st => {
            if (st.id === taskId) {
              const nextStatus = st.status === 'Done' ? 'To Do' : 'Done';
              return {
                ...st,
                status: nextStatus as 'To Do' | 'In Progress' | 'Done',
              };
            }
            return st;
          });

          return {
            ...p,
            subTasks: updatedSubTasks,
            lastUpdatedAt: 'Hari ini',
          };
        }),
      };
    }));
  };

  const handleAddProker = (teamId: string, newProker: ProgramKerja) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        prokers: [newProker, ...t.prokers],
        lastUpdatedAt: 'Hari ini',
      };
    }));
  };

  const handleUpdateProker = (teamId: string, updatedProker: ProgramKerja) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        prokers: t.prokers.map(p => p.id === updatedProker.id ? updatedProker : p),
        lastUpdatedAt: 'Hari ini',
      };
    }));
    setUpdatingProker(null);
  };

  const handleAssignTask = (teamId: string, prokerId: string, task: TaskSubItem) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        prokers: t.prokers.map(p => {
          if (p.id !== prokerId) return p;
          return {
            ...p,
            subTasks: [...(p.subTasks || []), task],
            lastUpdatedAt: 'Hari ini',
            lastUpdateText: `Tugas "${task.title}" ditugaskan ke ${task.assignedTo}`,
          };
        }),
      };
    }));
    setAssignTaskTarget(null);
  };

  const handleMarkCompletedWithReflection = (teamId: string, prokerId: string, reflection: ReflectionData) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        prokers: t.prokers.map(p => {
          if (p.id !== prokerId) return p;
          const markAllMilestones = (p.milestones || []).map(m => ({ ...m, isCompleted: true }));
          return {
            ...p,
            status: 'Selesai',
            progressPercentage: 100,
            milestones: markAllMilestones,
            reflection,
            lastUpdatedAt: 'Hari ini',
            lastUpdateText: 'Program selesai & refleksi disimpan',
          };
        }),
      };
    }));
    setMarkCompletedTarget(null);
  };

  const handleResolveIssue = (teamId: string, prokerId: string) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        prokers: t.prokers.map(p => {
          if (p.id !== prokerId) return p;
          const updatedLogs = [
            {
              id: `log-${Date.now()}`,
              timestamp: 'Hari ini',
              actorName: 'Admin / PIC',
              actionText: 'Kendala diselesaikan (Marked as Resolved)',
            },
            ...(p.activityLogs || []),
          ];

          return {
            ...p,
            issue: {
              hasIssue: false,
            },
            status: 'Sedang Berjalan',
            lastUpdatedAt: 'Hari ini',
            lastUpdateText: 'Kendala telah diselesaikan',
            activityLogs: updatedLogs,
          };
        }),
      };
    }));
  };

  const handleAddPrincipalComment = (teamId: string, prokerId: string, comment: string) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        prokers: t.prokers.map(p => {
          if (p.id !== prokerId) return p;
          const newPrincipalNote = {
            id: `pn-${Date.now()}`,
            date: 'Hari ini',
            authorName: 'Kepala Sekolah',
            message: comment,
          };
          return {
            ...p,
            principalNotes: [newPrincipalNote, ...(p.principalNotes || [])],
            lastUpdatedAt: 'Hari ini',
          };
        }),
      };
    }));
  };

  const handleAddReflectionFeedback = (teamId: string, prokerId: string, feedback: string) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        prokers: t.prokers.map(p => {
          if (p.id !== prokerId || !p.reflection) return p;
          return {
            ...p,
            reflection: {
              ...p.reflection,
              principalFeedback: feedback,
              principalFeedbackDate: 'Hari ini',
            },
          };
        }),
      };
    }));
  };

  const handleAddMember = (teamId: string, member: TeamMember) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        members: [...t.members, member],
      };
    }));
  };

  const handleClearData = () => {
    if (window.confirm('Kosongkan semua program kerja dan data monitoring?')) {
      const fresh = clearAllData();
      setTeams(fresh);
    }
  };

  const handleLoadDemoData = () => {
    if (window.confirm('Muat data contoh / simulasi program kerja?')) {
      const demo = loadDemoData();
      setTeams(demo);
    }
  };

  const handleExportData = () => {
    exportDataAsJSON(teams);
  };

  const handleOpenAI = (context?: { teamName?: string; prokerTitle?: string }) => {
    setAiContext(context);
    setIsAIChatOpen(true);
  };

  // Find active proker for modal
  const selectedTeamForModal = activeProkerDetail ? teams.find(t => t.id === activeProkerDetail.teamId) || null : null;
  const selectedProkerForModal = selectedTeamForModal && activeProkerDetail ? selectedTeamForModal.prokers.find(p => p.id === activeProkerDetail.prokerId) || null : null;

  // Find updating proker for modal
  const updatingTeamForModal = updatingProker ? teams.find(t => t.id === updatingProker.teamId) || null : null;
  const updatingProkerObj = updatingTeamForModal && updatingProker ? updatingTeamForModal.prokers.find(p => p.id === updatingProker.prokerId) || null : null;

  // Find target for AssignTaskModal
  const assignTaskTeam = assignTaskTarget ? teams.find(t => t.id === assignTaskTarget.teamId) || null : null;
  const assignTaskProker = assignTaskTeam && assignTaskTarget ? assignTaskTeam.prokers.find(p => p.id === assignTaskTarget.prokerId) || null : null;

  // Find target for MarkCompletedModal
  const markCompletedTeam = markCompletedTarget ? teams.find(t => t.id === markCompletedTarget.teamId) || null : null;
  const markCompletedProker = markCompletedTeam && markCompletedTarget ? markCompletedTeam.prokers.find(p => p.id === markCompletedTarget.prokerId) || null : null;

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        userRole={userRole}
        onRoleToggle={setUserRole}
        onOpenAddProker={() => {
          setAddProkerDefaultTeamId(undefined);
          setIsAddProkerOpen(true);
        }}
        onOpenAIChat={() => handleOpenAI()}
        onClearData={handleClearData}
        onLoadDemoData={handleLoadDemoData}
        onExportData={handleExportData}
      />

      {/* Main Container Content: Streamlined Unified Simple Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <SimpleDashboardView
          teams={teams}
          userRole={userRole}
          onSelectProgram={handleSelectProgram}
          onOpenUpdateProgress={handleOpenUpdateProgress}
          onOpenAddProker={(tId) => {
            setAddProkerDefaultTeamId(tId);
            setIsAddProkerOpen(true);
          }}
          onOpenEditDrive={(team) => setEditingDriveTeam(team)}
          onOpenMarkCompleted={handleOpenMarkCompleted}
          onToggleMilestone={handleToggleMilestone}
          onResolveIssue={handleResolveIssue}
          onOpenAIChat={handleOpenAI}
        />
      </main>

      {/* Modals & Drawers */}
      <EditDriveModal
        isOpen={Boolean(editingDriveTeam)}
        onClose={() => setEditingDriveTeam(null)}
        team={editingDriveTeam}
        onSave={handleSaveDriveUrl}
      />

      <ProgramDetailModal
        isOpen={Boolean(activeProkerDetail && selectedTeamForModal && selectedProkerForModal)}
        onClose={() => setActiveProkerDetail(null)}
        team={selectedTeamForModal}
        proker={selectedProkerForModal}
        onToggleMilestone={handleToggleMilestone}
        onToggleSubTask={handleToggleSubTask}
        onOpenUpdateProgress={handleOpenUpdateProgress}
        onOpenAssignTask={handleOpenAssignTask}
        onOpenMarkCompleted={handleOpenMarkCompleted}
        onResolveIssue={handleResolveIssue}
        onAddPrincipalComment={handleAddPrincipalComment}
        onOpenAI={handleOpenAI}
      />

      <UpdateProgressModal
        isOpen={Boolean(updatingProker && updatingTeamForModal && updatingProkerObj)}
        onClose={() => setUpdatingProker(null)}
        team={updatingTeamForModal}
        proker={updatingProkerObj}
        onSave={handleUpdateProker}
      />

      <AssignTaskModal
        isOpen={Boolean(assignTaskTarget && assignTaskTeam && assignTaskProker)}
        onClose={() => setAssignTaskTarget(null)}
        team={assignTaskTeam}
        proker={assignTaskProker}
        onAssignTask={handleAssignTask}
      />

      <MarkCompletedModal
        isOpen={Boolean(markCompletedTarget && markCompletedTeam && markCompletedProker)}
        onClose={() => setMarkCompletedTarget(null)}
        team={markCompletedTeam}
        proker={markCompletedProker}
        onComplete={handleMarkCompletedWithReflection}
      />

      <AddProkerModal
        isOpen={isAddProkerOpen}
        onClose={() => setIsAddProkerOpen(false)}
        teams={teams}
        defaultTeamId={addProkerDefaultTeamId}
        onAdd={handleAddProker}
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        team={teams.find(t => t.id === addMemberTeamId) || null}
        onAddMember={handleAddMember}
      />

      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        teams={teams}
        initialContext={aiContext}
      />
    </div>
  );
}

export default App;
