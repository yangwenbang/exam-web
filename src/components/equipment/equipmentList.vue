<template>
  <div>
    <div class="head-c">
      <span class="bread-item">设备列表</span>
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
                      <input
                        class="cin"
                        type="text"
                        v-model="searchCondition.conditions.macAddress"
                      >
                    </div>
                  </div>
                </div>
                <div class="fh">
                  <div class="fcl">
                    <div class="fci">
                      <span class="ct">所属用户:</span>
                    </div>
                    <div class="fca">
                      <userSelect
                        ref="userSelect"
                        v-on:selUser="setConditionUser"
                        @blur.prevent="changeCount()"
                      ></userSelect>
                    </div>
                  </div>
                </div>
                <div class="fh">
                  <div class="fcl">
                    <div class="fci">
                      <span class="ct">是否绑定:</span>
                    </div>
                    <div class="fca">
                      <el-select
                        v-model="searchCondition.conditions.hasBind"
                        clearable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in enableOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
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
            <div class="tools">
              <div class="t-r">
                <span @click="upgrade">设备固件升级</span>
                <span @click="addPatchDevice">批量导入设备</span>
                <span @click="addDevice">添加单台设备</span>
                <span class @click="export2Excel">导出数据</span>
              </div>
            </div>
          </div>
          <div v-loading="loading">
            <div class="result-c">
              <table class="comTb">
                <tr>
                  <th>设备ID</th>
                  <th>设备名称</th>
                  <th>设备MAC</th>
                  <th>所属用户</th>
                  <th>渠道</th>
                  <th>固件版本</th>
                  <th>是否绑定</th>
                  <th>是否启用</th>
                  <th>操作</th>
                </tr>
                <tr v-for="item in list" :key="item.did">
                  <td>
                    <span class="operate" @click="deviceDetail(item.deviceid)">{{item.deviceid}}</span>
                  </td>
                  <td>{{item.devicename}}</td>
                  <td>{{item.macaddress}}</td>
                  <td>{{item.username}}</td>
                  <td>{{item.channel}}</td>
                  <td>{{item.version ? item.version : '无'}}</td>
                  <!--<td>{{item.isactive ? '是' : '否'}}</td>-->
                  <td :class="{dg : !item.hasbind} ">{{item.hasbind ? '是' : '否'}}</td>
                  <!--<td>{{item.isonline ? '是' : '否'}}</td>-->
                  <td :class="{dg : !item.isenable} ">{{item.isenable ? '是' : '否'}}</td>
                  <td>
                    <span v-if="!item.hasbind" class="operate" @click="showBindUser(item)">绑定用户</span>
                    <span v-else class="operate" @click="untied(item.deviceid)">解除绑定</span>
                    <!--<span class="operate" @click="addScore(item.deviceid,item.uid)">添加积分</span>-->
                    <span class="operate" @click="editKey(item)">修改DeviceKey</span>
                    <span class="operate" @click="showScore(item)">昨日积分</span>
                    <span class="operate" @click="upgradeOne(item)">升级固件</span>
                    <span
                      class="operate"
                      v-if="item.isenable"
                      @click="disable(item.did,item.hasbind)"
                    >禁用</span>
                    <span class="operate" v-else @click="enable(item.did)">启用</span>
                  </td>
                </tr>
              </table>
            </div>
            <div class="p-f">
              <div class="page">
                <routerPaging
                  ref="devListPager"
                  :total="searchCondition.page.totalSize"
                  v-on:change="pageChange"
                  :page-index="+searchCondition.page.page"
                ></routerPaging>
              </div>
            </div>
          </div>
          <el-dialog title="批量导入设备" :visible.sync="patchWindow" width="700px" center>
            <div>
              <devicePatch :hasShow="patchWindow" ref="devicePatch" v-on:closeDevice="equClose"></devicePatch>
            </div>
          </el-dialog>
          <el-dialog title="设备绑定" :visible.sync="bindWindow" width="700px" center>
            <div style="margin:10px 0;">请选择人员</div>
            <div>
              <userSelect :bInit="bindWindow" ref="userSelect"></userSelect>
            </div>
            <div class="p-c" style="text-align:center;">
              <input type="button" class="btn btn-primary" value="确定" @click="bindUser">
            </div>
          </el-dialog>
          <el-dialog title="昨日积分详情" :visible.sync="scoreWindow" width="900px" center>
            <div class="panel" v-loading="scoreLoad">
              <div class="result-c">
                <table class="comTb">
                  <tr>
                    <th>设备ID</th>
                    <th>设备名称</th>
                    <th>获得积分</th>
                    <th>获得积分时间</th>
                    <!--<th>渠道</th>-->
                  </tr>
                  <tr v-for="item in scoreList" :key="item.did">
                    <td>{{item.deviceid}}</td>
                    <td>{{item.devicename}}</td>
                    <td>{{item.score}}</td>
                    <td>{{item.addtime}}</td>
                  </tr>
                </table>
              </div>
              <div class="p-f">
                <div class="page">
                  <routerPaging :total="scoreCondition.page.totalSize" v-on:change="showScore"></routerPaging>
                </div>
              </div>
            </div>
          </el-dialog>
          <el-dialog title="修改devicekey" :visible.sync="showKey" width="700px" center>
            <div class="panel">
              <div class="p-c">
                <div class="i">
                  <div class="tl">
                    <span>设备ID</span>
                  </div>
                  <div class="tr">
                    <input type="text" v-model="keyEdit.deviceid" readonly="readonly">
                  </div>
                </div>
                <div class="i">
                  <div class="tl">
                    <span>DeviceKey：</span>
                  </div>
                  <div class="tr">
                    <input type="text" v-model="keyEdit.devicekey">
                  </div>
                </div>
                <div class="i">
                  <div class="tl">
                    <span>MAC：</span>
                  </div>
                  <div class="tr">
                    <input type="text" v-model="keyEdit.macaddress">
                  </div>
                </div>
                <div class="i" style="text-align: center;">
                  <button class="btn" @click="subKey">
                    <span>保存</span>
                  </button>
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
var XLSX = require("xlsx");
import axios from "axios";
import routerPaging from "@/components/child-components/page-components/paging";
import api from "../../config/apiConfig";
import devicePatch from "@/components/child-components/upload-components/devicePatch";
import userSelect from "@/components/child-components/selector-components/user";
import utils from "../../vendor/utils";

