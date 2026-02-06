// pages/workout/workout.js
const WorkoutPlanService = require('../../services/cloud.js').WorkoutPlanService;
const WorkoutLogService = require('../../services/cloud.js').WorkoutLogService;
const { showLoading, hideLoading, showToast, showConfirm } = require('../../utils/util.js');

Page({
  data: {
    // 页面状态
    currentTab: 'plans', // 'plans' 或 'workout' 或 'history'
    isCreatingPlan: false,

    // 训练计划列表
    workoutPlans: [],

    // 当前正在进行的训练
    currentWorkout: null,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    workoutStartTime: null,
    workoutTimer: null,
    workoutDuration: 0,

    // 新建计划表单
    newPlan: {
      name: '',
      exercises: [
        { name: '', sets: 3, reps: 12, weight: 0, restTime: 60 }
      ]
    },

    // 训练历史
    workoutHistory: [],

    // 统计数据
    totalWorkouts: 0,
    weekWorkouts: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '训练'
    });
    this.loadWorkoutPlans();
    this.loadWorkoutHistory();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时刷新数据
    if (this.data.currentTab === 'plans') {
      this.loadWorkoutPlans();
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    Promise.all([
      this.loadWorkoutPlans(),
      this.loadWorkoutHistory()
    ]).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载训练计划列表
   */
  async loadWorkoutPlans() {
    try {
      showLoading('加载中...');
      const plans = await WorkoutPlanService.getAll();
      this.setData({
        workoutPlans: plans
      });
    } catch (error) {
      console.error('加载训练计划失败:', error);
      showToast('加载失败，请重试');
    } finally {
      hideLoading();
    }
  },

  /**
   * 加载训练历史
   */
  async loadWorkoutHistory() {
    try {
      const history = await WorkoutLogService.getAll({
        orderBy: 'startTime',
        order: 'desc',
        limit: 20
      });

      // 计算统计数据
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const weekWorkouts = history.filter(log => {
        const logDate = new Date(log.startTime);
        return logDate >= weekAgo;
      }).length;

      this.setData({
        workoutHistory: history,
        totalWorkouts: history.length,
        weekWorkouts: weekWorkouts
      });
    } catch (error) {
      console.error('加载训练历史失败:', error);
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

    if (tab === 'history') {
      this.loadWorkoutHistory();
    }
  },

  /**
   * 显示新建计划表单
   */
  showCreatePlan() {
    this.setData({
      isCreatingPlan: true,
      newPlan: {
        name: '',
        exercises: [
          { name: '', sets: 3, reps: 12, weight: 0, restTime: 60 }
        ]
      }
    });
  },

  /**
   * 取消新建计划
   */
  cancelCreatePlan() {
    this.setData({
      isCreatingPlan: false
    });
  },

  /**
   * 添加动作
   */
  addExercise() {
    const exercises = [...this.data.newPlan.exercises];
    exercises.push({
      name: '',
      sets: 3,
      reps: 12,
      weight: 0,
      restTime: 60
    });
    this.setData({
      'newPlan.exercises': exercises
    });
  },

  /**
   * 删除动作
   */
  deleteExercise(e) {
    const index = e.currentTarget.dataset.index;
    const exercises = [...this.data.newPlan.exercises];
    if (exercises.length > 1) {
      exercises.splice(index, 1);
      this.setData({
        'newPlan.exercises': exercises
      });
    } else {
      showToast('至少保留一个动作');
    }
  },

  /**
   * 更新计划名称
   */
  updatePlanName(e) {
    this.setData({
      'newPlan.name': e.detail.value
    });
  },

  /**
   * 更新动作信息
   */
  updateExercise(e) {
    const { field, index } = e.currentTarget.dataset;
    const value = e.detail.value;
    const exercises = [...this.data.newPlan.exercises];

    if (field === 'name') {
      exercises[index].name = value;
    } else {
      exercises[index][field] = parseInt(value) || 0;
    }

    this.setData({
      'newPlan.exercises': exercises
    });
  },

  /**
   * 保存训练计划
   */
  async savePlan() {
    const { newPlan } = this.data;

    // 验证
    if (!newPlan.name.trim()) {
      showToast('请输入计划名称');
      return;
    }

    for (let exercise of newPlan.exercises) {
      if (!exercise.name.trim()) {
        showToast('请填写所有动作名称');
        return;
      }
    }

    try {
      showLoading('保存中...');

      const planData = {
        name: newPlan.name.trim(),
        exercises: newPlan.exercises.map(ex => ({
          name: ex.name.trim(),
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          restTime: ex.restTime
        })),
        createdAt: new Date().getTime()
      };

      await WorkoutPlanService.create(planData);

      showToast('保存成功');
      this.setData({
        isCreatingPlan: false
      });
      this.loadWorkoutPlans();

    } catch (error) {
      console.error('保存失败:', error);
      showToast('保存失败，请重试');
    } finally {
      hideLoading();
    }
  },

  /**
   * 删除训练计划
   */
  async deletePlan(e) {
    const { id, name } = e.currentTarget.dataset;

    const confirmed = await showConfirm('确认删除', `确定要删除训练计划"${name}"吗？`);

    if (!confirmed) return;

    try {
      showLoading('删除中...');
      await WorkoutPlanService.remove(id);
      showToast('删除成功');
      this.loadWorkoutPlans();
    } catch (error) {
      console.error('删除失败:', error);
      showToast('删除失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 开始训练
   */
  async startWorkout(e) {
    const { plan } = e.currentTarget.dataset;

    // 初始化训练数据
    const workoutData = {
      planId: plan._id,
      planName: plan.name,
      exercises: plan.exercises.map(ex => ({
        ...ex,
        completedSets: 0,
        logs: []
      })),
      startTime: new Date().getTime()
    };

    this.setData({
      currentWorkout: workoutData,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      workoutStartTime: Date.now(),
      workoutDuration: 0,
      currentTab: 'workout'
    });

    // 启动计时器
    this.startWorkoutTimer();
  },

  /**
   * 启动训练计时器
   */
  startWorkoutTimer() {
    this.data.workoutTimer = setInterval(() => {
      const duration = Math.floor((Date.now() - this.data.workoutStartTime) / 1000);
      this.setData({
        workoutDuration: duration
      });
    }, 1000);
  },

  /**
   * 停止训练计时器
   */
  stopWorkoutTimer() {
    if (this.data.workoutTimer) {
      clearInterval(this.data.workoutTimer);
      this.setData({
        workoutTimer: null
      });
    }
  },

  /**
   * 格式化训练时长
   */
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * 完成一组
   */
  completeSet(e) {
    const { exerciseIndex } = e.currentTarget.dataset;
    const { currentWorkout, currentSetIndex } = this.data;

    const exercise = currentWorkout.exercises[exerciseIndex];
    exercise.completedSets++;
    exercise.logs.push({
      set: currentSetIndex + 1,
      reps: exercise.reps,
      weight: exercise.weight,
      completedAt: new Date().getTime()
    });

    // 更新当前组数
    if (exercise.completedSets < exercise.sets) {
      this.setData({
        currentSetIndex: currentSetIndex + 1
      });
      showToast(`休息 ${exercise.restTime} 秒`);
    } else {
      // 当前动作完成，切换到下一个动作
      if (exerciseIndex < currentWorkout.exercises.length - 1) {
        this.setData({
          currentExerciseIndex: exerciseIndex + 1,
          currentSetIndex: 0
        });
        showToast('下一个动作');
      } else {
        // 所有动作完成
        this.completeWorkout();
      }
    }

    this.setData({
      currentWorkout
    });
  },

  /**
   * 完成训练
   */
  async completeWorkout() {
    this.stopWorkoutTimer();

    const { currentWorkout, workoutDuration } = this.data;
    const endTime = new Date().getTime();

    try {
      showLoading('保存训练记录...');

      const logData = {
        planId: currentWorkout.planId,
        planName: currentWorkout.planName,
        exercises: currentWorkout.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets,
          logs: ex.logs
        })),
        startTime: currentWorkout.startTime,
        endTime: endTime,
        duration: workoutDuration,
        createdAt: new Date().getTime()
      };

      await WorkoutLogService.create(logData);

      showToast('训练完成！');

      // 返回计划列表
      this.setData({
        currentTab: 'plans',
        currentWorkout: null,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        workoutDuration: 0
      });

      this.loadWorkoutHistory();

    } catch (error) {
      console.error('保存训练记录失败:', error);
      showToast('保存失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 放弃训练
   */
  async giveUpWorkout() {
    const confirmed = await showConfirm('确认放弃', '确定要放弃当前训练吗？');

    if (confirmed) {
      this.stopWorkoutTimer();

      this.setData({
        currentTab: 'plans',
        currentWorkout: null,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        workoutDuration: 0
      });
    }
  },

  /**
   * 跳转到训练详情
   */
  viewWorkoutDetail(e) {
    const { log } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/workout-detail/workout-detail?id=${log._id}`
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.stopWorkoutTimer();
  }
});
