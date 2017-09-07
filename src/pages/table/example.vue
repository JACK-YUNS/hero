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
    	<div id="example">
		    <el-input v-model="title" :autosize="{ minRows: 2, maxRows: 4}" style="width:300px" @change="handleSelect" placeholder="请输入标题查询"></el-input>
		    <el-select v-model="type" placeholder="分类  ： 全部" @change="handleSelect">
		    <el-option
		      v-for="item in options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value"
          >
		    </el-option>
		  </el-select>
        <!--<el-button type="success">搜索</el-button>-->
				<router-link :to="{name: 'templateAdd',params: {id: ''}}" tag="span">
	        <el-button type="success">新建模板</el-button>
	      </router-link>
		</div>

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
          width="80">
        </el-table-column>
        <el-table-column
          label="主标题"
          >
          <template scope="props">
           	<router-link :to="{name: 'templateAdd',params: {id: props.row.id}}" tag="span">
			        <span class="link-type">{{props.row.title}}</span>
			      </router-link>
	        </template>
        </el-table-column>
        <el-table-column
          prop="subTitle"
          label="副标题"
         >
        </el-table-column>
        <el-table-column
          prop="sort"
          :formatter="typeFormat"
          label="类型"
          width="100">
        </el-table-column>
        <el-table-column
          prop="aTime"
          :formatter="dateFormat"
          label="创建时间"
          width="120">
        </el-table-column>
        <el-table-column
        	aTime="aTime"
          :formatter="sortFormat"
          label="排序"
          width="120"
          sortable>
          <template scope="props">
	            <span>{{props.row.sort}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="200"
          >
          <template scope="props">
            <router-link :to="{name: 'templateAdd',params: {id: props.row.id}}" tag="span">
              <el-button type="primary" size="small" >编辑</el-button>
            </router-link>
            <el-button type="danger" size="small" icon="delete" @click="delete_data(props.$index,props.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
        restaurants: [],
        title: '',
        type:'',
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
        currentId:'',
        options: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '金句'
        }, {
          value: '2',
          label: '海报'
        }, {
          value: '3',
          label: '文章'
        }],
        value: ''
      }
    },
    components: {
      panelTitle,
      bottomToolBar
    },
     computed: {

  },
    created(){
      this.get_table_data()
    },
    filters: {
      sortFormat:function(sort) {

        var myDate=new Date('2020-01-01 00:00:00')
        if (sort < myDate.getTime()) {
          return 0;
        }
        else if(sort == null){
        	return 0;
        }
        else{
        	 return sort - myDate.getTime();
        }

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
        if (aType == undefined) {
          return "";
        }
        var arr = ['','图文（1） ','文章（2） ','海报（3） '];
        return arr[aType];
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
      loadAll() {
        return [];
      },
      querySearchAsync(queryString, cb) {
//        var restaurants = this.restaurants;
//        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
//
//        clearTimeout(this.timeout);
//        this.timeout = setTimeout(() => {
//          cb(results);
//        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect() {
          this.get_table_data();
      },

      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
        var _self = this;
        _self.load_data = false
        _self.$fetch.api_wechat.templateList({
          current: _self.currentPage,
          pageSize: _self.length,
          title: _self.title,
          type : _self.type
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
      delete_data(item,id){
          var _self = this;
          _self.currentId = id;
          _self.$confirm('此操作将删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then((id) => {
            _self.load_data = true;

            try{
                  _self.$fetch.api_wechat
                    .delTemplate({id: _self.currentId})
                    .then(response => {
                    if(response.code == 200){
                      _self.$message({
                        type: 'success',
                        message: '删除成功'
                      });
                      _self.table_data.splice(item, 1);
                      _self.load_data = false;
                    }
                  })
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除失败')
                }
//          this.$fetch.api_table.del(item)
//            .then(({msg}) => {
//              this.get_table_data()
//              this.$message.success(msg)
//            })
//            .catch(() => {
//            })
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
      //批量删除
      on_batch_del(){
        this.$confirm('此操作将批量删除选择数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then((index) => {
            this.load_data = true
//          this.table_data=[];
            if(this.batch_select){
            	this.load_data = false;
            	this.table_data.splice(index, this.batch_select.length);
            }
//          this.$fetch.api_table.batch_del(this.batch_select)
//            .then(({msg}) => {
//              this.get_table_data()
//              this.$message.success(msg)
//            })
//            .catch(() => {
//            })
          })
          .catch(() => {
          })
      },
       open4() {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '确定要取消模板吗？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 3000);
            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'info',
            message: '更改成功'
          });
        });
      }
    },

    mounted() {
      this.restaurants = this.loadAll();
    }
  }
</script>
<style scoped="scoped">
 .el-select{margin-bottom: 10px;}
 .el-autocomplete{margin-bottom: 10px;}
  .link-type{color: #007ACC;}
</style>
