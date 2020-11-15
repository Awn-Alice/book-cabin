const { default: Axios } = require('axios')
// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')

cloud.init()
function getCataloglist(originDom) {
  const $ = cheerio.load(originDom)
  $('.cataloglist li').addClass('catalog_item')
  $('.cataloglist a').addClass('catalog_a')
  const list = $('.cataloglist').html()
  return list
}
// 云函数入口函数
exports.main = async (event, context) => {
  const { code, page } = event
  const ret = await axios.get(`https://m.xiashuwu.com/${code}/chapters.html?page=${page}`)
  const domStr = getCataloglist(ret.data)
    return domStr
}