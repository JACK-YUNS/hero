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
								      <el-date-picker type="date" placeholder="开始日期" v-model="form.startDate" style="width: 100%;"></el-date-picker>
								    </el-col>
								    <el-col :span="5" style="margin-left: 5px">
                      <el-date-picker type="date" placeholder="结束日期" v-model="form.endDate" style="width: 100%;"></el-date-picker>
								    </el-col>
								    <el-button type="primary" @click="onSubmit" style="margin-left: 5px">确定</el-button>
								  </el-form-item>
                  <div>{{ this.userName}}-<span>{{this.gradeLevel}}</span>-{{this.agentCode}}</div>
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
                        <span class="link-type" @click="handleUpdate(props.row)">点击查看日志详情</span>
                      </template>
                    </el-table-column>
							    </el-table>
                  <el-dialog title="日志详情" :visible.sync="dialogFormVisible">
                    <el-form class="small-space" :model="temp" label-position="left" label-width="100px" style='width: 600px; margin-left:50px;'>
                      <el-form-item label="日志时间">
                        <el-input v-model="temp.journalTime"></el-input>
                      </el-form-item>
                      <el-form-item label="新增客户">
                        <el-input v-model="temp.statisticsAddCustomer"></el-input>
                      </el-form-item>
                      <el-form-item label="上门拜访">
                        <el-input v-model="temp.statisticsVisit"></el-input>
                      </el-form-item>
                      <el-form-item label="邀约">
                        <el-input v-model="temp.statisticsOffer"></el-input>
                      </el-form-item>
                      <el-form-item label="早会内容">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="temp.morning_content"></el-input>
                      </el-form-item>
                      <el-form-item label="拜访情况">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="temp.visitsContent"></el-input>
                      </el-form-item>
                      <el-form-item label="主管辅导点评">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="temp.approverContent"></el-input>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">返回上一级</el-button>
                    </div>
                  </el-dialog>
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
              	<!--<el-form ref="form" :model="formline">-->
								   <!--<el-form-item>-->
                     <!--<el-col :span="5">-->
                       <!--<el-date-picker type="date" placeholder="开始日期" v-model="formline.startDate" style="width: 100%;"></el-date-picker>-->
                     <!--</el-col>-->
                     <!--<el-col :span="5" style="margin-left: 5px">-->
                       <!--<el-date-picker type="date" placeholder="结束日期" v-model="formline.endDate" style="width: 100%;"></el-date-picker>-->
                     <!--</el-col>-->
								     <!--<el-button type="success" @click="onSubmit" :loading="on_submit_loading" style="margin-left: 5px">保存</el-button>-->
								  <!--</el-form-item>-->
                  <div>{{ this.userName}}-<span>{{this.gradeLevel}}</span>-{{this.agentCode}}</div>
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
						            :total="totalt">
						          </el-pagination>
						        </div>
     							 </bottom-tool-bar>
								</el-form>
              </el-tab-pane>
              <el-tab-pane label="拜访记录" class="area">
                 <el-form ref="form" :model="form">
                   <div>{{ this.userName}}-<span>{{this.gradeLevel }}</span>-{{this.agentCode}}</div>
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
                      prop="insuranceDemand"
                      label="产险需求">
                      <template scope="props">
                        <span v-text="props.row.insuranceDemand == 1 ? '有' :'无'"></span>
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
						            :total="totals">
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
        totalt: 0,
        totals: 0,
        //每页显示多少条数据
        length: 7,
        tableData: [],
        form: {
          userName: '',
          journalTime: '',
          startDate: '',
          endDate: '',
          startDater: '',
          endDater: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formline:{
          startDate: '',
          endDate: ''
        },
        temp: {
          journalTime: '',
          statisticsAddCustomer: '',
          statisticsVisit: '',
          statisticsOffer: '',
          morning_content: '',
          visitsContent:'',
          approverContent: '',
          status: 'published'
        },
        userName:'',
        gradeLevel:'',
        agentCode:'',
        dialogFormVisible: false,
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
          userId:this.route_id,
          current: _self.currentPage,
          pageSize: _self.length,
          startDate:_self.form.startDate,
          endDate:_self.form.endDate
        })
          .then(response => {
            this.tableData = response.data.list.records
	          this.currentPage = response.data.list.current
	          this.total = response.data.list.total
            this.userName=response.data.entity.userName
            this.gradeLevel=response.data.entity.gradeLevel
            this.agentCode=response.data.entity.agentCode
	          this.load_data = false
            if(this.gradeLevel=='01'){
              this.gradeLevel='降级试用业务代表'
            }else if(this.gradeLevel=='02'){
              this.gradeLevel='试用业务员'
            }else if(this.gradeLevel=='03'){
              this.gradeLevel='正式业务员'
            }else if(this.gradeLevel=='04'){
              this.gradeLevel='业务主任'
            }else if(this.gradeLevel=='05'){
              this.gradeLevel='业务经理一级'
            }else if(this.gradeLevel=='06'){
              this.gradeLevel='业务经理二级'
            }else if(this.gradeLevel=='07'){
              this.gradeLevel='高级经理一级'
            }else if(this.gradeLevel=='08'){
              this.gradeLevel='高级经理二级'
            }else if(this.gradeLevel=='09'){
              this.gradeLevel='区域总监'
            }else if(this.gradeLevel=='10'){
              this.gradeLevel='区域总经理'
            }else{
              this.gradeLevel='高管'
            }
          })
          .catch(() => {
            this.load_data = false
          })

        _self.$fetch.api_journal.logReceived({
          userId:this.route_id ,
          current: _self.currentPage,
          pageSize: _self.length,
          startDate:_self.formline.startDate,
          endDate:_self.formline.endDate
        })
          .then(response => {
            this.table_data = response.data.records
            this.currentPage = response.data.current
            this.totalt = response.data.total
            this.load_data = false
          })
          .catch(() => {
            this.load_data = false
          })

        _self.$fetch.api_record.planRecord({
          userId:this.route_id ,
          current: _self.currentPage,
          pageSize: _self.length,
        })
          .then(response => {
            this.tabledata = response.data.records
            this.currentPage = response.data.current
            this.totals = response.data.total
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
        this.get_table_data();
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
