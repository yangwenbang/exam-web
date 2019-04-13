<template>
  <div class="footer">
    <div class="information">
      <p class="m-t">
        <span>继续教育一考通--后台管理系统@1.0.1</span>
        <!-- <span>区块链智能终端--后台管理系统@1.0.1</span> -->
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Bottombar",
  data() {
    return {};
  }
};
</script>

<style scoped>
.footer {
  background: #f8f8f8;
  height: 50px;
  line-height: 50px;
  position: fixed;
  bottom: 0;
  left: 220px;
  z-index: 2001;
  border-top: solid 1px #ddd;
  width: 100%;
  color: #000;
  font-size: 14px;
}
.footer .m-t {
  text-align: left;
  margin-left: 50px;
}
.footer .m-t span:first-of-type {
  margin-right: 20px;
}

@media screen and (max-width: 1450px) {
  .footer {
    left: 185px;
  }
}
</style>
