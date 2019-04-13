import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Index from '@/components/homePage/Index'
import UserList from '@/components/User/UserList'
import TeacherList from '@/components/User/TeacherList'
import UserDetail from '@/components/User/UserDetail'
import Wholepage from '@/components/Layout/Wholepage'
import ExecriseTypeList from '@/components/execrisetype/list'
import ExecriseList from '@/components/execrisetype/execriselist'
import ExecriseContentEdit from '@/components/execrisetype/conedit'
import ExecriseModelList from '@/components/execrisetype/model'

import AdvertisementList from '@/components/advertisement/list'
import AdvertisementEdit from '@/components/advertisement/edit'

import CommodityList from '@/components/commodity/list'
import CommodityEdit from '@/components/commodity/edit'

import CourseList from '@/components/course/list'
import ChapterList from '@/components/course/chapterlist'
import SectionList from '@/components/course/sectionlist'
import ProjectList from '@/components/project/list'
import CategoryList from '@/components/project/categorylist'
import SubjectList from '@/components/project/subjectlist'

import MsgTypeList from '@/components/msg/type'
import NewsMsgList from '@/components/msg/list'
import NewsMsgEdit from '@/components/msg/edit'

import NewsContent from '@/components/newsmsg'

import CourseEdit from '@/components/course/edit'
import TeacherEdit from '@/components/User/teacheredit'
import UserEdit from '@/components/User/edit'

import OfflineOrganizationList from '@/components/offline/organizationlist'
import OfflineOrganizationEdit from '@/components/offline/organizationedit'

import OfflineCourseList from '@/components/offline/courselist'
import OfflineCourseEdit from '@/components/offline/courseedit'

import OfflineCustomerList from '@/components/offline/customerlist'
import OfflineCustomerEdit from '@/components/offline/customeredit'


import RoleList from '@/components/User/rolelist'
import DeptList from '@/components/system/dept'
import MenuList from '@/components/system/menu'

import VersionList from '@/components/system/version'

Vue.use(ElementUI)
Vue.use(Router)

export default new Router({
    base: 'admin',
    routes: [{
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/news/content/:id',
        name: 'NewsContent',
        component: NewsContent
    },
    {
        path: '/home',
        component: Wholepage,
        children: [{
            path: '/',
            name: '',
            component: Index
        },

        {
            path: '/userlist',
            name: 'UserList',
            component: UserList
        },
        {
            path: '/user/edit/:id',
            name: 'UserEdit',
            component: UserEdit
        },
        {
            path: '/teacherlist',
            name: 'TeacherList',
            component: TeacherList
        },
        {
            path: '/userdetail',
            name: 'UserDetail',
            component: UserDetail
        },
        {
            path: '/execrisetype/list',
            name: 'ExecriseTypeList',
            component: ExecriseTypeList
        },
        {
            path: '/exercisecontent/edit/:sectionId/:id',
            name: 'ExecriseContentEdit',
            component: ExecriseContentEdit
        },
        {
            path: '/execrise/list/:courseId/:chapterId/:sectionId',
            name: 'ExecriseList',
            component: ExecriseList
        },
        {
            path: '/execrisetype/model/list',
            name: 'ExecriseModelList',
            component: ExecriseModelList
        },
        {
            path: '/course/list',
            name: 'CourseList',
            component: CourseList
        },
        {
            path: '/course/edit/:id',
            name: 'CourseEdit',
            component: CourseEdit
        },
        {
            path: '/chapter/list/:courseId',
            name: 'ChapterList',
            component: ChapterList
        },
        {
            path: '/section/list/:courseId/:chapterId',
            name: 'SectionList',
            component: SectionList
        },
        {
            path: '/project/list',
            name: 'ProjectList',
            component: ProjectList
        },
        {
            path: '/category/list/:projectId',
            name: 'CategoryList',
            component: CategoryList
        },
        {
            path: '/subject/list/:projectId/:categoryId',
            name: 'SubjectList',
            component: SubjectList
        },
        {
            path: '/teacher/edit/:id',
            name: 'TeacherEdit',
            component: TeacherEdit
        },
        {
            path: '/msgtype/list',
            name: 'MsgTypeList',
            component: MsgTypeList
        },
        {
            path: '/newsmsg/list/',
            name: 'NewsMsgList',
            component: NewsMsgList
        },
        {
            path: '/newsmsg/edit/:id',
            name: 'NewsMsgEdit',
            component: NewsMsgEdit
        },
        {
            path: '/role/list',
            name: 'RoleList',
            component: RoleList
        },
        {
            path: '/advertisement/list',
            name: 'AdvertisementList',
            component: AdvertisementList
        },
        {
            path: '/advertisement/edit/:id',
            name: 'AdvertisementEdit',
            component: AdvertisementEdit
        },
        {
            path: '/commodity/list',
            name: 'CommodityList',
            component: CommodityList
        },
        {
            path: '/commodity/edit/:id',
            name: 'CommodityEdit',
            component: CommodityEdit
        },
        {
            path: '/offline/organization/list',
            name: 'OfflineOrganizationList',
            component: OfflineOrganizationList
        },
        {
            path: '/offline/organization/edit/:id',
            name: 'OfflineOrganizationEdit',
            component: OfflineOrganizationEdit
        },
        {
            path: '/offline/course/list',
            name: 'OfflineCourseList',
            component: OfflineCourseList
        },
        {
            path: '/offline/course/edit/:id',
            name: 'OfflineCourseEdit',
            component: OfflineCourseEdit
        },
        {
            path: '/offline/customer/list',
            name: 'OfflineCustomerList',
            component: OfflineCustomerList
        },
        {
            path: '/offline/customer/edit/:id',
            name: 'OfflineCustomerEdit',
            component: OfflineCustomerEdit
        }, {
            path: '/sys/dept/list',
            name: 'DeptList',
            component: DeptList
        },
        {
            path: '/sys/menu/list',
            name: 'MenuList',
            component: MenuList
        },
        {
            path: '/sys/version/list',
            name: 'VersionList',
            component: VersionList
        }

        ]
    }
    ]
})