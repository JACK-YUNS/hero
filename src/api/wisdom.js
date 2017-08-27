
import fetch from 'common/fetch'
import {port_wechat} from 'common/port_uri'

//模板详情
export function settings(data) {
  return fetch({
    url: port_wisdom.settings,
    method: 'post',
    data
  })
}