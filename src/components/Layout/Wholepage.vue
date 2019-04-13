<template>
  <div class="app-wrapper">
    <Navbar ref="Navbar" :webUserInfo="userInfo"/>
    <div class="side-wrapper">
      <Sidebar v-on:change="setMenu"/>
    </div>
    <div class="main-container">
      <!--<div class="t">-->
      <!--<span class="bread-item">{{indexTitle}}</span>-->
      <!--</div>-->
      <div class="c">
        <router-view></router-view>
      </div>
      <Bottombar ref="Bottombar"/>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar";
import Bottombar from "./Bottombar";
import Sidebar from "./Sidebar";
import axios from "axios";
import api from "../../config/apiConfig";

export default {
  name: "Wholepage",
  components: {
    Sidebar,
    Navbar: Navbar,
    Bottombar: Bottombar
  },
  data() {
    return {
      indexTitle: "",
      userInfo: {}
    };
  },
  created() {
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      var that = this;
      if (sessionStorage.getItem("info") != null) {
        axios.post(api.api.user.checkLogin).then(response => {
          var rdata = response.data;
          if (rdata.code == 0) {
            that.userInfo = rdata.user;
            sessionStorage.setItem("info", JSON.stringify(rdata.user));
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
      } else {
        util.alertdo("用户未登录", function() {
          window.location.href = "#/";
        });
      }
    },
    setMenu(item) {
      this.indexTitle = item.name;
    }
  }
};
</script>

<style scoped>
div.side-wrapper {
  padding-top: 52px;
  position: fixed;
  background: #00261f;
  height: 100%;
  width: 220px;
  color: #fff;
  overflow-y: auto;
  z-index: 1;
}
div.main-container {
  margin-left: 220px;
  padding-top: 52px;
}

div.main-container .c {
  padding-bottom: 60px;
}

div.main-container .t {
  height: 50px;
  text-align: left;
  border-bottom: solid 1px #ddd;
  margin-bottom: 20px;
  background: #f3f3f3;
}

div.main-container .t span {
  font-size: 18px;
  font-weight: bold;
  line-height: 50px;
  margin-left: 30px;
}

.app-wrapper .t .bread-item {
  color: #48576a;
  font-size: 14px;
}

@media screen and (max-width: 1450px) {
  div.side-wrapper {
    width: 185px;
  }

  div.main-container {
    margin-left: 180px;
    padding-top: 42px;
  }
}
</style>
