import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, AlertCircle, Loader, Clock } from 'lucide-react';
import type { Task, TaskStep } from '../types';

const SidePanel: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();

    // 监听任务更新
    const listener = (message: any) => {
      if (message.type === 'UPDATE_TASK') {
        setTasks(prev => {
          const index = prev.findIndex(t => t.id === message.payload.id);
          if (index >= 0) {
            const newTasks = [...prev];
            newTasks[index] = message.payload;
            return newTasks;
          }
          return [...prev, message.payload];
        });
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const loadTasks = async () => {
    const response = await chrome.runtime.sendMessage({ type: 'GET_TASKS' });
    if (response.success) {
      setTasks(response.data);
    }
  };

  return (
    <div className="sidepanel-container">
      <div className="sidepanel-header">
        <h1>任务执行面板</h1>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} />
            <p>暂无任务</p>
            <p className="hint">点击插件图标创建新任务</p>
          </div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const [expanded, setExpanded] = useState(true);

  const statusConfig = {
    pending: { icon: Clock, color: '#94a3b8', label: '等待中' },
    planning: { icon: Loader, color: '#3b82f6', label: '规划中' },
    executing: { icon: Loader, color: '#f59e0b', label: '执行中' },
    completed: { icon: CheckCircle, color: '#10b981', label: '已完成' },
    failed: { icon: AlertCircle, color: '#ef4444', label: '失败' },
  };

  const config = statusConfig[task.status];
  const Icon = config.icon;

  return (
    <div className="task-card">
      <div className="task-header" onClick={() => setExpanded(!expanded)}>
        <div className="task-status">
          <Icon
            size={20}
            color={config.color}
            className={task.status === 'executing' || task.status === 'planning' ? 'spinning' : ''}
          />
          <span style={{ color: config.color }}>{config.label}</span>
        </div>
        <div className="task-title">{task.description}</div>
        <div className="task-time">
          {new Date(task.createdAt).toLocaleTimeString('zh-CN')}
        </div>
      </div>

      {expanded && (
        <div className="task-body">
          {task.steps.length > 0 && (
            <div className="steps-list">
              {task.steps.map(step => (
                <StepItem key={step.id} step={step} />
              ))}
            </div>
          )}

          {task.result && (
            <div className={`task-result ${task.status === 'failed' ? 'error' : 'success'}`}>
              <strong>结果：</strong>
              {task.result}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StepItem: React.FC<{ step: TaskStep }> = ({ step }) => {
  const statusIcons = {
    pending: Circle,
    executing: Loader,
    completed: CheckCircle,
    failed: AlertCircle,
  };

  const Icon = statusIcons[step.status];

  return (
    <div className={`step-item ${step.status}`}>
      <Icon
        size={16}
        className={step.status === 'executing' ? 'spinning' : ''}
      />
      <div className="step-content">
        <div className="step-description">{step.description}</div>
        {step.result && (
          <div className="step-result">{step.result}</div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
