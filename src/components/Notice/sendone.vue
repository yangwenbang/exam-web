<template>
  <div>
    <div class="head-c">
      <span class="bread-item">私发消息</span>
    </div>
    <div class="content">
      <div class="notice-t">
        <span>私发消息</span>
      </div>
      <div class="g-input">
        <div class="g-name">
          <div class="g-left">
            <span class="sign">*</span><span>消息标题：</span>
          </div>
          <div class="g-right">
            <input type="text" v-model="sendMsg.title">
          </div>
        </div>
        <div class="g-introduce">
          <div class="g-left">
            <span class="sign">*</span><span>消息内容：</span>
          </div>
          <div class="g-right">
            <textarea name="" v-model="sendMsg.content"></textarea>
          </div>
        </div>
        <div class="g-name">
          <div class="g-left">
            <span class="sign">*</span><span>消息类型：</span>
          </div>
          <div class="g-right">
            <el-select v-model="sendMsg.noticeType" clearable placeholder="请选择" @change="imgShow">
              <el-option v-for="item in sendOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="g-name">
          <div class="g-left">
            <span class="sign">*</span><span>用户账号：</span>
          </div>
          <div class="g-right">
            <input type="text" v-model="sendUser.phone" readonly="readonly">
          </div>
        </div>
        <div class="g-name" v-if="isShow">
          <div class="g-left">
            <span></span><span>选择图片：</span>
          </div>
          <div class="g-right">
            <fileUpload ref="fileUpload"></fileUpload>
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
        <button @click="sendone">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import fileUpload from '../child-components/upload-components/webupload'
  import api from '../../config/apiConfig'

  export default {
    name: "sendone",
    components: {
      fileUpload
    },
    data() {
      return {
        isShow: true,
        sendId: {
          id: this.$route.params.id
        },
        sendUser: {},
        sendMsg: {
          content: '',
          title: '',
          noticeType: null,
          userId: '',
          imgurl: '',
          admin: ''
        },
        sendOptions: [
          {value: '0', label: '站内消息'},
          {value: '1', label: '手机短信'}
        ]
      }
    },
    created () {
      this.getPhone();
    },
    methods: {
      imgShow (){
        var val = this.sendMsg.noticeType;
        if (val === '1'){
          this.isShow = false
        } else {
          this.isShow = true
        }
      },
      getPhone () {
        var that = this;
        var param = that.sendId;
        axios.post(api.api.user.queryOnly, param).then(response => {
          if (response.data.bresult) {
            that.sendUser = response.data.object;
          }
        })
      },
      sendone() {
        var that = this;
        var data = that.sendMsg;
        data.imgurl = data.noticeType === '0' ? that.$refs.fileUpload.$data.img.urlPath : '';
        data.userId = that.sendUser.id;
        data.admin = JSON.parse(sessionStorage.getItem('info')).user.username;
        if (data.content && data.noticeType && data.userId) {
          axios.post(api.api.noticemsg.sendOne, data).then(response => {
            if (response.data.bresult) {
              util.alert(response.data.message);
              if (data.noticeType === '0'){
                window.location.href = '/#/notice/list'
              } else if (data.noticeType === '1'){
                window.location.href = '/#/notice/msglist'
              }
            }
          })
        } else {
          util.alert("输入信息不完整，发送失败！")
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

  div.content .notice-t {
    margin-bottom: 30px;
    font-weight: bold;
    font-size: 20px;
    line-height: 60px;
    border-bottom: 1px solid #e4e4e4;
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

  .g-right select {
    height: 35px;
    width: 200px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    padding-left: 10px;
  }

  .g-right textarea {
    width: 500px;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    padding: 0 10px;
    resize: none;
  }

  .content .g-submit button {
    width: 250px;
    height: 35px;
    margin-left: 330px;
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
