<template>
  <div class="Chooser">
    <div class="cin" v-if="tagObj.key" style="text-align:left">
      <span class="cs">{{tagObj.value}}<i @click="delItem" class="el-icon-circle-close"></i></span>
    </div>
    <input type="text" v-if="!tagObj.key" hasclear="0" class="cin" v-model="tagObj.value" @click="decrement($event)"
           @keyup="decrement($event)">
    <div class="la" v-show="hasShow">
      <div :class="[ 'sitem', {'nitem': index%2==0}]" v-for="(item,index) in sourceList" @click="selItem(item)">
        <span>{{item.username}}({{item.phone}})</span>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import api from '../../../config/apiConfig'

  export default {
    name: 'userSelect',
    props: {
      // 总条数
      bInit: {
        default: function () {
          return true
        }
      }
    },
    data () {
      return {
        sourceList: [],
        hasShow: false,
        tagObj: {
          value: '',
          key: ''
        }
      }
    },
    watch: {
      bInit: function (n, o) {
        this.sourceList = []
        this.tagObj = {
          value: '',
          key: ''
        }
      }
    },
    methods: {
      decrement: function (e) {
        var that = this
        var element = e.target
        var hasclear = $(element).attr('hasclear')
        if (hasclear == '1') {
          this.sourceList = []
          this.tagObj = {
            value: '',
            key: ''
          }
          $(element).attr('hasclear', '0')
        }
        var top = $(element).position().top
        var left = $(element).position().left
        var height = $(element).outerHeight(true)
        var width = $(element).outerWidth(true)
        var la = $(element).next()
        $(la).css({
          width: width,
          top: top + height + 2,
          left: left
        })
        this.hasShow = true
        var param = {
          conditions:
            {
              phone: this.tagObj.value
            },
          page: {
            page: 1,
            num: 10,
            totalSize: 0
          }
        }
        axios.post(api.api.user.like, param).then(response => {
          if (response.data.bresult) {
            that.sourceList = response.data.object
          }
        })
      },
      selItem (item) {
        this.hasShow = false
        this.tagObj.value = item.username
        this.tagObj.key = item.id
        this.hasShow = false
        this.$emit('selUser', this.tagObj)
      },
      delItem () {
        this.sourceList = []
        this.tagObj = {
          value: '',
          key: ''
        }
        this.$emit('selUser', this.tagObj)
      }
    }
  }
</script>
<style scoped>
  .cin {
    opacity: 1;
    background: #fff;
    height: 20px;
    padding: 5px 3px;
    width: 98%;
    font-family: 'microsoft yahei';
    border: solid 1px #bbb;
    border-radius: 2px;
  }

  .cs {
    border: solid 1px #ddd;
    background: #f2f2f2;
    padding: 2px 5px;
    border-radius: 2px;
  }

  .cs i {
    cursor: pointer;
    margin-left: 5px;
  }
</style>
