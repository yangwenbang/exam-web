<template>
  <div>
    <div class="head-c">
      <span class="bread-item">首页</span>
    </div>
    <div class="wrap">
      <div class="w-top">
        <ul class="w-top-ul">
          <li class="w-top-list">
            <div class="list-img w-icon icon-user"></div>
            <div class="list-c">
              <p>
                <span class="list-i">今日新增用户</span>
              </p>
              <p>
                <span class="list-ii">{{newData.usercount}}</span>
              </p>
            </div>
          </li>
          <li class="w-top-list">
            <div class="list-img w-icon icon-equipment"></div>
            <div class="list-c">
              <p>
                <span class="list-i">今日课程购买数</span>
              </p>
              <p>
                <span class="list-ii">{{newData.devicecount}}</span>
              </p>
            </div>
          </li>
          <li class="w-top-list">
            <div class="list-img w-icon icon-profit"></div>
            <div class="list-c">
              <p>
                <span class="list-i">今日收益</span>
              </p>
              <p>
                <span class="list-ii">{{newData.scoreyes}}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="w-bottom">
        <div class="w-b-t">功能快捷入口</div>
        <div class="w-b-c">
          <ul class="w-b-ul">
            <li class="w-b-list">
              <router-link tag="div" class="w-b-link" to="/userlist">
                <div class="w-icon m-auto icon-setting"></div>
                <div class="w-b-text">
                  <span>用户管理</span>
                </div>
              </router-link>
            </li>
            <li class="w-b-list">
              <router-link tag="div" class="w-b-link" to="/course/list">
                <div class="w-icon m-auto icon-integral"></div>
                <div class="w-b-text">
                  <span>课程管理</span>
                </div>
              </router-link>
            </li>
            <li class="w-b-list">
              <router-link tag="div" class="w-b-link" to="/teacherlist">
                <div class="w-icon m-auto icon-notice"></div>
                <div class="w-b-text">
                  <span>教师管理</span>
                </div>
              </router-link>
            </li>
            <li class="w-b-list">
              <router-link tag="div" class="w-b-link" to="/execrisetype/list">
                <div class="w-icon m-auto icon-ad"></div>
                <div class="w-b-text">
                  <span>题型管理</span>
                </div>
              </router-link>
            </li>
            <li class="w-b-list">
              <router-link tag="div" class="w-b-link" to="/commodity/list">
                <div class="w-icon m-auto icon-setting"></div>
                <div class="w-b-text">
                  <span>商城管理</span>
                </div>
              </router-link>
            </li>
            <li class="w-b-list">
              <router-link tag="div" class="w-b-link" to="/newsmsg/list">
                <div class="w-icon m-auto icon-setting"></div>
                <div class="w-b-text">
                  <span>资讯管理</span>
                </div>
              </router-link>
            </li>
            <li class="w-b-list">
              <router-link tag="div" class="w-b-link" to="/advertisement/list">
                <div class="w-icon m-auto icon-setting"></div>
                <div class="w-b-text">
                  <span>广告管理</span>
                </div>
              </router-link>
            </li>
            <li class="w-b-list">
              <router-link tag="div" class="w-b-link" to="/offline/organization/list">
                <div class="w-icon m-auto icon-setting"></div>
                <div class="w-b-text">
                  <span>面授结构管理</span>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "../../config/apiConfig";

export default {
  name: "index",
  data() {
    return {
      newData: { usercount: null, devicecount: null, scoreyes: null },
      userInfo: {
        userid: "",
        username: "",
        loginIp: "",
        lastLoginIp: "",
        loginTime: "",
        lastLoginTime: ""
      }
    };
  },
  created() {
    this.getTodayUserCount();
  },
  methods: {
    getTodayUserCount() {
      var that = this;
      axios.post(api.api.user.todaycount).then(response => {
        if (response.data.code == 0) {
          that.newData.usercount = response.data.count;
        }
      });
    }
  }
};
</script>

