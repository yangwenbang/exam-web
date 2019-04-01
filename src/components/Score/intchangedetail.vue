<template>
  <div>
    <div class="head-c">
      <span class="bread-item">INT交易记录</span>
    </div>
    <div class="content">
      <div id="equipmentList">
        <div class="panel">
          <div class="p-t">
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
                      <span class="ct">用户账号:</span>
                    </div>
                    <div class="fca">
                      <input class="cin" type="text" v-model="searchCondition.conditions.phone">
                    </div>
                  </div>
                </div>
                <div class="fh">
                  <div class="fcl">
                    <div class="fci">
                      <span class="ct">钱包地址:</span>
                    </div>
                    <div class="fca">
                      <input class="cin" type="text" v-model="searchCondition.conditions.wallet">
                    </div>
                  </div>
                </div>
                <div class="fh">
                  <div class="fcl">
                    <div class="fci">
                      <span class="ct">TX值:</span>
                    </div>
                    <div class="fca">
                      <input class="cin" type="text" v-model="searchCondition.conditions.ethtx">
                    </div>
                  </div>
                </div>
                <div class="fh">
                  <div class="fcl">
                    <div class="fci">
                      <span class="ct">交易状态:</span>
                    </div>
                    <div class="fca">
                      <input class="cin" type="text" v-model="searchCondition.conditions.status">
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
        <div class="panel" >
          <div class="p-t p-t2">
            <div class="name">数据列表</div>
          </div>
          <div v-loading="loading" >
            <div>
              <table class="comTb">
                <tr>
                  <th>用户昵称</th>
                  <th>用户账号</th>
                  <th class="tx">TX值</th>
                  <th>提取int个数</th>
                  <th>交易时间</th>
                  <th>到账个数</th>
                  <th>汽油费</th>
                  <th>状态</th>
                  <th class="wallet">钱包地址</th>
                  <!--<th>操作</th>-->
                </tr>
                <tr v-for="item in deviceData" :key="item.id">
                  <td>{{item.username}}</td>
                  <td>{{item.phone}}</td>
                  <td class="tx">{{item.ethtx}}</td>
                  <td>{{item.intnum}}</td>
                  <td>{{item.picktime}}</td>
                  <td>{{item.realarrival}}</td>
                  <td>{{item.gas}}</td>
                  <td :class="{dg:!item.status}">{{item.tranStatus}}</td>
                  <td class="wallet">{{item.wallet}}</td>
                </tr>
              </table>
            </div>
            <div class="p-f">
              <div class="page">
                <routerPaging ref="devListPager" :total='searchCondition.page.totalSize' v-on:change="pageChange" :page-index="+searchCondition.page.page"></routerPaging>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import routerPaging from '@/components/child-components/page-components/paging'
  import api from '../../config/apiConfig'
  import devicePatch from '@/components/child-components/upload-components/devicePatch'
  import userSelect from '@/components/child-components/selector-components/user'

  export default {
    name: '',
    components: {
      routerPaging,
      devicePatch,
      userSelect
    },
    data () {
      return {
        loading: true,
        searchCondition: {
          conditions: {
            phone:'',
            wallet:'',
            ethtx:'',
            status:''
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        },
        deviceData: []
      }
    },
    created () {
      this.pageChange(1)
    },
    methods: {
      pageChange (val) {
        var that = this
        var param = that.searchCondition
        that.loading = true
        that.searchCondition.page.page = val
        axios.post(api.api.user.intchangedetail, param).then(response => {
          if (response.data.bresult) {
            that.deviceData = response.data.object
            that.searchCondition.page.totalSize = response.data.count
            that.deviceData.forEach(function (index) {
              index.picktime = util.getDateDiff(index.picktime)
              if (index.status === 1) {
                index.status = true;
                index.tranStatus = "已提交";
              } else if(index.status === 2){
                index.status = true;
                index.tranStatus = "兑换中";
              }else if(index.status === 3){
                index.status = true;
                index.tranStatus = "交易成功";
              }else if(index.status === 4){
                index.status = false;
                index.tranStatus = "交易失败";
              }
            })
            console.log(that.deviceData);
          };
          that.loading = false
        })
      },
      reSearch () {
        this.$refs.devListPager.init()
        this.pageChange(1)
      },
      reset () {
        this.searchCondition = {
          conditions: {
            hasBind: '',
            deviceId: '',
            macAddress: '',
            userId: this.$route.query.id,
            username: ''
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        }
        this.$refs.devListPager.init()
        this.pageChange(1)
      }
    }
  }
</script>
<style scoped>
  .s-t-right .s-t-r-btn span {
    display: inline-block;
    padding: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    line-height: 20px;
    cursor: pointer;
  }

  .s-t-right .s-t-r-btn span:first-of-type {
    border-right: 0;
  }

  .s-t-right .s-t-r-btn span:hover {
    background-color: #f2f2f2;
  }

  .search-c .user-input input {
    width: 180px;
    height: 35px;
    padding-left: 10px;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
    font-size: 16px;
    outline: none;
  }

  #wai .result-c{
    height: 700px;
    overflow: auto;
    width: 100%;
  }

  .search-c .user-input input::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: #ddd;
  }

  .search-c .user-input input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ddd;
  }

  .search-c .user-input input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ddd;
  }

  .search-c .user-input input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #ddd;
  }

  .user-result .result-t > div {
    float: left;
  }

  .result-t .data-show > div {
    float: left;
  }

  .user-detail th {
    height: 45px;
    background-color: #f9f9f9;
  }

  .user-detail td {
    height: 50px;
  }

  .user-detail td > a {
    color: #1abc9c;
    margin: 0 3px;
  }

  .user-detail td > a:hover {
    text-decoration: underline;
  }

  .fca #enable {
    opacity: 1;
    background: #fff;
    height: 35px;
    padding: 5px 3px;
    width: 100%;
    font-family: 'microsoft yahei';
    border: solid 1px #bbb;
    border-radius: 2px;
  }

  .panel .tx {
    max-width: 200px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }

  .panel .wallet {
    max-width: 190px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
</style>
