
import fetch from 'common/fetch'
import {port_record} from 'common/port_uri'

//拜访记录
export function planRecord(data) {
  return fetch({
    url: port_record.planRecord,
    method: 'post',
    data
  })
}
