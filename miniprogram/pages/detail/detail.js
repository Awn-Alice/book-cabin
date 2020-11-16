// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    curPage: 1,
    detailDom: '',
    isLoading: false,
    scrollTop: 0
  },
  clickLink(e) {
    // 执行此事件将不自动跳转
    e.detail.ignore();
    // a 标签的href值就是具体文章的请求路径
    wx.navigateTo({
      url: `/pages/article/article?url=${e.detail.href}`,
    })
  },
  prePage() {
    this.getDetail(this.data.code, this.data.curPage-1)
    this.setData({
      curPage: this.data.curPage-1,
      scrollTop: 0
    })
  },
  nextPage() {
    this.getDetail(this.data.code, this.data.curPage+1)
    this.setData({
      curPage: this.data.curPage+1,
      scrollTop: 0
    })
  },
  getDetail(code, page) {
    this.setData({ isLoading: true })
    wx.cloud.callFunction({
      name: 'getDetail',
      data: { code, page }
    }).then(res => {
      console.log(res, 'res')
      const dom = `<ul>${res.result}</ul>`
      this.setData({
        detailDom: dom,
        isLoading: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {code} = options
    this.setData({code: code})
    this.getDetail(code, this.data.curPage)
  }
})
