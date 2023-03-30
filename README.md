# 设备管理器

## 项目介绍

设备管理器是一个基于 [T3 Stack](https://create.t3.gg/) 的项目，用于管理内网设备。包括设备的增删改查、设备的在线状态、设备的唤醒等功能。

## 项目结构

```bash
.
├── auth # next-auth 的配置
├── components
├── env # 环境变量定义及校验
├── hooks
├── middleware.ts # next 中间件，用于未登录拦截
├── next.config.mjs # next 配置
├── package.json
├── pages
│   ├── api
│   │   ├── auth
│   │   │   └── [...nextauth].ts # next-auth 三连冠接口
│   │   └── trpc
│   │       └── [trpc].ts # trpc 相关接口
│   ├── _app.tsx
│   ├── index.tsx # 首页
│   └── login.tsx # 登录页面
├── pnpm-lock.yaml
├── postcss.config.cjs
├── prisma # prisma 相关配置
│   └── schema.prisma # 数据库表结构
├── public
├── README.md
├── server
│   ├── context.ts # 上下文定义
│   ├── db.ts # 数据库连接
│   ├── error.ts # 错误类型定义
│   ├── index.ts
│   ├── init.ts # 初始化 trpc
│   ├── middleware.ts # 中间件
│   ├── procedure.ts # tprc 处理过程
│   └── routers # 路由定义
├── share # 公共库
│   ├── commands.ts # 单片机命令定义
│   └── trpc.ts # trpc 客户端，用于前端调用
├── styles
├── tailwind.config.cjs
├── tsconfig.json
├── types
└── utils # 工具库
```

## 项目启动

```bash
# 安装依赖
pnpm install

# 创建数据库
pnpm exec prisma push dev

# 创建环境变量
cp .env.example .env

# 启动项目
pnpm dev
```

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

-   [Documentation](https://create.t3.gg/)
-   [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!
