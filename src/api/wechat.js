
import fetch from 'common/fetch'
import {port_wechat} from 'common/port_uri'

//文章列表
export function articleList(data) {
  return fetch({
    url: port_wechat.articleList,
    method: 'post',
    data
  })
}

//海报列表
export function posterList(data) {
  return fetch({
    url: port_wechat.posterList,
    method: 'post',
    data
  })
}

//模板列表
export function templateList(data) {
  return fetch({
    url: port_wechat.templateList,
    method: 'post',
    data
  })
}
//图文列表
export function imageTextList(data) {
  return fetch({
    url: port_wechat.imageTextList,
    method: 'post',
    data
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
//金句详情
export function findImageById(data) {
  return fetch({
    url: port_wechat.findImageById,
    method: 'post',
    data
  })
}
//金句单个删除
export function delImage(data) {
  return fetch({
    url: port_wechat.delImage,
    method: 'post',
    data
  })
}
//海报详情
export function findPosterById(data) {
  return fetch({
    url: port_wechat.findPosterById,
    method: 'post',
    data
  })
}
//文章详情
export function findArticleById(data) {
  return fetch({
    url: port_wechat.findArticleById,
    method: 'post',
    data
  })
}
//更新、新增数据
export function saveImage(data) {
  return fetch({
    url: port_wechat.saveImage,
    method: 'post',
    data
  })
}
//海报更新、新增数据
export function savePoster(data) {
  return fetch({
    url: port_wechat.savePoster,
    method: 'post',
    data
  })
}
//模板详情
export function findTemplateById(data) {
  return fetch({
    url: port_wechat.findTemplateById,
    method: 'post',
    data
  })
}
//设置模板
export function setTemplate(data) {
  return fetch({
    url: port_wechat.setTemplate,
    method: 'post',
    data
  })
}