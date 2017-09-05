
import fetch from 'common/fetch'
import {port_journal} from 'common/port_uri'
import {port_record} from 'common/port_uri'

//我发出的日志
export function journalpage(data) {
  return fetch({
    url: port_journal.journalpage,
    method: 'post',
    data
  })
}
//我收到的日志
export function logReceived(data) {
  return fetch({
    url: port_journal.logReceived,
    method: 'post',
    data
  })
}

