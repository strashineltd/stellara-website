# 星瀚空间 官方网站

企业展示网站，包含前端静态页面（首页 / 产品 / 服务 / 关于我们）与 Python Flask 后端 API。

## 项目结构

```
.
├── index.html              # 首页
├── products.html           # 产品页
├── services.html           # 服务页（含联系表单）
├── about.html              # 关于我们
├── css/                    # 样式
├── js/
│   ├── config.js           # ⭐ 前端全局配置（API 地址等）
│   └── main.js             # 通用交互逻辑
├── server.py               # Flask 后端 API
├── start.py                # 本地一键启动脚本
├── requirements.txt        # Python 依赖
├── .env.example            # 环境变量示例
└── SPEC.md                 # 设计规格
```

## 本地开发

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 一键启动（推荐）

```bash
python start.py
```

脚本会同时启动：
- 前端静态服务：http://localhost:8080
- 后端 API 服务：http://localhost:5000
- 并自动在浏览器打开首页

### 3. 分别启动（可选）

```bash
# 终端 1：后端
python server.py

# 终端 2：前端
python -m http.server 8080
```

## 生产部署

### 后端配置

复制 `.env.example` 为 `.env` 并修改：

| 变量 | 说明 | 生产环境建议值 |
|------|------|----------------|
| `SECRET_KEY` | 应用密钥 | 长随机字符串 |
| `ALLOWED_ORIGINS` | 允许的前端域名 | `https://你的域名` |
| `FORCE_HTTPS` | 强制 HTTPS | `true` |
| `REDIS_URL` | 速率限制共享存储 | `redis://...` |
| `DEBUG` | 调试模式 | `false` |
| `HOST` / `PORT` | 绑定地址与端口 | `0.0.0.0` / `5000` |

> Windows 下 `.env` 不会被 `server.py` 自动加载，需在系统环境变量中设置，或用 `python-dotenv`；
> Linux / Docker 部署时建议用 `gunicorn`：
> ```bash
> gunicorn -w 4 -b 0.0.0.0:5000 server:app
> ```

### 前端配置

修改 `js/config.js` 中的 `window.API_BASE`，指向你的后端域名：

```js
window.API_BASE = 'https://api.your-domain.com';
// 若前后端同域，可设为空字符串 ''，请求将走相对路径
```

修改一处即可全站生效（首页、产品页、服务页、关于页统一读取此变量）。

## 安全特性

- ✅ CSP / HSTS / X-Frame-Options / XSS 防护（flask-talisman）
- ✅ CORS 白名单（环境变量配置）
- ✅ 接口速率限制（flask-limiter，可接 Redis）
- ✅ 联系表单额外速率限制（5 分钟 3 次）
- ✅ 输入校验：HTML 转义、长度限制、邮箱/电话格式校验
- ✅ 请求体大小限制（1 MB）
- ✅ 安全响应头（nosniff / Referrer-Policy / Permissions-Policy）

## API 列表

| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | `/api/company`  | 公司信息 |
| GET  | `/api/services` | 服务/产品列表 |
| GET  | `/api/stats`    | 统计数据 |
| GET  | `/api/timeline` | 发展时间线 |
| GET  | `/api/team`     | 团队成员 |
| GET  | `/api/values`   | 企业价值观 |
| POST | `/api/contact`  | 提交联系表单 |
| GET  | `/api/health`   | 健康检查 |

## 浏览器支持

支持现代浏览器（Chrome / Edge / Firefox / Safari 最近两年版本），
完全响应式适配桌面（>1024px）、平板（768–1024px）、移动端（<768px）。
