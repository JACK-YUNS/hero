
import fetch from 'common/fetch'
import {port_feedback} from 'common/port_uri'

//反馈
export function feedbacks(data) {
  return fetch({
    url: port_feedback.feedbacks,
    method: 'post',
    data
  })
}
