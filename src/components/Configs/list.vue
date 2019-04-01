<template>
  <div>
    <div class="head-c">
      <span class="bread-item">配置信息</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name"><span>筛选查询</span></div>
        </div>
        <div class="p-c">
          <div class="ml" style="height: 60px;">
            <div class="fl">
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">名称:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.name">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">url:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.cvalue">
                  </div>
                </div>
              </div>
            </div>
            <div class="fr">
              <div class="b">
                <input type="button" class="btn btn-primary" value="查询" @click="reSearch">
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
            <div class="t-r">
              <span @click="goToAdd">添加配置</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <ul class="faq" v-for="(item,index) in urlList" :key1="index">
              <li class="faq-list">
                <div class="faq-t clearfix">
                  <div class="faq-t-left">
                    <span class="mr reply-color">{{item.name}}</span>
                  </div>
                  <div class="faq-t-right">
                    <span class="operate" @click="ConfigUpd(item)">编辑</span>
                  </div>
                </div>
                <div class="faq-c">
                  <div class="faq-answer clearfix">
                    <div class="faq-l">
                      <span>配置内容：</span>
                    </div>
                    <div class="faq-r">
                      <span>{{item.cvalue}}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="faq" v-for="(items,index1) in appList" :key2="index1" >
              <li class="faq-list">
                <div class="faq-t clearfix">
                  <div class="faq-t-left">
                    <span class="mr reply-color">{{items.name}}</span>
                  </div>
                  <div class="faq-t-right">
                    <span class="operate" @click="appConfig(items)">编辑</span>
                  </div>
                </div>
                <div class="faq-c">
                  <div class="faq-answer clearfix">
                    <div class="faq-is-l">
                      <span>是否强制更新：</span>
                    </div>
                    <div class="faq-is-r">
                      <span>{{items.cvalue.bForceUpdata ? '是' : '否'}}</span>
                    </div>
                  </div>
                  <div class="faq-answer clearfix">
                    <div class="faq-l">
                      <span>下载地址：</span>
                    </div>
                    <div class="faq-r">
                      <span>{{items.cvalue.downUrl}}</span>
                    </div>
                  </div>
                  <div class="faq-answer clearfix">
                    <div class="faq-l">
                      <span>更新日志：</span>
                    </div>
                    <div class="faq-r">
                      <span>{{items.cvalue.updateLog}}</span>
                    </div>
                  </div>
                  <div class="faq-answer clearfix" v-if="items.cvalue.md5">
                    <div class="faq-l">
                      <span>MD5：</span>
                    </div>
                    <div class="faq-r">
                      <span>{{items.cvalue.md5}}</span>
                    </div>
                  </div>
                  <div class="faq-answer clearfix">
                    <div class="faq-l">
                      <span>版本名称：</span>
                    </div>
                    <div class="faq-r">
                      <span>{{items.cvalue.versionName}}</span>
                    </div>
                  </div>
                  <div class="faq-answer clearfix">
                    <div class="faq-l">
                      <span>版本号：</span>
                    </div>
                    <div class="faq-r">
                      <span>{{items.cvalue.versionCode}}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="p-f">
            <div class="page">
              <routerPaging ref="devListPager" :total='searchCondition.page.totalSize' v-on:change="getData"></routerPaging>
            </div>
          </div>
        </div>
        <el-dialog title="修改配置信息" :visible.sync="showConfig" width="650px" center>
          <div class="panel" v-loading="webLoad">
            <div class="p-c">
              <div class="i">
                <div class="tl">
                  <span>名称：</span>
                </div>
                <div class="tr">
                  <input type="text" v-model="config.name" readonly="readonly">
                </div>
              </div>
              <div class="i ii">
                <div class="tl">
                  <span>配置内容：</span>
                </div>
                <div class="tr">
                  <textarea v-model="config.cvalue" placeholder="输入内容"></textarea>
                </div>
              </div>
              <div class="i" style="text-align: center;">
                <button class="btn" @click="setUpd"><span>发送</span></button>
              </div>
            </div>
          </div>
        </el-dialog>
        <el-dialog title="修改配置信息" :visible.sync="showAppConfig" width="700px" center>
          <div class="panel" v-loading="configLoad">
            <div class="p-c">
              <div class="i">
                <div class="tl">
                  <span>名称：</span>
                </div>
                <div class="tr">
                  <input type="text" v-model="appInfo.name" readonly="readonly">
                </div>
              </div>
              <div class="i">
                <div class="tl">
                  <span>是否强制更新：</span>
                </div>
                <div class="tr tr-radio">
                  <input type="radio" v-model="appInfo.cvalue.bForceUpdata" id="yes" value="true"><label
                  for="yes">是</label>
                  <input type="radio" v-model="appInfo.cvalue.bForceUpdata" id="no" value="false"><label
                  for="no">否</label>
                </div>
              </div>
              <div class="i">
                <div class="tl">
                  <span>下载地址：</span>
                </div>
                <div class="tr">
                  <input type="text" v-model="appInfo.cvalue.downUrl" >
                </div>
              </div>
              <div class="i" v-if="appInfo.cvalue.md5">
                <div class="tl">
                  <span>MD5：</span>
                </div>
                <div class="tr">
                  <input type="text" v-model="appInfo.cvalue.md5" >
                </div>
              </div>
              <div class="i">
                <div class="tl">
                  <span>更新日志：</span>
                </div>
                <div class="tr">
                  <input type="text" v-model="appInfo.cvalue.updateLog" >
                </div>
              </div>
              <div class="i">
                <div class="tl">
                  <span>版本名称：</span>
                </div>
                <div class="tr">
                  <input type="text" v-model="appInfo.cvalue.versionName" >
                </div>
              </div>
              <div class="i">
                <div class="tl">
                  <span>版本号：</span>
                </div>
                <div class="tr">
                  <input type="text" v-model="appInfo.cvalue.versionCode" >
                </div>
              </div>
              <div class="i" style="text-align: center;">
                <button class="btn" @click="appUpd"><span>保存</span></button>
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
    name: 'ConfigList',
    components: {
      routerPaging,
      userSelect
    },
    data() {
      return {
        loading: true,
        configLoad: true,
        webLoad: false,
        list: [],
        appList: [],
        urlList: [],
        showConfig: false,
        showAppConfig: false,
        configid: {
          id: ''
        },
        searchCondition: {
          conditions: {
            id: '',
            ckey: '',
            name: ''
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        },
        config: {
          id: '',
          name: '',
          cvalue: ''
        },
        appInfo: {
          cvalue: {},
          ckey: '',
          id: '',
          name: ''
        }
      }
    },
    created() {
      this.getData(1)
    },
    mounted (){
      this.setDateTimePick()
    },
    methods: {
      setConditionUser (user) {
        this.searchCondition.conditions.username = user.value
      },
      getData(val) {
        var that = this;
        that.urlList = [];
        that.appList = [];
        that.loading = true
        that.searchCondition.page.page = val
        var param = that.searchCondition
        axios.post(api.api.config.list, param).then(response => {
          if (response.data.bresult) {
            that.list = response.data.object
            that.searchCondition.page.totalSize = response.data.count
            var reg = /_VERSION/;
            var len = that.list.length;
            for (var i = 0; i < len; i++) {
              reg.test(that.list[i].ckey) ? that.appList.push(that.list[i]) : that.urlList.push(that.list[i]);
            };
            that.appList.forEach(function (item) {
              item.cvalue = JSON.parse(item.cvalue)
            });
          }
          that.loading = false
        })
      },
      goToAdd() {
        window.location.href = '/#/configs/add'
      },
      ConfigUpd (index) {
        this.showConfig = true;
        this.config = index;
      },
      setUpd () {
        var that = this;
        var param = that.config;
        that.webLoad = true;
        axios.post(api.api.config.upd, param).then(response => {
          that.webLoad = false;
          if (response.data.bresult) {
            util.alert(response.data.message);
            that.showConfig = false;
            that.getData(that.searchCondition.page.page)
          } else {
            util.alert(response.message)
          }
        }).catch(res => {
          util.alert('网络错误！')
          that.webLoad = false
        })
      },
      appConfig (index) {
        this.showAppConfig = true;
        this.configid.id = index.id;
        var that = this;
        var param = that.configid;
        that.configLoad = true;
        axios.post(api.api.config.getconfig, param).then(response => {
          that.configLoad = false;
          if (response.data.bresult) {
            var data = response.data.object;
            that.appInfo.cvalue = JSON.parse(data.cvalue);
            that.appInfo.ckey = data.ckey;
            that.appInfo.name = data.name;
            that.appInfo.id = data.id;
          } else {
            util.alert('网络错误！')
          }
        }).catch(res => {
          util.alert('网络错误！')
          that.configLoad = false;
        })
      },
      appUpd () {
        var that = this;
        that.configLoad = true;
        if (that.appInfo.cvalue.bForceUpdata === 'true') {
          that.appInfo.cvalue.bForceUpdata = true;
        } else {
          that.appInfo.cvalue.bForceUpdata = false
        }
        that.appInfo.cvalue = JSON.stringify(that.appInfo.cvalue);
        var param = that.appInfo;
        axios.post(api.api.config.upd, param).then(response => {
          that.configLoad = false;
          if (response.data.bresult) {
            util.alert(response.data.message);
            that.showAppConfig = false;
            that.getData(that.searchCondition.page.page)
          } else {
            util.alert(response.message)
          }
        }).catch(res => {
          util.alert('网络错误！')
          that.configLoad = false;
        })
      },
      Enable(data) {
        var that = this;
        var param = this.configid;
        param.id = data;
        axios.post(api.api.config.enable, param).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message);
            that.getData(that.searchCondition.page.page);
          } else {
            util.alert(response.message)
          }
        })
      },
      reSearch () {
        this.$refs.devListPager.init()
        this.getData(1);
      },
      reset () {
        this.searchCondition = {
          conditions: {
            id: '',
            ckey: ''
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        };
        this.$refs.devListPager.init()
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

  .p-f2 {
    border-top: 1px solid #e4e4e4;
  }

  .result-c .faq {
    list-style: none;
    font-size: 14px;
  }

  .result-c .faq {
    list-style: none;
    font-size: 14px;
  }

  .result-c .faq .faq-list {
    padding: 0 20px 20px 20px;
    margin: 10px 0;
    border: 1px solid #e4e4e4;
    border-left: 0;
    border-right: 0;
  }

  .faq .faq-list .faq-t {
    line-height: 50px;
    border-bottom: 1px solid #e4e4e4;
  }

  .faq-list .faq-t .faq-t-left {
    float: left;
  }

  .faq-list .faq-t .faq-t-left .dg {
    color: #f00;
  }

  .faq-t .mr {
    margin-right: 30px;
  }

  .faq-list .faq-t .faq-t-right {
    float: right;
  }

  .faq-list .faq-t .faq-t-right .operate {
    color: #1abc9c;
    margin: 0 3px;
    cursor: pointer;
  }

  .faq-list .faq-t .faq-t-right .operate:hover {
    text-decoration: underline;
  }

  .faq-c .faq-question,
  .faq-c .faq-answer {
    line-height: 35px;
  }

  .faq-c .faq-l {
    float: left;
  }

  .faq-c .faq-r {
    float: left;
  }

  .faq-c .faq-is-l {
    float: left;
  }

  .faq-c .faq-is-r {
    float: left;
  }

  .faq-c .faq-r input {
    width: 85%;
    height: 25px;
    outline: none;
    border: 1px solid #ddd;
    margin-right: 30px;
    border-radius: 3px;
  }

  .faq-c .faq-r button {
    width: 150px;
    height: 28px;
    background-color: #1abc9c;
    color: #FFF;
    border: none;
    border-radius: 3px;
    outline: none;

  }

  .faq .faq-list .reply-color {
    color: #1abc9c;
  }

  .faq .faq-list .noreply-color {
    color: #f00;
    cursor: pointer;
  }

  .panel .p-c .i .tr-radio {
    margin-top: 20px;
  }

  .panel .p-c .i .tr-radio > input {
    width: 15px;
    height: 15px;
    vertical-align: top;
    margin-right: 5px;
  }

  .panel .p-c .i .tr-radio > label{
    vertical-align: top;
    margin-right: 30px;
  }

</style>
