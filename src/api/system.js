
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
//菜单列表
export function menus() {
  return fetch({
    url: port_system.menus,
    method: 'post'
  })
}
//新增菜单
export function saveMenu(data) {
  return fetch({
    url: port_system.saveMenu,
    method: 'post',
    data
  })
}//删除菜单 -- 批量
export function batchDelMenu(data) {
  return fetch({
    url: port_system.batchDelMenu,
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


//用户列表
export function queryUUser(data) {
  return fetch({
    url: port_system.queryUUser,
    method: 'post',
    data
  })
}
//用户详情
export function queryUUserById(data) {
  return fetch({
    url: port_system.queryUUserById,
    method: 'post',
    data
  })
}
//删除用户
export function delUUser(data) {
  return fetch({
    url: port_system.delUUser,
    method: 'post',
    data
  })
}
//新增用户
export function addUUser(data) {
  return fetch({
    url: port_system.addUUser,
    method: 'post',
    data
  })
}
//获得区
export function selectArea(data) {
  return fetch({
    url: port_system.selectArea,
    method: 'post',
    data
  })
}
//配置用户角色
export function updateRoleUuser(data) {
  return fetch({
    url: port_system.updateRoleUuser,
    method: 'post',
    data
  })
}
//查看用户是否存在
export function checkUUser(data) {
  return fetch({
    url: port_system.checkUUser,
    method: 'post',
    data
  })
}
