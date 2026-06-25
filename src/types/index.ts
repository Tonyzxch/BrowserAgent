// 任务类型定义
export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'planning' | 'executing' | 'completed' | 'failed';
  steps: TaskStep[];
  result?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TaskStep {
  id: string;
  action: ActionType;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  target?: ElementDescriptor;
  value?: string;
  result?: string;
}

export type ActionType =
  | 'navigate'
  | 'click'
  | 'input'
  | 'scroll'
  | 'extract'
  | 'wait'
  | 'analyze';

export interface ElementDescriptor {
  selector?: string;
  xpath?: string;
  text?: string;
  role?: string;
  position?: { x: number; y: number };
}

// 页面元素信息
export interface PageElement {
  id: string;
  tag: string;
  type?: string;
  text?: string;
  value?: string;
  placeholder?: string;
  href?: string;
  selector: string;
  xpath: string;
  isInteractive: boolean;
  boundingBox?: DOMRect;
  attributes: Record<string, string>;
}

// Agent消息类型
export interface AgentMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// AI响应格式
export interface AgentResponse {
  thought: string;
  steps: TaskStep[];
  needsMoreInfo?: boolean;
  question?: string;
}

// 消息通信类型
export type MessageType =
  | 'CREATE_TASK'
  | 'UPDATE_TASK'
  | 'GET_PAGE_INFO'
  | 'EXECUTE_ACTION'
  | 'GET_TASKS'
  | 'OPEN_SIDEPANEL';

export interface Message {
  type: MessageType;
  payload?: any;
}
