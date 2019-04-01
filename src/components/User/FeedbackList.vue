<template>
  <div>
    <div class="head-c">
      <span class="bread-item">问题反馈列表</span>
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
                    <span class="ct">反馈用户:</span>
                  </div>
                  <div class="fca">
                    <userSelect ref="userSelect" v-on:selUser="setConditionUser"></userSelect>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">问题类型:</span>
                  </div>
                  <div class="fca">
                   <!-- <input class="cin" type="text" v-model="searchCondition.conditions.mname">-->
                    <el-select v-model="searchCondition.conditions.mname" clearable placeholder="请选择">
                      <el-option v-for="item in questionlist" :key="item.id" :label="item.modelName" :value="item.modelName">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">反馈时间:</span>
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
              <!--<div class="fh">-->
                <!--<div class="fcl">-->
                  <!--<div class="fci">-->
                    <!--<span class="ct">回复状态:</span>-->
                  <!--</div>-->
                  <!--<div class="fca">-->
                    <!--<el-select  v-model="searchCondition.conditions.state" clearable placeholder="请选择">-->
                      <!--<el-option v-for="item in replyState" :key="item.value" :label="item.label" :value="item.value">-->
                      <!--</el-option>-->
                    <!--</el-select>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
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
        <!--<div class="p-t">-->
          <!--<div class="name">问题反馈列表</div>-->
        <!--</div>-->
        <div class="p-t p-t2">
          <div class="name">数据列表</div>
          <div class="tools">
            <div class="t-r">
              <router-link tag="span" to="/feedbacktype" >问题类型</router-link>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <ul class="faq" v-for="item in queList" :key="item.qid">
              <li class="faq-list">
                <div class="faq-t clearfix">
                  <div class="faq-t-left clearfix">
                    <div class="f-l-i">
                      <span>反馈用户：</span>
                      <span class="mr reply-color" v-if="item.username">{{item.username}}</span>
                    </div>
                    <div class="f-l-i">
                      <span>问题类型：</span>
                      <span class="mr reply-color" v-if="item.mname">{{item.mname}}</span>
                    </div>
                    <div class="f-l-i">
                      <span>反馈时间：</span>
                      <span v-if="item.quetime">{{item.quetime}}</span>
                    </div>
                    <div class="f-l-i">
                      <span>联系方式：</span>
                      <span v-if="item.quetime">{{item.remark}}</span>
                    </div>
                  </div>
                  <!--<div class="faq-t-right">-->
                    <!--<span class="reply-color" v-if="item.hasAnswer">已回复</span>-->
                    <!--<span class="noreply-color" v-else>未回复</span>-->
                  <!--</div>-->
                </div>
                <div class="faq-c">
                  <div class="faq-question clearfix">
                    <div class="faq-l">
                      <span class="reply-color">问题：</span>
                    </div>
                    <div class="faq-r">
                      <span v-if="item.content">{{item.content}}</span>
                    </div>
                  </div>
                  <!--<div class="faq-answer clearfix" v-if="item.hasAnswer">-->
                    <!--<div class="faq-l">-->
                      <!--<span class="reply-color">回复：</span>-->
                    <!--</div>-->
                    <!--<div class="faq-r">-->
                      <!--<span>{{item.anscontent}}</span>-->
                    <!--</div>-->
                  <!--</div>-->
                  <!--<div class="faq-answer clearfix" v-else>-->
                    <!--<div class="faq-l">-->
                      <!--<span class="reply-color">回复：</span>-->
                    <!--</div>-->
                    <!--<div class="faq-r">-->
                      <!--<input type="text" style="padding: 3px 5px" v-model="item.questionAnswer.content">-->
                      <!--<button @click="setAns(item)">发送</button>-->
                    <!--</div>-->
                  <!--</div>-->
                  <div class="faq-answer clearfix">
                    <div class="faq-l">
                      <span class="reply-color">图片：</span>
                    </div>
                    <div class="faq-r" v-if="item.imgpath.length">
                      <div class="q-img"  v-for="(items,index) in item.imgpath" :key="index">
                        <img :src="items" alt="图片加载失败！" @click="showImg(items)">
                      </div>
                    </div>
                    <div class="faq-r" v-else>
                      <div class="q-img"><span>暂无图片！</span></div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="p-f">
            <div class="page">
              <routerPaging ref="devListPager" :total='searchCondition.page.totalSize' v-on:change="getQue"></routerPaging>
            </div>
          </div>
        </div>
      </div>
      <el-dialog :visible.sync='imgVisible' width="600px" center id="img">
        <div class="el-img">
          <img :src="imgSrc" alt="图片加载失败！">
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import routerPaging from "@/components/child-components/page-components/paging";
import api from '../../config/apiConfig'
import userSelect from '@/components/child-components/selector-components/user'

