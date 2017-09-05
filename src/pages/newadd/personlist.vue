<template>
  <el-row>
    <div class="panel">
      <panel-title :title="$route.meta.title"></panel-title>
      <div class="panel-body">

        <el-tabs>
              <el-tab-pane label="我的日志" class="area">
              	<el-form ref="form" :model="form">
								  <el-form-item>
								    <el-col :span="5">
								      <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
								    </el-col>
								    <el-col :span="5" style="margin-left: 5px">
								      <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
								    </el-col>
								    <el-button type="primary" @click="onSubmit" style="margin-left: 5px">立即创建</el-button>
								  </el-form-item>
								  <el-table
							      :data="tableData"
							      style="width: 100%">
							      <el-table-column
                      type="index"
							        label="我发出的日志"
							        width="180">
							      </el-table-column>
							      <el-table-column
							        prop="journalTime"
							        label="时间"
							        width="180">
							      </el-table-column>
							      <el-table-column
							        prop="isSubmit"
							        label="">
                      <template scope="props">
                        <span v-text="props.row.isSubmit == 1 ? '已提交' : props.row.isSubmit == 2 ?'未提交':props.row.isSubmit == 3 ?'未审批':'已审批'"></span>
                      </template>
							      </el-table-column>
                    <el-table-column
                      label=""
                      width="300"
                    >
                      <template scope="props">
                        <router-link :to="{name: 'personlist',params: {id: props.row.id}}" tag="span">
                          <span class="link-type">点击查看日志详情</span>
                        </router-link>
                      </template>
                    </el-table-column>
							    </el-table>
							    <bottom-tool-bar>
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
								</el-form>
              </el-tab-pane>
              <el-tab-pane label="收到的日志" class="area">
              	<el-form ref="form" :model="form">
								   <el-form-item>
								    <el-col :span="5">
								      <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
								    </el-col>
								    <el-col :span="5" style="margin-left:5px;">
								      <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>

								    </el-col>
								     <el-button type="success" @click="on_submit_form" :loading="on_submit_loading" style="margin-left: 5px">保存</el-button>
								  </el-form-item>
								  <el-table
							      :data="table_data"
							      style="width: 100%">
							      <el-table-column
                      type="index"
                      label="我收到的日志"
                      width="200">
							      </el-table-column>
							      <el-table-column
							        prop="userName"
							        label="姓名"
							        width="180">
							      </el-table-column>
							      <el-table-column
							        prop="address"
							        label="">
                      <template scope="props">
                        <span>实收到：{{props.row.haveReceived}}篇</span>
                      </template>
							      </el-table-column>
                    <el-table-column
                      prop="address"
                      label="">
                      <template scope="props">
                        <span>已经审批：{{props.row.appRoved}}篇</span>
                      </template>
                    </el-table-column>
							    </el-table>
							    <bottom-tool-bar>
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
								</el-form>
              </el-tab-pane>
              <el-tab-pane label="拜访记录" class="area">
                 <el-form ref="form" :model="form">
								  <el-table
							      :data="tabledata"
							      style="width: 100%">
							      <el-table-column
							        type="index"
							        label="序号"
							        width="180">
							      </el-table-column>
							      <el-table-column
							        prop="visitTime"
							        label="拜访时间"
							        width="180">
							      </el-table-column>
							      <el-table-column
							        prop="callMethod"
                      :formatter="typeFormat"
							        label="拜访方式">
							      </el-table-column>
                    <el-table-column
                      prop="callObject"
                      label="拜访对象">
                    </el-table-column>
                    <el-table-column
                      prop="callPosition"
                      label="拜访地点">
                    </el-table-column>
                    <el-table-column
                      prop="contents"
                      label="内容和目标">
                    </el-table-column>
                    <el-table-column
                      prop="address"
                      label="拜访结果">
                    </el-table-column>
                    <el-table-column
                      prop="address"
                      label="险种及风险">
                    </el-table-column>
                    <el-table-column
                      prop="insuranceDemand"
                      label="产险需求">
                    </el-table-column>
							    </el-table>
							    <bottom-tool-bar>
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
								</el-form>
              </el-tab-pane>
            </el-tabs>

      </div>
    </div>

  </el-row>
</template>
<script type="text/javascript">
  import {panelTitle, charts, bottomToolBar} from 'components'

  export default{
    data(){
      return {
         imageUrl: '',
          //当前页码
        currentPage: 1,
        //数据总条目
        total: 0,
        //每页显示多少条数据
        length: 7,
         tableData: [],
           form: {
          		userName: '',
		          journalTime: '',
		          date1: '',
		          date2: '',
		          delivery: false,
		          type: [],
		          resource: '',
		          desc: ''
		        },
		        table_data:[],
            tabledata:[],
		         //请求时的loading效果
		        load_data: true,
		         route_id: this.$route.params.id,
		        load_data: false,
		        on_submit_loading: false,
		        rules: {
		          name: [{required: true, message: '主标题不能为空', trigger: 'blur'}]
		        }
      }
    },
    created(){
      this.get_table_data()
    },
    methods: {
      typeFormat:function(row, column) {
        var aType = row[column.property];
        if (aType == undefined) {
          return "";
        }
        var arr = ['电话','上门 ','微信','邀请 ','陪访'];
        return arr[aType];
      },
    	//获取数据
      get_table_data(){
      	var _self = this;
         _self.load_data = false
         _self.$fetch.api_journal.journalpage({
          userId: '13175',
          current: _self.currentPage,
          pageSize: _self.length,
        })
          .then(response => {
            this.tableData = response.data.list.records
	          this.currentPage = response.data.list.current
	          this.total = response.data.list.total
	          this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })

        _self.$fetch.api_journal.logReceived({
          userId:'4398' ,
          current: _self.currentPage,
          pageSize: _self.length,
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

        _self.$fetch.api_record.planRecord({
          userId:'4398' ,
          current: _self.currentPage,
          pageSize: _self.length,
        })
          .then(response => {
            this.tabledata = response.data.records
            this.currentPage = response.data.current
            this.total = response.data.total
            this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })
      },
      //页码选择
      handleCurrentChange(val) {
        this.currentPage = val
        this.get_table_data()
      },
      onSubmit() {
        console.log('submit!');
      },
      //提交
      on_submit_form(){
        this.$refs.form.validate((valid) => {
          if (!valid) return false
          this.on_submit_loading = true
          this.$fetch.api_table.save(this.form)
            .then(({msg}) => {
              this.$message.success(msg)
              setTimeout(this.$router.back(), 500)
            })
            .catch(() => {
              this.on_submit_loading = false
            })
        })
      }
    },
    components: {
      panelTitle,
      charts,
      bottomToolBar
    }
  }
</script>
<style scoped="scoped">
	.area{line-height: 45px;}
	.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .link-type{color: #007ACC;}
</style>
