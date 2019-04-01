<template>
  <div>
    <!--<input type="text" class="cin" v-model="tagObj.value" @click="decrement($event)" @keyup="decrement($event)">-->
    <div class="cooSel" @click="decrement($event)"><span>{{tagObj.value}}</span></div>
    <div class="la" v-show="hasShow">
      <div :class="[ 'sitem', {'nitem': index%2==0}]" v-for="(item,index) in sourceList" @click="selItem(item)">
        <span>{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'RankType',
    props: {
      sourceList: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },
    data () {
      return {
        hasShow: false,
        tagObj: {
          value: '',
          key: ''
        }
      }
    },
    created () {

    },
    methods: {
      decrement: function (e) {
        var element = e.target
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
      },
      selItem (item) {
        this.hasShow = false
        this.tagObj.value = item.name
        this.tagObj.key = item.id
      }
    }
  }
</script>
<style scoped>

</style>
