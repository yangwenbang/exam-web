<template>
  <div>
    <div class="head-c">
      <span class="bread-item">修改任务</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>修改任务</span>
          </div>
        </div>
        <div class="p-c" v-loading="loading">
          <div class="i">
            <div class="tl">
              <span>任务名称：</span>
            </div>
            <div class="tr">
              <input type="text" v-model="task.name">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>任务类型：</span>
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
            <button class="btn" @click="taskUpd"><span>提交</span></button>
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
    name: 'TaskUpd',
    data() {
      return {
        loading: true,
        typeId: {
          id: this.$route.query.id
        },
        task: {
          id: '',
          name: '',
          isEnable: '',
          rankType: '',
          rank: '',
          userId: ''
        },
        rankTypeLst: [
          {id: 1, name: '电信积分类型'},
          {id: 2, name: 'INT积分类型'}
        ]
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        var that = this;
        var data = that.typeId;
        axios.post(api.api.task.info, data).then(response => {
          if (response.data.bresult) {
            var param = response.data.object;
            that.task = param;
            that.loading = false
          }
        })
      },
      taskUpd() {
        var that = this;
        var param = that.task;
        that.loading = true
        axios.post(api.api.task.update, param).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message);
            window.location.href = '/#/task/list'
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
