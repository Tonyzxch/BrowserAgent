# Chrome插件调试指南

## 常见错误及解决方案

### 错误1：Could not establish connection. Receiving end does not exist.

**原因**：
- Content Script尚未注入到当前页面
- 在插件加载前就打开的页面没有Content Script

**解决方案**：

#### 方法1：刷新页面（推荐）
```
1. 在当前页面按 F5 或 Ctrl+R 刷新
2. 刷新后Content Script会自动注入
3. 再次尝试创建任务
```

#### 方法2：代码修复（已完成）
在 `src/background/service-worker.ts` 中添加了动态注入逻辑：
```typescript
// 确保Content Script已注入
try {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content/content-script.js']
  });
  await sleep(500);
} catch (e) {
  // 已经注入，忽略错误
}
```

### 错误2：manifest.json 路径问题

**症状**：Side panel file path must exist.

**解决**：已在manifest.json中修正路径为 `src/popup/index.html` 和 `src/sidepanel/index.html`

### 错误3：插件图标不显示

**检查**：
- 确认 `dist/icons/` 目录下有图标文件
- 重新加载插件

## 调试技巧

### 1. 查看Background日志
```
chrome://extensions/ 
→ 找到插件 
→ 点击"服务工作进程" 
→ 查看Console
```

### 2. 查看Content Script日志
```
在目标网页上 
→ 按F12打开DevTools 
→ Console标签 
→ 查看是否有 "Browser Agent Assistant content script loaded"
```

### 3. 查看Popup日志
```
右键点击插件图标 
→ 审查弹出内容 
→ Console标签
```

### 4. 测试Content Script是否注入
在网页Console中运行：
```javascript
chrome.runtime.sendMessage({type: 'GET_PAGE_INFO'}, (response) => {
  console.log('Response:', response);
});
```

## 推荐测试流程

### 第一次测试
1. ✅ 加载插件到Chrome
2. ✅ 打开一个简单的网页（如百度）
3. ✅ **刷新页面**（重要！）
4. ✅ 点击插件图标
5. ✅ 输入任务："在百度搜索人工智能"
6. ✅ 点击"开始执行"
7. ✅ 查看侧边栏进度

### 如果失败
1. 打开 `chrome://extensions/`
2. 点击"重新加载"插件
3. 刷新测试网页
4. 打开DevTools查看错误信息
5. 检查Console是否有Content Script加载日志

## 测试网站推荐

### ✅ 推荐（结构简单）
- https://www.baidu.com - 百度搜索
- https://www.bing.com - Bing搜索
- https://example.com - 简单示例页面

### ⚠️ 中等难度
- https://github.com - GitHub
- https://www.douban.com - 豆瓣

### ❌ 不推荐（初次测试）
- chrome:// 开头的页面（不允许注入）
- 需要登录的页面
- 单页应用（SPA）可能需要等待

## API配置检查

确保AI服务配置正确（`src/config/index.ts`）：
```typescript
export const AI_CONFIG = {
  apiKey: 'sk-8ii5hArDqmElR01FWP0ZGEFrGNaXIdaDHyalDtdl6ohFS3ie',
  baseURL: 'https://xiaoai.plus/v1',
  model: 'claude-opus-4-8',
};
```

## 更新插件

每次修改代码后：
```bash
# 1. 重新构建
npm run build

# 2. 在Chrome中重新加载
chrome://extensions/ → 点击刷新图标

# 3. 刷新测试网页
按F5刷新
```

---

**关键提示**：
- 🔴 **首次使用必须刷新页面**，这样Content Script才会注入
- 🔴 **每次重新加载插件后，要刷新测试网页**
- 🔴 **不要在chrome://扩展页面上测试**，这些页面不允许注入脚本

---

**修复时间**：2026年6月28日  
**状态**：已添加动态注入逻辑
