<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加任务</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>添加任务</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>任务标题：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="task.name">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>任务积分类型：</span>
            </div>
            <div class="tr">
              <el-select v-model="task.rankType" clearable placeholder="请选择" style="width: 72%; height: 40px;">
                <el-option v-for="option in rankTypeLst" :key="option.id" :label="option.name" :value="option.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>任务积分：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="task.rank">
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
    components: {
      RankType
    },
    name: 'TaskAdd',
    data () {
      return {
        loading: false,
        task: {
          name: '',
          userId:'',
         // rankType:'',
          rank:'',
          formulator:'111'
        },
        rankTypeLst: [
          {id: 1, name: '电信积分类型'},
          {id: 2, name: 'INT积分类型'}
        ]
      }
    },
    methods: {
      add: function () {
        var that = this;
        var obj = JSON.parse(sessionStorage.getItem("info"));
        var param = this.task;
        that.loading = true
        param.userId = obj.user.id;
        axios.post(api.api.task.add, param).then(response => {
          that.loading = false
          if (response.data.bresult) {
            util.alert(response.data.message)
            window.location.href = '/#/task/list'
          } else {
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
  .pi {
    max-height: 100px;
  }
</style>
