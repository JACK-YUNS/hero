/**
 * Created by zzmhot on 2017/3/23.
 *
 * 路由Map
 *
 * @author: zzmhot
 * @github: https://github.com/zzmhot
 * @email: zzmhot@163.com
 * @Date: 2017/3/23 18:30
 * @Copyright(©) 2017 by zzmhot.
 *
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//import components
//view page warp component
import viewPageComponent from 'pages/App'

//home
import homeComponent from 'pages/home'
//404
import noPageComponent from 'pages/error/404'
//login
import loginComponent from 'pages/user/login'
//base table
import baseTableComponent from 'pages/table/base'
//sort table
import sortTableComponent from 'pages/table/sort'
//save table
import saveTableComponent from 'pages/table/save'
//bar charts
import barChartsComponent from 'pages/charts/bar'
//barline charts
import barlineChartsComponent from 'pages/charts/barline'
//city charts
import CityComponent from 'pages/charts/city'
//list table
import ListComponent from 'pages/table/list'
//word table
import WordComponent from 'pages/table/word'
//post table
import PostComponent from 'pages/table/post'
//article table
import ArticleComponent from 'pages/table/article'
//example table
import ExampleComponent from 'pages/table/example'
//homeIndex table
import homeIndexComponent from 'pages/home/index'
//homeMenu table
import homeMenuComponent from 'pages/home/menu'
//homeRole table
import homeRoleComponent from 'pages/home/role'
//homeUser table
import homeUserComponent from 'pages/home/user'
//homeUseradd table
import homeUseraddComponent from 'pages/home/userAdd'
Vue.use(VueRouter)

//使用AMD方式加载
// component: resolve => require(['pages/home'], resolve),
const routes = [{
  path: '/404',
  name: 'notPage',
  component: noPageComponent
}, {
  path: '*',
  redirect: '/404'
}, {
  path: '/user/login',
  name: 'login',
  component: loginComponent
}, {
  path: '/',
  redirect: '/home',
  component: viewPageComponent,
  children: [{
    path: '/home',
    name: 'home',
    component: homeComponent,
    meta: {
      title: "资源管理",
      auth: true
    }
  }, {
    path: '/home/index',
    name: 'homeIndex',
    component: homeIndexComponent,
    meta: {
      title: "资源管理",
      auth: true
    }
  }, {
    path: '/home/menu',
    name: 'homeMenu',
    component: homeMenuComponent,
    meta: {
      title: "菜单管理",
      auth: true
    }
  }, {
    path: '/home/role',
    name: 'homeRole',
    component: homeRoleComponent,
    meta: {
      title: "人员列表",
      auth: true
    }
  }, {
    path: '/home/user',
    name: 'homeUser',
    component: homeUserComponent,
    meta: {
      title: "角色管理",
      auth: true
    }
  }, {
    path: '/home/userAdd',
    name: 'homeUseradd',
    component: homeUseraddComponent,
    meta: {
      title: "",
      auth: true
    }
  },{
    path: '/table/base',
    name: 'tableBase',
    component: baseTableComponent,
    meta: {
      title: "基本表格",
      auth: true
    }
  }, {
    path: '/table/sort',
    name: 'tableSort',
    component: sortTableComponent,
    meta: {
      title: "排序表格",
      auth: true
    }
  }, {
    path: '/table/update/:id',
    name: 'tableUpdate',
    component: saveTableComponent,
    meta: {
      title: "数据修改",
      auth: true
    }
  }, {
    path: '/table/add',
    name: 'tableAdd',
    component: saveTableComponent,
    meta: {
      title: "添加数据",
      auth: true
    }
  }, {
    path: '/charts/bar',
    name: 'chartsBar',
    component: barChartsComponent,
    meta: {
      title: "概况",
      auth: true
    }
  }, {
    path: '/charts/barline',
    name: 'chartsBar',
    component: barlineChartsComponent,
    meta: {
      title: "概况",
      auth: true
    }
  }, {
    path: '/charts/city',
    name: 'chartsBar',
    component: CityComponent,
    meta: {
      title: "城市分布",
      auth: true
    }
  }, {
    path: '/table/list',
    name: 'chartsBar',
    component: ListComponent,
    meta: {
      title: "排行榜",
      auth: true
    }
  }, {
    path: '/table/word',
    name: 'chartsBar',
    component: WordComponent,
    meta: {
      title: "金句",
      auth: true
    }
  }, {
    path: '/table/example',
    name: 'chartsBar',
    component: ExampleComponent,
    meta: {
      title: "模板",
      auth: true
    }
  }, {
    path: '/table/post',
    name: 'chartsBar',
    component: PostComponent,
    meta: {
      title: "海报",
      auth: true
    }
  }, {
    path: '/table/article',
    name: 'chartsBar',
    component: ArticleComponent,
    meta: {
      title: "文章",
      auth: true
    }
  }]
}]

const router = new VueRouter({
  routes,
  mode: 'hash', //default: hash ,history
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})

//全局路由配置
//路由开始之前的操作
router.beforeEach((to, from, next) => {
  NProgress.done().start()
  let toName = to.name
  // let fromName = from.name
  let is_login = store.state.user_info.login

  if (!is_login && toName !== 'login') {
    next({
      name: 'login'
    })
  } else {
    if (is_login && toName === 'login') {
      next({
        path: '/'
      })
    } else {
      next()
    }
  }
})

//路由完成之后的操作
router.afterEach(route => {
  NProgress.done()
})

export default router
