
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
//新增，更新
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
//评论
export function replayList(data) {
  return fetch({
    url: port_knowledge.replayList,
    method: 'post',
    data
  })
}
//长见识评论外层删除
export function delComment(data) {
  return fetch({
    url: port_knowledge.delComment,
    method: 'post',
    data
  })
}
//长见识评论内层删除
export function delReply(data) {
  return fetch({
    url: port_knowledge.delReply,
    method: 'post',
    data
  })
}
//文章详情
export function getTopicComment(data) {
  return fetch({
    url: port_knowledge.getTopicComment,
    method: 'post',
    data
  })
}
//删除
export function delTopic(data) {
  return fetch({
    url: port_knowledge.delTopic,
    method: 'post',
    data
  })
}
