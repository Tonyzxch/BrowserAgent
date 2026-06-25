# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 打包插件
RUN npm run pack

# 生产阶段 - 提供简单的HTTP服务器
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/extension /usr/share/nginx/html/extension
COPY --from=builder /app/dist /usr/share/nginx/html/dist

# 复制文档
COPY README.md /usr/share/nginx/html/
COPY docs /usr/share/nginx/html/docs

# 创建简单的index.html
RUN echo '<html><head><meta charset="utf-8"><title>Browser Agent Assistant</title></head><body><h1>浏览器智能助手</h1><p>下载插件: <a href="/extension/browser-agent-assistant.zip">browser-agent-assistant.zip</a></p><p>查看文档: <a href="/docs/">文档目录</a></p></body></html>' > /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
