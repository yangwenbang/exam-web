<template>
  <div>
    <div class="head-c">
      <span class="bread-item">Banner修改</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>修改banner</span>
          </div>
        </div>
        <div class="p-c" v-loading="loading">
          <div class="i">
            <div class="tl">
              <span>标题：</span>
            </div>
            <div class="tr">
              <input type="text" placeholder="输入标题" v-model="modifyBanner.title">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>Url链接：</span>
            </div>
            <div class="tr">
              <input type="text" placeholder="输入url" v-model="modifyBanner.attribute1">
            </div>
          </div>
          <div class="i" style="height: 120px;">
            <div class="tl">
              <span>banner图片：</span>
            </div>
            <div class="tr">
              <fileUpload ref="fileUpload" :imgPath="modifyBanner.imgPath"></fileUpload>
            </div>
          </div>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="editBan"><span>提交</span></button>
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
        loading: true,
        getBanner: {
          id: this.$route.params.id
        },
        modifyBanner:{
          attribute1: '',
          title: '',
          imgPath: ''
        }
      }
    },
    created () {
      this.getBan()
    },
    methods: {
      getBan () {
        var that = this
        var param = that.getBanner
        that.loading = true
        axios.post(api.api.banner.modify , param).then(response =>{
          if (response.data.bresult) {
            that.modifyBanner = response.data.object
            that.loading = false
          }
        })
      },
      editBan () {
        this.modifyBanner.imgPath = this.$refs.fileUpload.$data.img.urlPath
        var param = this.modifyBanner;
        var that = this
        that.loading = true
        axios.post(api.api.banner.edit, param).then(response =>{
          that.loading = false
          if (response.data.bresult) {
            util.alertdo('修改成功！' ,function () {
              window.location.href = '/#/banner/list'
            })
          } else {
            util.alert(response.data.message)
          }
        }).catch(res => {
          util.alert('网络错误！')
          that.loading = false
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
