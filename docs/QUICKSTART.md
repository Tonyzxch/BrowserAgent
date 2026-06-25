# 快速开始

## 5分钟上手指南

### 1. 获取插件 (2分钟)

**Docker方式（最快）**：
```bash
docker-compose up -d
# 访问 http://localhost:8080 下载插件
```

**本地构建**：
```bash
npm install && npm run build
```

### 2. 安装插件 (1分钟)

1. 打开 `chrome://extensions/`
2. 开启"开发者模式"（右上角开关）
3. 点击"加载已解压的扩展程序"
4. 选择 `dist` 目录
5. 完成！工具栏会出现紫色机器人图标

### 3. 第一个任务 (2分钟)

**示例1：GitHub搜索**
```
任务：帮我在GitHub搜索React UI组件库
```

1. 打开 https://github.com
2. 点击插件图标
3. 输入上述任务
4. 点击"开始执行"
5. 观察侧边栏的执行过程

**示例2：信息收集**
```
任务：在豆瓣搜索评分8分以上的科幻电影
```

**示例3：商品筛选**
```
任务：在淘宝搜索500元以内的蓝牙耳机
```

## 常用命令

```bash
# 开发模式（热重载）
npm run dev

# 生产构建
npm run build

# 打包插件
npm run pack

# 生成图标
npm run generate-icons

# Docker部署
docker-compose up -d
```

## 目录结构速览

```
browser-agent-assistant/
├── src/
│   ├── background/      # 后台服务
│   ├── content/         # 页面脚本
│   ├── popup/           # 弹窗UI
│   ├── sidepanel/       # 侧边栏UI
│   ├── config/          # 配置
│   └── utils/           # 工具函数
├── public/              # 静态资源
├── docs/                # 文档
└── dist/                # 构建输出
```

## 核心概念

### 1. 任务（Task）
用户用自然语言描述的待完成工作

### 2. 步骤（Step）
AI规划的具体执行动作序列

### 3. 动作类型（Actions）
- `navigate`: 页面导航
- `click`: 点击元素
- `input`: 输入文本
- `extract`: 提取信息
- `wait`: 等待加载
- `analyze`: 分析页面

### 4. 页面感知
自动识别页面中所有可交互元素

### 5. 元素定位
通过CSS选择器或XPath精准定位元素

## 自定义配置

编辑 `src/config/index.ts`：

```typescript
export const AI_CONFIG = {
  apiKey: 'your-api-key',
  baseURL: 'https://api-endpoint/v1',
  model: 'claude-opus-4-8',
  temperature: 0.7,
  maxTokens: 4096,
};
```

## 调试技巧

**查看Background日志**：
- `chrome://extensions/` → 服务工作进程 → 控制台

**查看Content Script日志**：
- 在目标网页按 F12 → Console

**调试Popup**：
- 右键插件图标 → 审查弹出内容

## 下一步

- 📖 阅读[用户指南](USER_GUIDE.md)了解详细功能
- 💻 查看[开发文档](DEVELOPMENT.md)学习架构
- 🎬 参考[演示脚本](DEMO_SCRIPT.md)录制视频
- 🔧 浏览代码了解实现细节

## 获取帮助

- GitHub Issues: 提交bug或功能请求
- 文档: 查看docs目录下的详细文档
- 代码注释: 关键函数都有详细注释

---

开始你的AI浏览器之旅吧！🚀
