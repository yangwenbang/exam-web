<template>
  <div>
    <div class="head-c">
      <span class="bread-item">充值卡列表</span>
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
                    <span class="ct">卡号:</span>
                  </div>
                  <div class="fca">
                    <input class="cin" type="text" v-model="searchCondition.conditions.code">
                  </div>
                </div>
              </div>
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
          <div class="name"><span>数据列表</span></div>
          <div class="tools">
            <div class="t-r">
              <span @click="downloadMould">下载卡片导入模板</span>
              <span @click="addPatch">批量导入</span>
              <span @click="goToImportCard">单张导入</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>图片</th>
                <th>卡号</th>
                <th>名称</th>
                <th>积分</th>
                <th>是否兑换</th>
                <!-- <th>操作</th>-->
              </tr>
              <tr v-for="item in cardLst" :key="item.id">
                <td>
                  <div class="pi-c">
                    <img :src="item.imgPath" class="pi">
                  </div>
                </td>
                <td>{{item.code}}</td>
                <td>{{item.name}}</td>
                <td>{{item.score}}</td>
                <td :class="{dg : !item.hasUsed}">{{item.hasUsed ? '是' : '否'}}</td>

                <!--<td>
                  <span class="operate" @click="goToUpd(item)">编辑</span>
                </td>-->
              </tr>
            </table>
          </div>
          <div class="p-f">
            <div class="page">
              <routerPaging :total='searchCondition.page.totalSize' v-on:change="getCards"></routerPaging>
            </div>
          </div>
        </div>
      </div>
      <el-dialog title="批量导入" :visible.sync="patchWindow" width="700px" center >
        <div>
          <cardPatch :hasShow="patchWindow" ref="cardPatch" v-on:closeCard="closeWin"></cardPatch>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import routerPaging from '@/components/child-components/page-components/paging'
import api from '../../config/apiConfig'
import cardPatch from '@/components/child-components/upload-components/cardPatch'

export default {
  components: {
    routerPaging,
    cardPatch
  },
  name: 'rechargeCard',
  data () {
    return {
      loading: true,
      patchWindow: false,
      cardLst: [],
      searchCondition: {
        conditions: {
          code: '',
          name: ''
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      },
      data: {}
    }
  },
  created () {
    this.getCards(1)
  },
  methods: {
    downloadMould () {
      window.open('../../../static/file/卡片列表.xlsx')
    },
    getCards: function (val) {
      var that = this
      that.loading = true
      that.searchCondition.page.page = val
      var param = that.searchCondition
      axios.post(api.api.card.list, param).then(response => {
        if (response.data.bresult) {
          that.cardLst = response.data.object
          that.searchCondition.page.totalSize = response.data.count
          that.cardLst.forEach(function (item) {
            item.score = util.thousand(item.score)
          })
          that.loading = false;
        }
      })
    },
    goToImportCard: function () {
      window.location.href = '/#/recharge/addrechargecard'
    },
    /*  goToUpd: function (data) {
            var that = this;
            var param = this.taskid;
            param.id = data.id;
            axios.post(api.api.task.del, param).then(response => {
              if (response.data.bresult) {
                util.alert(response.data.message);
                this.getData(1);
              } else {
                util.alert(response.message)
              }
            })
        }, */
    reSearch () {
      this.getCards(1)
    },
    reset () {
      this.searchCondition = {
        conditions: {
          code: '',
          name: ''
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      }
      this.getCards(1)
    },
    addPatch () {
      this.patchWindow = true
    },
    closeWin (item) {
      this.patchWindow = item
      this.getCards(1)
    }
  }
}
</script>

<style scoped>

</style>
