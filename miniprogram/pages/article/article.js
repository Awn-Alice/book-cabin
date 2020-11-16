// miniprogram/pages/article/article.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 100,
    content: '',
    isRender: false,
    chapterNum: '',
    bookCode: '',
    isLoading: false
  },
  contentLoaded() {
    this.setData({ isRender: true })
  },
  preChapter() {
    this.getContent(this.data.chapterNum - 1)
    this.setData({ chapterNum: this.data.chapterNum - 1 })
  },
  nextChapter() {
    this.getContent(this.data.chapterNum/1 + 1)
    this.setData({ chapterNum: this.data.chapterNum/1 + 1, scrollTop: 0 })
  },
  goToDetail() {
    wx.navigateTo({
      url: `/pages/detail/detail?code=${this.data.bookCode}`,
    })
  },
  getContent(chapterNum, bookCode) {
    if(!bookCode) bookCode = this.data.bookCode
    this.setData({ isLoading: true })
    wx.cloud.callFunction({
      name: 'getArticle',
      data: { chapterNum, bookCode }
    }).then(res => {
      const {title, content} = res.result
      wx.setNavigationBarTitle({ title })
      this.setData({
        content,
        isLoading: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {url,title} = options
    // wx.setNavigationBarTitle({ title })
    // const url = '/272703/read_5.html'
    const chapterNum = url.match(/read_(\S*).html/)[1]
    const bookCode = url.match(/(\S*)read_/)[1];

    this.setData({chapterNum, bookCode})
    this.getContent(chapterNum, bookCode)
    // 等接口返回content后，再让下面的导航显示出来
    setTimeout(() => {
      if (!this.data.isRender) {
        this.setData({ isRender: true })
      }
    }, 5000);
  }
})
