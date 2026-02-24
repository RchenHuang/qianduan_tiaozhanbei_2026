# 认知训练游戏平台

一个综合性的认知训练游戏平台，包含多个训练游戏，旨在提升用户的注意力、反应速度、逻辑思维和空间认知能力。

## 项目结构

```
tiaobei/
├── index.html              # 主页面入口
├── NeuroFlex-main/         # Vue.js 主项目（舒尔特方格、Stroop测试）
├── games/                  # 独立游戏目录
│   ├── parity/            # 奇偶性游戏
│   └── shape/             # 形状识别游戏
└── docs/                  # 文档和演示
    └── demo.html          # 样式演示页面
```

## 游戏列表

### 1. 舒尔特方格 (Schulte Grid)
- **位置**: `NeuroFlex-main/` 项目
- **训练目标**: 提升注意力和视觉搜索能力
- **游戏规则**: 按 1→2→3→...→25 的顺序快速点击数字
- **运行方式**: 
  1. 进入 `NeuroFlex-main` 目录
  2. 运行 `pnpm install` 安装依赖
  3. 运行 `pnpm dev` 启动开发服务器
  4. 访问 `http://localhost:5173/schulte`

### 2. Stroop测试 (Stroop Test)
- **位置**: `NeuroFlex-main/` 项目
- **训练目标**: 训练抑制控制和认知灵活性
- **游戏规则**: 快速判断文字颜色而非文字含义
- **运行方式**: 
  1. 进入 `NeuroFlex-main` 目录
  2. 运行 `pnpm install` 安装依赖
  3. 运行 `pnpm dev` 启动开发服务器
  4. 访问 `http://localhost:5173/stroop`

### 3. 奇偶性 (Parity)
- **位置**: `games/parity/`
- **训练目标**: 数字逻辑推理训练
- **游戏规则**: 让 3x3 棋盘上的所有数字都相同
- **运行方式**: 直接打开 `games/parity/index.html`

### 4. 形状识别 (Shape Recognition)
- **位置**: `games/shape/`
- **训练目标**: 快速识别和分类形状
- **游戏规则**: 快速识别屏幕上显示的形状
- **运行方式**: 直接打开 `games/shape/index.html`

## 快速开始

### 方式一：从主页面进入
直接打开 `index.html`，点击游戏卡片即可进入对应游戏。

### 方式二：单独运行游戏
按照各个游戏的运行方式说明单独运行。

## 技术栈

- **Vue.js 项目**: Vue 3 + Vite + Pinia + Vue Router
- **独立游戏**: HTML + CSS + JavaScript
- **样式**: Tailwind CSS + 自定义 SCSS
- **动画**: GSAP

## 开发说明

### NeuroFlex-main 项目
```bash
cd NeuroFlex-main
pnpm install
pnpm dev          # 开发模式
pnpm build        # 构建生产版本
pnpm preview      # 预览生产版本
```

### 独立游戏
直接在浏览器中打开对应的 `index.html` 文件即可。

## 样式参考

查看 `docs/demo.html` 了解项目的统一设计风格和组件样式。

## 许可证

本项目采用 MIT 许可证。
