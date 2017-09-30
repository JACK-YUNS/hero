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
        <!--<el-form-item>-->
          <!--<el-select v-model="formInline.isTop" placeholder="首页">-->
            <!--<el-option label="全部" value=""></el-option>-->
            <!--<el-option label="是" value="0"></el-option>-->
            <!--<el-option label="否" value="1"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-select v-model="formInline.assortmentType" placeholder="是否分类">-->
            <!--<el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.id"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-select v-model="formInline.templateId" placeholder="模板">-->
            <!--<el-option label="全部" value="">选择模版</el-option>-->
            <!--<el-option v-for="item in template_type" :label="item.title" :value="item.id" :key="item.id"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="success" @click="onSubmit" :loading="on_submit_loading">查询</el-button>
          <router-link :to="{name: 'specialTopicAdd',params: {id: ''}}" tag="span">
            <el-button type="success">新建</el-button>
          </router-link>
        </el-form-item>
      </el-form>


    <el-table
      :data="table_data"
      v-loading="load_data"
      element-loading-text="拼命加载中"
      border
      @selection-change="on_batch_select"
      style="width: 100%;">
      <!--<el-table-column
        type="selection"
        width="55">
      </el-table-column>-->
      <el-table-column
        type="index"
        label="序号"
        width="80"
      >
      </el-table-column>
      <el-table-column
        label="专题名称"
        :show-overflow-tooltip=true
      >
        <template scope="props">
          <router-link :to="{name: 'specialTopicAdd',params: {id: props.row.id}}" tag="span">
            <span class="link-type">{{props.row.title}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="info"
        label="专题内容"
        :show-overflow-tooltip=true
      >
      </el-table-column>
      <el-table-column
        label="专题类型"
        :show-overflow-tooltip=true
      >
        <template scope="props">
            <span v-if="props.row.type==1">普通专题</span>
             <span v-else>倒计时专题 ( {{props.row.endTime | dateFormat}} )</span>
        </template>
      </el-table-column>

      <el-table-column

        label="排序"
        width="120"
        :show-overflow-tooltip=true>
        <template scope="props">
          <span class="link-type" @click="handleUpdate(props.row)">{{props.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="aTime"
        :formatter="dateFormat"
        label="创建时间"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template scope="props">
          <router-link :to="{name: 'specialTopicAdd',params: {id: props.row.id}}" tag="span">
            <el-button type="primary" size="small" >编辑</el-button>
          </router-link>
          <el-button type="danger" size="small" icon="delete" @click="delete_data(props.$index,props.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="" :visible.sync="dialogTableVisible">
      <el-table :data="template_type" border>
        <!--<el-table-column property="index" label="序号" width="150"></el-table-column>-->
        <el-table-column property="title" label="主标题" ></el-table-column>
        <!--<el-table-column property="type" label="类型"></el-table-column>-->
        <el-table-column label="操作" width="200">
          <template scope="props">
            <el-button type="info" size="small" icon="edit"  @click="addTemplate(props.row.id)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="编辑排序" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="排序">
          <el-input-number v-model="sort"  :min="0"  :maxlength=5></el-input-number>
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
          info: '',
          templateId: ''
        },
        on_submit_loading: false,
        dialogFormVisible: false,
        dialogTableVisible:false,
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
      },
        dateFormat:function(value) {
          return new Date(parseInt(value)).toLocaleDateString()
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
      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
        var _self = this;
        _self.load_data = false
        _self.$fetch.api_theme.themeList({
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
            this.$fetch.api_theme.delTheme(data)
              .then(({msg}) => {
                this.get_table_data()
//                this.$message.success(msg)
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
      //批量选择
      on_batch_select(val){
        this.batch_select = val
      },

      //删除模板
      deltemplate(id) {
        var type = this.type;
        this.currentId = id;
        this.templateId=-1;
        this.load_data = false
        this.$confirm('请确定是否取消模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            try{
              this.$message({
                type: 'success',
                message: '取消成功'
              });

            }catch(err){
              this.$message({
                type: 'error',
                message: '已取消'
              });
              console.log('删除失败')
            }
            this.$fetch.api_wechat.setTemplate({
              id:this.currentId,
              templateId:this.templateId,
              type:this.type
            })
              .then(response => {
                this.get_table_data()
              })
              .catch(() => {
                this.load_data = false
              })
          })
          .catch(() => {
          })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        var sort = this.temp.sort;
        this.sort =this.temp.sort;

      },
      create() {
        this.dialogFormVisible = false
        console.log(this.temp.id)
        this.$fetch.api_theme.themeSort({
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
