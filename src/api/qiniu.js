
import fetch from 'common/fetch'
import {port_qiniu} from 'common/port_uri'



//获取token上传图片
export function getToken(data) {
  return fetch({
    url: port_qiniu.getToken,
    method: 'post',
    data
  })
}