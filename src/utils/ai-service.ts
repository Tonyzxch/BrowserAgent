import { AI_CONFIG, SYSTEM_PROMPT } from '../config';
import type { AgentMessage, AgentResponse } from '../types';

export class AIService {
  private async callAPI(messages: AgentMessage[]): Promise<string> {
    const response = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages,
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI API调用失败: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async planTask(
    taskDescription: string,
    pageInfo: string
  ): Promise<AgentResponse> {
    const messages: AgentMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `任务描述：${taskDescription}

当前页面信息：
${pageInfo}

请分析任务并生成执行计划。`,
      },
    ];

    const response = await this.callAPI(messages);

    try {
      // 尝试从Markdown代码块中提取JSON
      const jsonMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : response;
      return JSON.parse(jsonStr.trim());
    } catch (error) {
      console.error('解析AI响应失败:', response);
      throw new Error('AI响应格式错误');
    }
  }

  async analyzeNextStep(
    taskDescription: string,
    completedSteps: string[],
    currentPageInfo: string
  ): Promise<AgentResponse> {
    const messages: AgentMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `任务：${taskDescription}

已完成的步骤：
${completedSteps.join('\n')}

当前页面信息：
${currentPageInfo}

请分析下一步应该做什么。`,
      },
    ];

    const response = await this.callAPI(messages);

    try {
      const jsonMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : response;
      return JSON.parse(jsonStr.trim());
    } catch (error) {
      console.error('解析AI响应失败:', response);
      throw new Error('AI响应格式错误');
    }
  }
}

export const aiService = new AIService();
