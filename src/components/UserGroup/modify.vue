<template>
  <div>
    <div class="head-c">
      <span class="bread-item">修改用户组</span>
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
              <input type="text" placeholder="输入用户组名称" v-model="groupData.rolegroupname">
            </div>
          </div>
          <div class="i clearfix" style="height: 100%;">
            <div class="tl">
              <span>用户组说明：</span>
            </div>
            <div class="tr">
              <textarea name="" id="user" v-model="groupData.rolegroupdesc">

              </textarea>
            </div>
          </div>
          <div class="i">
            <div class="tl">
              <span>是否可删：</span>
            </div>
            <div class="tr">
              <div class="ii">
                <input type="radio" id="one" value="1" v-model="groupData.canDel">
                <label for="one">可删</label>
              </div>
              <div class="ii">
                <input type="radio" id="zero" value="0" v-model="groupData.canDel">
                <label for="zero">不可删</label>
              </div>
            </div>
          </div>
          <div class="i" style="text-align: center;margin-top: 20px;">
            <button class="btn" @click="modifyGroup"><span>确认修改</span></button>
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
    name: "modify",
    data() {
      return {
        Id: {
          id: this.$route.params.id
        },
        groupData: {
          groupId: 0,
          rolegroupname: '',
          rolegroupdesc: '',
          canDel: ''
        }
      }
    },
    created() {
      this.getGroupData()
    },
    methods: {
      getGroupData() {
        var that = this;
        var param = that.Id;
        axios.post(api.api.orgrolegroup.getOne, param).then(response => {
          if (response.data.bresult) {
            that.groupData.groupId = response.data.object.groupId;
            that.groupData.rolegroupname = response.data.object.rolegroupname;
            that.groupData.rolegroupdesc = response.data.object.rolegroupdesc;
            that.groupData.canDel = response.data.object.canDel;
          }
        })
      },
      modifyGroup() {
        var that = this;
        var param = that.groupData;
        axios.post(api.api.orgrolegroup.edit, param).then(response => {
          if (response.data.bresult) {
            util.alert(response.data.message);
            window.location.href = '/#/usergroup/list'
          }else {
            util.alert(response.data.message)
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

  .i > .tr > .ii {
    display: inline-block;
    margin-right: 15px;
  }

  .i > .tr > .ii input {
    width: 15px;
    vertical-align: middle;
  }

  .i > .tr > .ii label {
    vertical-align: middle;
  }
</style>
