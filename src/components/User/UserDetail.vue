<template>
  <div id="user-detail">
    <!--用户详情-->
    <div class="user-D">
      <div class="detail-t">
        <span>用户基本信息</span>
      </div>
      <div class="detail-c clearfix">
        <div class="detail-c-left">
          <div class="U-phone detail-msg">
            <span>用户账号 : </span><span>{{message}}</span>
          </div>
          <div class="U-name detail-msg">
            <span>用户昵称 : </span><span>{{message}}</span>
          </div>
          <div class="U-reg detail-msg">
            <span>注册时间 : </span><span>{{message}}</span>
          </div>
          <div class="U-login detail-msg">
            <span>最近登录 : </span><span>{{message}}</span>
          </div>
          <div class="U-integral detail-msg">
            <span>可用积分 : </span><span>{{message}}</span>
          </div>
        </div>
        <div class="detail-c-right">
          <div class="U-state detail-msg">
            <span>账户启用状态 : </span><span>{{message}}</span>
          </div>
          <div class="U-eid detail-msg">
            <span>用户所绑设备ID : </span><span>{{message}}</span>
          </div>
        </div>
      </div>
    </div>
    <!--设备详情-->
    <div class="equip-D">
      <div class="detail-t">
        <span>用户所绑设备信息</span>
      </div>
      <div class="detail-c clearfix">
        <div class="detail-c-left">
          <div class="E-id detail-msg">
            <span>设备ID : </span><span>{{message}}</span>
          </div>
          <div class="E-mac detail-msg">
            <span>设备MAC : </span><span>{{message}}</span>
          </div>
          <div class="E-active detail-msg">
            <span>是否激活 : </span><span>{{message}}</span>
          </div>
          <div class="E-bind detail-msg">
            <span>是否绑定 : </span> <span>{{message}}</span>
          </div>
          <div class="E-id detail-msg">
            <span>是否在线 : </span><span>{{message}}</span>
          </div>
        </div>
        <div class="detail-c-right">
          <div class="E-id detail-msg">
            <span>所属用户 : </span><span>{{message}}</span>
          </div>
          <div class="E-id detail-msg">
            <span>是否启用 : </span><span>{{message}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "UserDetail",
    data() {
      return {
        message: '8972400929'
      }
    },
    methods: {}
  }
</script>

<style scoped>
  .clearfix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  #user-detail {
    text-align: left;
    font-size: 14px;
  }

  #user-detail .user-D {
    margin-bottom: 20px;
  }

  #user-detail .detail-t {
    padding-left: 20px;
    background-color: #f1f1f1;
    height: 50px;
    line-height: 50px;
  }

  #user-detail .detail-c {
    padding: 20px;
    border: 1px solid #f1f1f1;
  }

  .detail-c .detail-c-left,
  .detail-c .detail-c-right {
    width: 30%;
    float: left;
  }

  .detail-c .detail-msg {
    height: 50px;
    line-height: 50px;
  }

  .detail-c .detail-msg > span {
    margin: 0 5px 0 0;
  }

  .detail-c .detail-msg > span:first-of-type{
    color: #1ABC9C;
  }
</style>
