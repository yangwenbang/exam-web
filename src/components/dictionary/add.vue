<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加数据字典</span>
    </div>
    <div class="content">
      <div class="panel" v-loading="loading">
        <div class="p-t p-t2">
          <div class="name">
            <span>添加数据字典</span>
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
            <button class="btn" @click="add"><span>提交</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import RankType from '@/components/child-components/ranktype-components/ranktype'
import api from '../../config/apiConfig'

export default {
  name: 'DictionaryAdd',
  data () {
    return {
      wordbook: {
        wbname: '',
        wbtype: '',
        tpname: '',
        wbval1: '',
        wbval2: '',
        remark: ''
      }
    }
  },
  methods: {
    add () {
      var that = this;
      var param = that.wordbook;
      if (param.wbname && param.wbval1 && param.wbtype && param.wbval2 && param.tpname ) {
        axios.post(api.api.wordbook.add, param).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message)
            window.location.href = '/#/wordbook/list'
          }
          else{
            util.alert(response.data.message)
          }
        })
      } else {
        util.alert('输入信息有误，添加失败！')
      }
    }
  }
}
</script>

<style scoped>
  .pi {
    max-height: 100px;
  }
</style>
