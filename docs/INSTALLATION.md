# 安装指南

## Chrome/Edge浏览器安装步骤

### 方法一：从源码构建（推荐用于开发）

1. **克隆项目**
```bash
git clone https://github.com/Tonyzxch/BrowserAgent.git
cd BrowserAgent
```

2. **安装依赖并构建**
```bash
npm install
npm run build
```

3. **加载到Chrome**
   - 打开Chrome浏览器
   - 访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目根目录下的 `dist` 文件夹
   - 插件图标应该出现在浏览器工具栏中

### 方法二：从Docker获取

1. **启动Docker服务**
```bash
docker-compose up -d
```

2. **下载插件**
   - 访问 http://localhost:8080
   - 下载 `browser-agent-assistant.zip`
   - 解压到本地目录

3. **加载到Chrome**
   - 打开 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择解压后的文件夹

## 验证安装

安装成功后，你应该看到：
- ✅ 浏览器工具栏出现紫色渐变的机器人图标
- ✅ 点击图标弹出任务输入窗口
- ✅ 访问 `chrome://extensions/` 可以看到"Browser Agent Assistant"

## 首次使用

1. **点击插件图标**
   - 在浏览器工具栏找到机器人图标
   - 点击打开任务输入窗口

2. **输入任务**
   - 在文本框中用自然语言描述你想完成的任务
   - 例如："帮我在GitHub上搜索React相关的项目"

3. **查看执行过程**
   - 点击"开始执行"
   - 侧边栏会自动打开显示任务进度
   - 观察每个步骤的执行情况

## 配置AI服务（可选）

如果需要使用自己的API Key：

1. 打开项目目录
2. 编辑 `src/config/index.ts`
3. 修改 `AI_CONFIG` 配置：

```typescript
export const AI_CONFIG = {
  apiKey: 'your-api-key',
  baseURL: 'https://your-api-endpoint/v1',
  model: 'claude-opus-4-8',
};
```

4. 重新构建：`npm run build`
5. 在 `chrome://extensions/` 点击刷新按钮

## 常见问题

### Q: 插件无法加载？
**A**: 确保：
- 已开启"开发者模式"
- 选择了正确的dist目录
- manifest.json文件存在

### Q: 点击图标没有反应？
**A**: 
- 检查浏览器控制台是否有错误
- 右键图标→"检查弹出内容"查看日志
- 确认所有文件已正确构建

### Q: 任务执行失败？
**A**:
- 检查AI API配置是否正确
- 验证API Key是否有效
- 查看网络连接是否正常
- 检查目标网站是否可访问

### Q: 如何卸载？
**A**:
- 访问 `chrome://extensions/`
- 找到"Browser Agent Assistant"
- 点击"移除"按钮

## 更新插件

当有新版本时：

```bash
# 拉取最新代码
git pull

# 重新安装依赖（如有package.json变更）
npm install

# 重新构建
npm run build

# 在chrome://extensions/页面点击刷新图标
```

## 技术支持

遇到问题？
1. 查看 [用户指南](USER_GUIDE.md)
2. 查看 [开发文档](DEVELOPMENT.md)
3. 提交Issue到GitHub仓库

---

祝使用愉快！🚀
