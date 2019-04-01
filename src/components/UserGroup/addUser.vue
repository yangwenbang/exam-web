<template>
  <div>
    <div class="head-c">
      <span class="bread-item">用户组添加用户</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>添加用户</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>选择用户组：</span>
            </div>
            <div class="tr">
              <el-select v-model="selected" clearable placeholder="请选择">
                <el-option v-for="item in groupList" :key="item.roleGroupId" :label="item.rolegroupname" :value="item.roleGroupId">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="i clearfix" style="height: 100%;">
            <div class="tl">
              <span>选择用户：</span>
            </div>
            <div class="tr">
              <textarea readonly name="" id="user" v-model="checkedIdArr"></textarea>
            </div>
          </div>
          <div class="i" style="text-align: center;margin-top: 20px;">
            <button class="btn" @click="addUser"><span>提交</span></button>
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
            </div>
          </div>
        </div>
        <div class="result-c">
          <table class="comTb">
            <tr>
              <th><input type="checkbox" v-model="checked" @click="checkAll" class="check"></th>
              <th>用户ID</th>
              <th>用户账号</th>
              <th>用户昵称</th>
              <th>注册时间</th>
              <th>最近登录</th>
              <th>可用积分</th>
            </tr>
            <tr v-for="item in userList" :key="item.id">
              <td><input type="checkbox" class="check" :value="item.id" v-model="checkedIdArr"></td>
              <td>{{item.id}}</td>
              <td>{{item.phone}}</td>
              <td>{{item.username}}</td>
              <td>{{item.lastUpdateTime}}</td>
              <td>{{item.lastLoginTime}}</td>
              <td>1000</td>
            </tr>
          </table>
        </div>
        <div class="p-f">
          <div class="page">
            <routerPaging :total='userData.page.total'></routerPaging>
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

export default {
  name: "addUser",
  components: {
    routerPaging
  },
  data() {
    return {
      selected: 0,
      userData: {
          page: 1,
          num: 10,
        total: 0,
      },
      userList: [],
      groupList: [],
      addUserData: {
        conditions:{
          groupId: '',
          userIds: []
        }
      },
      checked: false,
      checkedIdArr: [],
      IdArr: []
    }
  },
  created() {
    this.getUser(1);
    this.getGroup();
  },
  methods: {
    getUser(val) {
      var that = this;
      var param = that.userData;
      param.page = val;
      axios.post(api.api.user.listEnable, param).then(response => {
        if (response.data.bresult) {
          that.userList = response.data.object;
          that.userList.forEach(function (item) {
            that.IdArr.push(item.id);
            item.lastLoginTime = item.lastLoginTime ? util.getDateDiff(item.lastLoginTime) : '尚未登录';
            item.lastUpdateTime = util.getDateDiff(item.lastUpdateTime)
          })
        }
      })
    },
    getGroup() {
      var that = this;
      axios.post(api.api.orgrolegroup.all).then(response => {
        if (response.data.bresult) {
          that.groupList = response.data.object
        }
      })
    },
    checkAll() {
      this.checked = !this.checked;
      this.checkedIdArr = this.checked ? this.IdArr : [];
    },
    addUser() {
      var that = this;
      var param = that.addUserData;
      param.conditions.userIds = that.checkedIdArr;
      param.conditions.groupId = that.selected;
      axios.post(api.api.groupuser.add, param).then(response => {
        if (response.data.bresult) {
          util.alert(response.data.message)
        }
      })
    }
  },
  watch: {
    'checkedIdArr': function () {
      if (this.checkedIdArr.length === this.IdArr.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    }
  }
}
</script>

<style scoped>
  .pi {
    max-height: 100px;
  }

  #user {
    width: 70%;
    padding: 5px 7px;
    height: 150px;
    resize: none;
  }

  .tr #sg {
    height: 35px;
    width: 200px;
    padding-left: 5px;
  }

  .comTb .check {
    width: 15px;
    height: 15px;
    outline: none;
  }
</style>
