# Browser Agent Assistant - 浏览器智能助手

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

一个基于AI的浏览器自主操作助手，通过自然语言让AI帮你完成复杂的浏览器任务。

## ✨ 特性

- 🤖 **AI驱动**：使用Claude Opus 4.8模型进行任务理解和规划
- 🎯 **自然语言交互**：用中文描述任务，AI自动执行
- 🔍 **智能页面感知**：自动识别页面元素和可交互内容
- 📋 **任务规划**：AI自主规划多步骤执行流程
- 🎨 **可视化界面**：实时查看任务执行过程和结果
- 🚀 **Chrome扩展**：无需额外软件，直接在浏览器中使用

## 🎬 示例任务

- 帮我查找最近的AI会议截稿日期
- 在GitHub上搜索stars最多的React UI组件库
- 在电商网站筛选某类商品并整理信息
- 自动填写复杂的在线表单
- 批量收集网页信息并生成报告

## 🏗️ 技术架构

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **状态管理**: Zustand
- **AI服务**: Claude Opus 4.8 (通过OpenAI兼容API)
- **浏览器扩展**: Chrome Extension Manifest V3

## 🚀 快速开始

### 方式一：Docker部署（推荐）

```bash
# 克隆仓库
git clone https://github.com/Tonyzxch/BrowserAgent.git
cd BrowserAgent

# 使用docker-compose启动
docker-compose up -d

# 访问 http://localhost:8080 下载插件
```

### 方式二：本地开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 打包插件
npm run pack
```

## 📦 安装插件

1. 构建或从Docker服务下载插件zip文件
2. 解压文件到本地目录
3. 打开Chrome浏览器，访问 `chrome://extensions/`
4. 开启"开发者模式"
5. 点击"加载已解压的扩展程序"
6. 选择解压后的`dist`目录

## 📖 使用指南

### 基本使用

1. 点击浏览器工具栏中的插件图标
2. 在弹出窗口中输入你想完成的任务
3. 点击"开始执行"
4. 在侧边栏中查看任务执行过程

### 配置AI服务

默认使用配置在代码中的API密钥。如需自定义：

编辑 `src/config/index.ts`:

```typescript
export const AI_CONFIG = {
  apiKey: 'your-api-key',
  baseURL: 'https://your-api-endpoint/v1',
  model: 'claude-opus-4-8',
};
```

## 🏛️ 项目结构

```
browser-agent-assistant/
├── src/
│   ├── background/          # Background Service Worker
│   ├── content/             # Content Script (页面注入)
│   ├── popup/               # 弹出窗口UI
│   ├── sidepanel/           # 侧边栏面板UI
│   ├── config/              # 配置文件
│   ├── utils/               # 工具函数
│   └── types/               # TypeScript类型定义
├── public/
│   ├── manifest.json        # 插件配置文件
│   └── icons/               # 插件图标
├── scripts/                 # 构建脚本
├── Dockerfile               # Docker配置
└── docker-compose.yml       # Docker Compose配置
```

## 🎯 核心功能

### 1. 页面感知

自动提取页面中的可交互元素：
- 链接、按钮
- 输入框、文本域
- 下拉选择框
- 可点击元素

### 2. 任务规划

AI根据页面信息和用户意图，生成执行步骤：
- navigate: 页面导航
- click: 点击元素
- input: 输入文本
- extract: 提取信息
- wait: 等待加载

### 3. 动作执行

自动化执行任务步骤：
- 元素定位（CSS Selector / XPath）
- 滚动到可见区域
- 高亮显示操作元素
- 模拟用户交互

## 🔒 隐私与安全

- 所有操作在本地浏览器执行
- 仅发送页面结构信息给AI服务
- 不收集用户个人信息
- API密钥存储在本地

## 🛠️ 开发指南

### 构建流程

1. TypeScript编译
2. Vite打包React应用
3. 生成Chrome Extension所需文件
4. 打包成zip文件

### 调试技巧

- **Popup调试**: 右键点击插件图标 → 审查弹出内容
- **Background调试**: chrome://extensions → 检查视图 → 服务工作进程
- **Content Script调试**: 在网页中打开DevTools控制台

## 📝 TODO

- [ ] 支持更多动作类型（拖拽、右键等）
- [ ] 添加任务模板功能
- [ ] 支持多标签页协同操作
- [ ] 增强错误恢复能力
- [ ] 添加任务导出功能
- [ ] 支持自定义AI模型

## 👤 作者

**Xucheng Zhuang**
- 学校：Sichuan University
- 邮箱：scuzxc660223@gmail.com
- GitHub：[@Tonyzxch](https://github.com/Tonyzxch)

---

**注意**: 本项目为教育和研究目的开发，请遵守网站服务条款和robots.txt规则。
