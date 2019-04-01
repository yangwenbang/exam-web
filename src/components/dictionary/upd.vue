<template>
  <div>
    <div class="head-c">
      <span class="bread-item">修改数据字典</span>
    </div>
    <div class="content">
      <div class="panel" v-loading="loading">
        <div class="p-t p-t2">
          <div class="name">
            <span>修改数据字典</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>名称：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="wordbook.wbname">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>类型：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="wordbook.wbtype">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>下拉框参数：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="wordbook.tpname">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>有效值1：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="wordbook.wbval1">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>有效值2：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="wordbook.wbval2">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>描述：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="wordbook.remark">
            </div>
          </div>
          <div class="i" style="text-align: center;">
            <button class="btn" @click="wordbookUpd"><span>修改</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import api from '../../config/apiConfig'

  export default {

    name: 'DictionaryUpd',
    data () {
      return {
        loading: true,
        wordbookId: {
          id: this.$route.params.id
        },
        wordbook: {
          wbname: '',
          tpname: '',
          wbtype: '',
          wbval1: '',
          wbval2: '',
          remark: ''
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        var that = this;
        var param = that.wordbookId;
        that.loading = true
        axios.post(api.api.wordbook.queryById, param).then(response => {
          if (response.data.bresult) {
            that.loading = false
            var data = response.data.object;
            console.log(data);
            that.wordbook = data;
          }
        })
      },
      wordbookUpd() {
        var that = this;
        var param = that.wordbook;
        axios.post(api.api.wordbook.upd, param).then(response => {
          if (response.data.bresult) {
           util.alert(response.data.message);
            window.location.href = '/#/wordbook/list'
          } else {
            util.alert(response.message)
          }
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
