<template>
  <div>
    <div class="head-c">
      <span class="bread-item">积分列表</span>
    </div>
    <div class="content">
      <div class="panel"><!-- form重置 -->
        <div class="p-t p-t2">
          <div class="name"><span>筛选查询</span></div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 60px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">用户昵称:</span>
                  </div>
                  <div class="fca">
                    <userSelect ref="userSelect" v-on:selUser="setConditionUser"></userSelect>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">用户账号:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.phone">
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
        <div class="p-t p-t2 clearfix">
          <div class="name"><span>数据列表</span></div>
          <!--<div class="tools clearfix">
            <div class="t-r">
              <span @click="export2Excel">导出数据</span>
            </div>
          </div>-->
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>用户昵称</th>
                <th>用户账号</th>
                <th style="text-align:left;">电信积分</th>
                <th style="text-align:left;">INT积分</th>
                <th style="text-align:left;">总积分</th>
                <th style="text-align:left;">可兑换RMB</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in list" :key="item.id">
                <td>{{item.username}}</td>
                <td>{{item.phone}}</td>
                <td style="text-align:left;">{{item.dscore}}</td>
                <td style="text-align:left;">{{item.iscore}}</td>
                <td style="text-align:left;">{{item.score}}</td>
                <td style="text-align:left;">{{item.rmb}}</td>
                <td><span class="operate" @click="reDetail(item)">查看详情</span></td>
              </tr>
            </table>
          </div>
          <div class="p-f clearfix">
            <div class="page clearfix">
              <routerPaging ref="devListPager" :total='searchCondition.page.totalSize' v-on:change="getData"></routerPaging>
            </div>
          </div>
        </div>
        <el-dialog title="用户积分详情" :visible.sync="scoreVisible" width="900px" center>
          <div class="panel" v-loading="detailLoad">
            <div class="result-c">
              <table class="comTb">
                <tr>
                  <th>名称</th>
                  <th>变更时间</th>
                  <th>变更途径</th>
               <!--   <th>积分类型</th>-->
                  <th>变更积分</th>
                </tr>
                <tr v-for="item in scoreList" :key="item.id">
                  <td>{{item.pname}}</td>
                  <td>{{item.addTime}}</td>
                  <td>{{item.stype}}</td>
                 <!-- <td>{{item.rankType}}</td>-->
                  <td>
                    <span :style="'color:'+((item.score).replace(',','')>0?'green':'red')+';'">{{item.score}}</span>
                  </td>
                </tr>
              </table>
            </div>
            <div class="p-f clearfix">
              <div class="page clearfix">
                <routerPaging :total='scoreData.page.totalSize' v-on:change="reDetail"></routerPaging>
              </div>
            </div>
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

export default {
  name: 'TaskList',
  components: {
    routerPaging,
    userSelect
  },
  data () {
    return {
      loading: true,
      detailLoad: true,
      scoreVisible: false,
      list: [],
      scoreList: [],
      userId: '',
      searchCondition: {
        conditions: {
          username: '',
          phone: ''
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      },
      scoreData: {
        conditions: {
          userId: ''
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      }
    }
  },
  created () {
    this.getData(1)
  },
  mounted () {
    this.setDateTimePick()
  },
  methods: {
    /* export2Excel () {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../vendor/Export2Excel')
        const tHeader = ['用户昵称', '电信积分', 'INT积分', '总积分', '可兑换RMB']
        // 上面设置Excel的表格第一行的标题
        const filterVal = ['username', 'dscore', 'iscore', 'score', 'rmb']
        const list = this.list // 把data里的tableData存到list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '用户积分列表')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }, */
    setConditionUser (user) {
      this.searchCondition.conditions.username = user.value
    },
    getData (val) {
      var that = this
      that.loading = true
      that.searchCondition.page.page = val
      var param = this.searchCondition
      // 添加请求头
      axios.post(api.api.score.list, param).then(response => {
        if (response.data.bresult) {
          that.list = response.data.object
          that.list.forEach(function (item) {
            item.score = util.thousand(item.score)
            item.iscore = util.thousand(item.iscore)
            item.dscore = util.thousand(item.dscore)
            item.rmb = util.thousand(item.rmb)
          })
          that.searchCondition.page.totalSize = response.data.count
        }
        that.loading = false;
      })
    },
    research () {
      this.$refs.devListPager.init()
      this.getData(1)
    },
    reset () {
      this.searchCondition = {
        conditions: {
          rankType: '',
          username: '',
          phone: '',
          startTime: '',
          endTime: ''
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      }
      this.$refs.userSelect.delItem()
      this.$refs.devListPager.init()
      this.getData(1)
    },
    reDetail (index,val) {
      if(index.id){
        this.userId=index.id;
      }
      this.scoreVisible = true
      var that = this
      var param = that.scoreData
      val = 1
      if(!index.id){
        val=index
      }
      that.scoreData.page.page = val
      that.scoreData.conditions.userId = this.userId+''
      that.detailLoad = true
      axios.post(api.api.score.water, param).then(response => {
        if (response.data.bresult) {
          that.scoreList = response.data.object
          that.scoreData.page.totalSize = response.data.count
          that.scoreList.forEach(function (item) {
            item.addTime = util.getDateDiff(item.addtime)
            item.score = util.thousand(item.score)
            if ((item.score).replace(',', '') > 0) {
              item.score = '+' + item.score
            }
            item.rankType = item.rankType === 1 ? '电信积分' : 'INT积分'
          })
          that.detailLoad = false
        }
      })
    },
    setDateTimePick () {
      var that = this
      $('#datetimepicker').datetimepicker({
        format: 'Y-m-d', // 格式化日期
        timepicker: false, // 关闭时间选项
        yearStart: 1990, // 设置最小年份
        yearEnd: 2050, // 设置最大年份
        todayButton: true,
        scrollMonth: false,
        scrollTime: false,
        scrollInput: false,
        closeOnInputClick: true
      }).on('change', function (picker) {
        that.searchCondition.conditions.startTime = picker.currentTarget.value
      })
      $('#datetimepicker2').datetimepicker({
        format: 'Y-m-d', // 格式化日期
        timepicker: false, // 关闭时间选项
        yearStart: 1990, // 设置最小年份
        yearEnd: 2050, // 设置最大年份
        todayButton: true
        // 关闭选择今天按钮);
      }).on('change', function (picker) {
        that.searchCondition.conditions.endTime = picker.currentTarget.value
      })
      $.datetimepicker.setLocale('ch')
    }
  }
}
</script>

<style scoped>
  div.content {
    text-align: left;
  }
</style>
