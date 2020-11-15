// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { chapterNum, bookCode } = event
  // 跳转文章https://m.xiashuwu.com/272703/read_11.html
  const url = `/${bookCode}/read_${chapterNum}.html`
  // 文章正文在 articlecon font-normal 下面, nextinfo 类名的内容是 下一章/下一页 来区分是不是一章分两页
  const ret = await axios.get(`https://m.xiashuwu.com${url}`)
  const $ = cheerio.load(ret.data)
  $('.content .articlecon p').addClass('article_p')
  let firstContent = ''
  let secondContent = ''
  const nextBtnText = $('.nextinfo').eq(0).text()
  if (nextBtnText === '下一页') {
    // 如果有下一页，把最后一个p标签删掉
    $('.content .articlecon p').last().remove()
    firstContent = $('.content .articlecon').html()
    // 处理本章的第二页
    const ret2 = await axios.get(`https://m.xiashuwu.com${bookCode}/read_${chapterNum}_2.html`)
    const $_2 = cheerio.load(ret2.data)
    $_2('.content .articlecon p').addClass('article_p')
    secondContent = $_2('.content .articlecon').html()
  } else {
    firstContent = $('.content .articlecon').html()
  }
  
  return firstContent + secondContent
}