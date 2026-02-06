// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'nightpump-8gl25q159083a62c', // 你的云开发环境ID
        traceUser: true,
      });
      console.log('云开发初始化成功');
    }

    // 检查更新
    this.checkUpdate();
  },

  checkUpdate() {
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      console.log('检查更新结果:', res.hasUpdate);
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(() => {
      console.log('新版本下载失败');
    });
  },

  globalData: {
    userInfo: null,
    cloudDB: null
  }
});
