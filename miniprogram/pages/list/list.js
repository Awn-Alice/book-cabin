// miniprogram/pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listDom: '',
    curPage: 1,
    query: '',
    isSearch: false,
    scrollTop: 0,
    isLoading: false
  },
  
  clickLink(e) {
    // 执行此事件将不自动跳转
    e.detail.ignore();
    // 跳转详情页https://m.xiashuwu.com/288400/chapters.html
    let code = ''
    if (e.detail.href.startsWith('api')) {
      code = aHref.match(/\d{2,}/g)[0]
    } else {
      code = e.detail.href.substring(1, e.detail.href.length - 1)
    }
    wx.navigateTo({
      url: `/pages/detail/detail?code=${code}`,
    })
  },

  prePage() {
    this.getList(this.data.curPage-1)
    this.setData({
      curPage: this.data.curPage-1,
      scrollTop: 0
    })
  },
  nextPage() {
    this.getList(this.data.curPage+1)
    this.setData({
      curPage: this.data.curPage+1,
      scrollTop: 0
    })
  },
  getList(page) {
    if(!page) page = 1
    const query = this.data.query
    this.setData({ isLoading: true })
    wx.cloud.callFunction({
      name: 'getList',
      data: { page, query }
    }).then(res => {
      const dom = `<ul id='ulist' class='book_list'>${res.result}</ul>`
      this.setData({
        listDom: dom,
        isLoading: false
      })
    })
  },

  /**
   * 搜索功能
   */
  showSearch() {
    this.setData({ isSearch: true })
  },
  cancelSearch() {
    this.setData({ isSearch: false })
  },
  inputHandler(e) {
    this.setData({
      query: e.detail.value
    })
  },
  searchHandler(e) {
    if (e.detail.value === '123') {
      this.getList()
      // 收起键盘
      wx.hideKeyboard()
      this.getList()
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getList()
  }
})