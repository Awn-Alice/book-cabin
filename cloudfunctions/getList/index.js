// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio');

cloud.init()

function getCode(aHref, query) {
  let bookCode = '', preCode = ''
  if (query) { // 从api/search/index/id/272703/type/m/中取出数字
    bookCode = aHref.match(/\d{2,}/g)[0]
  } else {
    bookCode = aHref.substring(1,aHref.length-1)
  }
  if(bookCode.length === 3) preCode = 0;
  if(bookCode.length === 4) preCode = bookCode.substr(0,1);
  if(bookCode.length === 5) preCode = bookCode.substr(0,2);
  if(bookCode.length === 6) preCode = bookCode.substr(0,3);
  if(bookCode.length === 7) preCode = bookCode.substr(0,4);
  return {bookCode, preCode}
}

// 云函数入口函数
exports.main = async (event, context) => {
  const {query, page} = event
  let firstBook = ''
  let $ = ''
  if (query) { // 查询的逻辑
    const name = encodeURIComponent(query)
    const ret = await axios.get(`https://m.xiashuwu.com/search.html?searchkey=${name}&searchtype=all`)
    $ = cheerio.load(ret.data);
    const aHref = $('.bookcover .pic a').attr('href')
    const title = $('.bookcover .title a').text()
    const author = $('.bookcover p').eq(0).text()
    const classify = $('.bookcover p').eq(1).text()
    const num = $('.bookcover p').eq(2).find('.num').text()
    const status = $('.bookcover .type').text()
    const time = $('.bookcover p').eq(4).text()
    $('.bookcover .pic img').addClass('book_cover img_item')
    $('.bookcover .pic img').attr('data-original', $('.bookcover .pic img').attr('src'))
    const pic = $('.bookcover .pic a').html()
    firstBook = `<li class='book_item'><a class='a_item' href='${aHref}'>
    ${pic}
    <p class='p_item book_title'>${title}</p>
    <p class='p_item'>${author}</p>
    <p class='p_item'>章数：${num}</p>
    <p class='p_item'>进度：${status}</p>
    <p class='p_item'>${time}</p>
    </a></li>`
    $('#ulist').prepend(firstBook)
  } else { // 列表页
    const ret = await axios.get(`https://m.xiashuwu.com/type/nan_0_0_allvisit_${page}.html`)
    $ = cheerio.load(ret.data);
  }
  
  $('#ulist p').addClass('p_item')
  $('#ulist li').addClass('book_item')
  $('#ulist a').addClass('a_item')
  $('#ulist img').addClass('img_item')
  $('#ulist li a').each(function() {
    const aHref = $(this).attr('href')
    if (aHref) {
      const img = $(this).find('img')
      img.attr('original-src', img.attr('src'))
      if (img.attr('data-original') && img.attr('data-original').indexOf('nocover') === -1) {
        const {bookCode, preCode} = getCode(aHref, query)
        img.attr('src', `https://img.xiashuwu.com/cover/${preCode}/${bookCode}.jpg`)
      } else {
        img.attr('src', 'https://img.xiashuwu.com/image/nocover.jpg')
      }
    }
  })
  
  const list = $('#ulist').html()
  return list
}
// https://static.xiashuwu.com/template/mobile/public/image/grey.gif
// https://static.xiashuwu.com/template/mobile/public/image/grey.gif
// https://img.xiashuwu.com/cover/288/288400.jpg