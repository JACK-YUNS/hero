
import fetch from 'common/fetch'
import {port_knowledge} from 'common/port_uri'

//列表
export function topicList(data) {
  return fetch({
    url: port_knowledge.topicList,
    method: 'post',
    data
  })
}
//save
export function saveTopic(data) {
  return fetch({
    url: port_knowledge.saveTopic,
    method: 'post',
    data
  })
}
//详情
export function getTopic(data) {
  return fetch({
    url: port_knowledge.getTopic,
    method: 'post',
    data
  })
}
