# 爽文人生模拟器

> 一款基于文字事件驱动的单机人生模拟器。极端起伏，黑色幽默，每局必有截图传播时刻。

## 玩法

1. 选择职业路线（创业者/军人/白领/学者/创作者/自由职业）
2. 每年推进，系统根据你的属性和职业抽取事件
3. 面对选择，承受后果
4. 活到最后或死得其所

## 核心机制

- **200+ 事件库**，覆盖0-80岁
- **5档稀有度**：COMMON / RARE / EPIC / LEGENDARY / MEME
- **连锁事件系统**：一个决定可能触发8步骤的人生链条
- **极端起伏**：可能一夜暴富，可能倾家荡产

## 本地开发

```bash
npm install
npm run dev
```

## 部署到Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Fork 本仓库
2. 在 Railway 创建新项目，选择"Deploy from GitHub repo"
3. 选择本仓库，Railway 会自动读取 railway.json 配置
4. 部署完成后访问分配的域名

## 技术栈

- React 18 + TypeScript
- Vite 5
- Zustand（状态管理）
- 纯CSS样式（无UI库依赖）

## 事件库结构

```
events/
├── age_0_12.json    # 童年 30条
├── age_13_18.json   # 青少年 35条
├── age_19_30.json   # 青年 50条
├── age_31_45.json   # 中青年 50条
├── age_46_60.json   # 中年 35条
└── age_61_80.json   # 老年 30条
```
