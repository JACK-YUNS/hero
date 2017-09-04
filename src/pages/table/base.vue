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
    	<!--<div id="example">
		    <el-select v-model="prov">
		        <el-option v-for="option in arr" :value="option.name">
		            {{ option.name }}
		        </el-option>
		    </el-select>
		    <el-select v-model="city">
		        <el-option v-for="option in cityArr" :value="option.name">
		            {{ option.name }}
		        </el-option>
		    </el-select>
		    <el-select v-model="district" v-if="district">
		        <el-option v-for="option in districtArr" :value="option.name">
		            {{ option.name }}
		        </el-option>
		    </el-select>
		    <el-select v-model="value" placeholder="筛选 — 区">
		    <el-option
		      v-for="item in options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
		  <el-select v-model="value" placeholder="筛选 — 部">
		    <el-option
		      v-for="item in options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
		  <el-select v-model="value" placeholder="筛选 — 组">
		    <el-option
		      v-for="item in options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
		  <el-select v-model="value" placeholder="筛选 — 职级">
		    <el-option
		      v-for="item in options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
		  <el-autocomplete
				  v-model="state4"
				  :fetch-suggestions="querySearchAsync"
				  placeholder="请输入姓名查询"
				  @select="handleSelect"
				></el-autocomplete>
				<el-autocomplete
				  v-model="state4"
				  :fetch-suggestions="querySearchAsync"
				  placeholder="请输入手机号查询"
				  @select="handleSelect"
				></el-autocomplete>
				<el-autocomplete
				  v-model="state4"
				  :fetch-suggestions="querySearchAsync"
				  placeholder="请输入工号查询"
				  @select="handleSelect"
				></el-autocomplete>
				<el-autocomplete
				  v-model="state4"
				  :fetch-suggestions="querySearchAsync"
				  placeholder="入职开始时间"
				  @select="handleSelect"
				></el-autocomplete>
				<el-autocomplete
				  v-model="state4"
				  :fetch-suggestions="querySearchAsync"
				  placeholder="入职结束时间"
				  @select="handleSelect"
				></el-autocomplete>
				<el-button type="success">确定</el-button>
		</div>-->

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
          width="50">
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
          <!--<template scope="props">
            <span v-text="props.row.sex == 1 ? '男' : '女'"></span>
          </template>-->
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
            <el-button type="info" size="small" icon="edit" @click="open4">重置密码</el-button>
            <!--<el-button type="danger" size="small" icon="delete" @click="delete_data(props.$index, props.row)">删除</el-button>-->
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


  export default{
    data(){

      return {
      			arr: [
								{name: "选择省份", sub: [{name: "请选择"}], type: 1},
								{
									name: "北京",
									sub: [
										{name: "请选择", sub: []},
										{
											name: "北京",
											sub: [{name: "请选择"}, {name: "东城区"}, {name: "西城区"}, {name: "崇文区"}, {name: "宣武区"}, {name: "朝阳区"}, {name: "海淀区"}, {name: "丰台区"}, {name: "石景山区"}, {name: "房山区"}, {name: "通州区"}, {name: "顺义区"}, {name: "昌平区"}, {name: "大兴区"}, {name: "怀柔区"}, {name: "平谷区"}, {name: "门头沟区"}, {name: "密云县"}, {name: "延庆县"}, {name: "其他"}],
											type: 0
										}], type: 1
								},
								{
									name: "广东",
									sub: [{name: "请选择", sub: []},
										{
											name: "广州",
											sub: [{name: "请选择"}, {name: "越秀区"}, {name: "荔湾区"}, {name: "海珠区"}, {name: "天河区"}, {name: "白云区"}, {name: "黄埔区"}, {name: "番禺区"}, {name: "花都区"}, {name: "南沙区"}, {name: "萝岗区"}, {name: "增城市"}, {name: "从化市"}, {name: "其他"}],
											type: 0
										},
										{
											name: "深圳",
											sub: [{name: "请选择"}, {name: "福田区"}, {name: "罗湖区"}, {name: "南山区"}, {name: "宝安区"}, {name: "龙岗区"}, {name: "盐田区"}, {name: "其他"}],
											type: 0
										},
										{
											name: "珠海",
											sub: [{name: "请选择"}, {name: "香洲区"}, {name: "斗门区"}, {name: "金湾区"}, {name: "其他"}],
											type: 0
										},
										{name: "其他"}],
									type: 1
								}],
        prov: '北京',
        city: '北京',
        district: '东城区',
        cityArr: [],
        districtArr: [],
        restaurants: [],
        state4: '',
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
        //批量选择数组
        batch_select: [],
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
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
    methods: {
      //时间格式化
      dateFormat:function(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },
    updateCity: function () {
                for (var i in this.arr) {
                    var obj = this.arr[i];
                    if (obj.name == this.prov) {
                        this.cityArr = obj.sub;
                        break;
                    }
                }
                this.city = this.cityArr[1].name;
            },
            updateDistrict: function () {
                for (var i in this.cityArr) {
                    var obj = this.cityArr[i];
                    if (obj.name == this.city) {
                        this.districtArr = obj.sub;
                        break;
                    }
                }
                if(this.districtArr && this.districtArr.length > 0 && this.districtArr[1].name) {
                    this.district = this.districtArr[1].name;
                } else {
                    this.district = '';
                }
            },
           
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
      },

      //刷新
      on_refresh(){
        this.get_table_data()
      },
      //获取数据
      get_table_data(){
        this.load_data = false
      this.$fetch.api_table.list({
        current: this.currentPage,
        pageSize: this.length,
        areaName:this.areaName
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
            	console.log(this.batch_select)
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
            h('span', null, '确定要重置密码吗？')
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
    beforeMount: function () {
            this.updateCity();
            this.updateDistrict();
        },
        watch: {
            prov: function () {
                this.updateCity();
                this.updateDistrict();
            },
            city: function () {
                this.updateDistrict();
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
