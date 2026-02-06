// services/cloud.js - 微信云开发服务
const db = wx.cloud.database();

const CloudService = {
  // 通用查询方法
  async query(collection, options = {}) {
    try {
      let query = db.collection(collection);

      // 添加查询条件
      if (options.where) {
        query = query.where(options.where);
      }

      // 排序
      if (options.orderBy) {
        query = query.orderBy(options.orderBy, options.order || 'desc');
      }

      // 限制数量
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const result = await query.get();
      return result.data;
    } catch (error) {
      console.error('查询失败:', error);
      throw error;
    }
  },

  // 添加文档
  async add(collection, data) {
    try {
      const result = await db.collection(collection).add({
        data: {
          ...data,
          createdAt: db.serverDate(),
        }
      });
      return { _id: result._id, ...data };
    } catch (error) {
      console.error('添加失败:', error);
      throw error;
    }
  },

  // 更新文档
  async update(collection, id, data) {
    try {
      await db.collection(collection).doc(id).update({
        data: {
          ...data,
          updatedAt: db.serverDate(),
        }
      });
      return { _id: id, ...data };
    } catch (error) {
      console.error('更新失败:', error);
      throw error;
    }
  },

  // 删除文档
  async remove(collection, id) {
    try {
      await db.collection(collection).doc(id).remove();
      return true;
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  },

  // 获取单个文档
  async getById(collection, id) {
    try {
      const result = await db.collection(collection).doc(id).get();
      return result.data;
    } catch (error) {
      console.error('获取失败:', error);
      throw error;
    }
  }
};

// 训练计划服务
const WorkoutPlanService = {
  async create(plan) {
    return CloudService.add('workout_plans', plan);
  },

  async getAll() {
    return CloudService.query('workout_plans', {
      orderBy: 'createdAt',
      order: 'desc'
    });
  },

  async getTemplates() {
    return CloudService.query('workout_plans', {
      where: { isTemplate: true },
      orderBy: 'createdAt',
      order: 'desc'
    });
  },

  async update(id, data) {
    return CloudService.update('workout_plans', id, data);
  },

  async delete(id) {
    return CloudService.remove('workout_plans', id);
  }
};

// 训练记录服务
const WorkoutLogService = {
  async create(log) {
    return CloudService.add('workout_logs', log);
  },

  async getAll(options = {}) {
    return CloudService.query('workout_logs', {
      orderBy: 'date',
      order: 'desc',
      ...options
    });
  },

  async update(id, data) {
    return CloudService.update('workout_logs', id, data);
  },

  async delete(id) {
    return CloudService.remove('workout_logs', id);
  }
};

// 身体数据服务
const BodyDataService = {
  async create(data) {
    return CloudService.add('body_data', data);
  },

  async getAll() {
    return CloudService.query('body_data', {
      orderBy: 'date',
      order: 'desc'
    });
  },

  async getLatest() {
    const result = await CloudService.query('body_data', {
      orderBy: 'date',
      order: 'desc',
      limit: 1
    });
    return result[0] || null;
  },

  async update(id, data) {
    return CloudService.update('body_data', id, data);
  }
};

// 动作库服务
const ExerciseService = {
  async getAll() {
    return CloudService.query('exercises');
  },

  async getById(id) {
    return CloudService.getById('exercises', id);
  }
};

// 提醒服务
const ReminderService = {
  async get() {
    const result = await CloudService.query('reminders', { limit: 1 });
    return result[0] || null;
  },

  async update(id, data) {
    return CloudService.update('reminders', id, data);
  },

  async create(data) {
    return CloudService.add('reminders', data);
  }
};

module.exports = {
  CloudService,
  WorkoutPlanService,
  WorkoutLogService,
  BodyDataService,
  ExerciseService,
  ReminderService
};
