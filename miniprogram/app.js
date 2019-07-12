import Toast from './miniprogram_npm/vant-weapp/toast/toast';

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init()
    }

    this.globalData = {
      imgPath:"signinMiniPro/"
    }
  },

  /**
 * @action vant toast的loading提示
 * @params
 *  msg：内容；
 *  duration：展示时长；
 *  loadingType：加载图标类型,可选值为 spinner；
 *  mask：是否显示背景蒙层；
 *  forbidClick：是否禁止背景点击；
 * @use
 * html: <van-toast id="van-toast" />
 * js:
 * global.toastLoading();// 开启
 * global.toastLoading(false);// 关闭
 *
 */
  toastLoading: function (msg = '加载中...', duration = 0, loadingType = 'circular', mask = false, forbidClick = true) {
    if (arguments.length === 1 && !arguments[0]) {
      Toast.clear();
    } else {
      Toast.loading({
        message: msg,
        duration: duration,
        loadingType: loadingType,
        mask: false,
        forbidClick: true
      });
    }
  }
})
