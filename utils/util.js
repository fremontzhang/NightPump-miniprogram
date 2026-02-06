// utils/util.js
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

// 格式化日期为 YYYY-MM-DD
const formatDate = date => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 计算BMI
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// 显示Toast
const showToast = (title, icon = 'none') => {
  wx.showToast({
    title,
    icon,
    duration: 2000
  });
};

// 显示Loading
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  });
};

// 隐藏Loading
const hideLoading = () => {
  wx.hideLoading();
};

// 显示确认对话框
const showConfirm = (content, title = '提示') => {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success(res) {
        resolve(res.confirm);
      },
      fail() {
        resolve(false);
      }
    });
  });
};

module.exports = {
  formatTime,
  formatDate,
  calculateBMI,
  showToast,
  showLoading,
  hideLoading,
  showConfirm
};
