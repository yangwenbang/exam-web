<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加Banner</span>
    </div>
    <div class="content">
      <div class="panel" v-loading="loading">
      <div class="p-t p-t2">
        <div class="name">
          <span>添加banner</span>
        </div>
      </div>
      <div class="p-c">
        <div class="i">
          <div class="tl">
            <span>标题：</span>
          </div>
          <div class="tr">
            <input type="text" placeholder="输入标题" v-model="banner.title">
          </div>
        </div>
        <div class="i">
          <div class="tl">
            <span>Url链接：</span>
          </div>
          <div class="tr">
            <input type="text" placeholder="输入url" v-model="banner.attribute1"><span class="url-tip"> * Url链接必须完整，包含协议。</span>
          </div>
        </div>
        <div class="i" style="height: 120px;">
          <div class="tl">
            <span>banner图片：</span>
          </div>
          <div class="tr">
            <fileUpload ref="fileUpload"></fileUpload>
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
import fileUpload from '@/components/child-components/upload-components/webupload'
import api from '../../config/apiConfig'

export default {
  components: {
    fileUpload
  },
  name: 'BannerAdd',
  data () {
    return {
      banner: {
        attribute1: 'http://',
        title: '',
        imgPath: ''
      },
      loading: false
    }
  },
  created () {},
  methods: {
    add: function () {
      this.banner.imgPath = this.$refs.fileUpload.$data.img.urlPath
      var param = this.banner
      var that = this;
      this.loading = true
      console.log(param.imgPath);
      // 添加请求头
      if (param.title && param.imgPath) {
        axios.post(api.api.banner.add, param).then(response => {
          that.loading = false
          if (response.data.bresult) {
            util.alertdo('添加成功', function () {
              window.location.href = '/#/banner/list'
            })
          } else {
            util.alert(response.data.message)
          }
        }).catch(res => {
          util.alert('网络错误！')
          that.loading = false
        })
      } else {
        util.alert('信息不完整，添加失败！')
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

  .url-tip {
    color: #f00;
    margin-left: 10px;
    font-size: 12px;
  }
</style>
