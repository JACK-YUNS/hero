
import fetch from 'common/fetch'
import {port_verbal} from 'common/port_uri'

//话术
export function verbalpage(data) {
  return fetch({
    url: port_verbal.verbalpage,
    method: 'post',
    data
  })
}

//话术更新、新建、删除
export function newly(data) {
  return fetch({
    url: port_verbal.newly,
    method: 'post',
    data
  })
}
