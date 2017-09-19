
import fetch from 'common/fetch'
import {port_system} from 'common/port_uri'

//角色列表
export function roleList(data) {
  return fetch({
    url: port_system.roleList,
    method: 'post',
    data
  })
}
//菜单列表
export function menuList(data) {
  return fetch({
    url: port_system.menuList,
    method: 'post',
    data
  })
}
//新增菜单
export function saveMenu(data) {
  return fetch({
    url: port_system.saveMenu,
    method: 'post',
    data
  })
}
//新增角色
export function saveRole(data) {
  return fetch({
    url: port_system.saveRole,
    method: 'post',
    data
  })
}
//删除角色
export function delRole(data) {
  return fetch({
    url: port_system.delRole,
    method: 'post',
    data
  })
}
//角色配置权限
export function roleMenus(data) {
  return fetch({
    url: port_system.roleMenus,
    method: 'post',
    data
  })
}
//角色配置权限 -- 保存
export function updateRoleMenu(data) {
  return fetch({
    url: port_system.updateRoleMenu,
    method: 'post',
    data
  })
}
