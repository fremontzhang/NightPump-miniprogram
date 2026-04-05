# 微信云开发成本优化指南

> 针对 NightPump 健身小程序的微信云开发优化建议

## 当前套餐

- **套餐**: 个人版 ¥19.9/月
- **生效时间**: 2025年5月30日起

## 资源额度

| 资源项 | 月额度 | 日额度 | 注意事项 |
|--------|--------|--------|----------|
| 云函数调用次数 | 20万次 | - | 足够使用 |
| 数据库读操作 | - | 5万次 | 注意列表查询 |
| 数据库写操作 | - | 5万次 | 批量操作省额度 |
| 存储容量 | 3GB | - | 图片压缩上传 |
| CDN流量 | 10GB | - | 一般够用 |
| 云函数并发 | 20 | - | 无压力 |

## 优化技巧

### 1. 数据库查询优化

```javascript
// ✅ 好的做法：限制返回数量
const plans = await CloudService.query('workout_plans', {
  limit: 20  // 默认已限制20条
});

// ❌ 避免：不限制数量查询
const allData = await db.collection('workout_logs').get(); // 可能返回大量数据
```

### 2. 批量操作省额度

```javascript
// ✅ 批量写入（1次写操作写入多条）
const batch = db.collection('workout_logs');
// 使用 add 批量添加

// ❌ 避免：循环单条写入
for (let item of items) {
  await db.collection('workout_logs').add({ data: item }); // 浪费额度
}
```

### 3. 本地缓存减少请求

```javascript
// utils/cache.js
const Cache = {
  set(key, data, ttl = 3600) {
    const item = {
      data,
      expire: Date.now() + ttl * 1000
    };
    wx.setStorageSync(key, item);
  },
  
  get(key) {
    const item = wx.getStorageSync(key);
    if (!item) return null;
    if (Date.now() > item.expire) {
      wx.removeStorageSync(key);
      return null;
    }
    return item.data;
  }
};

// 使用缓存
const plans = Cache.get('workout_plans');
if (plans) {
  return plans; // 使用缓存，不请求数据库
}
// 否则请求数据库并缓存
```

### 4. 图片压缩上传

```javascript
// 上传前压缩图片
wx.chooseImage({
  success: (res) => {
    wx.compressImage({
      src: res.tempFilePaths[0],
      quality: 80,  // 压缩到80%质量
      success: (compressed) => {
        // 上传压缩后的图片
        wx.cloud.uploadFile({
          cloudPath: `images/${Date.now()}.jpg`,
          filePath: compressed.tempFilePath
        });
      }
    });
  }
});
```

### 5. 分页加载

```javascript
// 训练记录分页加载
Page({
  data: {
    logs: [],
    page: 0,
    pageSize: 10,
    hasMore: true
  },

  async loadMore() {
    if (!this.data.hasMore) return;
    
    const logs = await CloudService.query('workout_logs', {
      orderBy: 'date',
      order: 'desc',
      limit: this.data.pageSize,
      skip: this.data.page * this.data.pageSize  // 跳过已加载的
    });
    
    this.setData({
      logs: [...this.data.logs, ...logs],
      page: this.data.page + 1,
      hasMore: logs.length === this.data.pageSize
    });
  }
});
```

## 监控用量

### 在小程序中查看用量

1. 打开微信开发者工具
2. 点击"云开发"按钮
3. 进入"配额"页面查看实时用量

### 设置用量告警

在微信云开发控制台：
1. 进入"设置" → "告警设置"
2. 设置用量达到 80% 时发送告警

## 续费提醒

- **续费周期**: 每月自动扣费
- **欠费处理**: 欠费后服务会保留 7 天，期间可恢复
- **备份建议**: 定期导出重要数据

## 降级方案（如果用量远低于套餐）

如果发现每月用量远低于套餐额度：
1. 考虑切换到按量付费（更便宜）
2. 或者与其他小程序共用环境

## 常见问题

### Q: 超出额度会怎样？
A: 如果开启"不限额服务"，超出部分按量收费；否则服务会受限。

### Q: 可以暂停服务吗？
A: 可以，在控制台停止服务即可暂停计费。

### Q: 数据如何备份？
A: 使用云开发控制台的"数据库导出"功能定期备份。
