<template>
  <div>
    <div class="head-c">
      <span class="bread-item">用户任务</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name"><span>筛选查询</span></div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 120px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">执行人:</span>
                  </div>
                  <div class="fca">
                    <userSelect ref="userSelect" v-on:selUser="setConditionUser"></userSelect>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">任务名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.name">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">积分类型:</span>
                  </div>
                  <div class="fca">
                    <!--<input class="cin" type="text" v-model="searchCondition.conditions.rankType">-->
                    <el-select v-model="searchCondition.conditions.rankType" clearable placeholder="请选择">
                      <el-option v-for="item in rankTypeLst" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">执行时间:</span>
                  </div>
                  <div class="fca">
                    <div class="f1">
                      <input class="cin" type="text" id="datetimepicker" v-model="searchCondition.conditions.startTime">
                    </div>
                    <div class="f2">
                      <a class="ct"></a>
                    </div>
                    <div class="f1">
                      <input class="cin" type="text" id="datetimepicker2" v-model="searchCondition.conditions.endTime">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="fr">
              <div class="b">
                <input type="button" class="btn btn-primary" value="查询" @click="research">
                <input type="button" class="btn btn-primary" value="重置" @click="reset">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>数据列表</span>
          </div>
          <div class="tools">
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>执行人</th>
                <th>用户账号</th>
                <th>任务名称</th>
                <th>积分类型</th>
                <th style="text-align: left">获取积分(INT)</th>
                <th>备注</th>
                <th>执行时间</th>
              </tr>
              <tr v-for="(item,index) in list" :key="index">
                <td>{{item.username}}</td>
                <td>{{item.phone}}</td>
                <td>{{item.name}}</td>
                 <td>{{item.rankType}}</td>
               <!-- <td>{{item.rank}}</td>-->
                <td style="text-align: left"><div class="green">+{{item.rank}}</div></td>
                <td><span>被邀请人：</span><span @click="invite(item)" class="operate">{{item.invitephone}}</span></td>
                <td>{{item.addtime}}</td>
              </tr>
            </table>
          </div>
          <div class="p-f">
            <div class="page">
              <routerPaging ref="devListPager" :total='searchCondition.page.totalSize' v-on:change="getData"></routerPaging>
            </div>
          </div>
        </div>
        <el-dialog title="被邀请人信息" :visible.sync='inviteVisible' width="600px">
          <div class="m-c">
            <div class="m-l clearfix">
              <div class="m-i"><span>账号：</span></div>
              <div class="m-ii"><span>{{inviteData.invitephone}}</span></div>
            </div>
            <div class="m-l clearfix">
              <div class="m-i"><span>注册时间：</span></div>
              <div class="m-ii"><span>{{inviteData.registertime}}</span></div>
            </div>
            <div class="m-l clearfix">
              <div class="m-i"><span>设备：</span></div>
              <div class="m-ii"><span>{{inviteData.isbinddevice ? '已绑定' : '未绑定'}}</span></div>
            </div>
            <div class="m-l clearfix">
              <div class="m-i"><span>INT账户：</span></div>
              <div class="m-ii"><span>{{inviteData.isbindint ? '已绑定' : '未绑定'}}</span></div>
            </div>
          </div>
        </el-dialog>
        <el-dialog title="邀请送" :visible.sync="codeVisible" width="600px">
          <div class="el-img">
            <img :src="imgSrc" alt="" id="qqq">
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import routerPaging from '@/components/child-components/page-components/paging'
import api from '../../config/apiConfig'
import userSelect from '@/components/child-components/selector-components/user'
import RankType from '@/components/child-components/ranktype-components/ranktype'

export default {
  name: 'UserTask',
  components: {
    routerPaging,
    userSelect,
    RankType
  },
  data () {
    return {
      loading: true,
      inviteVisible: false,
      codeVisible: false,
      imgSrc: '',
      list: [],
      searchCondition: {
        conditions: {
          username: '',
          rankType: '',
          name: '',
          startTime: '',
          endTime: ''
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      },
      rankTypeLst: [
        {value: '1', label: '电信积分'},
        {value: '2', label: 'INT积分'}
      ],
      inviteData: {}
    }
  },
  created () {
    this.getData(1)
  },
  mounted (){
    this.setDateTimePick()
  },
  methods: {
    invite (item) {
      var that = this
      that.inviteVisible = true
      that.inviteData = item
      that.inviteData.registertime = util.getDateDiff(that.inviteData.registertime)
    },
    setConditionUser (user) {
      this.searchCondition.conditions.username = user.value
    },
    getData: function (val) {
      var that = this;
      that.loading = true
      that.searchCondition.page.page = val
      var param = that.searchCondition
      // 添加请求头
      axios.post(api.api.task.listall, param).then(response => {
        this.list = response.data.object;
        this.list.forEach(function (item) {
          item.addtime = util.getDateDiff(item.addtime);
          item.rank = util.thousand(item.rank);
          if( item.rankType==1){
            item.rankType= "电信积分类型";
          } if( item.rankType==2){
            item.rankType= "INT积分类型";
          }
        })
        that.searchCondition.page.totalSize = response.data.count
        that.loading = false
      })
    },
    // imgcode () {
    //   var that = this;
    //   var param = 'userTag=efgsdfgsdfgsrefsdfhg';
    //   axios.post(api.api.imgcode.sharing,param).then(res => {
    //     that.codeVisible = true;
    //     console.log(res.data);
    //     that.imgSrc = res.data;
    //   })
    // },
    research () {
      this.$refs.devListPager.init()
      this.getData(1)
    },
    reset () {
      this.searchCondition = {
        conditions: {
          username: '',
          rankType: '',
          name: '',
          startTime: '',
          endTime: ''
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      };
      this.$refs.devListPager.init()
      this.$refs.userSelect.delItem()
      this.getData(1)
    },
    setDateTimePick () {
      var that = this
      $('#datetimepicker').datetimepicker({
        format: 'Y-m-d', //格式化日期
        timepicker: false, //关闭时间选项
        yearStart: 1990, //设置最小年份
        yearEnd: 2050, //设置最大年份
        todayButton: true,
        scrollMonth: false,
        scrollTime: false,
        scrollInput: false,
        closeOnInputClick: true
      }).on('change', function (picker) {
        that.searchCondition.conditions.startTime = picker.currentTarget.value
      })
      $('#datetimepicker2').datetimepicker({
        format: 'Y-m-d', //格式化日期
        timepicker: false, //关闭时间选项
        yearStart: 1990, //设置最小年份
        yearEnd: 2050, //设置最大年份
        todayButton: true
        //关闭选择今天按钮);
      }).on('change', function (picker) {
        that.searchCondition.conditions.endTime = picker.currentTarget.value
      })
      $.datetimepicker.setLocale('ch')
    }
  }
}
</script>

<style scoped>
  .pi {
    max-height: 100px;
  }

  div.content {
    text-align: left;
  }

  div.content .m-c .m-l{
    font-size: 16px;
    margin: 15px 0;
  }

  .m-l .m-i {
    float: left;
    width: 100px;
    margin-right: 20px;
    text-align: right;
    color: #1abc9c;
    line-height: 25px;
  }

  .m-l .m-ii {
    float: left;
    width: 400px;
    word-break: break-word;
    line-height: 25px;
  }

  .content .el-img {
    width: 450px;
    margin: 0 auto;
  }
</style>
