
import fetch from 'common/fetch'
import {port_wechat} from 'common/port_uri'

//文章列表
export function articleList(params) {
  return fetch({
    url: port_wechat.articleList,
    method: 'get',
    params
  })
}

//海报列表
export function posterList(params) {
  return fetch({
    url: port_wechat.posterList,
    method: 'get',
    params
  })
}

//模板列表
export function templateList(params) {
  return fetch({
    url: port_wechat.templateList,
    method: 'get',
    params
  })
}
//图文列表
export function imageTextList(params) {
  return fetch({
    url: port_wechat.imageTextList,
    method: 'get',
    params
  })
}
//批量删除
export function batch_del(data) {
  return fetch({
    url: port_table.batch_del,
    method: 'post',
    data
  })
}

