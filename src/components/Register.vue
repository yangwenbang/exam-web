<template>
  <div style="margin-top:100px;">
    <div class="wrap">
      <div class="t">
        <span>注册</span>
      </div>
      <div class="c">
        <div class="login-input">
          <input type="text" v-model="registerData.phone" placeholder="请输入手机号" v-on:blur="reg">
          <div
            class="hint"
            v-if="isPhoneShow && (hint === '请输入手机号' || hint === '请输入正确的手机号') "
          >{{hint}}</div>
        </div>
        <div class="login-input">
          <input type="text" v-model="registerData.username" placeholder="请输入用户名">
          <div class="hint" v-if="isShowHint && hint === '请输入用户名' ">{{hint}}</div>
        </div>
        <div class="login-input">
          <input type="password" name="password1" style="display:none">
          <!--禁用浏览器input自动填充-->
          <input
            type="password"
            v-model="registerData.upassword"
            placeholder="请输入密码"
            autocomplete="off"
            @focus="pswTip"
            @blur="pswReg"
          >
          <div class="hint" v-if="isPswShow">{{tip}}</div>
        </div>
        <div class="login-input">
          <input type="password" v-model="pswAgain" placeholder="请再次输入密码" autocomplete="off">
          <div
            class="hint"
            v-if=" isShowHint && (hint === '两次密码不一致,请重新输入' || hint === '请再次输入密码' ) "
          >{{hint}}</div>
        </div>
        <div class="login-input v clearfix">
          <div class="v-input">
            <input type="text" placeholder="请输入验证码" v-model="Vcode.validatecode">
          </div>
          <div class="v-img">
            <img :src="imgCode" alt @click="getImgCode">
          </div>
        </div>
        <div class="login-input">
          <button class="rgbtn" @click="registerbtn">注册</button>
          <div class="hint" v-if=" isShowHint">
            <span>{{msg}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "../config/apiConfig";
import utils from "@/vendor/utils.js";

export default {
  name: "register",
  data() {
    return {
      registerData: {
        phone: "",
        upassword: "",
        username: ""
      },
      pswAgain: "",
      hint: "",
      tip: "",
      isPhoneShow: false,
      isShowHint: false,
      isPswShow: false,
      Vcode: {
        validatecode: ""
      },
      imgCode: "",
      msg: ""
    };
  },
  created() {
    this.checkLogin();
    this.getImgCode();
  },
  watch: {
    upassword: function() {
      this.isPswShow = true;
      this.tip = "342342342";
    }
    // upassword () {
    //   // this.pswReg();
    //   this.isPswShow = true;
    //   this.tip = '长度6-20，允许使用数字，大小写字母，特殊字符'
    // },
    // pswAgain(val) {
    //   if (val === this.upassword) {
    //     this.isShowHint = false
    //   } else {
    //     this.isShowHint = true
    //   }
    // }
  },
  methods: {
    reg() {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(this.registerData.phone)) {
        this.hint = "请输入正确的手机号";
        this.isPhoneShow = true;
      } else {
        this.isPhoneShow = false;
      }
    },
    pswTip() {
      this.isPswShow = true;
      this.tip = "长度6-20，允许使用数字，大小写字母，特殊字符";
    },
    pswReg() {
      var reg = /[a-zA-Z0-9_@!#$%^&*/—+]{6,20}/;
      if (!reg.test(this.registerData.upassword)) {
        this.tip = "密码格式错误，请重新输入！";
        this.isPswShow = true;
      } else {
        this.isPswShow = false;
      }
    },
    registerbtn() {
      this.reg();
      var that = this;
      var param = that.registerData;
      param.upassword = utils.encryptByDES(that.registerData.upassword);
      var vcode = that.Vcode;
      if (!param.phone) {
        this.hint = "请输入手机号";
        this.isShowHint = true;
        return;
      }
      if (!param.username) {
        this.hint = "请输入用户名";
        this.isShowHint = true;
        return;
      }
      if (!param.upassword) {
        this.hint = "请输入密码";
        this.isShowHint = true;
        return;
      }
      if (!this.pswAgain) {
        this.hint = "请再次输入密码";
        this.isShowHint = true;
        return;
      }
      if (param.upassword !== this.pswAgain) {
        this.hint = "两次密码不一致,请重新输入";
        this.pswAgain = "";
        this.isShowHint = true;
        return;
      }
      // axios.post(api.api.imgcode.check, vcode, {withCredentials : true}).then(response =>{
      //   if (response.data.bresult) {
      axios
        .post(api.api.user.register, param)
        .then(response => {
          if (response.data.bresult) {
            util.alertdo("注册成功!", function() {
              this.$router.push({ path: "/home" });
            });
          } else {
            util.alert(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
      //   } else {
      //     this.isShowHint = true;
      //     that.msg = '验证码错误！'
      //   }
      // })
    },
    getImgCode() {
      this.imgCode =
        CONSTANT.imgCodePath +
        "/imgcode/getvalidatecode" +
        "?time=" +
        new Date();
    },
    checkLogin() {
      var that = this;
      axios.post(api.api.user.checkLogin).then(response => {
        if (response.data.bresult) {
          this.$route.push({ path: "/home" });
        }
      });
    }
  }
};
</script>

<style scoped>
.wrap {
  width: 500px;
  border: solid 1px #ddd;
  margin: 0 auto;
  box-shadow: 1px 1px 16px #ccc;
  border-radius: 5px;
  padding: 40px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.wrap .t {
  height: 80px;
}

.wrap .t span {
  line-height: 80px;
  font-size: 26px;
  font-family: "microsoft yahei";
  font-weight: bold;
}

.wrap .c {
  margin: 10px auto;
  width: 300px;
}

.wrap .c .login-input {
  position: relative;
  margin-bottom: 25px;
}

.wrap .c .login-input .hint {
  position: absolute;
  bottom: -17px;
  padding-left: 12px;
  font-size: 12px;
  color: #c6303e;
  text-align: left;
}

.wrap .c input {
  width: 286px;
  height: 30px;
  outline: none;
  padding-left: 10px;
  border: solid 1px #ccc;
  border-radius: 3px;
}

.wrap .c .v .v-input {
  float: left;
}

.wrap .v .v-input > input {
  width: 150px;
}

.wrap .v .v-img {
  float: right;
}

.v-img img {
  width: 128px;
  height: 34px;
}

.login-input .rgbtn {
  background: #48c9b0;
  height: 40px;
  width: 100%;
  border: none;
  font-size: 16px;
  color: #fff;
  outline: none;
  cursor: pointer;
}

.login-input .rgbtn:hover {
  background: #2fa58e;
  border: solid 1px #30645a;
}
</style>
