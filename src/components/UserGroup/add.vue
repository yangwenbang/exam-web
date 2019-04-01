<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加用户组</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>添加用户组</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>用户组名称：</span>
            </div>
            <div class="tr">
              <input type="text" placeholder="输入用户组名称" v-model="rolegroup.rolegroupname">
            </div>
          </div>
          <div class="i clearfix" style="height: 100%;">
            <div class="tl">
              <span>用户组说明：</span>
            </div>
            <div class="tr">
              <textarea name="" id="user" v-model="rolegroup.rolegroupdesc">

              </textarea>
            </div>
          </div>
          <div class="i" style="text-align: center;margin-top: 20px;">
            <button class="btn" @click="setGroup"><span>提交</span></button>
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
    name: "add",
    data() {
      return {
        rolegroup: {
          rolegroupdesc: '',
          rolegroupname: '',
          createId: +JSON.parse(sessionStorage.getItem('info')).user.id
        }
      }
    },
    created() {
    },
    methods: {
      setGroup() {
        var that = this;
        var param = that.rolegroup;
        param.canDel = +param.canDel;
        if (param.rolegroupname){
          axios.post(api.api.orgrolegroup.add, param).then(response => {
            if (response.data.bresult) {
              util.alert(response.data.message);
              window.location.href = '/#/usergroup/list'
            }
          })
        }else {
          util.alert('用户组名不能为空！')
        }

      }
    }
  }
</script>

<style scoped>
  .pi {
    max-height: 100px;
  }
  #user{
    width: 70%;
    padding: 5px 7px;
    height: 150px;
    resize: none;
  }

  .i > .tr > .ii {
    display: inline-block;
    margin-right: 15px;
  }

  .i > .tr > .ii input{
    width: 15px;
    vertical-align: middle;
  }
  .i > .tr > .ii label{
    vertical-align: middle;
  }
</style>
