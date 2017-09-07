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
        <!--<el-form-item>
          <el-select v-model="formInline.isTop" placeholder="首页">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-select v-model="f.p" placeholder="请选择区" clearable @clear="clearArea"  @change="selArea">
            <el-option v-for="(v,i) in area"  :value="i" :label="v.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="f.c" placeholder="请选择部门" clearable @change="selDept" @clear="clearDept">
            <el-option v-for="(v,i) in dept"  :value="i" :label="v.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="f.cc" placeholder="请选择组" clearable  @change="result" @clear="clearGroup">
            <el-option v-for="(v,i) in group"  :value="i" :label="v.name"></el-option>
          </el-select>
        </el-form-item>



        <el-form-item>
          <el-select v-model="formInline.gradeLevel"  @change="get_table_data" placeholder="筛选 — 职级">
            <el-option v-for="item in levelArr" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.userName" @change="get_table_data" placeholder="请输入姓名查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.mobile" @change="get_table_data" placeholder="请输入手机号查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.agentCode" @change="get_table_data" placeholder="请输入工号查询"></el-input>
        </el-form-item>
        <el-form-item>
					<el-col>
						<el-date-picker type="date"  placeholder="入职开始时间" v-model="formInline.startDate" style="width: 100%;"></el-date-picker>
					</el-col>
				</el-form-item>
				<el-form-item>
					<el-col>
						<el-date-picker type="date" placeholder="入职结束时间" v-model="formInline.endDate" style="width: 100%;"></el-date-picker>
					</el-col>
				</el-form-item>
        <el-form-item>
          <el-button type="success" @click="get_table_data" :loading="on_submit_loading">确定</el-button>
        </el-form-item>
      </el-form>

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
          width="80">
        </el-table-column>
        <el-table-column
          label="姓名"
          width="100"
          >
          <template scope="props">
           	<router-link :to="{name: 'personlist',params: {id: props.row.id}}" tag="span">
			        <span class="link-type">{{props.row.userName}}</span>
			      </router-link>
	        </template>
        </el-table-column>
        <el-table-column
          prop="agentCode"
          label="工号"
          width="130"
         >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="130">
        </el-table-column>
        <el-table-column
          prop="area.areaName"
          label="所在区"
          width="120">
        </el-table-column>
        <el-table-column
          prop="area.deptName"
          label="所在部"
          width="120">
        </el-table-column>
        <el-table-column
          prop="area.groupName"
          label="所在组">
        </el-table-column>
        <el-table-column
          prop="gradeLevel"
          :formatter="levelFormat"
          label="职级">
        </el-table-column>
        <el-table-column
          prop="companyDate"
          :formatter="dateFormat"
          label="入职时间">
        </el-table-column>
        <el-table-column
          label="密码重置"
          width="130"
          >
          <template scope="props">
            <el-button type="info" size="small" icon="edit" @click="">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <bottom-tool-bar>
        <div slot="page">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="length"
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
  import axios from 'axios';
  import {port_user, port_code} from 'common/port_uri'
  import moment from "moment"
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";


  export default{
    data(){

      return {
      	formInline: {
          areaName: '',
          deptName: '',
          groupName: '',
          gradeLevel: '',
          userName:'',
          mobile:'',
          agentCode:'',
          startDate:'',
          endDate:''
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
        timeout:  null,
//    	el: '#test',
        table_data: [],
        //当前页码
        currentPage: 1,
        //数据总条目
        total: 0,
        //每页显示多少条数据
        length: 20,
        //请求时的loading效果
        load_data: true,
        on_submit_loading:false,
        //批量选择数组
        batch_select: [],
        value: '',
        area:"",
        dept:"",
        group:"",
        f:{
          p:'',
          c:'',
          cc:'',
        }

      }
    },
    components: {
      ElFormItem,
      panelTitle,
      bottomToolBar
    },
     computed: {

  },
    created(){
    	var _self = this;
      _self.get_table_data()
      _self.get_area_data();


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
      levelFormat:function (row,column) {
          var _self = this;
        var level = row[column.property];
        return _self.levelArr[Number.parseInt(level)-1]['label'];
      },
      handleSelect(item) {

      },
      //刷新
      on_refresh(){
        this.get_table_data()
      },
      get_area_data(){
          var _self = this;
          _self.$fetch.api_table.get_area({})
            .then(response => {
                _self.area = response.data;
              _self.dept=_self.area[0]['child'];
              _self.group=_self.dept[0]['child'];
            })
      },
      //获取数据
      get_table_data(){
      	 var _self = this;
        _self.load_data = false
     	  _self.$fetch.api_table.list({
	        current: _self.currentPage,
	        pageSize: _self.length,
          areaName:_self.formInline.areaName,
          deptName:_self.formInline.deptName,
          groupName:_self.formInline.groupName,
          gradeLevel: _self.formInline.gradeLevel,
          userName:_self.formInline.userName,
          mobile:_self.formInline.mobile,
          agentCode:_self.formInline.agentCode,
          startDate:_self.formInline.startDate,
          endDate:_self.formInline.endDate

	      })
	        .then(response => {

	          this.table_data = response.data.records
	          this.currentPage = response.data.current
	          this.total = response.data.total
	          this.load_data = false

	        })
	        .catch(() => {
	          this.load_data = false
	        })
      },

      //单个删除
      delete_data(item){
        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((index, row) => {
            this.load_data = true;
            try{
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.table_data.splice(index, 1);
                    		this.load_data = false;
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                }
          })
          .catch(() => {
          })
      },
      onSubmit(){
      	this.get_table_data();
      },
      //页码选择
      handleCurrentChange(val) {
        this.currentPage = val
        this.get_table_data()
      },
      selArea:function(){
        var _self = this;
        if(_self.f.p !== ""){
          _self.dept = _self.area[_self.f.p]['child'];
        }
        _self.group = "";
        _self.f.c="";
        _self.f.cc="";
        _self.result();
      },
      selDept:function(){
        var _self = this;
        if(_self.f.c !== ""){
          _self.group=this.dept[this.f.c]['child'];
        }
        this.f.cc="";
        this.result();
      },
      result:function(){
          var _self = this;
        if(_self.f.p !== ""){
          _self.formInline.areaName = _self.area[_self.f.p].name;
        }
        if(_self.f.c !== ""){
          _self.formInline.deptName = _self.dept[_self.f.c].name;
        }
        if(_self.f.cc !== ""){
          _self.formInline.groupName = _self.group[_self.f.cc].name;
        }
        _self.get_table_data();
      },
      clearArea:function () {
        var _self = this;
        _self.dept = "";
        _self.f.p="";
        _self.f.c="";
        _self.f.cc="";
      },
      clearDept:function () {
        var _self = this;
        _self.group = "";
        _self.f.c="";
        _self.f.cc="";
      },
      clearGroup:function () {
        var _self = this;
        _self.f.cc="";
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
