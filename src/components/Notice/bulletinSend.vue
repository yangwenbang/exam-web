<template>
  <div>
    <div class="head-c">
      <span class="bread-item">发送系统公告</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="c-b">
        <div class="c-t"><span>公告标题：</span></div>
        <div class="c-i"><input type="text" placeholder="输入标题" v-model="sendBulletin.title"></div>
      </div>
      <div class="c-b">
        <div class="c-t"><span>内容编辑：</span></div>
        <div class="ckeditor">
          <textarea id="editor" rows="10" cols="100"></textarea>
        </div>
      </div>
      <div class="send-btn">
        <button class="btn" @click="send()"><span>发送</span></button>
      </div>
      <!--<div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>发送系统公告</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>公告标题：</span>
            </div>
            <div class="tr">
              <input type="text" placeholder="输入标题" v-model="sendBulletin.title">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>内容简介：</span>
            </div>
            <div class="tr">
              <input type="text" placeholder="输入内容" v-model="sendBulletin.content">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>Url链接：</span>
            </div>
            <div class="tr">
              <input type="text" placeholder="输入url" v-model="sendBulletin.url">
            </div>
          </div>
          <div class="i" style="text-align: center; margin-top: 30px">
            <button class="btn" @click="send"><span>发送</span></button>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import fileUpload from '../child-components/upload-components/webupload'
import api from '../../config/apiConfig'

export default {
  name: "bulletinSend",
  components: {
    fileUpload
  },
  data () {
    return {
      loading: false,
      sendBulletin: {
        title: '',
        content: ''
      },
    }
  },
  created () {
  },
  mounted () {
    CKEDITOR.replace('editor',{
      filebrowserImageUploadUrl: '/router/upload/file/upload',
      language : 'zh-cn',
    });
  },
  methods: {
    send () {
      var that = this;
      that.loading = true
      var html = '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1 user-scalable=no"></head><body>';
      var data = CKEDITOR.instances.editor.getData();
      var param = that.sendBulletin;
      param.content = html + data + '</body>';
      if (param.title && param.content) {
        axios.post(api.api.noticemsg.system, param).then(res => {
          if (res.data.bresult) {
            util.alert(res.data.message)
          } else {
            util.alert(res.data.message)
          }
          that.loading = false;
        }).catch(res => {
          util.alert('网络错误！')
          that.loading = false;
        })
      } else {
        util.alertdo('公告标题和内容不能为空！',function () {
          that.loading = false;
        })
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

  div.content .send-btn {
    text-align: center;
    margin-top: 30px;
    padding-bottom: 50px;
  }

  .send-btn .btn {
    width: 80px;
    height: 35px;
    border: 0;
    border-radius: 3px;
    font-size: 16px;
    color: #fff;
    background-color: #1ABC9C;
    outline: none;
    cursor: pointer;
  }

  .content .c-b {
    margin: 20px 0;
  }

  .content .c-b .c-t {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .content .c-b .c-i input {
    height: 26px;
    padding: 5px 7px;
    width: 90%;
    border: 1px solid #ccc;
  }
</style>
