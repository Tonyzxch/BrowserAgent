import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const Popup: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CREATE_TASK',
        payload: input,
      });

      if (response.success) {
        // 打开侧边栏查看任务执行
        try {
          await chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
        } catch (e) {
          // 如果打开失败，至少关闭popup
          console.log('无法自动打开侧边栏，请手动点击侧边栏按钮');
        }
        window.close();
      } else {
        alert('任务创建失败: ' + response.error);
      }
    } catch (error) {
      alert('发生错误: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    '帮我在豆瓣上搜索最新的科幻电影',
    '查找GitHub上stars最多的React项目',
    '在淘宝上筛选500元以内的蓝牙耳机',
  ];

  return (
    <div className="popup-container">
      <div className="header">
        <Sparkles className="icon" size={24} />
        <h1>浏览器智能助手</h1>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="用自然语言描述你想完成的任务..."
          rows={4}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? '处理中...' : '开始执行'}
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="examples">
        <div className="examples-title">示例任务：</div>
        {examples.map((example, index) => (
          <div
            key={index}
            className="example-item"
            onClick={() => setInput(example)}
          >
            {example}
          </div>
        ))}
      </div>

      <div className="footer">
        <button
          className="link-button"
          onClick={() => chrome.runtime.sendMessage({ type: 'OPEN_SIDEPANEL' })}
        >
          查看任务历史
        </button>
      </div>
    </div>
  );
};

export default Popup;
