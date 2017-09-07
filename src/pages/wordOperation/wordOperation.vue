<template>
  <div class="panel">
    <panel-title :title="$route.meta.title">
      <!--<el-button @click.stop="on_refresh" size="small">
        <i class="fa fa-refresh"></i>
      </el-button>
      <router-link :to="{name: 'tableAdd'}" tag="span">
        <el-button type="primary" icon="plus" size="small">添加数据</el-button>
      </router-link>-->
    </panel-title>
    <div class="panel-body">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.title" placeholder="请输入标题查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSubmit" :loading="on_submit_loading">查询</el-button>
          <router-link :to="{name: 'wordOperationAdd',params: {id: ''}}" tag="span">
            <el-button type="success">新建</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="table_data"
      v-loading="load_data"
      element-loading-text="拼命加载中"
      border
      style="width: 100%;">
      <!--<el-table-column
        type="selection"
        width="55">
      </el-table-column>-->
      <el-table-column
        type="index"
        label="序号"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="主标题"
      >
        <template scope="props">
          <router-link :to="{name: 'wordOperationAdd',params: {id: props.row.id,title:props.row.id,content:props.row.content,sort:props.row.sort}}" tag="span">
            <span class="link-type">{{props.row.title}}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column
        label="排序">
        <template scope="props">
          <span class="link-type" @click="handleUpdate(props.row)">{{props.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="aTime"
        :formatter="dateFormat"
        label="创建时间">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >
        <template scope="props">
          <el-button type="danger" size="small" icon="delete" @click="delete_data(props.$index,props.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑排序" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="排序">
          <el-input v-model="sort" @blur="inputsort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="create(temp.id)">确 定</el-button>
      </div>
    </el-dialog>

    <bottom-tool-bar>
      <!--<el-button
        type="danger"
        icon="delete"
        size="small"
        :disabled="batch_select.length === 0"
        @click="on_batch_del"
        slot="handler">
        <span>批量删除</span>
      </el-button>-->
      <div slot="page">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size=length
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </bottom-tool-bar>
  </div>
</template>
<script type="text/javascript">
  import {panelTitle, bottomToolBar} from 'components'
  import moment from "moment"
  import axios from 'axios';

  export default{
    data(){

      return {
        formInline: {
          title: '',
          isTop: '',
          assortmentType: '',
          templateId: ''
        },
        on_submit_loading: false,
        dialogFormVisible: false,
        template_type: [],
        dialogStatus: '',
        dialogPvVisible: false,

        temp: {
          id: '',
          importance: 0,
          remark: '',
          timestamp: 0,
          title: '',
          subtitle:'',
          type: '',
          status: 'published'
        },
        formLabelWidth: '120px',
        timeout:  null,
//    	el: '#test',
        table_data: [],
        //当前页码
        currentPage: 1,
        //数据总条目
        total: 0,
        //每页显示多少条数据
        length: 15,
        //请求时的loading效果
        load_data: true,
        //批量选择数组
        batch_select: [],
        //模板类型
        type:1,
        currentId:'',
        sort:''

      }
    },
    components: {
      panelTitle,
      bottomToolBar
    },
    computed: {

    },
    created(){
      var _self = this;
      _self.get_table_data();
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    methods: {
      //时间格式化
      dateFormat:function(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },

      topFormat:function(row, column) {
        var isTop = row[column.property];
        return isTop == 0 ? '是':'否';
      },
      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
        var _self = this;
        _self.load_data = true
        _self.$fetch.api_verbal.verbalpage({
          current: _self.currentPage,
          pageSize: _self.length,
          title:_self.formInline.title
        })
          .then(response => {
            var list = response.data.records;
            $.each(list, function(index, value, array) {
//						 console.log(list[index].id)
            });
            this.table_data =list
            this.currentPage = response.data.current
            this.total = response.data.total
            this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },
      //提交
      onSubmit() {
        this.load_data = true
        this.get_table_data();
      },
      //单个删除
      delete_data(item,id){
        //当前点击的文章id
        this.currentId = this.table_data[item].id;

        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((id) => {
            this.load_data = true;
            try{
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.table_data.splice(item, 1);
              this.load_data = false;
            }catch(err){
              this.$message({
                type: 'error',
                message: err.message
              });
              console.log('删除失败')
            }
            var data = {"id":this.currentId,"flag":-1}
            this.$fetch.api_verbal.newly(data)
              .then(({msg}) => {
                this.get_table_data()
                this.$message.success(msg)
              })
              .catch(() => {
              })
          })
          .catch(() => {
          })
      },
      //页码选择
      handleCurrentChange(val) {
        this.currentPage = val
        this.get_table_data()
      },

      //跟换排序里面的值
      inputsort(){
        console.log(this.sort)
      },

      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.sort =this.temp.sort;

      },
      create() {
        this.dialogFormVisible = false
//    	console.log(this.temp.id)
        this.$fetch.api_verbal.newly({
          sort:this.sort,
          id:this.temp.id
        })
          .then(response => {
            this.get_table_data()
          })
          .catch(() => {
            this.load_data = false
          })

      }
    },

    mounted() {

    }
  }
</script>
<style scoped="scoped">
  .el-select{margin-bottom: 10px;}
  .el-autocomplete{margin-bottom: 10px;}
  .link-type{color: #007ACC;}
</style>
