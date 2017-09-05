
import fetch from 'common/fetch'
import {port_verbal} from 'common/port_uri'

//话术
export function Verbalpge(data) {
  return fetch({
    url: port_verbal.Verbalpge,
    method: 'post',
    data
  })
}
