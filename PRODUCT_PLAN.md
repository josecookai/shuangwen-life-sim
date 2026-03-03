# 爽文人生模拟器 · 产品开发计划

> 一款基于文字事件驱动的单机人生模拟器，核心卖点：**极端起伏、黑色幽默、截图传播**

---

## 一、产品定位

| 维度 | 内容 |
|------|------|
| 类型 | 单机文字 RPG / 人生模拟 |
| 平台 | Web 优先（React PWA），后续可打包桌面/手机 |
| 目标用户 | 18-35 岁互联网用户，爱刷爽文/短剧 |
| 核心传播点 | 每局必有「截图时刻」：暴富/暴亏/塌房/九死一生 |
| 竞品参考 | BitLife、人生重开模拟器、中国式家长 |

---

## 二、核心系统架构

```
├── 角色属性系统
│   ├── 核心属性 (0-100)：Health / Happiness / Skill / Charm / Risk / Stress
│   └── 外部指标：Money / Debt / Reputation / Impact
│
├── 状态标签系统 (flags)
│   └── startup / burnout / married / lawsuit / viral_hit / blacklisted ...
│
├── 事件引擎
│   ├── 按年龄段抽取
│   ├── 按职业路线过滤
│   ├── 按稀有度加权
│   └── 连锁事件触发
│
├── 事件库 (200+ 条)
│   ├── 稀有度：COMMON / RARE / EPIC / LEGENDARY / MEME
│   └── 年龄段：0-12 / 13-18 / 19-30 / 31-45 / 46-60 / 61-80
│
├── 职业路线系统 (6条)
│   └── 创业者 / 军人 / 白领 / 学者 / 创作者 / 自由职业
│
└── 结局系统
    └── 死亡事件 / 传承结局 / 终局评分卡（可分享）
```

---

## 三、事件库规格

### 稀有度分布（200条中）

| 稀有度 | 数量 | 权重 | 说明 |
|--------|------|------|------|
| COMMON | 80 | 60% | 日常生活，推进时间 |
| RARE | 50 | 25% | 转折点，有选择意义 |
| EPIC | 35 | 12% | 大事件，属性剧变 |
| LEGENDARY | 25 | 2.5% | 人生高光/暗坑，截图传播 |
| MEME | 25 | 0.5% | 梗事件，文案爆笑 |

### 强制配额

- 创业路线 LEGENDARY：12条（IPO×3 / 10B收购×3 / 倾家荡产×3 / 官司监管×3）
- 军人路线 LEGENDARY：6条（战场生死×3 / 授勋晋升×3）
- 白领路线 EPIC+LEGENDARY：12条
- 创作者路线 LEGENDARY：10条（爆火×5 / 塌房×5）
- 学者路线 EPIC+LEGENDARY：10条
- MEME 梗事件：25条
- 明确死亡事件：20条（分布各年龄段）

### 连锁事件要求

- 短链（2-4步）：30条以上
- 长链（5-8步）：10条以上
- 示例长链：`种子融资 → A轮 → B轮 → 爆增长 → IPO → 套现风波 → 税务稽查 → 移民海外`

---

## 四、开发阶段规划

### Phase 0：设计基础（当前）
- [ ] 事件数据结构规范定义
- [ ] 200条事件库 JSON 文件生成
- [ ] 连锁关系图谱设计

### Phase 1：核心引擎（MVP）
- [ ] 事件抽取引擎（条件过滤 + 权重抽样）
- [ ] 属性/状态管理系统
- [ ] 职业路线选择
- [ ] 基础 UI（年龄推进 + 事件卡片 + 选项按钮）

### Phase 2：游戏化增强
- [ ] 连锁事件触发逻辑
- [ ] 死亡/结局系统
- [ ] 结局评分卡（可截图分享）
- [ ] 成就系统

### Phase 3：传播优化
- [ ] 分享截图生成（Canvas 渲染）
- [ ] 存档/读档
- [ ] 多人对比功能（"你的人生 vs 朋友的人生"）

---

## 五、事件数据结构规范

每条事件包含以下字段：

```json
{
  "id": "EVT_001",
  "title": "事件标题（热搜体）",
  "rarity": "LEGENDARY",
  "age_range": [19, 30],
  "route_tags": ["startup", "tech"],
  "base_weight": 1,
  "requirements": "startup=True AND startup_years>=3 AND Money>=100 AND investor_backing=True",
  "intro": "叙事文案 80-220字，带具体金额/细节/黑色幽默",
  "choices": [
    {
      "choice_text": "选项A文本",
      "outcome_text": "选A结果叙述",
      "effects": ["+Money 5000", "-Stress 20", "set viral_hit=True"],
      "next_event_ids": ["EVT_045", "EVT_046"]
    },
    {
      "choice_text": "选项B文本",
      "outcome_text": "选B结果叙述",
      "effects": ["-Money 200", "+Stress 30", "set lawsuit=True"],
      "next_event_ids": ["EVT_089"]
    }
  ],
  "death_risk": 0.0,
  "notes": "传播点：为什么这条事件适合截图分享"
}
```

---

## 六、下一步行动

1. **生成事件库**：按此规范生成 `events/` 目录下的 JSON 文件（按年龄段分文件）
2. **搭建引擎**：React + TypeScript，纯前端，无需后端
3. **接入事件库**：引擎读取 JSON，按条件抽取并渲染

---

## 七、文件结构预览

```
shuangwen-life-sim/
├── PRODUCT_PLAN.md          # 本文件
├── events/
│   ├── age_0_12.json        # 童年事件 30-40条
│   ├── age_13_18.json       # 青少年事件 30-40条
│   ├── age_19_30.json       # 青年事件 40-50条
│   ├── age_31_45.json       # 中青年事件 40-50条
│   ├── age_46_60.json       # 中年事件 30-40条
│   └── age_61_80.json       # 老年事件 30-40条
├── src/
│   ├── engine/              # 事件引擎
│   ├── components/          # UI 组件
│   └── store/               # 状态管理
└── public/
```
