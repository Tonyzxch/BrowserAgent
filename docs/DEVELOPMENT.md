# 开发指南

## 环境准备

### 必需工具

- Node.js >= 18
- npm >= 9
- Chrome浏览器
- Docker (可选，用于部署)

### 开发环境设置

```bash
# 克隆项目
git clone <repo-url>
cd browser-agent-assistant

# 安装依赖
npm install

# 启动开发模式
npm run dev
```

## 项目架构

### 核心模块

#### 1. Content Script (`src/content/content-script.ts`)

负责页面内容的感知和操作：

- **页面信息提取**: 提取DOM结构、可交互元素
- **动作执行**: 点击、输入、滚动等操作
- **元素定位**: CSS Selector和XPath生成

关键函数：
- `findInteractiveElements()`: 查找可交互元素
- `executeAction()`: 执行操作
- `generateSelector()`: 生成CSS选择器

#### 2. Background Service Worker (`src/background/service-worker.ts`)

插件的核心逻辑层：

- **任务管理**: 创建、存储、更新任务
- **AI通信**: 调用AI服务进行规划
- **任务执行**: 协调各步骤执行
- **消息路由**: 处理popup和content script的消息

关键函数：
- `createTask()`: 创建新任务
- `executeTask()`: 执行任务步骤
- `handleMessage()`: 消息路由

#### 3. AI Service (`src/utils/ai-service.ts`)

与AI API通信：

- **API调用**: 封装OpenAI兼容的API调用
- **提示工程**: 构造System Prompt和用户消息
- **响应解析**: 解析JSON格式的AI响应

#### 4. UI组件

**Popup** (`src/popup/`):
- 任务输入界面
- 快速启动入口
- 示例任务展示

**SidePanel** (`src/sidepanel/`):
- 任务列表展示
- 执行过程可视化
- 实时状态更新

## 开发流程

### 1. 添加新的动作类型

在 `src/types/index.ts` 中添加类型：

```typescript
export type ActionType =
  | 'navigate'
  | 'click'
  | 'your-new-action';
```

在 `src/content/content-script.ts` 实现：

```typescript
case 'your-new-action':
  // 实现逻辑
  return 'result';
```

更新System Prompt以告知AI新动作。

### 2. 修改AI提示词

编辑 `src/config/index.ts` 中的 `SYSTEM_PROMPT`：

```typescript
export const SYSTEM_PROMPT = `
你是一个浏览器操作助手...
// 添加你的指令
`;
```

### 3. 调试技巧

**查看Background日志**:
```javascript
// 在 service-worker.ts 中
console.log('Debug info:', data);
```

访问 `chrome://extensions/` → 检查视图 → 服务工作进程

**查看Content Script日志**:
```javascript
// 在 content-script.ts 中
console.log('Page info:', pageInfo);
```

在目标网页打开DevTools控制台

**调试Popup**:
- 右键插件图标 → 审查弹出内容

### 4. 构建和测试

```bash
# 开发模式（热重载）
npm run dev

# 生产构建
npm run build

# 打包插件
npm run pack

# 加载到Chrome测试
# 1. 访问 chrome://extensions/
# 2. 开启开发者模式
# 3. 加载 dist 目录
```

## API配置

### 切换AI服务

编辑 `src/config/index.ts`:

```typescript
export const AI_CONFIG = {
  apiKey: 'your-key',
  baseURL: 'https://api.openai.com/v1', // 或其他兼容API
  model: 'gpt-4', // 或其他模型
};
```

### 支持的模型

理论上支持所有OpenAI兼容的模型：
- Claude (通过第三方转换)
- GPT-4 / GPT-3.5
- 本地部署的开源模型

## 性能优化

### 减少页面信息量

在 `extractPageInfo()` 中限制元素数量：

```typescript
elements: interactiveElements.slice(0, 30) // 降低到30个
```

### 调整AI参数

```typescript
export const AI_CONFIG = {
  temperature: 0.5, // 降低随机性
  maxTokens: 2048,  // 减少token消耗
};
```

## 测试

### 手动测试清单

- [ ] Popup界面正常显示
- [ ] 任务创建成功
- [ ] 页面信息正确提取
- [ ] AI返回合法JSON
- [ ] 动作正确执行
- [ ] 侧边栏实时更新
- [ ] 错误处理正常

### 常见问题排查

**问题**: Content script未注入
- 检查manifest.json的content_scripts配置
- 刷新目标页面
- 检查控制台是否有加载日志

**问题**: AI返回格式错误
- 检查API响应
- 验证System Prompt
- 添加更多错误处理

**问题**: 元素定位失败
- 检查selector生成逻辑
- 尝试使用xpath
- 添加延迟等待

## 发布

### 打包步骤

```bash
# 1. 构建
npm run build

# 2. 打包
npm run pack

# 3. 输出在 extension/browser-agent-assistant.zip
```

### Docker部署

```bash
# 构建镜像
docker build -t browser-agent-assistant .

# 启动容器
docker-compose up -d

# 访问 http://localhost:8080
```

## 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 代码规范

- 使用TypeScript严格模式
- 遵循ESLint规则
- 函数添加类型注解
- 复杂逻辑添加注释
- 组件使用React.FC类型

## 资源

- [Chrome Extension文档](https://developer.chrome.com/docs/extensions/)
- [Manifest V3指南](https://developer.chrome.com/docs/extensions/mv3/)
- [React文档](https://react.dev/)
- [TypeScript手册](https://www.typescriptlang.org/docs/)
