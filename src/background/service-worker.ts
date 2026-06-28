import { aiService } from '../utils/ai-service';
import type { Task, Message } from '../types';

// 任务存储
const tasks = new Map<string, Task>();

// 监听插件图标点击 - 不自动打开侧边栏，因为有popup
// chrome.action.onClicked.addListener((tab) => {
//   if (tab.id) {
//     chrome.sidePanel.open({ tabId: tab.id });
//   }
// });

// 消息处理
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse);
  return true;
});

async function handleMessage(message: Message): Promise<any> {
  try {
    switch (message.type) {
      case 'CREATE_TASK':
        return await createTask(message.payload);

      case 'GET_TASKS':
        return { success: true, data: Array.from(tasks.values()) };

      case 'OPEN_SIDEPANEL':
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.id) {
          await chrome.sidePanel.open({ tabId: tab.id });
        }
        return { success: true };

      default:
        return { success: false, error: '未知消息类型' };
    }
  } catch (error) {
    console.error('消息处理错误:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 创建并执行任务
async function createTask(description: string): Promise<any> {
  const taskId = `task-${Date.now()}`;
  const task: Task = {
    id: taskId,
    description,
    status: 'planning',
    steps: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  tasks.set(taskId, task);

  try {
    // 获取当前标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) throw new Error('无法获取当前标签页');

    // 确保Content Script已注入
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content/content-script.js']
      });
      // 等待一下让脚本初始化
      await sleep(500);
    } catch (e) {
      // Content Script可能已经注入，忽略错误
      console.log('Content script already injected or injection failed:', e);
    }

    // 获取页面信息
    const pageInfoResponse = await chrome.tabs.sendMessage(tab.id, {
      type: 'GET_PAGE_INFO',
    });

    if (!pageInfoResponse.success) {
      throw new Error(pageInfoResponse.error);
    }

    // 使用AI规划任务
    task.status = 'planning';
    updateTask(task);

    const plan = await aiService.planTask(description, pageInfoResponse.data);

    // 检查是否需要更多信息
    if (plan.needsMoreInfo && plan.question) {
      task.status = 'pending';
      task.result = `需要更多信息：${plan.question}`;
      updateTask(task);
      return { success: true, task, needsInfo: true, question: plan.question };
    }

    // 生成任务步骤
    task.steps = plan.steps.map((step, index) => ({
      ...step,
      id: `step-${index}`,
      status: 'pending' as const,
    }));

    task.status = 'executing';
    updateTask(task);

    // 执行任务步骤
    await executeTask(task, tab.id);

    return { success: true, task };

  } catch (error) {
    task.status = 'failed';
    task.result = (error as Error).message;
    updateTask(task);
    return { success: false, error: (error as Error).message };
  }
}

// 执行任务
async function executeTask(task: Task, tabId: number) {
  for (const step of task.steps) {
    try {
      step.status = 'executing';
      updateTask(task);

      if (step.action === 'navigate') {
        await chrome.tabs.update(tabId, { url: step.value });
        await sleep(2000); // 等待页面加载
        step.result = `导航到: ${step.value}`;
      } else if (step.action === 'wait') {
        const waitTime = parseInt(step.value || '1000');
        await sleep(waitTime);
        step.result = `等待 ${waitTime}ms`;
      } else if (step.action === 'analyze') {
        const response = await chrome.tabs.sendMessage(tabId, {
          type: 'GET_PAGE_INFO',
        });
        step.result = response.success ? '页面分析完成' : '页面分析失败';
      } else {
        // 其他动作通过content script执行
        const response = await chrome.tabs.sendMessage(tabId, {
          type: 'EXECUTE_ACTION',
          payload: {
            action: step.action,
            target: step.target,
            value: step.value,
          },
        });

        if (!response.success) {
          throw new Error(response.error);
        }

        step.result = response.data;
      }

      step.status = 'completed';
      updateTask(task);

      // 步骤间延迟
      await sleep(500);

    } catch (error) {
      step.status = 'failed';
      step.result = (error as Error).message;
      task.status = 'failed';
      updateTask(task);
      throw error;
    }
  }

  task.status = 'completed';
  task.result = '任务执行成功';
  updateTask(task);
}

function updateTask(task: Task) {
  task.updatedAt = Date.now();
  tasks.set(task.id, { ...task });

  // 通知所有打开的面板
  chrome.runtime.sendMessage({
    type: 'UPDATE_TASK',
    payload: task,
  }).catch(() => {
    // 忽略没有接收者的错误
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('Browser Agent Assistant background service worker loaded');
