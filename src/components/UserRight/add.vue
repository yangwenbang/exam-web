<template>
  <div>
    <div class="head-c">
      <span class="bread-item">添加权限</span>
    </div>
    <div class="content">
      <div class="panel">
        <div class="p-t p-t2">
          <div class="name">
            <span>添加权限</span>
          </div>
        </div>
        <div class="p-c">
          <div class="i">
            <div class="tl">
              <span>权限名称：</span>
            </div>
            <div class="tr">
              <input type="text" placeholder="输入权限名称" v-model="right.authorityname">
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>设置权限等级：</span>
            </div>
            <div class="tr">
              <el-select v-model="right.parentId" clearable placeholder="请选择">
                <el-option value="0" label="一级权限"></el-option>
                <el-option v-for="item in getRightName" :key="item.authorityId" :label="item.authorityname" :value="item.authorityId">
                </el-option>
              </el-select>
              <!--<select name="" id="select" v-model="right.parentId">-->
                <!--<option value="0">一级权限</option>-->
                <!--<option v-for="item in getRightName" :key="item.authorityId" :value="item.authorityId">{{item.authorityname}}</option>-->
              <!--</select>-->
            </div>
          </div>
          <div class="i clearfix" style="height: 100%;">
            <div class="tl">
              <span>权限说明：</span>
            </div>
            <div class="tr">
              <textarea name="" id="user" v-model="right.authoritydesc"></textarea>
            </div>
          </div>
          <div class="i" style="text-align: center;margin-top: 20px;">
            <button class="btn" @click="addRight"><span>提交</span></button>
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
        return{
          right: {
            authorityname:'',
            authoritydesc:'',
            // createid: +JSON.parse(sessionStorage.getItem('info')).userid,
            parentId: ''
          },
          getRightName: {}
        }
      },
      created() {
        this.getRight();
      },
      methods: {
        addRight() {
          var that = this;
          var param = that.right;
          axios.post(api.api.authority.add, param).then(response =>{
            if (response.data.bresult) {
              util.alert(response.data.message);
            }
          })
        },
        getRight() {
          var that = this;
          axios.post(api.api.authority.parent).then(response =>{
            if (response.data.bresult) {
              that.getRightName = response.data.object;
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

  #user {
    width: 70%;
    padding: 5px 7px;
    height: 150px;
    resize: none;
  }
  #select{
    height: 40px;
    width: 200px;
    padding: 5px;
  }
</style>
