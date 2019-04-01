<template>
  <div>
    <div class="head-c">
      <span class="bread-item">用户列表</span>
    </div>
    <div class="content">
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
                    <input class="cin" type="text" v-model="searchData.conditions.phone">
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">注册时间:</span>
                  </div>
                  <div class="fca">
                    <div class="f1">
                      <input class="cin" type="text" id="datetimepicker" v-model="searchData.conditions.startTime">
                    </div>
                    <div class="f2">
                      <a class="ct"></a>
                    </div>
                    <div class="f1">
                      <input class="cin" type="text" id="datetimepicker2" v-model="searchData.conditions.endTime">
                    </div>
                  </div>
                </div>
              </div>
              <div class="fh">
                <div class="fcl">
                  <div class="fci">
                    <span class="ct">是否启用:</span>
                  </div>
                  <div class="fca">
                    <el-select v-model="searchData.conditions.isEnable" clearable placeholder="请选择">
                      <el-option v-for="item in enableOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
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
        <div class="p-t p-t2 ">
          <div class="name">
            <span>用户列表</span>
          </div>
          <div class="tools clearfix">
            <div class="t-r">
              <span class="" @click="export2Excel">导出数据</span>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="result-c">
            <table class="comTb">
              <tr>
                <th>用户昵称</th>
                <th>用户账号</th>
                <th style="text-align: left">可用电信积分</th>
                <th style="text-align: left">可用INT积分</th>
                <th style="text-align: left">可用总积分</th>
                <th>账户启用状态</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in userlist" :key="item.id">
                <td class="u-info" @click="showUser(item.id)">
                  <div class="i ii"><img :src="item.headimg" alt=""></div>
                  <div class="i">
                    <div><span>{{item.username}}</span></div>
                  </div>
                </td>
                <td>{{item.phone}}</td>
                <td style="text-align: left">{{item.dianxin}}</td>
                <td style="text-align: left">{{item.intscore}}</td>
                <td style="text-align: left">{{item.totalscore}}</td>
                <td :class="{dg : !item.isEnable} ">{{item.isEnable ? '已启用' : '已禁用'}}</td>
                <td>
                  <span class="operate" @click="roleset(item)">权限</span>
                  <span class="operate" @click="returnDevice(item)">设备</span>
                  <span class="operate" @click="returnCard(item)">卡片</span>
                  <span class="operate" @click="showMsg(item)">私信</span>
                  <span class="operate" v-if="item.isEnable" @click="Disable(item.id)">禁用</span>
                  <span class="operate" v-else @click="Able(item.id)">启用</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="p-f">
            <div class="page">
              <routerPaging ref="devListPager" :total='searchData.page.listTotal' v-on:change="getData"></routerPaging>
            </div>
          </div>
        </div>
        <el-dialog title="用户关联设备" :visible.sync="centerDialogVisible" width="600px" center>
          <div class="panel" v-loading="deviceLoad">
            <div class="result-c">
              <table class="comTb" style="min-height:40px;">
                <tr>
                  <th>设备ID</th>
                  <th>设备名称</th>
                  <th>设备MAC</th>
                </tr>
                <tr v-for="item in equList" :key="item.did">
                  <td>{{item.deviceid}}</td>
                  <td>{{item.devicename}}</td>
                  <td>{{item.macaddress}}</td>
                </tr>
              </table>
            </div>
            <div class="p-f" v-if="equList.length>0">
              <div class="page">
                <routerPaging :total='equData.page.totalSize' v-on:change="returnDevice"></routerPaging>
              </div>
            </div>
            <div v-else style="padding:10px;">用户没有关联设备</div>
          </div>
        </el-dialog>
        <el-dialog title="用户兑换积分卡" :visible.sync="cardVisible" width="800px" center>
          <div class="panel" v-loading="cardLoad">
            <div class="result-c">
              <table class="comTb">
                <tr>
                  <th>卡号</th>
                  <!--<th>卡密</th>-->
                  <th>名称</th>
                  <th>积分</th>
                  <th>是否使用</th>
                </tr>
                <tr v-for="item in cardLst" :key="item.id">
                  <td>{{item.code}}</td>
                  <!--<td>{{item.password}}</td>-->
                  <td>{{item.name}}</td>
                  <td>{{item.score}}</td>
                  <td>
                    <span v-if="item.hasUsed">是</span>
                    <span v-if="!item.hasUsed">否</span>
                  </td>
                </tr>
              </table>
            </div>
            <div class="p-f" v-if="cardLst.length>0">
              <div class="page">
                <routerPaging :total='cardData.page.totalSize' v-on:change="returnCard"></routerPaging>
              </div>
            </div>
            <div v-else style="padding:10px;">用户没有关联卡片</div>
          </div>
        </el-dialog>
        <el-dialog title="消息发送" :visible.sync="msgVisible" width="600px" center>
          <div style="line-height:40px;">发送至<span style="color:#f00">{{sendUser.username}}({{sendUser.phone}})</span></div>
          <div class="panel">
            <div class="p-c" style="margin:0;margin-top:10px;">
              <div class="i">
                <div class="tl">
                  <span>消息标题：</span>
                </div>
                <div class="tr">
                  <input type="text" placeholder="输入标题" v-model="sendMsg.title" style="width:100%;border:solid 1px #aaa;border-radius:3px;outline:none;">
                </div>
              </div>
              <div class="i ii">
                <div class="tl">
                  <span>消息内容：</span>
                </div>
                <div class="tr">
                  <textarea v-model="sendMsg.content" placeholder="输入内容" style="width:100%;border-radius:3px;padding:5px;outline:none;"></textarea>
                </div>
              </div>
              <!-- <div class="i">
                <div class="tl">
                  <span>用户账号：</span>
                </div>
                <div class="tr">
                  <input type="text" readonly="readonly" v-model="sendUser.phone">
                </div>
              </div> -->
              <div class="i" style="text-align: center;margin-top:20px;">
                <button class="btn" @click="sendone"><span>发送</span></button>
              </div>
            </div>
          </div>
        </el-dialog>
        <el-dialog title="用户信息" :visible.sync='userVisible' width="600px">
          <div class="u-c" v-loading="userLoading">
            <div class="u-img">
              <img :src="uInfo.headImg" alt="">
            </div>
            <div class="u clearfix">
              <div class="u-i"><span>用户昵称:</span></div>
              <div class="u-ii"><span>{{uInfo.username}}</span></div>
            </div>
            <div class="u clearfix">
              <div class="u-i"><span>用户账号:</span></div>
              <div class="u-ii"><span>{{uInfo.phone}}</span></div>
            </div>
            <div class="u clearfix">
              <div class="u-i"><span>性别:</span></div>
              <div class="u-ii"><span>{{uInfo.sex ? '男' : '女'}}</span></div>
            </div>
            <div class="u clearfix">
              <div class="u-i"><span>出生年月:</span></div>
              <div class="u-ii"><span>{{uInfo.birthday}}</span></div>
            </div>
            <div class="u clearfix">
              <div class="u-i"><span>Email:</span></div>
              <div class="u-ii"><span>{{uInfo.email}}</span></div>
            </div>
            <div class="u clearfix">
              <div class="u-i"><span>INT账号:</span></div>
              <div class="u-ii"><span>{{uInfo.intAccount}}</span></div>
            </div>
            <div class="u clearfix">
              <div class="u-i"><span>最近登录:</span></div>
              <div class="u-ii"><span>{{uInfo.lastLoginTime}}</span></div>
            </div>
            <div class="u clearfix">
              <div class="u-i"><span>注册时间:</span></div>
              <div class="u-ii"><span>{{uInfo.lastUpdateTime}}</span></div>
            </div>
          </div>
        </el-dialog>

        <el-dialog title="权限组设置" :visible.sync="roleshow" width="450px" center>
          <div style="height: 300px; overflow: auto">
          <el-tree :data="data" :props="defaultProps" accordion @node-click="handleNodeClick">
          </el-tree>
          </div>
            <div  align="center">
              <button class="btn" @click="saveorg()">添加</button>
          </div>
         <!-- -->
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from "axios";
  import routerPaging from "@/components/child-components/page-components/paging";
  import api from "../../config/apiConfig";
  import userSelect from "@/components/child-components/selector-components/user";
  import Utils from '@/vendor/utils.js'

  export default {
    name: "UserList",
    components: {
      routerPaging,
      userSelect
    },
    data() {
      return {
        loading: true,
        deviceLoad: true,
        cardLoad: true,
        userLoading: true,
        enableOptions: [
          {value: 0, label: "已禁用"},
          {value: 1, label: "已启用"}
        ],
        defaultProps: {
          children: 'children',
          rolegroupid: 'rolegroupid',
          label: 'rolegroupname'
        },
        orgrolegroup: {
          roleGroupId: 0,
          parentid: 0,
          rolegroupname: ''
        },
        searchConditionOrg: {
          conditions: {},
          page: {
            page: 1,
            num: 9999,
            totalSize: 0
          }
        },
        roleauth:{
          userid:0,
          groupid:0
        },
        centerDialogVisible: false,
        cardVisible: false,
        msgVisible: false,
        userVisible: false,
        roleshow: false,
        num: 10,
        userlist: [],
        userId: "",
        cardLst: [],
        equList: [],
        listTotal: 0,
        data: [],
        searchData: {
          conditions: {
            isEnable: null,
            phone: "",
            username: "",
            management:1,
            startTime: "",
            endTime: ""
          },
          page: {
            page: 1,
            num: 10,
            listTotal: 0
          }
        },
        cardData: {
          conditions: {
            userId: ""
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        },
        equData: {
          conditions: {
            userId: ""
          },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        },
        sendMsg: {
          content: "",
          title: "",
          noticeType: 0,
          userId: "",
          imgurl: "",
          admin: ""
        },
        sendUser: {},
        sendId: {
          id: ''
        },
        uInfo: {}
      }
    },
    created() {
      this.loading = true;
      this.getData(1);
    },
    mounted() {
      this.setDateTimePick();
    },
    methods: {
      export2Excel() {
        require.ensure([], () => {
          const {export_json_to_excel} = require("../../vendor/Export2Excel");
          const tHeader = [
            "用户账号",
            "用户昵称",
            "注册时间",
            "最近登录",
            "电信积分",
            "INT积分",
            "总积分",
            "启用状态"
          ];
          // 上面设置Excel的表格第一行的标题
          const filterVal = [
            "phone",
            "username",
            "lastUpdateTime",
            "lastLoginTime",
            "dianxin",
            "intscore",
            "totalscore",
            "isEnable"
          ];
          let that = this;
          that.searchData.page.page = 1;
          that.searchData.page.num = 99999;
          var param = that.searchData;
          axios.post(api.api.user.list, param).then(response => {
            if (response.data.bresult) {
              that.userList = response.data.object;
              that.userList.forEach(function (item) {
                item.lastLoginTime = util.getDateDiff(item.lastLoginTime);
                item.lastUpdateTime = util.getDateDiff(item.lastUpdateTime);
              });
              const data = this.formatJson(filterVal, that.userList);
              export_json_to_excel(
                tHeader,
                data,
                "用户列表"
              );
              that.searchData.page.num = 10;
            }
          });
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      setConditionUser(user) {
        this.searchData.conditions.userId = user.key.toString();
        this.searchData.conditions.username = user.value;
      },
      getData(val) {
        var that = this;
        var param = that.searchData;
        that.searchData.page.page = val;
        that.loading = true
        axios.post(api.api.user.list, param).then(response => {
          if (response.data.bresult) {
            that.userlist = response.data.object;
            that.searchData.page.listTotal = response.data.count;
            that.userlist.forEach(function (value) {
              value.lastLoginTime = value.lastLoginTime
                ? util.getDateDiff(value.lastLoginTime)
                : "尚未登录";
              value.lastUpdateTime = moment(value.lastUpdateTime).format(
                "YYYY-MM-DD"
              );
              value.dianxin =
                value.dianxin != null ? util.thousand(value.dianxin) : "0";
              value.intscore =
                value.intscore != null ? util.thousand(value.intscore) : "0";
              value.totalscore =
                value.totalscore != null ? util.thousand(value.totalscore) : "0";
              value.url = "/notice/sendone/" + value.id;
            });
          }
          that.loading = false;
        });
      },
      Disable(index) {
        var that = this;
        var param = {id: +index};
        util.confirmDoWithTitle("禁用", "是否禁用？", function () {
          axios.post(api.api.user.delete, param).then(response => {
            var data = response.data;
            if (data.bresult) {
              util.alertdo("禁用成功！", function () {
                that.getData(that.searchData.page.page);
              });
            } else {
              util.alert(data.object);
            }
          });
        });
      },
      returnDevice(index, val) {
        val = 1;
        if (index.id) {
          this.userId = index.id;
        } else {
          val = index;
        }
        this.centerDialogVisible = true;
        var that = this;
        that.equData.page.page = val;
        that.equData.conditions.userId = this.userId + "";
        var param = that.equData;
        that.deviceLoad = true;
        axios.post(api.api.device.list, param).then(response => {
          if (response.data.bresult) {
            that.equList = response.data.object;
            that.equData.page.totalSize = response.data.count;
            that.deviceLoad = false;
          }
        });
      },
      returnCard(index, val) {
        val = 1;
        if (index.id) {
          this.userId = index.id;
        } else {
          val = index;
        }
        this.cardVisible = true;
        var that = this;
        var param = that.cardData;
        param.page.page = val;
        param.conditions.userId = this.userId + "";
        that.cardLoad = true;
        axios.post(api.api.card.userList, param).then(response => {
          if (response.data.bresult) {
            that.cardLst = response.data.object;
            that.cardLst.forEach(function (item) {
              item.password = Utils.encrypt(item.password)
            })
            that.cardData.page.totalSize = response.data.count;
            that.cardLoad = false;
          }
        });
      },
      Able(index) {
        var that = this;
        var param = {id: +index};
        util.confirmDoWithTitle("启用", "是否启用？", function () {
          axios.post(api.api.user.enable, param).then(response => {
            var data = response.data;
            if (data.bresult) {
              util.alertdo("启用成功！", function () {
                that.getData(that.searchData.page.page);
              });
            } else {
              util.alert(data.object);
            }
          });
        });
      },
      reSearch() {
        this.$refs.devListPager.init();
        this.getData(1);
      },
      reset() {
        var resetData = {
          conditions: {
            isEnable: null,
            phone: "",
            username: "",
            startTime: "",
            endTime: ""
          },
          page: {
            page: 1,
            num: 10,
            listTotal: 0
          }
        };
        this.searchData = resetData;
        this.$refs.devListPager.init();
        this.$refs.userSelect.delItem();
        this.getData(1);
      },
      setDateTimePick() {
        var that = this;
        $("#datetimepicker")
          .datetimepicker({
            format: "Y-m-d", // 格式化日期
            timepicker: false, // 关闭时间选项
            yearStart: 1990, // 设置最小年份
            yearEnd: 2050, // 设置最大年份
            todayButton: true,
            scrollMonth: false,
            scrollTime: false,
            scrollInput: false,
            closeOnInputClick: true
          })
          .on("change", function (picker) {
            that.searchData.conditions.startTime = picker.currentTarget.value;
          });
        $("#datetimepicker2")
          .datetimepicker({
            format: "Y-m-d", // 格式化日期
            timepicker: false, // 关闭时间选项
            yearStart: 1990, // 设置最小年份
            yearEnd: 2050, // 设置最大年份
            todayButton: true
            // 关闭选择今天按钮);
          })
          .on("change", function (picker) {
            that.searchData.conditions.endTime = picker.currentTarget.value;
          });
        $.datetimepicker.setLocale("ch");
      },
      showMsg(item) {
        var that = this;
        that.msgVisible = true;
        that.sendUser = item;
      },
      sendone() {
        var that = this;
        var data = that.sendMsg;
        // data.imgurl = data.noticeType === '0' ? that.$refs.fileUpload.$data.img.urlPath : '';
        data.userId = that.sendUser.id;
        data.admin = JSON.parse(sessionStorage.getItem("info")).user.username;
        if (data.content && data.userId) {
          axios.post(api.api.noticemsg.sendOne, data).then(response => {
            if (response.data.bresult) {
              util.alert(response.data.message);
              that.msgVisible = false;
            }
          });
        } else {
          util.alert("输入信息不完整，发送失败！");
        }
      },
      handleNodeClick(data) {
        console.log("data",data);
        this.roleauth.groupid=data.rolegroupid;

      },
      roleset(index) {
        this.roleauth.userid=index.id;
        this.roleshow=true;
        this.getOrgRoles();

      },
      data2treeDG(datas, dataArray) {
        for (let j = 0; j < dataArray.length; j++) {
          let dataArrayIndex = dataArray[j];
          let childrenArray = [];
          let id = dataArrayIndex.rolegroupid;
          for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            let parentid = data.parentid;
            if (parentid == id) {//判断是否为儿子节点
              let objTemp = {
                rolegroupid: data.rolegroupid,
                rolegroupname: data.rolegroupname,
                parentid: parentid,
                id: data.rolegroupid
              }
              childrenArray.push(objTemp);
            }
          }
          dataArrayIndex.children = childrenArray;
          if (childrenArray.length > 0) {//有儿子节点则递归
            this.data2treeDG(datas, childrenArray)
          }
        }
        this.data = dataArray;
        return dataArray;
      },
      getOrgRoles() {
        var that = this
        var param =this.searchConditionOrg
        console.log('param+index',param);
        // 添加请求头
        let dataArray = [];
        axios.post(api.api.orgrolegroup.list, param).then(response => {
          if (response.data.bresult) {
            that.list = response.data.object
            that.list.forEach(function (item) {
              let parentid = item.parentid;
              if (parentid == 0) {
                let objTemp = {
                  rolegroupid: item.rolegroupid,
                  rolegroupname: item.rolegroupname,
                  parentid: parentid,
                }
                dataArray.push(objTemp);
              }
            })
            this.data = this.data2treeDG(that.list, dataArray)
          }
        })
      },
      saveorg(){
          console.log("!!!!!",this.roleauth);
          var param=this.roleauth;
        axios.post(api.api.groupuser.edit, param).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message);
            that.roleshow = false;
          }
        });

      },
      showUser(item) {
        var that = this;
        var param = {id: item}
        that.userVisible = true;
        that.userLoading = true;
        axios.post(api.api.user.queryuserinfo, param).then(response => {
          if (response.data.bresult) {
            that.userLoading = false
            that.uInfo = response.data.object;
            that.uInfo.email = that.uInfo.email ? that.uInfo.email : '未设置'
            that.uInfo.intAccount = that.uInfo.intAccount ? that.uInfo.intAccount : '无'
            that.uInfo.birthday = that.uInfo.birthday ? moment(that.uInfo.birthday).format('YYYY-MM-DD') : '未设置'
            that.uInfo.lastLoginTime = that.uInfo.lastLoginTime ? util.getDateDiff(that.uInfo.lastLoginTime) : '尚未登录'
            that.uInfo.lastUpdateTime = moment(that.uInfo.lastUpdateTime).format('YYYY-MM-DD')
          } else {
            util.alertdo(response.data.message, function () {
              that.userVisible = false
            })
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  };
</script>
<style scoped>
  @import url("//unpkg.com/element-ui@2.4.11/lib/theme-chalk/index.css");
  div.content {
    text-align: left
  }

  table.comTb .u-info .i {
    display: inline-block;
    margin: 10px;
    margin-right: 0;
    vertical-align: middle;
  }

  table.comTb .u-info .ii {
    margin-left: 30%;
  }

  table.comTb .u-info {
    cursor: pointer;
    text-align: left;
  }

  table.comTb .u-info .i img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  table.comTb .u-info .i span {
    line-height: 25px;
    color: #1abc9c;
  }

  table.comTb .u-info:hover .i span {
    text-decoration: underline;
  }

  .u-c {
    text-align: center;
  }

  .u-c .u {
    width: 100%;
    margin: 10px;
  }

  .u-c .u .u-i {
    float: left;
    text-align: right;
    width: 47%;
  }

  .u-c .u .u-ii {
    float: left;
    text-align: left;
    width: 39%;
    margin-left: 20px;
    word-break: break-all;
  }

  .u-c .u-img img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-bottom: 20px;
  }

  .u-c .u > div {
    display: inline-block;
    width: 49%;
  }

  @media screen and (max-width: 1400px) {
    table.comTb .u-info .i img {
      width: 35px;
      height: 35px;
    }

    table.comTb .u-info .i {
      display: block;
      margin: 0;
      text-align: center;
    }

    table.comTb .u-info .i > div {
      margin-bottom: 10px;
    }

    table.comTb .u-info .ii {
      margin-left: 0;
      margin-top: 10px;
    }
  }

</style>