export default {
  name: 'Feedback',
  components: {
    routerPaging,
    userSelect
  },
  data () {
    return {
      loading: true,
      // replyState: [
      //   {value: '0', label: '未回复'},
      //   {value: '1', label: '已回复'}
      // ],
      massage: 12345678,
      isShow: false,
      imgVisible: false,
      imgSrc: '',
      queList: [],
      questionlist: [],
      questionTypeSearchCondition: {
        conditions: {
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      },
      searchCondition: {
        conditions: {
          mname: '',
          username: '',
          // state: '',
          startTime: '',
          endTime: ''
        },
        page: {
          page: 1,
          num: 10
        }
      }
    }
  },
  created () {
    this.getQue(1)
    this.getProducts()
  },
  mounted () {
    this.setDateTimePick()
  },
  methods: {
    setConditionUser (user) {
      this.searchCondition.conditions.username = user.value
    },
    showImg (items) {
      this.imgSrc = items;
      this.imgVisible = true;
    },
    getProducts: function () {
      var that = this
      var param = that.questionTypeSearchCondition
      // 添加请求头
      axios.post(api.api.question.list, param).then(response => {
        if (response.data.bresult) {
          that.questionlist = response.data.object
        }
      })
    },
    getQue (val) {
      var that = this;
      that.loading = true
      that.searchCondition.page.page = val;
      var param = that.searchCondition;
      axios.post(api.api.question.qusans, param).then(response => {
        if (response.data.bresult) {
          that.queList = response.data.object;
          that.queList.forEach(index => {
            index.imgpath = JSON.parse(index.imgpath);
            index.quetime = util.getDateDiff(index.quetime);
            index.remark = index.remark ? index.remark : '无';
          })
          // that.queList.forEach(function (item) {
          //   item.state = 1 ? '1' : '0';
          //   if (item.anscontent === null) {
          //     item.hasAnswer = false;
          //     item.questionAnswer = {
          //       questionId: item.qid,
          //       content: ''
          //     }
          //   } else {
          //     item.hasAnswer = true;
          //   }
          //   item.quetime = util.getDateDiff(item.quetime);
          // })
          that.loading = false
        }
        that.searchCondition.page.totalSize = response.data.count
      })
    },
    // setAns (item) {
    //   var that = item;
    //   var param = that.questionAnswer;
    //   if(param.content){
    //     axios.post(api.api.question.answer, param).then(response => {
    //       if (response.data.bresult) {
    //         util.alert(response.data.message);
    //         this.getQue();
    //       }
    //     })
    //   } else {
    //     util.alert('回复信息不能为空！')
    //   }
    // },
    research () {
      this.$refs.devListPager.init()
      this.getQue(1)
    },
    reset () {
      this.searchCondition = {
        conditions: {
          questionTypeId: '',
          userId: ''
        },
        page: {
          page: 1,
          num: 10
        }
      };
      this.$refs.devListPager.init()
      this.$refs.userSelect.delItem()
      this.getQue(1)
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

  .faq-list .faq-t .faq-t-left .f-l-i{
    float: left;
    width: 220px;
  }

  .faq-list .faq-t .faq-t-left .f-l-i:last-of-type{
    width: 220px;
  }

  .faq-t .mr {
    margin-right: 30px;
  }

  .faq-list .faq-t .faq-t-right {
    float: right;
  }

  .faq-c .faq-question,
  .faq-c .faq-answer {
    line-height: 35px;
    width: 100%;
  }

  .faq-c .faq-l {
    float: left;
  }

  .faq-c .faq-r {
    float: left;
    width: 90%;
    word-break: break-all;
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

  .faq-c .faq-r .q-img{
    display: inline-block;
    margin: 0 10px;
  }

  .faq-c .faq-r .q-img img{
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  .content .el-img {
    width: 450px;
    margin: 0 auto;
  }

  .content .el-img img {
    width: 450px;
    height: 450px;
  }

  @media screen and (min-width: 1200px) and (max-width: 1500px) {
    .faq-c .faq-l{
    }
    .faq-c .faq-r{
    }
    .faq-c .faq-r button{
    }
  }
  @media screen and (min-width: 1501px) and (max-width: 1750px){
    .faq-c .faq-l{
    }
    .faq-c .faq-r{
    }
    .faq-c .faq-r button{
    }
  }

  /*.content #img > .el-dialog {*/
    /*height: 600px!important;*/
  /*}*/
</style>
