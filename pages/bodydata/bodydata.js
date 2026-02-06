// pages/bodydata/bodydata.js
const BodyDataService = require('../../services/cloud.js').BodyDataService;
const { showLoading, hideLoading, showToast, showConfirm, formatDate, calculateBMI } = require('../../utils/util.js');

Page({
  data: {
    // 页面状态
    currentTab: 'overview', // 'overview' 或 'history' 或 'add'
    isAdding: false,

    // 最新身体数据
    latestData: null,

    // 历史记录
    historyList: [],

    // 新增数据表单
    formData: {
      date: formatDate(new Date()),
      weight: '',
      height: '',
      bodyFatRate: '',
      chest: '',
      waist: '',
      hip: '',
      thigh: '',
      arm: '',
    },

    // 统计数据
    totalRecords: 0,
    weightChange: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '身体数据'
    });
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (this.data.currentTab !== 'add') {
      this.loadData();
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载数据
   */
  async loadData() {
    try {
      showLoading('加载中...');

      // 加载最新数据
      const latest = await BodyDataService.getLatest();

      // 加载历史数据
      const history = await BodyDataService.getAll({
        orderBy: 'date',
        order: 'desc',
        limit: 50
      });

      // 计算体重变化
      let weightChange = 0;
      if (history.length >= 2) {
        weightChange = history[0].weight - history[1].weight;
      }

      this.setData({
        latestData: latest,
        historyList: history,
        totalRecords: history.length,
        weightChange: weightChange
      });

    } catch (error) {
      console.error('加载身体数据失败:', error);
      showToast('加载失败，请重试');
    } finally {
      hideLoading();
    }
  },

  /**
   * 切换标签页
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
  },

  /**
   * 显示新增表单
   */
  showAddForm() {
    const today = formatDate(new Date());

    this.setData({
      isAdding: true,
      currentTab: 'add',
      formData: {
        date: today,
        weight: '',
        height: this.data.latestData?.height || '',
        bodyFatRate: '',
        chest: '',
        waist: '',
        hip: '',
        thigh: '',
        arm: '',
      }
    });
  },

  /**
   * 取消新增
   */
  cancelAdd() {
    this.setData({
      isAdding: false,
      currentTab: 'overview'
    });
  },

  /**
   * 更新表单数据
   */
  updateFormData(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;

    this.setData({
      [`formData.${field}`]: value
    });
  },

  /**
   * 选择日期
   */
  bindDateChange(e) {
    this.setData({
      'formData.date': e.detail.value
    });
  },

  /**
   * 验证表单
   */
  validateForm() {
    const { formData } = this.data;

    // 至少需要填写一项数据
    const hasData = formData.weight ||
                    formData.height ||
                    formData.bodyFatRate ||
                    formData.chest ||
                    formData.waist ||
                    formData.hip ||
                    formData.thigh ||
                    formData.arm;

    if (!hasData) {
      showToast('请至少填写一项数据');
      return false;
    }

    return true;
  },

  /**
   * 保存数据
   */
  async saveData() {
    if (!this.validateForm()) {
      return;
    }

    const { formData } = this.data;

    try {
      showLoading('保存中...');

      const data = {
        date: formData.date,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        bodyFatRate: formData.bodyFatRate ? parseFloat(formData.bodyFatRate) : null,
        measurements: {
          chest: formData.chest ? parseFloat(formData.chest) : null,
          waist: formData.waist ? parseFloat(formData.waist) : null,
          hip: formData.hip ? parseFloat(formData.hip) : null,
          thigh: formData.thigh ? parseFloat(formData.thigh) : null,
          arm: formData.arm ? parseFloat(formData.arm) : null,
        },
        createdAt: new Date().getTime()
      };

      await BodyDataService.create(data);

      showToast('保存成功');

      this.setData({
        isAdding: false,
        currentTab: 'overview'
      });

      this.loadData();

    } catch (error) {
      console.error('保存失败:', error);
      showToast('保存失败，请重试');
    } finally {
      hideLoading();
    }
  },

  /**
   * 删除记录
   */
  async deleteRecord(e) {
    const { id, date } = e.currentTarget.dataset;

    const confirmed = await showConfirm('确认删除', `确定要删除 ${date} 的记录吗？`);

    if (!confirmed) return;

    try {
      showLoading('删除中...');
      await BodyDataService.remove(id);
      showToast('删除成功');
      this.loadData();
    } catch (error) {
      console.error('删除失败:', error);
      showToast('删除失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 计算BMI
   */
  calculateBMI(weight, height) {
    if (!weight || !height) return null;
    return calculateBMI(weight, height);
  },

  /**
   * 获取BMI状态
   */
  getBMIStatus(bmi) {
    if (!bmi) return '';
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '正常';
    if (bmi < 28) return '超重';
    return '肥胖';
  },

  /**
   * 获取BMI状态颜色
   */
  getBMIStatusColor(bmi) {
    if (!bmi) return '#8B9BB4';
    if (bmi < 18.5) return '#FFA726';
    if (bmi < 24) return '#66BB6A';
    if (bmi < 28) return '#FFA726';
    return '#EF5350';
  },

  /**
   * 格式化测量数据
   */
  formatMeasurement(value, unit = 'cm') {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    return `${value}${unit}`;
  }
});
