// pages/index/index.js
const { WorkoutLogService, BodyDataService } = require('../../services/cloud');
const { formatDate, showLoading, hideLoading } = require('../../utils/util');

Page({
  data: {
    stats: {
      totalWorkouts: 0,
      weekWorkouts: 0,
      totalDuration: 0
    },
    recentLogs: [],
    latestBodyData: null
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  async loadData() {
    try {
      showLoading();

      // 加载训练记录
      const logs = await WorkoutLogService.getAll({ limit: 5 });
      this.setData({ recentLogs: logs });

      // 计算统计数据
      this.calculateStats(logs);

      // 加载最新身体数据
      const latestData = await BodyDataService.getLatest();
      this.setData({ latestBodyData: latestData });

    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      hideLoading();
    }
  },

  calculateStats(logs) {
    const totalWorkouts = logs.length;
    const totalDuration = logs.reduce((sum, log) => sum + (log.duration || 0), 0);

    // 计算本周训练次数
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekWorkouts = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekAgo;
    }).length;

    this.setData({
      stats: {
        totalWorkouts,
        weekWorkouts,
        totalDuration
      }
    });
  },

  startWorkout() {
    wx.navigateTo({
      url: '/pages/workout/workout'
    });
  },

  addBodyData() {
    wx.navigateTo({
      url: '/pages/bodydata/bodydata'
    });
  },

  viewMore() {
    wx.switchTab({
      url: '/pages/workout/workout'
    });
  }
});