<style scoped>
.m-auto {
  margin: auto;
}

.wrap {
  margin: 0 30px;
}

.wrap ul,
.wrap p {
  margin: 0;
  padding: 0;
}

.wrap ul {
  list-style: none;
}

.wrap a {
  text-decoration: none;
}

.wrap {
  padding-left: 20px;
  text-align: left;
}

.wrap .w-top {
  padding: 60px 0;
}

.wrap .w-top-ul {
  width: 100%;
  overflow: auto;
}

.wrap .w-icon {
  width: 40px;
  height: 40px;
  background-position: center;
  background-repeat: no-repeat;
  -webkit-background-size: contain;
  background-size: contain;
}

.w-top-ul .w-top-list {
  float: left;
  width: 210px;
  height: 60px;
  padding: 20px;
  margin-right: 20px;
  border: 1px solid #e4e4e4;
  text-align: left;
}

.w-top-list .list-img {
  display: inline-block;
  margin-right: 5px;
  vertical-align: middle;
}

.w-top-list .icon-user {
  background-image: url("../../assets/new-user.png");
}

.w-top-list .icon-equipment {
  background-image: url("../../assets/equipment.png");
}

.w-top-list .icon-profit {
  background-image: url("../../assets/profit.png");
}

.w-top-list .list-c {
  display: inline-block;
  vertical-align: middle;
}

.w-top-list .list-c > p {
  margin: 3px 0;
}

.w-top-list .list-c .list-i {
  font-size: 16px;
  color: #999;
}

.w-top-list .list-c .list-ii {
  font-size: 20px;
  color: #666;
}

.wrap .w-bottom {
  width: 100%;
  border: 1px solid #e4e4e4;
}

.w-bottom .w-b-t {
  height: 30px;
  padding: 10px;
  font-size: 16px;
  line-height: 30px;
  font-weight: bold;
  color: #333;
  background-color: #f3f3f3;
}

.w-bottom .w-b-c {
  border-top: 1px solid #e4e4e4;
}

.w-bottom .w-b-ul {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}

.w-bottom .w-b-ul .w-b-list {
  float: left;
  width: 180px;
  height: 150px;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.w-bottom .w-b-ul .w-b-list:hover .w-b-link {
  box-shadow: 5px 5px 15px #ddd;
}

.w-bottom .w-b-ul .w-b-list:hover .w-b-text {
  color: #1abc9c;
}

.w-b-ul .w-b-list .w-b-link {
  background: #fafafa;
  width: 130px;
  height: 100px;
  margin: 10px;
  padding-top: 20px;
  border: 1px solid #e4e4e4;
  border-radius: 2px;
  color: #333;
  font-size: 14px;
  transition: 0.3s;
  cursor: pointer;
}

.w-b-list .w-b-link .icon-setting {
  background-image: url("../../assets/setting.png");
}

.w-b-list .w-b-link .icon-integral {
  background-image: url("../../assets/integral.png");
}

.w-b-list .w-b-link .icon-notice {
  background-image: url("../../assets/notice.png");
}

.w-b-list .w-b-link .icon-ad {
  background-image: url("../../assets/ad.png");
}

.w-b-list .w-b-link .w-b-text {
  margin-top: 10px;
  transition: 0.3s;
}

@media screen and (max-width: 1400px) {
  .wrap {
    margin-left: 0px;
  }
  .wrap .w-top {
    padding: 0 0 30px 0;
  }

  .w-bottom .w-b-t {
    height: 30px;
    padding-top: 5px;
    padding-left: 10px;
    font-size: 14px;
  }
  .w-bottom .w-b-ul .w-b-list {
    width: 15%;
    height: 130px;
  }
  .w-b-ul .w-b-list .w-b-link {
    width: 100px;
    height: 80px;
    margin: 10px auto 0;
    padding-top: 15px;
  }
}
</style>
