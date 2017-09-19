<template>
<div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body">
		  <imp-panel>
		    <h3 class="box-title" slot="header" style="width: 100%;">
		      <el-button type="primary" icon="plus" @click="newAdd">新增</el-button>
		      <!--<el-button type="danger" icon="delete" @click="batchDelete">删除</el-button>-->

		    </h3>
		    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
		      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
		        <el-tree v-if="roleTree"
		                 :data="roleTree"
		                 ref="roleTree"
		                 highlight-current

		                 @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps"></el-tree>
		      </el-col>
		      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
		        <el-card class="box-card">
		          <div class="text item">
		            <el-form :model="form"  ref="form">
		              <el-form-item label="名称" :label-width="formLabelWidth">
		                <el-input v-model="form.name" auto-complete="off"></el-input>
		              </el-form-item>
		              <el-form-item label="" :label-width="formLabelWidth">
		                <el-button type="primary" :loading="on_submit_loading" @click="onSubmit" v-text="form.id?'修改':'新增'"></el-button>
		                <el-button type="info" @click="settingResource($event,form.id)" icon="setting" v-show="form.id && form.id!=null">配置目录
		                </el-button>
		                <el-button type="danger" @click="deleteSelected" icon="delete" v-show="form.id && form.id!=null">删除
		                </el-button>
		              </el-form-item>
		            </el-form>
		          </div>
		        </el-card>

		        <el-dialog title="配置资源" v-model="dialogVisible" size="tiny">
		          <div class="select-tree">
		          <el-scrollbar
		            tag="div"
		            class='is-empty'
		            wrap-class="el-select-dropdown__wrap"
		            view-class="el-select-dropdown__list">
		          <el-tree
		            :data="menuTree"
		            ref="menuTree"
		            show-checkbox

		            node-key="id"
		            v-loading="dialogLoading"
		            :props="defaultProps">
		          </el-tree>
		          </el-scrollbar>
		          </div>
		          <span slot="footer" class="dialog-footer">
		          <el-button @click="dialogVisible = false">取 消</el-button>
		          <el-button type="primary" @click="configRoleResources">确 定</el-button>
		          </span>
		        </el-dialog>
		      </el-col>
		    </el-row>
		  </imp-panel>
	</div>
</div>
</template>
<script>
	import {panelTitle} from 'components'
  import panel from "../../components/panel.vue"
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
    data(){
      return {
        dialogLoading:false,
        dialogVisible:false,
        on_submit_loading: false,
        formLabelWidth: '100px',
        defaultProps: {
          children: 'child',
          label: 'name',
          id: "id",
        },
        roleId:null,
        roleTree: [],
        menuTree:[],
        menuParent:[],
        defaultMenu:[],
        form: {
          id: null,
          name: '',
          type:'1'
        },
        temp:{}

      }
    },
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      panelTitle
    },
    created(){
      var _self = this;
      _self.get_table_data();
      _self.get_menu_data();

    },
    methods: {
      get_table_data(){
        var _self = this;
        _self.$fetch.api_system.roleList({})
          .then(response => {
          _self.roleTree = response.data;
          _self.load_data = false
        })
          .catch(() => {
            _self.load_data = false
          })
      },
      get_menu_data(){
        var _self = this;
        _self.$fetch.api_system.menuList({})
          .then(response => {
            _self.menuTree = response.data;
            response.data.forEach((item,index)=>{
              _self.menuParent.push(item.id);
            })
          })
          .catch(() => {
          })
      },
      configRoleResources(){
        var _self = this;
        var checkedKeys = this.$refs.menuTree.getCheckedNodes();
        var tempKeys = [];
        checkedKeys.forEach((item,index)=>{
          tempKeys.push(item.id);
          if(item.pid != null)tempKeys.push(item.pid);
        })
        tempKeys = tempKeys.unique();
        var menuIds = tempKeys.join(",");
        _self.$fetch.api_system.updateRoleMenu({"roleId":_self.roleId,"menuIds":menuIds})
          .then(({msg}) => {
            _self.$message.success(msg)
            _self.dialogVisible = false;
          })
          .catch(() => {
            _self.dialogVisible = false;
          })

      },
      handleNodeClick(data){
        var _self = this;
        _self.form.name = data.name;
        _self.form.id = data.id;
        _self.form.type = data.type;
        _self.temp = data;
      },
      newAdd(){
        this.form = {
          id: null,
          name: '',
          type: '1'
        };
      },
      batchDelete(){
        var checkKeys = this.$refs.roleTree.getCheckedKeys();
        if (checkKeys == null || checkKeys.length <= 0) {
          this.$message.warning('请选择要删除的资源');
          return;
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('http://localhost:8080/static/data.json' + "?roleIds=" + checkKeys.join(','))
            .then(res => {
              this.$message('操作成功');
              this.load();
            }).catch(e => {
            this.$message('操作成功');
            this.batchDeleteFromTree(this.roleTree, checkKeys);
          })
        });

      },
      onSubmit(){
          var _self = this;
          if(_self.form.name.trim().length<=3 || _self.form.name.trim().length>=15){
            this.$message({
              message: '请输入角色名称，长度在 3 到 15 个字符',
              type: 'warning'
            });
              return false;
          }
          _self.on_submit_loading = true
          _self.$fetch.api_system.saveRole(_self.form)
            .then(({msg}) => {
              _self.$message.success(msg)
              _self.on_submit_loading = false;

              _self.get_table_data();
            })
            .catch(() => {

            })
      },
      deleteSelected(){
          var _self = this;
        _self.on_submit_loading = true
          _self.$fetch.api_system.delRole({"id":_self.form.id})
            .then(({msg}) => {
              _self.$message.success(msg)
              _self.on_submit_loading = false;
              _self.newAdd();
              _self.get_table_data();
          })
          .catch(() => {

          })
      },
      settingResource(event,id){
          var _self = this;
          event.stopPropagation();
          this.dialogVisible = true;
          _self.defaultMenu = [];
          _self.roleId = id;
          _self.$fetch.api_system.roleMenus({"roleId":id})
            .then((response) => {
                response.data.forEach((item, index) => {
                  var indexOf = _self.menuParent.indexOf(item);
                  if(indexOf==-1)_self.defaultMenu.push(item+"");
                });
              _self.$refs.menuTree.setCheckedKeys( _self.defaultMenu);
            })
            .catch(() => {

            })
      }

    }

  }
</script>

<style>
  input[type=check]{disabled:disabled}
  .render-content {
    float: right;
    margin-right: 20px
  }

  .render-content i.fa {
    margin-left: 10px;
  }

  .render-content i.fa:hover{
    color: #e6000f;
  }

  .select-tree .el-scrollbar.is-empty .el-select-dropdown__list {
    padding: 0;
  }

  .select-tree .el-scrollbar {
    border: 1px solid #d1dbe5;
  }

  .select-tree .el-tree{
    border:0;
  }

</style>
