<template>
  <div class="header clearfix">
    <div class="head-left">
      <i class="head-icon head-logo"></i>
      <span>{{title}}</span>
    </div>
    <div class="head-right" v-if="webUserInfo.username">
      <ul class="h-r-ul clearfix">
        <li class="h-r-list user-down">
          <div class="h-r-nav">
            <i class="head-icon head-user"></i>
            <span>欢迎 {{webUserInfo.username}}</span>
          </div>
          <div class="h-r-nav" @click="modifyPwd">
            <span>修改密码</span>
          </div>
        </li>
        <li class="h-r-list">
          <span class="h-r-nav" title="退出登录" @click="delSes">
            <i class="head-icon lgout"></i>
          </span>
        </li>
      </ul>
    </div>
    <el-dialog title="修改密码" :visible.sync="showVisable" width="650px" center>
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>修改密码</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i2">
            <div class="tll">
              <span>旧密码：</span>
            </div>
            <div class="trr">
              <input class="add-input" type="password" placeholder="请输入旧密码" v-model="pwd.password">
            </div>
          </div>
          <div style="clear:both"></div>
          <div class="i2">
            <div class="tll">
              <span>新密码：</span>
            </div>
            <div class="trr">
              <input
                class="add-input"
                type="password"
                placeholder="请输入新密码"
                v-model="pwd.newPassword"
              >
            </div>
          </div>
          <div style="clear:both"></div>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="save">保存</button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import api from "../../config/apiConfig";

export default {
  name: "Navbar",
  data() {
    return {
      showVisable: false,
      webUserInfo: {},
      title: "江西教师一考通",
      pwd: {
        password: "",
        newPassword: ""
      }
    };
  },
  created() {
    if (sessionStorage.getItem("info") != null) {
      this.webUserInfo = JSON.parse(sessionStorage.getItem("info"));
      console.log(this.webUserInfo);
    }
  },
  methods: {
    modifyPwd() {
      this.pwd = {
        password: "",
        newPassword: ""
      };
      this.showVisable = true;
    },
    save() {
      var that = this;
      var param = util.clone(this.pwd);
      axios.post(api.api.user.modifyPwd, param).then(response => {
        var rdata = response.data;
        if (rdata.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.showVisable = false;
        } else {
          this.$message.error("修改失败" + rdata.msg);
        }
      });
    },
    delSes() {
      util.confirmDoWithTitle("退出登录", "是否退出登录？", function() {
        sessionStorage.removeItem("info");
        axios.post(api.api.user.logout).then(response => {});
        window.location.href = "#/";
      });
    }
  }
};
</script>

<style>
ul,
li,
p {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

.clearfix:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.header {
  position: fixed;
  background: #31c3a6;
  height: 50px;
  width: 100%;
  color: #fff;
  border-bottom: 2px solid #279c85;
  z-index: 2001;
}

.head-left {
  float: left;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  margin-left: 20px;
}

.header span {
  vertical-align: middle;
}

.head-icon {
  display: inline-block;
  width: 25px;
  height: 25px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  vertical-align: middle;
}

.head-left .head-logo {
  padding: 0 10px;
  background-image: url("../../assets/head-logo.png");
}

.header .head-right {
  float: right;
  height: 50px;
}

.head-right .h-r-ul {
  width: 100%;
  height: 52px;
  list-style: none;
}

.head-right .h-r-ul .h-r-list {
  float: left;
  padding-top: 0px;
  height: 42px;
}

.h-r-ul .h-r-list:last-of-type > .h-r-nav {
  border-right: none;
}

.h-r-list .h-r-nav {
  display: inline-block;
  height: 50px;
  padding: 0 25px;
  line-height: 50px;
  border-right: 1px solid #279d85;
  cursor: pointer;
}
.h-r-list .h-r-nav:hover {
  background: #279d85;
}

.h-r-ul .user-down {
  position: relative;
}

.user-down:hover .h-r-user {
  display: block;
}

.h-r-nav .head-user {
  background-image: url("../../assets/head-user.png");
}

.h-r-nav .head-home {
  background-image: url("../../assets/home.png");
}

.h-r-nav .lgout {
  background-image: url("../../assets/lgout.png");
}

.h-r-list .h-r-user {
  display: none;
  position: absolute;
  top: 52px;
  left: -130px;
  width: 300px;
  height: 240px;
  padding: 0 10px;
  border: 1px solid #e4e4e4;
  color: #999;
  font-size: 12px;
  background-color: #fff;
  box-shadow: 0 0 5px #aaa;
  transition: 0.3s;
  z-index: 1000;
}

.h-r-user .user-t {
  padding: 0 20px;
  border-bottom: 1px solid #e4e4e4;
  line-height: 50px;
}

.h-r-user .user-t .user-t-left {
  float: left;
}

.h-r-user .user-t .user-t-right {
  float: right;
}

.user-t .user-t-right a {
  color: #1abc9c;
}

.h-r-user .user-c {
  padding-top: 25px;
  text-align: left;
}

.h-r-user .user-c .login-ul {
  list-style: none;
  padding-left: 20px;
}

.user-c .login-ul .login-info {
  line-height: 30px;
}
</style>
