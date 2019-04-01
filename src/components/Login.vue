<template>
  <div>
    <div class="hd">
      <div class="t">
        <span>江西教师一考通系统</span>
      </div>
    </div>
    <div class="ctt">
      <div class="box">
        <div class="t">
          <span>登录</span>
        </div>
        <div class="c">
          <div class="login-input">
            <input
              type="text"
              v-model="login.phone"
              placeholder="请输入用户账号"
              autocomplete="off"
              @input="inputFocus"
              autofocus
            >
            <div class="hint" v-if="isShowHint && hint === '请输入用户账号' ">
              <span>{{hint}}</span>
            </div>
          </div>
          <div class="login-input">
            <input type="password" name="password1" style="display:none">
            <!--禁用浏览器input自动填充-->
            <input
              type="password"
              v-model="login.upassword"
              placeholder="请输入登录密码"
              autocomplete="off"
              @input="inputFocus"
            >
            <div class="hint" v-if=" isShowHint && hint === '请输入登录密码' ">
              <span>{{hint}}</span>
            </div>
          </div>
          <div class="login-input">
            <button class="lgBtn" @click="loginbtn">登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
            <div class="hint" v-if=" isShowHint">
              <span>{{msg}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ft">
      <div class="i">
        <span>Copyright © 2019-2039</span>
      </div>
      <div class="i">
        <span>异视界科技版权所有</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "../config/apiConfig";
import utils from "@/vendor/utils.js";

export default {
  name: "Login",
  data() {
    return {
      phone: "",
      upassword: "",
      hint: "",
      isShowHint: false,
      isFocus: true,
      msg: "",
      imgCode: "",
      Vcode: {
        validatecode: ""
      },
      login: {
        phone: "",
        upassword: ""
      }
    };
  },
  created() {
    this.enter();
  },
  watch: {
    phone(val) {
      if (val) {
        this.isShowHint = false;
      } else {
        this.isShowHint = true;
      }
    },
    upassword(val) {
      if (val) {
        this.isShowHint = false;
      } else {
        this.isShowHint = true;
      }
    }
  },
  methods: {
    enter() {
      var lett = this;
      document.onkeydown = function() {
        var key = window.event.keyCode;
        if (key === 13) {
          lett.loginbtn();
        }
      };
    },
    loginbtn() {
      let that = this;
      var param = that.Vcode;
      var data = {
        userName: that.login.phone,
        upassword: that.login.upassword
      };
      if (!data.userName) {
        this.hint = "请输入用户账号";
        this.isShowHint = true;
        return;
      } else if (!data.upassword) {
        this.hint = "请输入登录密码";
        this.isShowHint = true;
        return;
      } else {
        this.hint = "";
      }
      console.log(api.api.user.login);
      axios.post(api.api.user.login, data).then(response => {
        that.isFocus = false;
        that.isShowHint = false;
        if (response.data.code == 0) {
          that.checkLogin();
        } else {
          that.isShowHint = true;
          that.msg = response.data.msg;
        }
      });
    },
    checkLogin() {
      var that = this;
      axios.post(api.api.user.checkLogin).then(response => {
        
        var rdata = response.data;
        if (rdata.code == 0) {
          sessionStorage.setItem("info", JSON.stringify(rdata.user));
          window.location.href = "/#/home";
        } else {
          if (response.data.message === "暂无权限") {
            util.alert(response.data.message);
          } else {
            util.alertdo(response.data.message, function() {
              window.location.href = "#/";
            });
          }
        }
      });
    },
    getImgCode() {
      this.imgCode =
        CONSTANT.imgCodePath +
        "/imgcode/getvalidatecode" +
        "?time=" +
        new Date();
    },
    inputFocus() {
      this.isShowHint = false;
    }
  }
};
</script>

<style scoped>
.hd {
  height: 100px;
}

.hd .t {
  text-align: left;
  height: 100px;
  margin-left: 200px;
}
.hd .t span {
  line-height: 100px;
  font-size: 22px;
  font-family: "microsoft yahei";
  font-weight: bold;
  vertical-align: middle;
}

.hd .t .logo {
  width: 80px;
  height: 30px;
  margin-right: 20px;
  display: inline-block;
  vertical-align: middle;
  background: url("../assets/tyl-logo.png") no-repeat center/cover;
}

.ctt {
  background: url("../assets/bg1.jpg") no-repeat center/cover;
  min-height: 640px;
}

.box {
  float: right;
  width: 400px;
  margin-top: 160px;
  margin-right: 200px;
  border: solid 1px #ddd;
  /*box-shadow: 1px 1px 16px #ccc;*/
  border-radius: 3px;
  /*-webkit-box-sizing: border-box;*/
  /*-moz-box-sizing: border-box;*/
  /*box-sizing: border-box;*/
  background: #fff;
}

.box .t {
  height: 60px;
}

.box .t span {
  line-height: 60px;
  font-size: 20px;
  font-family: "microsoft yahei";
  font-weight: bold;
}

.box .c {
  margin: 10px auto;
  width: 280px;
  margin-bottom: 60px;
}

.box .c .login-input {
  position: relative;
  margin-bottom: 25px;
}

.box .c .login-input .hint {
  position: absolute;
  bottom: -17px;
  padding-left: 12px;
  font-size: 12px;
  color: #c6303e;
  text-align: left;
}

.box .c .i {
  margin-top: 15px;
}

.box .c input {
  width: 268px;
  height: 30px;
  outline: none;
  padding-left: 10px;
  border: solid 1px #ccc;
  border-radius: 3px;
}

.box .c .v .v-input {
  float: left;
}

.box .v .v-input > input {
  width: 130px;
}

.box .v .v-img {
  float: right;
}

.v-img img {
  width: 128px;
  height: 34px;
}

.login-input .lgBtn {
  background: #46c0a8;
  margin-bottom: 5px;
  height: 40px;
  width: 100%;
  border: solid 1px #509b8c;
  font-size: 16px;
  color: #fff;
  outline: none;
  border-radius: 2px;
  cursor: pointer;
}

.login-input .lgBtn:hover {
  background: #2fa58e;
  border: solid 1px #30645a;
}

.login-input .lgBtn:active {
  background-color: #30645a;
}

.ft {
  width: 100%;
  height: 150px;
  text-align: center;
  line-height: 150px;
  color: #333;
}
.ft .i {
  height: 30px;
}

@media screen and (max-width: 1400px) {
  .hd {
    height: 70px;
  }
  .hd .t {
    height: 70px;
    margin-left: 120px;
  }
  .hd .t span {
    line-height: 70px;
  }

  .ctt {
    min-height: 380px;
  }
  .box {
    margin-top: 50px;
    width: 350px;
  }
  .box .c {
    width: 250px;
    margin-bottom: 40px;
  }
  .box .c input {
    width: 240px;
  }
}
</style>