export default {
  name: "equipmentList",
  components: {
    routerPaging,
    devicePatch,
    userSelect
  },
  data() {
    return {
      loading: true,
      scoreLoad: true,
      bindWindow: false,
      patchWindow: false,
      scoreWindow: false,
      showKey: false,
      list: [],
      devicelist: [],
      scoreList: [],
      keyEdit: {},
      currentItem: null,
      ischecked: false,
      uId: "",
      dId: "",
      scoreCondition: {
        conditions: {
          deviceId: "",
          userId: "",
          flag: "1",
          rankType: "",
          username: ""
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      },
      searchCondition: {
        conditions: {
          hasBind: "",
          deviceId: "",
          macAddress: "",
          username: "",
          userId: ""
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      },
      enableOptions: [{ value: "1", label: "是" }, { value: "0", label: "否" }]
    };
  },
  created() {
    this.pageChange(this.$route.params.page);
  },
  methods: {
    export2Excel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "设备ID",
          "设备名称",
          "设备MAC",
          "所属用户",
          "是否绑定",
          "是否启用"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "deviceid",
          "devicename",
          "macaddress",
          "username",
          "hasbind",
          "isenable"
        ];
        var devicelist = this.list; // 把data里的tableData存到list

        let that = this;
        that.searchCondition.page.page = 1;
        that.searchCondition.page.num = 99999;
        var param = this.searchCondition;
        axios
          .post(api.api.device.list, param)
          .then(response => {
            if (response.data.bresult) {
              devicelist = response.data.object;
              const data = this.formatJson(filterVal, devicelist);
              export_json_to_excel(tHeader, data, "设备数据列表");
              that.searchCondition.page.num = 10;
            } else {
              util.alert("导出失败，请稍后再试！");
            }
          })
          .catch(error => {
            util.alert("网络错误，请稍后再试！");
          });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    setConditionUser(user) {
      console.log(user);
      this.searchCondition.conditions.userId = user.key.toString();
      this.searchCondition.conditions.username = user.value;
    },
    pageChange(val) {
      let that = this;
      that.loading = true;
      that.$router.push({ path: `/equipment/list/${val}` });
      that.searchCondition.page.page = this.$route.params.page;
      var param = this.searchCondition;
      axios.post(api.api.device.list, param).then(response => {
        if (response.data.bresult) {
          that.list = response.data.object;
          that.searchCondition.page.page = +that.$route.params.page;
          that.list.forEach(function(item) {
            item.url = "/equipment/detail/" + item.did;
            item.channel = item.channel ? item.channel : "无";
          });
          that.searchCondition.page.totalSize = response.data.count;
          that.loading = false;
        }
      });
    },
    disable(id, hasbind) {
      if (hasbind) {
        util.alert("该设备已绑定用户，无法禁用");
      } else {
        let that = this;
        var param = { id: +id };
        util.confirmDoWithTitle("禁用", "是否禁用？", function() {
          axios
            .post(api.api.device.delete, param)
            .then(response => {
              let result = response.data;
              if (result.bresult) {
                that.pageChange(that.searchCondition.page.page);
                util.alert(result.message);
              } else {
                util.alert(result.message);
              }
            })
            .catch(function(error) {
              util.alert("网络异常");
            });
        });
      }
    },
    showScore(index, val) {
      var that = this;
      var param = that.scoreCondition;
      val = 1;
      if (index.uid) {
        this.uId = index.uid;
        this.dId = index.deviceid;
      } else {
        val = index;
      }
      param.conditions.deviceId = this.dId + "";
      param.conditions.userId = this.uId + "";
      that.scoreWindow = true;
      that.scoreLoad = true;
      axios.post(api.api.device.scoreList, param).then(response => {
        if (response.data.bresult) {
          that.scoreList = response.data.object;
          that.scoreCondition.page.totalSize = response.data.count;
          that.scoreList.forEach(function(item) {
            //item.daddtime = util.getDateDiff(item.daddtime)
            item.addtime = util.getDateDiff(item.addtime);
          });
          that.scoreLoad = false;
        }
      });
    },
    enable(id) {
      let that = this;
      var param = { id: +id };
      util.confirmDoWithTitle("启用", "是否启用？", function() {
        axios
          .post(api.api.device.enable, param)
          .then(function(response) {
            let result = response.data;
            if (result.bresult) {
              that.pageChange(that.searchCondition.page.page);
              util.alert(result.message);
            } else {
              util.alert(result.message);
            }
          })
          .catch(function(error) {
            util.alert("网络异常");
          });
      });
    },
    upgrade() {
      util.confirmDoWithTitle("升级", "是否强制升级所有设备固件？", function() {
        axios
          .post(api.api.device.upgrade)
          .then(function(result) {
            if (result.data.bresult) {
              util.alert(result.data.message);
            } else {
              util.alert(result.data.message);
            }
          })
          .catch(function() {
            util.alert("网络错误！");
          });
      });
    },
    upgradeOne(key) {
      var param = {
        devicekey: key.devicekey
      };
      util.confirmDoWithTitle("升级", "是否升级此设备固件？", function() {
        axios
          .post(api.api.device.upgradeone, param)
          .then(function(result) {
            if (result.data.bresult) {
              util.alert(result.data.message);
            } else {
              util.alert(result.data.message);
            }
          })
          .catch(function() {
            util.alert("网络错误！");
          });
      });
    },
    deviceDetail(id) {
      window.location.href = "/#/equipment/detail/" + id;
    },
    editKey(device) {
      var that = this;
      that.keyEdit = device;
      that.showKey = true;
    },
    subKey() {
      var that = this;
      var param = {
        id: that.keyEdit.did,
        devicekey: that.keyEdit.devicekey,
        macAddress: that.keyEdit.macaddress
      };
      axios.post(api.api.device.edit, param).then(response => {
        if (response.data.bresult) {
          that.showKey = false;
          util.alert("修改成功！");
        } else {
          util.alert(response.data.msg);
        }
      });
    },
    reSearch() {
      this.$refs.devListPager.init();
      this.pageChange(1);
    },
    reset() {
      this.searchCondition = {
        conditions: {
          hasBind: "",
          deviceId: "",
          macAddress: "",
          userId: this.$route.query.id,
          username: ""
        },
        page: {
          page: 1,
          num: 10,
          totalSize: 0
        }
      };
      this.$refs.userSelect.delItem();
      this.$refs.devListPager.init();
      this.pageChange(1);
    },
    addDevice() {
      window.location.href = "/#/equipment/add";
    },
    addPatchDevice() {
      this.patchWindow = true;
    },
    equClose(item) {
      this.patchWindow = item;
      this.pageChange(1);
    },
    showBindUser(item) {
      if (item.hasbind) {
        util.alert("设备已绑定");
      } else {
        this.currentItem = null;
        this.currentItem = item;
        this.bindWindow = true;
      }
    },
    bindUser() {
      var that = this;
      this.currentItem.userId = this.$refs.userSelect.$data.tagObj.key;

      var param = {
        device: {
          macAddress: this.currentItem.macaddress
        },
        user: {
          id: this.currentItem.userId
        }
      };
      axios.post(api.api.device.bind, param).then(response => {
        if (response.data.bresult) {
          util.alertdo("绑定成功", function() {
            that.bindWindow = false;
            that.currentItem.username =
              that.$refs.userSelect.$data.tagObj.value;
            that.currentItem.hasbind = true;
          });
        } else {
          util.alert(response.data.message);
        }
      });
    },
    untied(key) {
      var that = this;
      var param = {
        deviceId: key
      };
      util.confirmDoWithTitle("解除绑定", "是否解绑该设备？", () => {
        axios.post(api.api.device.untied, param).then(response => {
          if (response.data.bresult) {
            util.alertdo(response.data.message, () => {
              that.pageChange(that.searchCondition.page.page);
            });
          } else {
            util.alert(response.data.message);
          }
        });
      });
    }
  }
};
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

.fca #enable {
  opacity: 1;
  background: #fff;
  height: 35px;
  padding: 5px 3px;
  width: 100%;
  font-family: "microsoft yahei";
  border: solid 1px #bbb;
  border-radius: 2px;
}
</style>

