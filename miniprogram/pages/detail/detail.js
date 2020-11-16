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
    scrollTop: 0,
    // 分页梯
    pageIndex: 0,
    pageList: []
  },
  clickLink(e) {
    // 执行此事件将不自动跳转
    e.detail.ignore();
    // a 标签的href值就是具体文章的请求路径
    console.log(e.detail.title)
    const title = unescape(e.detail.title.replace(/&#x/g,'%u').replace(/;/g,''))
    wx.navigateTo({
      url: `/pages/article/article?url=${e.detail.href}&title=${title}`,
    })
  },
  prePage() {
    this.getDetail(this.data.curPage-1)
    this.setData({
      curPage: this.data.curPage-1,
      scrollTop: 0
    })
  },
  nextPage() {
    this.getDetail(this.data.curPage+1)
    this.setData({
      curPage: this.data.curPage+1,
      scrollTop: 0
    })
  },
  bindPickerChange(e) {
    console.log(e.detail)
    this.getDetail(e.detail.value/1 + 1)
    this.setData({ pageIndex: e.detail.value, scrollTop: 0 })
  },
  getDetail(page, code) {
    if(!code) code = this.data.code
    this.setData({ isLoading: true })
    wx.cloud.callFunction({
      name: 'getDetail',
      data: { code, page }
    }).then(res => {
      console.log(res.result)
      const {catalogList, pageList} = res.result
      const dom = `<ul>${catalogList}</ul>`
      if(this.data.pageList.length === 0) this.setData({ pageList })
      this.setData({
        detailDom: dom,
        isLoading: false,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {code} = options
    this.setData({code: code})
    this.getDetail(1)
  }
})
