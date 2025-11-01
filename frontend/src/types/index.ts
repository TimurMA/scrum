export type TaskStatus = 'InBackLog' | 'NewTask' | 'InProgress' | 'OnVerification' | 'Done';

export type ScrumStatus = 'ACTIVE' | 'DONE' | 'DELETED';

export type SprintStatus = 'ACTIVE' | 'DONE';

export interface User {
  id: string
  email: string
  username: string
  password?: string      
  token?: string
}

export interface Scrum {
  id: string
  name: string
  status: ScrumStatus
  creatorId: string
}

export interface ScrumMember {
  scrumId: string
  userEmail: string
  startDate: Date
  finishDate?: Date
}

export interface Sprint {
  id: string
  scrumId: string
  name: string
  goal?: string
  report?: string
  startDate: Date
  finishDate: Date
  status: SprintStatus
}

export interface TaskTag {
  id: string
  scrumId: string
  name: string
  color: string
}

export interface Task {
  id: string
  sprintId?: string
  scrumId: string
  title: string
  description?: string
  status: TaskStatus
  createdAt: Date

  taskTagId?: string
  taskTag?: TaskTag
  
  creatorId: string
  creator?: User
  
  executorId?: string
  executor?: User
}

export interface Board {
  id: string
  sprintId?: string
  title: string
}

export interface Column {
  id: string
  title: string
  color: string
  status: TaskStatus
}