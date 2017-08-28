
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