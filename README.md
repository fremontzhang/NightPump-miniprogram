# NightPump 微信小程序

一个现代化的健身记录微信小程序，使用原生微信小程序开发框架。

## 功能特性

- ✅ 训练计划管理
- ✅ 训练记录追踪
- ✅ 身体数据跟踪
- ✅ 数据统计可视化
- ✅ 训练提醒功能
- ✅ 云端数据同步（微信云开发）

## 技术栈

- **框架**: 原生微信小程序
- **云服务**: 微信云开发 CloudBase
- **UI**: 自定义科技风格深色主题
- **状态管理**: 自定义 Store

## 项目结构

```
NightPump-miniprogram/
├── pages/              # 页面目录
│   ├── index/         # 首页
│   ├── workout/       # 训练相关
│   ├── bodydata/      # 身体数据
│   ├── statistics/    # 统计分析
│   ├── profile/       # 个人中心
│   └── reminder/      # 提醒设置
├── services/          # 服务层
│   └── cloud.js      # 云开发服务
├── utils/            # 工具函数
│   └── util.js       # 通用工具
├── store/            # 状态管理
│   └── store.js      # 全局状态
├── images/           # 图片资源
├── app.js            # 小程序入口
├── app.json          # 小程序配置
├── app.wxss          # 全局样式
└── project.config.json  # 项目配置
```

## 快速开始

### 1. 安装微信开发者工具

下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 2. 导入项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择项目目录: `/Users/frankzhang/Claude/NightPump/NightPump-miniprogram`
4. 填写 AppID（测试号可以不需要）
5. 点击"导入"

### 3. 配置云开发

#### 步骤 1: 开通云开发

1. 在微信开发者工具中，点击"云开发"按钮
2. 按照提示开通云开发服务
3. 记录下你的环境ID（envId）

#### 步骤 2: 创建数据库集合

在云开发控制台创建以下集合（数据库表）：

- `workout_plans` - 训练计划
- `workout_logs` - 训练记录
- `body_data` - 身体数据
- `exercises` - 动作库
- `reminders` - 提醒设置

#### 步骤 3: 配置环境ID

修改 `app.js` 文件，将环境ID替换为你自己的：

```javascript
wx.cloud.init({
  env: 'your-env-id-here', // 替换为你的环境ID
  traceUser: true,
});
```

#### 步骤 4: 配置项目AppID

修改 `project.config.json`：

```json
{
  "appid": "your-appid-here"  // 替换为你的小程序AppID
}
```

### 4. 运行项目

1. 在微信开发者工具中点击"编译"
2. 项目将在模拟器中运行
3. 可以在手机上扫码预览

## 开发进度

- [x] 项目初始化
- [x] 云开发服务层
- [x] 状态管理
- [x] 首页UI
- [ ] 训练页面
- [ ] 身体数据页面
- [ ] 统计页面
- [ ] 个人中心页面
- [ ] 提醒功能页面

## 下一步开发

### 优先级 1: 完成核心页面

1. **训练页面** (pages/workout)
   - 训练计划列表
   - 开始训练流程
   - 实时记录组数/次数/重量

2. **身体数据页面** (pages/bodydata)
   - 数据录入表单
   - 历史数据展示
   - 数据编辑功能

3. **统计页面** (pages/statistics)
   - 训练趋势图表
   - 身体数据变化曲线
   - 数据统计卡片

### 优先级 2: 完善功能

4. **个人中心** (pages/profile)
   - 用户信息
   - 设置选项
   - 数据导出

5. **提醒功能** (pages/reminder)
   - 提醒时间设置
   - 星期选择
   - 开关控制

## 数据库结构

### workout_plans (训练计划)

```javascript
{
  name: String,        // 计划名称
  exercises: Array,    // 动作列表
  totalSets: Number,   // 总组数
  estimatedTime: Number, // 预计时长
  isTemplate: Boolean,  // 是否为模板
  createdAt: Date
}
```

### workout_logs (训练记录)

```javascript
{
  planId: String,      // 计划ID
  planName: String,    // 计划名称
  duration: Number,    // 实际时长
  exercises: Array,    // 实际完成的动作
  date: Date,          // 训练日期
  notes: String        // 备注
}
```

### body_data (身体数据)

```javascript
{
  weight: Number,      // 体重(kg)
  bodyFat: Number,     // 体脂率(%)
  bmi: Number,         // BMI
  chest: Number,       // 胸围
  waist: Number,       // 腰围
  hips: Number,        // 臀围
  date: Date           // 记录日期
}
```

## 配色方案

- 主色: #00D9FF (科技蓝)
- 次色: #FF6B35 (活力橙)
- 背景色: #0A0E27 (深空蓝)
- 卡片色: #1E2542 (深蓝灰)

## 注意事项

1. **云数据库权限**: 在云开发控制台设置数据库权限为"所有用户可读写"
2. **小程序类目**: 需要选择"体育 > 体育健身服务"类目
3. **隐私合规**: 添加用户隐私协议和服务条款

## 常见问题

### Q: 云数据库连接失败？
A: 检查 `app.js` 中的环境ID是否正确，确保云开发已开通。

### Q: 页面跳转失败？
A: 检查 `app.json` 中是否正确配置了页面路径。

### Q: TabBar 图标不显示？
A: 需要在 `images` 目录添加对应的图标文件。

## 技术支持

如有问题，请参考：
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## License

MIT
