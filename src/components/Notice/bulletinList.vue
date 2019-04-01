<template>
  <div>
    <div class="head-c">
      <span class="bread-item">系统公告</span>
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
                    <span class="ct">公告标题:</span>
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
            <span>系统公告列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <router-link tag="span" to="/notice/bulletinsend">发送公告</router-link>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>公告标题</th>
                <th>发送时间</th>
                <th>发布人员</th>
                <th>接收人员</th>
              </tr>
              <tr v-for="item in bulletinList" :key="item.id">
                <td @click='showMsg(item)'><span class="operate">{{item.title}}</span></td>
                <td>{{item.noticeTime}}</td>
                <td>{{item.admin}}</td>
                <td>{{item.sendName}}</td>
              </tr>
            </table>
          </div>
          <div class="p-f clearfix">
            <div class="page clearfix">
              <routerPaging ref="devListPager" :total='searchCondition.page.total' v-on:change="getBulletin"></routerPaging>
            </div>
          </div>
        </div>
      </div>
      <el-dialog title="系统公告" :visible.sync='msgVisible' width="600px">
        <div class="m-c">
          <div class="m-l clearfix">
            <div class="m-i"><span>公告标题：</span></div>
            <div class="m-ii"><span>{{msgList.title}}</span></div>
          </div>
          <div class="m-l clearfix">
            <div class="m-i"><span>公告内容：</span></div>
            <div class="m-ii"><span>{{msgList.url}}</span></div>
          </div>
          <div class="m-l clearfix">
            <div class="m-i"><span>发送时间：</span></div>
            <div class="m-ii"><span>{{msgList.noticeTime}}</span></div>
          </div>
          <div class="m-l clearfix">
            <div class="m-i"><span>接收人：</span></div>
            <div class="m-ii"><span>{{msgList.sendName}}</span></div>
          </div>
          <div class="m-l clearfix">
            <div class="m-i"><span>发送人：</span></div>
            <div class="m-ii"><span>{{msgList.admin}}</span></div>
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
  name: 'bulletinList',
  components: {
    routerPaging,
    userSelect
  },
  data () {
    return {
      loading: true,
      msgLoading: true,
      msgVisible: false,
      bulletinList: [],
      msgList: {},
      searchCondition: {
        conditions: {
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
    this.getBulletin(1)
  },
  mounted () {
    this.setDateTimePick()
  },
  methods: {
    showMsg (item) {
      this.msgVisible = true;
      this.msgList = item
    },
    setConditionUser (user) {
      this.searchCondition.conditions.admin = user.value
    },
    getBulletin (val) {
      var that = this
      var param = that.searchCondition
      that.loading = true
      that.searchCondition.page.page = val
      axios.post(api.api.noticemsg.all, param).then(response => {
        if (response.data.bresult) {
          that.bulletinList = response.data.object
          that.searchCondition.page.total = response.data.count
          that.bulletinList.forEach(function (index) {
            index.noticeTime = util.getDateDiff(index.noticeTime)
          })
        };
        that.loading = false
      })
    },
    research () {
      this.$refs.devListPager.init()
      this.getBulletin(1)
    },
    reset () {
      this.searchCondition = {
        conditions: {
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
      this.$refs.devListPager.init()
      this.$refs.userSelect.delItem()
      this.getBulletin(1)
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
