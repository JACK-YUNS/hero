/**
 * Created by zzmhot on 2017/3/23.
 *
 * 主程序入口
 *
 * @author: zzmhot
 * @github: https://github.com/zzmhot
 * @email: zzmhot@163.com
 * @Date: 2017/3/23 18:19
 * @Copyright(©) 2017 by zzmhot.
 *
 */

//导入样式
import 'normalize.css'
import 'font-awesome/scss/font-awesome.scss'
import 'element-ui/lib/theme-default/index.css'
import 'bootstrap/js/modal.js'
import 'bootstrap/js/dropdown.js'
import 'bootstrap/js/tooltip.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import 'summernote'
import 'summernote/dist/lang/summernote-zh-CN.js'
import 'summernote/dist/summernote.css'
import '../static/ue/ueditor.config.js'
import '../static/ue/ueditor.all.min.js'
import '../static/ue/lang/zh-cn/zh-cn.js'
import '../static/ue/ueditor.parse.min.js'
//导入Vue框架
import Vue from 'vue'
//导入element组件
import ElementUI from 'element-ui'
//导入组件
import router from './router'
//导入状态管理器
import store from 'store'
//导入请求框架
import api from './api'
//导入自定义插件
import Plugins from 'plugins'
//导入主视图文件
import App from './App'
//导入mock数据
// import './mock'

//引入带样式编辑器
import VueQuillEditor from 'vue-quill-editor'

//使用vue-quill-editor
Vue.use(VueQuillEditor)

//使用element-ui
Vue.use(ElementUI)

//使用自定义插件
Vue.use(Plugins)

//使用api
Vue.use(api)

//发布后是否显示提示
Vue.config.productionTip = false

//是否开启工具调试
Vue.config.devtools = process.env.NODE_ENV === 'development'

new Vue({
  router,
  store,
  ...App
}).$mount('mainbody')

// main.js
router.beforeEach((to, from, next) => {
  if (store.getters.token) { // 判断是否有token
  if (to.path === '/login') {
    next({ path: '/' });
  } else {
    if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
      store.dispatch('GetInfo').then(res => { // 拉取info
        const roles = res.data.role;
      store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
      next(to.path); // hack方法 确保addRoutes已完成
    })
    }).catch(err => {
        console.log(err);
    });
    } else {
      next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
    }
  }
} else {
    next();
}
});
