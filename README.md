# 市场问题挖掘器 — 部署指南

## 项目结构

```
market-miner/
├── netlify/
│   └── functions/
│       └── suggest.js       ← Google Suggest 代理（解决跨域）
├── public/
│   └── index.html           ← 主工具页面
├── netlify.toml             ← Netlify 配置
└── README.md
```

## 部署步骤（10 分钟搞定）

### 1. 上传到 GitHub

```bash
cd market-miner
git init
git add .
git commit -m "init market miner tool"
git remote add origin https://github.com/你的用户名/market-miner.git
git push -u origin main
```

### 2. Netlify 部署

1. 登录 [netlify.com](https://netlify.com)
2. 点击 **Add new site → Import an existing project**
3. 选择刚才的 GitHub repo
4. Build settings 保持默认（netlify.toml 已配置好）
5. 点击 **Deploy site**

### 3. 填入 Anthropic API Key

打开 `public/index.html`，找到这一行：

```js
const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY';
```

替换为你的真实 API Key，然后 commit & push。

> ⚠️ 注意：这个 Key 会暴露在前端。建议另外写一个 Netlify Function 来代理 Claude API 调用，Key 放在 Netlify 的环境变量里。需要的话告诉我，我帮你写。

### 4. 绑定自定义域名

1. Netlify → Domain management → Add custom domain
2. 输入 `tools.kklearning.com`
3. 在你的 DNS 管理后台加一条 CNAME 记录：
   - Name: `tools`
   - Value: `你的netlify站点.netlify.app`
4. 等待几分钟 DNS 生效

## 工作原理

```
用户输入关键词
    ↓
/api/suggest（Netlify Function 代理）
    ↓
Google Autocomplete API（服务端调用，无跨域问题）
    ↓
返回真实搜索词
    ↓
Claude API 分析意图 + 生成 insight
    ↓
渲染结果
```

## 功能说明

- 🟢 绿点 = Google 真实搜索词
- 🟣 紫点 = Claude AI 补充问题
- 点击问题卡片 = 展开用户意图 insight
- 点击 Google 真实词 = 继续挖掘该词
- 导出 CSV = 可直接导入 Excel 整理
