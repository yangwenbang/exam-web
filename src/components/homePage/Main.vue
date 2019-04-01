<template>
  <div>
    <div class="head"></div>
    <div class="lm">
      <ul>
        <li>
          <span class="white-color">首页</span>
        </li>
        <li>
          <div>
            <span class="white-color">用户管理</span>
            <i></i>
          </div>
          <ul>
            <li></li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="rc">
      <div>11111111111</div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    data () {
      return {}
    },
    methods: {}
  }
</script>
<style scoped>
  .white-color {
    color: #fff;
  }

  .head {
    background: #31c3a6;
    height: 50px;
    position: fixed;
    top: 0;
    z-index: 11;
    width: 100%;
  }

  .lm {
    width: 220px;
    background: #324057;
    position: fixed;
    z-index: 10;
    height: 100%;
    padding-top: 50px;
  }

  .lm > ul {
    margin-left: -40px;
    text-align: left;
  }

  .lm > ul li {
    padding: 0 20px;
    margin: 30px 0;
  }

  .rc {
    background: #ddd;
    padding-top: 50px;
    padding-left: 120px;
  }

  .footer {
    background: #fafafa;
    height: 50px;
    position: fixed;
    bottom: 0;
    z-index: 9;
    padding-left: 50px;
    border-top: solid 1px #ddd;
    width: 100%;
  }
</style>
