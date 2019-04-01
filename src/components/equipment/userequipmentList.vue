<template>
  <div id="equipmentList">
    <!--<routerPaging :total = 100 v-on:change="pageChange"></routerPaging>-->
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
                  <span class="ct">设备ID:</span>
                </div>
                <div class="fca">
                  <input class="cin" type="text" v-model="searchCondition.conditions.deviceId">
                </div>
              </div>
            </div>
            <div class="fh">
              <div class="fcl">
                <div class="fci">
                  <span class="ct">设备MAC:</span>
                </div>
                <div class="fca">
                  <input class="cin" type="text" v-model="searchCondition.conditions.macAddress">
                </div>
              </div>
            </div>
            <div class="fh">
              <div class="fcl">
                <div class="fci">
                  <span class="ct">设备名称:</span>
                </div>
                <div class="fca">
                  <input class="cin" type="text" v-model="searchCondition.conditions.devicename">
                </div>
              </div>
            </div>
            <div class="fh">
              <div class="fcl">
                <div class="fci">
                  <span class="ct">是否激活:</span>
                </div>
                <div class="fca">
                  <input class="cin" type="text" v-model="searchCondition.conditions.isactive">
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
        <div class="name">数据列表</div>
      </div>
      <div class="result-c">
        <table class="comTb">
          <tr>
            <th>设备ID</th>
            <th>设备名称</th>
            <th>设备MAC</th>
            <th>是否激活</th>
            <th>是否在线</th>
            <th>是否启用</th>
            <th>操作</th>
          </tr>
          <tr v-for="item in list" :key="item.did">
            <td>{{item.deviceid}}</td>
            <td>{{item.devicename}}</td>
            <td>{{item.macaddress}}</td>
            <td>{{item.isactive ? '是' : '否'}}</td>
            <td>{{item.isonline ? '是' : '否'}}</td>
            <td>{{item.isenable ? '是' : '否'}}</td>
            <td>
              <span  @click="addScore(item.deviceid,item.uid)">添加积分</span>
              <span  @click="showScore(item.deviceid,item.uid)">昨日积分</span>
              <span v-if="item.isenable" @click="disable(item.did,item.hasbind)">禁用</span>
              <span v-else @click="enable(item.did)">启用</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="p-f">
        <div class="page">
          <routerPaging ref="devListPager" :total='searchCondition.page.totalSize' v-on:change="pageChange"></routerPaging>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import routerPaging from '@/components/child-components/page-components/paging'
import api from '../../config/apiConfig'

export default {
  name: 'equipmentList',
  components: {
    routerPaging
  },
  data () {
    return {
      list: [],
      ischecked: false,
      searchCondition: {
        conditions: {
          hasBind: '',
          deviceId: '',
          isactive:'',
          macAddress: '',
          devicename:'',
          userId:  this.$route.query.id,
          username: ''
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
    this.pageChange(1)
  },
  methods: {
    pageChange (val) {
      let that = this
      that.searchCondition.page.page = val
      var param = this.searchCondition;
      axios.post(api.api.device.list, param).then(response => {
        if (response.data.bresult) {
          that.list = response.data.object
          that.searchCondition.page.totalSize = response.data.count;
        }
      })
    },
    disable (id, hasbind) {
      if (hasbind) {
        util.alert("该设备已绑定用户，无法禁用");
      } else {
        let that = this
        var param = {id: +id};
        util.confirmDoWithTitle('禁用', '是否禁用？', function () {
          axios.post(api.api.device.delete, param).then(response => {
            let result = response.data
            if (result.bresult) {
              that.pageChange();
              util.alert(result.message);
            } else {
              util.alert(result.message)
            }
          })
            .catch(function (error) {
              util.alert('网络异常')
            })
        })
      }
    },
    addScore (did, uid) {
      if (uid == null) {
        util.alert("该设备未绑定用户");
      } else {
        window.location.href = '/#/equipment/addscore?did=' + did + "&uid=" + uid;
      }
    },
    showScore (did, uid) {
      if (uid == null){
        util.alert("该设备未绑定用户");
      } else {
        window.location.href = '/#/equipment/equipmentscorelist?did=' + did + "&uid=" + uid + "&flag=1";
      }
    },
    enable (id) {
      let that = this;
      var param = {id: +id};
      util.confirmDoWithTitle('启用', '是否启用？', function () {
        axios.post(api.api.device.enable, param).then(function (response) {
          let result = response.data
          if (result.bresult) {
            that.pageChange();
            util.alert(result.message);
          } else {
            util.alert(result.message);
          }
        })
          .catch(function (error) {
            util.alert('网络异常')
          })
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
      };
      this.$refs.devListPager.init()
      this.pageChange(1);
    },
    addDevice () {
      window.location.href = '/#/equipment/add'
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

</style>
