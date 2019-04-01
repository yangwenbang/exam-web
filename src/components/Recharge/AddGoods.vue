<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加商品</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="g-input">
        <div class="g-name">
          <div class="g-left">
            <span class="sign">*</span><span>商品名称：</span>
          </div>
          <div class="g-right">
            <input type="text" v-model="product.name">
          </div>
        </div>
        <div class="g-price">
          <div class="g-left">
            <span class="sign">*</span><span>积分类型：</span>
          </div>
          <div class="g-right">
            <el-select v-model="product.rankType" clearable placeholder="请选择">
              <el-option v-for="item in rankTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="g-price">
          <div class="g-left">
            <span class="sign">*</span><span>售价（积分）：</span>
          </div>
          <div class="g-right">
            <input type="text" v-model="product.score">
          </div>
        </div>
        <div class="g-price">
          <div class="g-left">
            <span class="sign">*</span><span>售价（RMB）：</span>
          </div>
          <div class="g-right">
            <input type="text" v-model="product.rmb">
          </div>
        </div>
        <div class="g-introduce" style="margin-top: 30px">
          <div class="g-left">
            <span></span><span>商品介绍：</span>
          </div>
          <div class="g-right">
            <textarea name="" v-model="product.remark"></textarea>
          </div>
        </div>
        <div class="g-img">
          <div class="g-left">
            <span class="sign">*</span><span>商品图片：</span>
          </div>
          <div class="g-right">
            <fileUpload ref="fileUpload">aaa</fileUpload>
          </div>
        </div>
        <div class="tip">
          <div class="g-left">
            <span>注意：</span>
          </div>
          <div class="g-right">
            <span class="sign">*</span><span>为必填项</span>
          </div>
        </div>
      </div>
      <div class="g-submit">
        <button @click="addProduct">发布商品</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import fileUpload from '@/components/child-components/upload-components/webupload'
  import api from '../../config/apiConfig'

  export default {
    name: 'hello',
    components: {fileUpload},
    data() {
      return {
        fileList: [],
        loading: false,
        ext: 'png,jpg,jpeg,mp3,mp4,pdf',
        tip: '可上传png/jpg/jpeg/mp3/mp4/pdf，大小不超过200M',
        product: {
          name: '',
          score: 0,
          rmb: 0,
          rankType: '',
          remark: '',
          imgPath: '',
          userId: ''
        }, rankTypeOptions: [
          {value: '1', label: '电信积分'},
          {value: '2', label: 'int积分'}
        ]
      }
    },
    created() {},
    methods: {
      addProduct: function () {
        var that = this
        that.loading = true
        this.product.imgPath = this.$refs.fileUpload.$data.img.urlPath;
        var param = this.product;
        if (Number(param.score)){
          if (Number(param.score) < 0) {
            util.alert('售价错误！');
            this.product.score = 0;
            return;
          }
        } else {
          util.alert('售价错误！');
          this.product.score = 0;
          return;
        }
        // 添加请求头
        if (param.name && param.score){
          axios.post(api.api.product.add, param).then(response => {
            that.loading = false
            if (response.data.bresult) {
              util.alert('添加成功')
              window.location.href = "/#/recharge/goodslist";
            } else {
              util.alert(response.data.message)
            }
          }).catch(res => {
            console.log(res);
            that.loading = false
          })
        } else {
          util.alert('商品信息不完整，添加失败！')
          that.loading = false
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
    height: 300px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    padding: 10px;
    resize: none;
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

  .content .sign{
    color: #f00;
    margin: 0 5px;
  }

  .tip{
    font-size: 12px;
    color: #f00;
  }

  .tip .sign{
    font-size: 14px;
  }
</style>
