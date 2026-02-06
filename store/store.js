// store/store.js - 简单的状态管理
class Store {
  constructor() {
    this.state = {
      user: null,
      currentWorkout: null,
      workoutPlans: [],
      workoutLogs: [],
      bodyData: [],
      exercises: [],
      reminder: null
    };
    this.listeners = [];
  }

  // 获取状态
  getState() {
    return this.state;
  }

  // 更新状态
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // 订阅状态变化
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // 通知所有监听者
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

const store = new Store();

module.exports = store;
