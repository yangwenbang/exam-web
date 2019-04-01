<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加用户任务</span>
    </div>
    <div class="content">
      <div class="equipmentBind">

        <div class="bind-item">
          <span>用户ID</span>
          <input type="text" placeholder="" v-model="usertask.userId">
        </div>

        <div>
          <button @click="add">添加</button>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import axios from "axios";
import api from '../../config/apiConfig'

export default {
  name: "addusertask",
  data () {
    return {

      usertask: {
        taskId: this.$route.query.tid,
        userId: '',
        rankType:this.$route.query.rankType,
      },
    }
  },
  created () {
  },
  methods: {
    add () {

      var that = this;
      var param = that.usertask;
      axios.post(api.api.task.userAdd, param).then(response => {
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
  .equipmentBind {
    width: 350px;
    margin: 0 auto;
    padding: 30px 100px;
  }
  .equipmentBind .bind-item {
    margin-bottom: 25px;
  }
  .equipmentBind .bind-item input{
    box-sizing: border-box;
    width: 250px;
    height: 26px;
    margin-left: 10px;
  }
  .equipmentBind button {
    width: 310px;
    height: 36px;
  }
</style>
