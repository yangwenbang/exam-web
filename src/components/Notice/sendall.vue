<template>
  <div>
    <div class="head-c">
      <span class="bread-item">群发站内信</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="notice-t">
        <span>群发站内信</span>
      </div>
      <div class="g-input">
        <div class="g-name">
          <div class="g-left">
            <span class="sign">*</span><span>信息标题：</span>
          </div>
          <div class="g-right">
            <input type="text" v-model="sendMsg.title">
          </div>
        </div>
        <div class="g-introduce" style="margin-top: 28px;">
          <div class="g-left">
            <span class="sign">*</span><span>信息内容：</span>
          </div>
          <div class="g-right" style="margin-top: -8px">
            <textarea name="" v-model="sendMsg.content"></textarea>
          </div>
        </div>
        <div class="g-name">
          <div class="g-left">
            <span class="sign">*</span><span>信息类型：</span>
          </div>
          <div class="g-right">
            <el-select v-model="sendMsg.noticeType" clearable placeholder="请选择" >
              <el-option v-for="item in sendOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="g-name">
          <div class="g-left">
            <span class="sign">*</span><span>用户：</span>
          </div>
          <div class="g-right">
            <select name="" id="u-type" v-model="sendMsg.ids">
              <option value="">请选择用户组</option>
              <option value="null">所有用户</option>
              <!--<option value="0">其他。。。</option>-->
            </select>
          </div>
        </div>
        <!--<div class="g-name" v-if="isShow">-->
          <!--<div class="g-left">-->
            <!--<span></span><span>选择图片：</span>-->
          <!--</div>-->
          <!--<div class="g-right">-->
            <!--<fileUpload ref="fileUpload"></fileUpload>-->
          <!--</div>-->
        <!--</div>-->
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
        <button @click="sendAll">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import fileUpload from '../child-components/upload-components/webupload'
  import api from '../../config/apiConfig'
  export default {
    name: "sendall",
    components: {
      fileUpload
    },
    data() {
      return {
        loading: false,
        sendMsg: {
          content: '',
          title: '',
          noticeType: null,
          ids: '',
          imgurl: null,
          admin: ''
        },
        isShow: true,
        sendOptions: [
          {value: '0', label: '站内消息'},
          // {value: '1', label: '手机短信'}
        ]
      }
    },
    methods: {
      // imgShow(){
      //   var val = this.sendMsg.noticeType;
      //   if (val === '1'){
      //     this.isShow = false
      //   } else {
      //     this.isShow = true
      //   }
      // },
      sendAll() {
        var that = this;
        that.loading = true
        // that.sendMsg.imgurl = that.sendMsg.noticeType === '0' ? that.$refs.fileUpload.$data.img.urlPath : '';
        that.sendMsg.admin = JSON.parse(sessionStorage.getItem('info')).user.username;
        var param = that.sendMsg;
        if (param.ids === 'null'){
          param.ids = null;
        } ;
        if (param.content && param.noticeType) {
          axios.post(api.api.noticemsg.sendMany, param).then(response => {
            if (response.data.bresult) {
              that.loading = false;
              util.alert(response.data.message)
              // if (param.noticeType === '0') {
                window.location.href = '/#/notice/list'
              // } else if (param.noticeType === '1') {
              //   window.location.href = '/#/notice/msglist'
              // }
            } else {
              that.loading = false
              util.alert(response.data.message)
            }
          })
        } else {
          that.loading = false;
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
    width: 522px;
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
    padding: 10px;
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

  .content .sign {
    color: #f00;
    margin: 0 5px;
  }

  .tip {
    font-size: 12px;
    color: #f00;
  }

  .tip .sign {
    font-size: 14px;
  }

  .g-name .g-right .el-select .ele {
    height: 35px;
    width: 200px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    padding-left: 10px;
  }
</style>
