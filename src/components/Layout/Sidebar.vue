<template>
  <div class="sidebar">
    <div>
      <div class="mp" v-for="(item ,index) in navList" v-bind:key="index">
        <div class="m" @click="openItem(item)">
          <img :src="item.imgpath" alt>
          <span v-if="!item.url">{{item.name}}</span>
          <router-link tag="span" v-else :to="item.url">{{item.name}}</router-link>
          <i class="collapse-icon" v-if="item.children" :class="{ 'rotate': item.isCollapsed}"></i>
        </div>
        <div v-show="item.isCollapsed" class="collapse-item">
          <div class="mc" v-for="(sitem,sindex) in item.children" :key="sindex">
            <router-link
              class="m"
              tag="div"
              :to="sitem.url"
              @click.native="selItem(sitem, sindex, index)"
              :class="{ 'mc-active' : currentRow === index && currentIndex === sindex}"
            >
              <span class="ml">{{sitem.name}}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",

  data() {
    return {
      currentItem: null,
      currentIndex: null,
      currentRow: null,
      navList: [
        {
          name: "系统首页",
          url: "",
          imgpath: require("../../assets/sy.png"),
          url: "/home"
          // children: [
          //   {
          //     name: "首页",
          //     url: "/home",
          //     isclick: false
          //   }
          // ]
        },
        {
          name: "用户管理",
          url: "",
          isCollapsed: false,
          imgpath: require("../../assets/yh.png"),
          children: [
            {
              name: "用户列表",
              url: "/userlist",
              isclick: false
            }
            // {
            //   name: "教师列表",
            //   url: "/teacherlist",
            //   isclick: false
            // }
          ]
        },
        {
          name: "项目&课程",
          url: "",
          isCollapsed: false,
          imgpath: require("../../assets/sb.png"),
          children: [
            {
              name: "课程列表",
              url: "/course/list",
              isclick: false
            },
            {
              name: "项目列表",
              url: "/project/list",
              isclick: false
            }
          ]
        },
        {
          name: "题型管理",
          url: "",
          isCollapsed: false,
          imgpath: require("../../assets/sb.png"),
          children: [
            {
              name: "题型管理",
              url: "/execrisetype/list",
              isclick: false
            }
            // {
            //   name: "题型模板管理",
            //   url: "/execrisetype/model/list",
            //   isclick: false
            // }
          ]
        },
        {
          name: "资讯&轮播&分享",
          url: "",
          isCollapsed: false,
          imgpath: require("../../assets/sb.png"),
          children: [
            {
              name: "资讯管理",
              url: "/newsmsg/list",
              isclick: false
            },
            {
              name: "轮播图管理",
              url: "/advertisement/list",
              isclick: false
            },
            {
              name: "资讯类别管理",
              url: "/msgtype/list",
              isclick: false
            }
          ]
        },
        {
          name: "商城&面授&vip内容",
          url: "",
          isCollapsed: false,
          imgpath: require("../../assets/sb.png"),
          children: [
            {
              name: "商城管理",
              url: "/commodity/list",
              isclick: false
            },
            {
              name: "面授机构管理",
              url: "/offline/organization/list",
              isclick: false
            }
            // {
            //   name: "机构管理",
            //   url: "/offline/organization/list",
            //   isclick: false
            // },
            // {
            //   name: "机构管理",
            //   url: "/offline/organization/list",
            //   isclick: false
            // }
          ]
        },
        {
          name: "系统管理",
          url: "",
          isCollapsed: false,
          imgpath: require("../../assets/sb.png"),
          children: [
            // {
            //   name: "地区管理",
            //   url: "/msgtype/list",
            //   isclick: false
            // },
            {
              name: "部门管理",
              url: "/sys/dept/list",
              isclick: false
            },
            {
              name: "菜单管理",
              url: "/sys/menu/list",
              isclick: false
            }
            ,
            {
              name: "版本管理",
              url: "/sys/version/list",
              isclick: false
            }
          ]
        }

        // {
        //   name: "统计管理",
        //   url: "",
        //   isCollapsed: false,
        //   imgpath: require("../../assets/sb.png"),
        //   children: [
        //     {
        //       name: "角色管理"
        //       // url: "/role/list",
        //       // isclick: false
        //     }
        //   ]
        // },

        // ,
        // {
        //   name: '系统设置',
        //   url: '',
        //   isCollapsed: false,
        //   imgpath: require('../../assets/sz.png'),
        //   children: [
        //     {
        //       name: '权限列表',
        //       url: '/userright/list',
        //       isclick: false
        //     },
        //      {
        //        name: '用户列表(管理)',
        //        url: '/usergroup/list',
        //        isclick: false
        //      },
        //     {
        //       name: '配置信息',
        //       url: '/configs/list',
        //       isclick: false
        //     },
        //     {
        //       name: '数据字典',
        //       url: '/wordbook/list',
        //       isclick: false
        //     },
        //     {
        //       name: '操作日志',
        //       url: '',
        //       isclick: false
        //     }
        //   ]
        // }
      ]
    };
  },
  created() {
    // this.currentItem = this.navList[0].children[0];
  },
  watch: {},
  methods: {
    openItem(item) {
      // console.log(item.children);
      this.navList.forEach(function(sitem) {
        // console.log(sitem.name);
        if (sitem.name !== item.name) {
          sitem.isCollapsed = false;
        }
      });
      item.isCollapsed = !item.isCollapsed;
    },
    selItem(item, index, rowIndex) {
      // console.log(item.name);
      this.currentRow = rowIndex;
      this.currentIndex = index;
      item.isclick = true;
    }
  }
};
</script>

<style>
.sidebar {
}

.sidebar .mp {
  min-height: 50px;
  color: #999;
  font-size: 14px;
  text-align: left;
}

.sidebar .mp:hover > .m {
  color: #fff;
}

.sidebar .mc {
  background-color: #001410;
}

.sidebar .mc:hover {
  color: #fff;
}

.sidebar .mc-active {
  background-color: #31c3a6;
  color: #fff;
}

.sidebar .m {
  position: relative;
  height: 50px;
  line-height: 50px;
  cursor: pointer;
}

.sidebar .m img {
  margin-left: 40px;
  margin-right: 5px;
  display: inline-block;
  width: 18px;
  height: 18px;
  vertical-align: middle;
}

.sidebar .m span {
  line-height: 50px;
  vertical-align: middle;
}

.sidebar .mp .m .collapse-icon {
  position: absolute;
  right: 20px;
  top: 38%;
  display: inline-block;
  width: 12px;
  height: 12px;
  background-image: url("../../assets/arrow-down-o.png");
  background-size: cover;
  transition: transform 0.3s;
}

.sidebar .m .rotate {
  transform: rotateZ(180deg);
}

.sidebar .m .ml {
  margin-left: 66px;
}

@media screen and (max-width: 1450px) {
  .sidebar .m img {
    margin-left: 16px;
  }

  .sidebar .m .ml {
    margin-left: 53px;
  }
  .sidebar .m span {
    font-size: 13px;
  }
}
</style>
