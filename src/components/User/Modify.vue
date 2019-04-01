<template>
  <div>
    <div class="head-c">
      <span class="bread-item">修改问题类型</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="type-input">
        <div class="type-name">
          <div class="type-left">
            <span>问题类型名称：</span>
          </div>
          <div class="type-right">
            <input type="text" v-model="typeData.modelName" id="name">
          </div>
        </div>
        <div class="type-introduce">
          <div class="type-left">
            <span>描述：</span>
          </div>
          <div class="type-right">
            <textarea name="" id="desc" v-model="typeData.modelDesc"></textarea>
          </div>
        </div>
      </div>
      <div class="type-submit">
        <button @click="modifyType">确认修改</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import api from '../../config/apiConfig'

  export default {
    name: "Modify",
    data() {
      return {
        loading: true,
        typeId: {
          id: this.$route.params.id
        },
        typeData: {
          id: 0,
          modelName: "",
          modelDesc: ""
        }
      }
    },
    created() {
      this.getType()
    },
    methods: {
      getType() {
        var that = this
        let data = that.typeId
        that.loading = true;
        axios.post(api.api.question.info, data).then(response => {
          if (response.data.bresult) {
            var resObj = response.data.object;
            that.typeData.id = resObj.id;
            that.typeData.modelName = resObj.modelName;
            that.typeData.modelDesc = resObj.modelDesc;
            that.loading = false
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      modifyType() {
        var that = this;
        var modifyData = that.typeData;
        that.loading = true;
        axios.post(api.api.question.upd, modifyData).then(response => {
          that.loading = false
          if (response.data.bresult) {
            util.alert(response.data.message);
            window.location.href = '/#/feedbacktype'
          }else {
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
    resize: none;
    width: 300px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    padding: 0 10px;
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
