export type Priority = "Critical" | "High" | "Medium" | "Low";

export type TaskCategory = 
  | "Technical" 
  | "Strategy" 
  | "Operations" 
  | "Design" 
  | "Communication" 
  | "Personal";

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  priority: Priority;
  risk: number; // 0 - 100
  estimatedMinutes: number;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: number;
}

export interface RescueActionStep {
  id: string;
  stepNumber: number;
  title: string;
  rationale: string;
  estimatedMinutes: number;
  priorityLevel: Priority;
  completed?: boolean;
}

export interface EisenhowerMatrix {
  doFirst: string[];
  schedule: string[];
  delegate: string[];
  drop: string[];
}

export interface RescuePlan {
  productivityScore: number;
  chaosLevel: "Catastrophic" | "High Alert" | "Elevated" | "Manageable" | "Optimal";
  analysisSummary: string;
  tacticalMantra: string;
  rescueActions: RescueActionStep[];
  quickWins: string[];
  eisenhowerMatrix?: EisenhowerMatrix;
}

export interface SystemStats {
  totalTasks: number;
  completedTasks: number;
  criticalTasks: number;
  avgRisk: number;
  chaosIndex: number;
  totalEstimatedMinutes: number;
}
