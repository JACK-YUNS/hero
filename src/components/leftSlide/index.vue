<template>
  <div class="left-side">
    <div class="left-side-inner">
      <router-link to="/" class="logo block">
        <img src="./images/logo.png" alt="智多保运营平台">
      </router-link>
      <el-menu
        class="menu-box"
        theme="dark"
        router
        unique-opened
        :default-active="$route.path">
        <div
          v-for="(item, index) in nav_menu_data"
          :key="index">
          <el-menu-item
            class="menu-list"
            v-if="typeof item.child === 'undefined'"
            :index="item.path">
            <i class="icon fa" :class="item.icon"></i>
            <span v-text="item.title" class="text"></span>
          </el-menu-item>
          <el-submenu
            :index="item.path"
            v-else>
            <template slot="title">
              <i class="icon fa" :class="item.icon"></i>
              <span v-text="item.title" class="text"></span>
            </template>
            <el-menu-item
              class="menu-list"
              v-for="(sub_item, sub_index) in item.child"
              :index="sub_item.path"
              :key="sub_index">
              <!--<i class="icon fa" :class="sub_item.icon"></i>-->
              <span v-text="sub_item.title" class="text"></span>
            </el-menu-item>
          </el-submenu>
        </div>
      </el-menu>
    </div>
  </div>
</template>
<script type="text/javascript">
import store from 'store'
export default{
    name: 'slide',
    data(){
      return {
          nav_menu_data: []
      }
    },
    created(){
        this.getUser()
    },
    methods:{
      getUser(){
        let is_loginName = store.state.user_info.user.name
        console.log(is_loginName)
        if(is_loginName!='admin'){
            this.nav_menu_data=[{
              title: "智慧营业区",
              path: "/business",
              icon: "fa-list",
              child: [{
                title: "基本设置",
                path: "/business/basic"
              }, {
                title: "早会流程",
                path: "/business/goodmorning"
              }, {
                title: "团队风采",
                path: "/business/team"
              }]
            }]
        }else {
          this.nav_menu_data=[{
            title: "智慧营业区",
            path: "/business",
            icon: "fa-list",
            child: [{
              title: "基本设置",
              path: "/business/basic"
            }, {
              title: "早会流程",
              path: "/business/goodmorning"
            }, {
              title: "团队风采",
              path: "/business/team"
            },{
              title: "长见识",
              path: "/business/knowledge"
            }]
          },{
            title: "系统管理",
            path: "/home",
            icon: "fa-home",
            child: [{
              title: "资源管理",
              path: "/home/index"
            }, {
              title: "菜单管理",
              path: "/home/menu"
            }, {
              title: "人员列表",
              path: "/home/role"
            }, {
              title: "用户管理",
              path: "/home/user"
            }]
          }, {
            title: "人员",
            path: "/list",
            icon: "fa-table",
            child: [{
              title: "概况",
              path: "/charts/barline"
            }, {
              title: "城市分布",
              path: "/charts/city"
            }, {
              title: "人员列表",
              path: "/table/base"
            }]
          }, {
            title: "活动",
            path: "/charts",
            icon: "fa-bar-chart-o",
            child: [{
              title: "概况",
              path: "/charts/bar"
            }, {
              title: "区域活动统计",
              path: "/table/sort"
            }, {
              title: "排行榜",
              path: "/table/list"
            }]
          }, {
            title: "朋友圈",
            path: "/table",
            icon: "el-icon-picture ",
            child: [{
              title: "金句",
              path: "/table/word"
            }, {
              title: "海报",
              path: "/table/post"
            }, {
              title: "文章",
              path: "/table/article"
            }, {
              title: "模板",
              path: "/table/example"
            }]
          },{
            title: "运营管理",
            path: "/wordOperation",
            icon: "el-icon-message ",
            child: [{
              title: "话术",
              path: "/wordOperation/wordOperation"
            },{
              title: "反馈",
              path: "/wordOperation/feedBack"
            }]
          }]
        }
      },
    }

//    let is_login = store.state.user_info.login
//    console.log(is_login)
  }
</script>
