
import fetch from 'common/fetch'
import {port_theme} from 'common/port_uri'

//专题列表
export function themeList(data) {
  return fetch({
    url: port_theme.themeList,
    method: 'post',
    data
  })
}
//专题详情
export function themeById(data) {
  return fetch({
    url: port_theme.themeById,
    method: 'post',
    data
  })
}
//专题删除
export function delTheme(data) {
  return fetch({
    url: port_theme.delTheme,
    method: 'post',
    data
  })
}
//专题更新
export function addTheme(data) {
  return fetch({
    url: port_theme.addTheme,
    method: 'post',
    data
  })
}
//专题搜索
export function queryAll(data) {
  return fetch({
    url: port_theme.queryAll,
    method: 'post',
    data
  })
}
//专题排序
export function themeSort(data) {
  return fetch({
    url: port_theme.themeSort,
    method: 'post',
    data
  })
}
