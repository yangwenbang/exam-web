<template>
  <div>
    <div class="head-c">
      <span class="bread-item">增加问题类型</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="type-input">
        <div class="type-name">
          <div class="type-left">
            <span>问题类型名称：</span>
          </div>
          <div class="type-right">
            <input type="text" v-model="typeData.modelName">
          </div>
        </div>
        <div class="type-introduce" style="margin-top: 30px">
          <div class="type-left">
            <span>描述：</span>
          </div>
          <div class="type-right">
            <textarea name="" id="" v-model="typeData.modelDesc"></textarea>
          </div>
        </div>
      </div>
      <div class="type-submit">
        <button @click="addType" :disabled="isDisable">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import api from  '../../config/apiConfig'

  export default {
    name: 'AddType',
    data() {
      return {
        typeData: {
          modelName: "",
          modelDesc: ""
        },
        isDisable: false,
        loading: false
      }
    },
    methods: {
      addType() {
        this.isDisable = true
        setTimeout(() => {
          this.isDisable = false
        }, 1000)
        var that = this;
        let data = that.typeData;
        that.loading = true
        axios.post(api.api.question.add, data).then(response => {
          that.loading = false;
          if (response.data.bresult) {
            data.modelDesc = '';
            data.modelName = '';
            util.alertdo('添加成功!',function () {
              window.location.href = '/#/feedbacktype'
            });
          } else {
            util.alert(response.data.message)
          }
        })
          .catch(error => {
            console.log(error)
            that.loading = false
          })
      }
    }
  }
</script>

<style scoped>
  div.content {
    text-align: left;
    font-size: 14px;
  }

  .content .type-input {
    margin-bottom: 50px;
  }

  .content .type-input > div {
    margin: 20px 0;
  }

  .content .type-left,
  .content .type-right {
    display: inline-block;
  }

  .content .type-left {
    width: 200px;
    text-align: right;
  }

  .type-introduce .type-left {
    vertical-align: top;
  }

  .type-right input {
    height: 35px;
    width: 310px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    padding-left: 10px;
  }

  .type-right textarea {
    margin-top: -10px;
    resize: none;
    width: 300px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    padding: 10px;
  }

  .content .type-submit button {
    width: 322px;
    height: 35px;
    margin-left: 205px;
    border: 0;
    border-radius: 3px;
    background-color: #1abc9c;
    color: #fff;
    outline: none;
  }
</style>
