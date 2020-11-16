const { default: Axios } = require('axios')
// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')

cloud.init()
function getCataloglist(originDom) {
  const $ = cheerio.load(originDom)
  // 获取目录列表
  $('.cataloglist li a').each(function(index,a){
    const title = $(this).find('span').eq(0).text()
    $(this).attr('title', title)
  })
  $('.cataloglist li').addClass('catalog_item')
  $('.cataloglist a').addClass('catalog_a')
  const catalogList = $('.cataloglist').html()
  // 获取分页梯
  const pageList = []
  $('#pagelist option').each(function(index,op){
    pageList.push($(this).text())
  })
  return {catalogList,pageList}
}
// 云函数入口函数
exports.main = async (event, context) => {
  const { code, page } = event
  const ret = await axios.get(`https://m.xiashuwu.com/${code}/chapters.html?page=${page}&sort=asc`)
  const {catalogList, pageList} = getCataloglist(ret.data)
  return {catalogList, pageList}
}