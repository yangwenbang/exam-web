<template>
  <div>
    <div class="head-c">
      <span class="bread-item">站内信列表</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t clearfix">
          <div class="name">
            <span>筛选查询</span>
          </div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 120px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">消息标题:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.title">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">发送人员:</span>
                  </div>
                  <div class="fca">
                    <userSelect ref="userSelect" v-on:selUser="setConditionUser"></userSelect>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">发送时间:</span>
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
        <div class="p-t p-t2 clearfix">
          <div class="name">
            <span>站内信列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <!--<router-link tag="span" to="/notice/sendone">私发消息</router-link>-->
              <router-link tag="span" to="/notice/sendall">群发站内信</router-link>
              <!--<span class="" @click="export2Excel">导出数据</span>-->
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr v-for="item in noticeList" :key="item.id">
                <td>
                  <div class="t-c">
                    <div class="t-i" @click="showMsg(item)">{{item.title}}</div>
                    <div class="t-ii">{{item.noticeTime}}</div>
                  </div>
                </td>
                <td style="width:200px;">
                  <div style="text-align: left;">
                    接收人：{{item.sendName ? item.sendName : item.sendCounts}}
                  </div>
                </td>
                <td style="width:200px;">
                  <div style="text-align: left;">发送人：{{item.admin}}</div>
                </td>
              </tr>
            </table>
          </div>
          <div class="p-f clearfix">
            <div class="page clearfix">
              <routerPaging ref="devListPager" :total='searchCondition.page.total' v-on:change="getNotice"></routerPaging>
            </div>
          </div>
        </div>
      </div>
      <el-dialog title="站内信" :visible.sync='msgVisible' width="600px">
        <div class="m-c">
          <div class="m-l clearfix">
            <div class="m-i"><span>站内信标题：</span></div>
            <div class="m-ii"><span>{{messageList.title}}</span></div>
          </div>
          <div class="m-l clearfix">
            <div class="m-i"><span>站内信内容：</span></div>
            <div class="m-ii"><span>{{messageList.content}}</span></div>
          </div>
          <div class="m-l clearfix">
            <div class="m-i"><span>发送时间：</span></div>
            <div class="m-ii"><span>{{messageList.noticeTime}}</span></div>
          </div>
          <div class="m-l clearfix">
            <div class="m-i"><span>接收人：</span></div>
            <div class="m-ii"><span>{{messageList.sendName}}</span></div>
          </div>
          <div class="m-l clearfix">
            <div class="m-i"><span>发送人：</span></div>
            <div class="m-ii"><span>{{messageList.admin}}</span></div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import routerPaging from '@/components/child-components/page-components/paging'
import api from '../../config/apiConfig'
import userSelect from '@/components/child-components/selector-components/user'

export default {
  components: {
    routerPaging,
    userSelect
  },
  name: 'list',
  data () {
    return {
      loading: true,
      msgVisible: false,
      noticeList: [],
      messageList: {},
      searchCondition: {
        conditions: {
          noticeType: '0',
          sourcetype: 'NOTICE_NEWS',
          title: '',
          admin: '',
          startTime: '',
          endTime: ''
        },
        page: {
          page: 1,
          num: 10,
          total: 0
        }
      }
    }
  },
  created () {
    this.getNotice(1)
  },
  mounted () {
    this.setDateTimePick()
  },
  methods: {
    showMsg (item) {
      this.msgVisible = true;
      this.messageList = item
    },
    /* // 导出功能
    export2Excel () {
      require.ensure([], () => {
        const {export_json_to_excel} = require('../../vendor/Export2Excel')
        const tHeader = ['站内信标题', '站内信内容', '发布时间', '发送人', '接收人']
        // 上面设置Excel的表格第一行的标题
        const filterVal = ['title', 'content', 'noticeTime', 'admin', 'sendName']
        let list = this.noticeList // 把data里的tableData存到list
        let that = this
        let param = that.searchCondition
        param.page.num = 99999
        axios.post(api.api.noticemsg.list, param).then(response => {
          if (response.data.bresult) {
            list = response.data.object
            that.noticeList.forEach(function (index) {
              index.noticeTime = util.getDateDiff(index.noticeTime)
            })
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '站内信列表excel' + new Date().toLocaleString())
          } else {
            util.alert('导出失败，请稍后再试！')
          }
        }) .catch(error =>{
          util.alert('网络错误，请稍后再试！')
        })
      })
    }, */
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    setConditionUser (user) {
      this.searchCondition.conditions.admin = user.value
    },
    getNotice (val) {
      var that = this
      var param = that.searchCondition
      that.loading = true
      that.searchCondition.page.page = val
      axios.post(api.api.noticemsg.list, param).then(response => {
        if (response.data.bresult) {
          that.noticeList = response.data.object
          that.searchCondition.page.total = response.data.count
          that.noticeList.forEach(function (index) {
            index.noticeTime = util.getDateDiff(index.noticeTime)
          })
          that.loading = false
        }
      })
    },
    delNotice (index) {
      let that = this
      util.confirmDoWithTitle('删除', '是否删除？', function () {
        var param = {
          id: +index
        }
        axios.post(api.api.noticemsg.del, param).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message)
            that.getNotice(that.searchCondition.page.page)
          }
        })
      })
    },
    research () {
      this.$refs.devListPager.init()
      this.getNotice(1)
    },
    reset () {
      this.searchCondition = {
        conditions: {
          noticeType: '0',
          sourcetype: 'NOTICE_NEWS'
        },
        page: {
          page: 1,
          num: 10,
          total: 0
        }
      }
      this.$refs.devListPager.init()
      this.$refs.userSelect.delItem()
      this.getNotice(1)
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

  .content .t-c {
    text-align: left;
    margin-left: 20px;
    padding: 10px 0;
  }

  .content .t-c .t-i {
    font-size: 16px;
    margin-bottom: 10px;
    color: #1abc9c;
    cursor: pointer
  }

  .content .t-c .t-i:hover {
    text-decoration: underline;
  }

  .content .t-c .t-ii {
    font-size: 12px;
    color: #333;
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
    width: 420px;
    word-break: break-word;
    line-height: 25px;
  }
</style>
