<template>
  <div>
    <div class="head-c">
      <span class="bread-item">修改商品信息</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="g-input">
        <div class="g-name">
          <div class="g-left">
            <span>商品名称：</span>
          </div>
          <div class="g-right">
            <input type="text" v-model="product.name">
          </div>
        </div>
        <div class="g-price">
          <div class="g-left">
            <span>积分类型：</span>
          </div>
          <div class="g-right">
            <!--<input type="text" v-model="product.rankType">-->
            <el-select v-model="product.rankType" clearable placeholder="请选择">
              <el-option v-for="item in rankTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="g-price">
          <div class="g-left">
            <span>售价（积分）：</span>
          </div>
          <div class="g-right">
            <input type="text" v-model="product.score">
          </div>
        </div>
        <div class="g-price">
          <div class="g-left">
            <span>售价（RMB）：</span>
          </div>
          <div class="g-right">
            <input type="text" v-model="product.rmb">
          </div>
        </div>
        <div class="g-introduce" style="margin-top: 30px">
          <div class="g-left">
            <span>商品介绍：</span>
          </div>
          <div class="g-right">
            <textarea name="" v-model="product.remark"></textarea>
          </div>
        </div>
        <div class="g-img">
          <div class="g-left">
            <span>商品图片：</span>
          </div>
          <div class="g-right">
            <fileUpload ref="fileUpload" :imgPath="product.imgPath">aaa</fileUpload>
          </div>
        </div>
      </div>
      <div class="g-submit">
        <button @click="updProduct">修改信息</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import fileUpload from '@/components/child-components/upload-components/webupload'
  import api from '../../config/apiConfig'

  export default {
    name: 'UpdGoods',
    components: {fileUpload},
    data () {
      return {
        willhide: true,
        loading: false,
        fileList: [],
        paramId: {
          id: this.$route.query.id
        },
        ext: 'png,jpg,jpeg,mp3,mp4,pdf',
        tip: '可上传png/jpg/jpeg/mp3/mp4/pdf，大小不超过200M',
        product: {
          id: this.$route.query.id,
          name: '',
          score: '',
          rmb: '',
          rankType: '',
          remark: '',
          imgPath: '',
          userId: '',
          stock: '',
          volume: ''
        },
        rankTypeOptions: [
          {value: 1, label: '电信积分'},
          {value: 2, label: 'int积分'}
        ]
      }
    },
    created () {
      this.getProductById()
    },
    methods: {
      getProductById: function () {
        var data = this.paramId
        var that = this
        that.loading = true
        axios.post(api.api.product.listInfo, data).then(response => {
          that.loading = false
          var product = response.data.object
          that.product = product
          this.$refs.fileUpload.$data.img.urlPath = product.imgPath;
        }).catch(res => {
          util.alert('网络错误！')
          that.loading = false
        })
      },
      updProduct: function () {
        var that = this
        this.product.imgPath = this.$refs.fileUpload.$data.img.urlPath
        var param = this.product
        that.loading = true
        axios.post(api.api.product.modify, param).then(response => {
          that.loading = false
          if (response.data.bresult) {
            util.alert(response.data.message)
            window.location.href = '/#/recharge/goodslist'
          } else {
            util.alert(response.data.message)
          }
        }).catch(res => {
          util.alert('网络错误！')
          that.loading = false
        })
      },
      hide: function () {
        if (this.willhide === true) {
          this.willhide = false
        }
      }
    }
  }
</script>

<style scoped>
  div.content {
    text-align: left;
    font-size: 14px;
  }

  .content .g-input {
    margin-bottom: 50px;
  }

  .content .g-input > div {
    margin: 20px 0;
  }

  .content .g-left,
  .content .g-right {
    display: inline-block;
  }

  .content .g-left {
    width: 200px;
    text-align: right;
  }

  .g-introduce .g-left {
    vertical-align: top;
  }

  .g-right input {
    height: 35px;
    width: 510px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    padding-left: 10px;
  }

  .g-right textarea {
    margin-top: -10px;
    width: 500px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    padding: 10px;
    resize: none;
    font-size: 14px;
  }

  .content .g-submit button {
    width: 200px;
    height: 35px;
    margin-left: 205px;
    border: 0;
    border-radius: 3px;
    background-color: #1abc9c;
    color: #fff;
    outline: none;
  }
</style>
