
import fetch from 'common/fetch'
import {port_cloudDisk} from 'common/port_uri'

//云盘列表
export function cloudList(data) {
  return fetch({
    url: port_cloudDisk.cloudList,
    method: 'post',
    data
  })
}
//云盘上传
export function addFile(data) {
  return fetch({
    url: port_cloudDisk.addFile,
    method: 'post',
    data
  })
}
//云盘文件删除
export function delFile(data) {
  return fetch({
    url: port_cloudDisk.delFile,
    method: 'post',
    data
  })
}
//云盘文件下载
export function downloadFile(data) {
  return fetch({
    url: port_cloudDisk.downloadFile,
    method: 'post',
    data
  })
}
