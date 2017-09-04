
import fetch from 'common/fetch'
import {port_journal} from 'common/port_uri'

//我的日志
export function journalpage(data) {
  return fetch({
    url: port_journal.journalpage,
    method: 'post',
    data
  })
}
