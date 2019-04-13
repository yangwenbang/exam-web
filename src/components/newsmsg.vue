<template>
  <div class="pc">
    <div class="pt">
      <div class="t">
        <span>{{msg.msgName}}</span>
      </div>
      <!-- <div class="tt">发布时间：{{msg.publishDate}}</div> -->
    </div>
    <p class="pp" v-html="msg.msgContent"></p>
    <div class="pf">
      <div class="i1">Copyright © 2019-2039</div>
      <div class="i2">异视界科技技术支持</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "../config/apiConfig";
import utils from "@/vendor/utils.js";

export default {
  name: "NewsContent",
  data() {
    return {
      msg: {}
    };
  },
  created() {
    this.getinfo();
  },
  watch: {},
  methods: {
    getinfo() {
      if (this.$route.params.id != 0) {
        var url = api.api.msg.info + "/" + this.$route.params.id;
        axios.post(url).then(response => {
          console.log(response.data);
          var rdata = response.data;
          if (rdata.code == 0) {  
            this.msg = rdata.newMsg;
          }
        });
      }
    }
  }
};
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 300px;
}
@media screen and (max-width: 700px) {
  img {
    max-width: 100%;
    max-height: 300px;
  }
  .pc {
    position: relative;
  }
  p {
    text-align: left;
    width: 100%;
  }
  .pt {
    text-align: left;
    margin: 5px 10px;
    margin-bottom: 20px;
  }
  .pt .t {
    font-size: 16px;
    font-weight: bold;
    width: 100%;
    border-bottom: solid 1px #ddd;
  }
  .pt .t span {
    line-height: 30px;
  }
  .pt .tt {
    margin-top: 5px;
    text-align: right;
    font-size: 14px;
  }
  .pp {
    font-size: 14px;
    margin: 5px;
    max-width: 100%;
  }

  .pf {
    border-top: solid 1px #ddd;
    background: #f2f2f2;
    width: 100%;
  }
  .pf .i1 {
    margin-top: 8px;
    height: 30px;
    font-size: 14px;
  }
  .pf .i2 {
    height: 20px;
    font-size: 12px;
  }
}
</style>
