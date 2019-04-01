<template>
  <div>
    <div class="head-c">
      <span class="bread-item">修改配置信息</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>修改配置信息</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>配置名称：</span>
            </div>
            <div class="tr">
              <input type="text"  v-model="config.name">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>配置KEY：</span>
            </div>
            <div class="tr">
              <input type="text"  v-model="config.ckey">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>配置内容url：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="config.cvalue">
            </div>
          </div>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="ConfigUpd"><span>提交</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import api from '../../config/apiConfig'

  export default {

    name: 'ConfigUpd',
    data() {
      return {
        configid: {
          id: this.$route.query.id
        },
        config: {
          id: '',
          ckey: '',
          cvalue: '',
          name: ''
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        var that = this;
        var data = that.configid;
        console.log(1111,data)
        axios.post(api.api.config.getconfig, data).then(response => {
          if (response.data.bresult) {
            var param = response.data.object;
            console.log(param)
            that.config = param;
          }
        })
      },
      ConfigUpd() {
        var that = this;
        var param = that.config;
        console.log(param);
        axios.post(api.api.config.upd, param).then(response => {
          if (response.data.bresult) {
           util.alert(response.data.message);
            window.location.href = '/#/configs/list'
          } else {
            util.alert(response.message)
          }
        })
      }
    }

  }
</script>

<style scoped>
  .pi {
    max-height: 100px;
  }

</style>
