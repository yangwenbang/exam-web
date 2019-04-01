<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加配置信息</span>
    </div>
    <div class="content">
      <div class="panel" v-loading="loading">
        <div class="p-t p-t2">
          <div class="name">
            <span>添加配置</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>名称：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="config.name">
              <div class="warm"><span>请确认内容正确，提交后无法修改</span></div>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>配置KEY：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="config.ckey">
              <div class="warm"><span>请确认内容正确，提交后无法修改</span></div>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>配置内容：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="config.cvalue">
            </div>
          </div>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="add"><span>提交</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import RankType from '@/components/child-components/ranktype-components/ranktype'
  import api from '../../config/apiConfig'

  export default {
    name: 'ConfigAdd',
    data () {
      return {
        config: {
          ckey: '',
          cvalue: '',
          name: ''
        },
        loading: false
      }
    },
    methods: {
      add: function () {
        var param = this.config;
        var that = this;
        that.loading = true;
        if (that.config.ckey && that.config.cvalue && that.config.name) {
          axios.post(api.api.config.add, param).then(response => {
            that.loading = false;
            if (response.data.bresult) {
              util.alert(response.data.message)
              window.location.href = '/#/configs/list'
            } else {
              util.alert(response.data.message);
            }
          }).catch(res => {
            util.alert('网络错误！')
            that.loading = false
          })
        } else {
          util.alert('输入内容不能为空！')
          that.loading = false
        }
      }

    }

  }
</script>

<style scoped>

  .pi {
    max-height: 100px;
  }

  .i .warm {
    color: #f00;
    font-size: 14px;
  }

  .panel .p-c .i {
    text-align: left;
    height: 75px;
    width: 100%;
  }
</style>
