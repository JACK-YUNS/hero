<template>
<div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body">
		  <imp-panel>
		    <h3 class="box-title" slot="header" style="width: 100%;">
		      <el-row style="width: 100%;">
		        <el-col :span="12">
		          <router-link :to="{ path: 'userAdd'}">
		            <el-button type="primary" icon="plus">新增</el-button>
		          </router-link>
		        </el-col>
		        <el-col :span="12">
		          <div class="el-input" style="width: 200px; float: right;">
		            <i class="el-input__icon el-icon-search"></i>
		            <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)"
		                   class="el-input__inner">
		          </div>
		        </el-col>
		      </el-row>
		    </h3>
		    <div slot="body">
		      <el-table
		        :data="table_data"
		        border
		        style="width: 100%"
            v-loading="load_data"
            element-loading-text="拼命加载中"
		        @selection-change="handleSelectionChange">
		        <el-table-column
		          prop="nickname"
		          label="登录用户名">
		        </el-table-column>
		        <el-table-column
		          prop="areaName"
		          label="所属区">
		        </el-table-column>
		        <el-table-column label="操作" width="285">
		          <template scope="scope">
		            <el-button
		              size="small"
		              type="default"
		              icon="edit"
		              @click="handleEdit(scope.$index, scope.row)">编辑
		            </el-button>
		            <el-button
		              size="small"
		              type="info"
		              icon="setting"
		              @click="handleRoleConfig(scope.$index, scope.row)">配置角色
		            </el-button>
		            <el-button
		              size="small"
		              type="danger"
		              @click="handleDelete(scope.$index, scope.row)">删除
		            </el-button>
		          </template>
		        </el-table-column>
		      </el-table>

		      <el-pagination
		        @size-change="handleSizeChange"
		        @current-change="handleCurrentChange"
		        :current-page="currentPage"
		        :page-sizes="[5, 10, 20]"
		        :page-size="length"
		        layout="total, sizes, prev, pager, next"
		        :total="total">
		      </el-pagination>

		      <el-dialog title="配置用户角色" v-model="dialogVisible" size="tiny">
		        <div class="select-tree">
		          <el-scrollbar
		            tag="div"
		            class='is-empty'
		            wrap-class="el-select-dropdown__wrap"
		            view-class="el-select-dropdown__list">
                <!--<ul v-for="item in roleTree">-->
                  <!--<li :class="choose(item.id)" style="padding-left: 15px;height: 30px;line-height: 30px;border-bottom: 1px solid #ebebeb;">{{item.name}}</li>-->
                <!--</ul>-->
		            <el-tree
		              ref="roleTree"
		              :data="roleTree"
		              check-strictly
                  show-checkbox
                  highlight-current
		              node-key="id"
                  v-loading="dialogLoading"
                  current-change=""
		              :props="defaultProps">
		            </el-tree>
		          </el-scrollbar>
		        </div>
		        <span slot="footer" class="dialog-footer">
		          <el-button @click="dialogVisible = false">取 消</el-button>
		          <el-button type="primary" @click="configUserRoles">确 定</el-button>
		          </span>
		      </el-dialog>
		    </div>


		  </imp-panel>
		</div>
	</div>
</template>

<script>
	import {panelTitle} from 'components'
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import selectTree from "../../components/selectTree.vue"
  import treeter from "../../components/treeter"
  import axios from 'axios';

  Array.prototype.unique = function(){
    var res = [];
    var json = {};
    for(var i = 0; i < this.length; i++){
      if(!json[this[i]]){
        res.push(this[i]);
        json[this[i]] = 1;
      }
    }
    return res;
  };
  Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      panelTitle
    },
    data(){
      return {
        currentRow: {},
        dialogVisible: false,
        dialogLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        roleTree: [],
        uid:"",
        defaultRole:[],
        listLoading: false,
        searchKey: '',
        table_data: [],
        //当前页码
        currentPage: 1,
        //数据总条目
        total: 0,
        //每页显示多少条数据
        length: 5,
        load_data: true
      }
    },
    created(){
      var _self = this;
      _self.get_table_data();
      _self.get_role_data();
    },
    methods: {
      get_table_data(){
        var _self = this;
        _self.load_data = true;
        _self.$fetch.api_system.queryUUser({
          current: _self.currentPage,
          pageSize: _self.length,
          nickName:_self.searchKey
        })
          .then(response => {
            _self.table_data = response.data.records;
            _self.currentPage = response.data.current;
            _self.total = response.data.total;
            _self.load_data = false;
          })
          .catch(() => {
            _self.load_data = false;
          })
      },
      get_role_data(){
        var _self = this;
        _self.$fetch.api_system.roleList({})
          .then(response => {
            _self.roleTree = response.data;
          })
          .catch(() => {
          })
      },
      search(target){
        var _self = this;
        _self.get_table_data();
      },
      handleSelectionChange(val){

      },
      handleRoleConfig(index, row){
        var _self = this;
        _self.currentRow = row;
        _self.dialogVisible = true;
        _self.uid = row.id;
        setTimeout(() => {
          _self.defaultRole = [];
          for(var i=0;i<row.roleStrlist.length;i++){
            _self.defaultRole.push(row.roleStrlist[i]);
          }
          this.$refs.roleTree.setCheckedKeys(_self.defaultRole);
        },500);


      },
      configUserRoles(){
        var _self = this;
        var checkedKeys = _self.$refs.roleTree.getCheckedKeys();
        var tempKeys = [];
        checkedKeys.forEach((item,index)=>{
          tempKeys.push(item+"");
        })
        tempKeys = tempKeys.unique();
        var rids = tempKeys.join(",");
        _self.$fetch.api_system.updateRoleUuser({"uid":_self.uid,"rids":rids})
          .then(({msg}) => {
            _self.$message.success(msg)
            _self.get_table_data();
            _self.dialogVisible = false;
          })
          .catch(() => {
            _self.dialogVisible = false;
          })

      },
      handleSizeChange(val) {
          var _self = this;
        _self.length = val;
        _self.get_table_data();
      },
      handleCurrentChange(val) {
        var _self = this;
        _self.currentPage = val;
        _self.get_table_data();
      },
      handleEdit(index, row){
        this.$router.push({path: 'userAdd', query:{id: row.id}})
      },
      handleDelete(index, row){
        var _self = this;
        _self.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.$fetch.api_system.delUUser({"id":row.id})
            .then(({msg}) => {
              _self.$message.success(msg)
              _self.get_table_data();
            })
            .catch(() => {

            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });;
      }
    }

  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .choose{background-color: #e6effb}
</style>
