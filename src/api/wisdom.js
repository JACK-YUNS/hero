
import fetch from 'common/fetch'
import {port_wisdom} from 'common/port_uri'

//智慧营业区获取基本信息
export function settings(data) {
  return fetch({
    url: port_wisdom.settings,
    method: 'post',
    data
  })
}
//智慧营业区更新基本信息
export function updateSettings(data) {
  return fetch({
    url: port_wisdom.updateSettings,
    method: 'post',
    data
  })
}
//智慧营业区获取早会流程 当前时间的后7天的
export function earlyMettingList(data) {
  return fetch({
    url:port_wisdom.earlyMettingList,
    method: 'post',
    data
  })
}
//更新或者新增，删除写flag=-1
export function saveEarlyMetting(data) {
  return fetch({
    url:port_wisdom.saveEarlyMetting,
    method: 'post',
    data
  })
}
//获得相册列表
export function albumList(data) {
  return fetch({
    url:port_wisdom.albumList,
    method: 'post',
    data
  })
}
//新增或者保存
export function saveAlbum(data) {
  return fetch({
    url:port_wisdom.saveAlbum,
    method: 'post',
    data
  })
}
//删除相册
export function delAlbum(data) {
  return fetch({
    url:port_wisdom.delAlbum,
    method: 'post',
    data
  })
}
//返回照片列表 -- 无分页
export function photoList(data) {
  return fetch({
    url:port_wisdom.photoList,
    method: 'post',
    data
  })
}
//保存相片--批量，单张，删除传flag=-1
export function savePhoto(data) {
  return fetch({
    url:port_wisdom.savePhoto,
    method: 'post',
    data
  })
}
//一键清除所有的相片名称
export function cleanPhotoName(data) {
  return fetch({
    url:port_wisdom.cleanPhotoName,
    method: 'post',
    data
  })
}
//设置封面
export function setCover(data) {
  return fetch({
    url:port_wisdom.setCover,
    method: 'post',
    data
  })
}
