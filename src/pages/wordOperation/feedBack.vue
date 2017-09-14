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
      <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">-->
        <!--<el-form-item>-->
          <!--<el-input v-model="formInline.title" placeholder="请输入标题查询"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-select v-model="formInline.isTop" placeholder="首页">-->
            <!--<el-option label="全部" value=""></el-option>-->
            <!--<el-option label="是" value="0"></el-option>-->
            <!--<el-option label="否" value="1"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-select v-model="formInline.assortmentType" placeholder="是否分类">-->
            <!--<el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-select v-model="formInline.templateId" placeholder="模板">-->
            <!--<el-option label="全部" value="">选择模版</el-option>-->
            <!--<el-option v-for="item in template_type" :label="item.title" :value="item.id"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="success" @click="onSubmit" :loading="on_submit_loading">查询</el-button>-->
          <!--<router-link :to="{name: 'wordAdd',params: {id: ''}}" tag="span">-->
            <!--<el-button type="success">新建</el-button>-->
          <!--</router-link>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
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
          label="姓名"
          prop="userName"
          :show-overflow-tooltip=true
        >
        </el-table-column>
        <el-table-column
          prop="areaName"
          label="所在区"
          :show-overflow-tooltip=true
        >
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="所在部"
          :show-overflow-tooltip=true
        >
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="所在组"
          :show-overflow-tooltip=true
        >
        </el-table-column>


        <el-table-column
          label="内容"
          :show-overflow-tooltip=true>
          <template scope="props">
            <span class="link-type" @click="handleUpdate(props.row)">{{props.row.contents}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="aTime"
          :formatter="dateFormat"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          prop="gradeLevel"
          :formatter="levelFormat"
          label="职级"
        >
        </el-table-column>
      </el-table>
      <el-dialog title="" :visible.sync="dialogTableVisible">
        <el-table :data="template_type" border>
          <!--<el-table-column property="index" label="序号" width="150"></el-table-column>-->
          <el-table-column property="title" label="主标题" width="200"></el-table-column>
          <el-table-column property="type" label="类型"></el-table-column>
          <el-table-column label="操作">
            <template scope="props">
              <el-button type="info" size="small" icon="edit"  @click="addTemplate(props.row.id)">设置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="内容" :visible.sync="dialogFormVisible">
        <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 80%; margin-left:50px;'>
          <el-form-item label="内容">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.contents" readonly="readonly"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">返回上一级</el-button>
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
          isTop: '',
          assortmentType: '',
          templateId: ''
        },
        options:[
          {
            value: '',
            label: '全部'
          }, {
            value: '1',
            label: '保险理念'
          }, {
            value: '2',
            label: '励志成长'
          }, {
            value: '3',
            label: '生活锦囊'
          }, {
            value: '4',
            label: '轻松一刻'
          }
        ],
        levelArr:[
          {
            value: '01',
            label: '降级试用业务代表'
          }, {
            value: '02',
            label: '试用业务员'
          }, {
            value: '03',
            label: '正式业务员'
          }, {
            value: '04',
            label: '业务主任'
          }, {
            value: '05',
            label: '业务经理一级'
          }, {
            value: '06',
            label: '业务经理二级'
          }, {
            value: '07',
            label: '高级经理一级'
          }, {
            value: '08',
            label: '高级经理二级'
          }, {
            value: '09',
            label: '区域总监'
          }, {
            value: '10',
            label: '区域总经理'
          }, {
            value: '11',
            label: '高管'
          }
        ],
        addtemplate:'设置模板',
        on_submit_loading: false,
        dialogFormVisible: false,
        dialogTableVisible:false,
        template_type: [],
        dialogStatus: '',
        dialogPvVisible: false,

        temp: {
          contents: '',
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
      typeFormat:function(row, column) {
        var aType = row[column.property];
        if (!aType) {
          return "";
        }
        return this.options[aType].label;
      },
      topFormat:function(row, column) {
        var isTop = row[column.property];
        return isTop == 0 ? '是':'否';
      },
      sortFormat:function(row, column,cellValue) {
        var aSort = row[column.property];
        var aTime = row['aTime'];
        var myDate=new Date('2020-01-01 00:00:00')
        if (aSort == aTime) {
          return 0;
        }
        else if(aSort == null){
          return 0;
        }
        else{
          return aSort - myDate.getTime();
        }

      },
      levelFormat:function (row,column) {
        var _self = this;
        var level = row[column.property];
        if(level!=null){
          return _self.levelArr[Number.parseInt(level)-1]['label'];
        }
      },
      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
        var _self = this;
        _self.load_data = false
        _self.$fetch.api_feedback.feedbacks({
          current: _self.currentPage,
          pageSize: _self.length,
          title:_self.formInline.title,
          assortmentType:_self.formInline.assortmentType,
          templateId:_self.formInline.templateId,
          isTop:_self.formInline.isTop
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

      //页码选择
      handleCurrentChange(val) {
        this.currentPage = val
        this.get_table_data()
      },
      //批量选择
      on_batch_select(val){
        this.batch_select = val
      },

      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        var sort = this.temp.sort;
        var myDate=new Date('2020-01-01 00:00:00')
        var sortnum = sort - myDate.getTime()
//      console.log(sortnum)
        this.sort =sortnum;
        if (sort < myDate.getTime()) {
          this.sort=0;
        }
        else if(sort == null){
          this.sort=0;
        }
        else{
          this.sort =sortnum;
        }

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
