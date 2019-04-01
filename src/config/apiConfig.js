module.exports.api = {
    user: {
        login: '/exam-admin/sys/admin/login',
        logout: '/exam-admin/sys/admin/logout',
        modifyPwd: '/exam-admin/sys/user/password',
        checkLogin: '/exam-admin/sys/user/info',
        todaycount: '/exam-admin/sys/user/today/count',
        list: '/exam-admin/sys/user/list/condition',
        info: '/exam-admin/sys/user/info',
        save: '/exam-admin/sys/user/save/user',
        savestatus: "/exam-admin/sys/user/save/status",
        teacherlist: '/exam-admin/exam/teacher/list/condition'
    },
    role: {
        select: "/exam-admin/sys/role/select",
        dept: '/exam-admin/sys/role/all/dept',
        info: '/exam-admin/sys/role/info',
        savemenu: '/exam-admin/sys/role/save'
    },
    menu: {
        all: "/exam-admin/sys/menu/list",
    },
    dept: {
        list: "/exam-admin/sys/dept/list",
        save: "/exam-admin/sys/dept/save",
        delete: "/exam-admin/sys/dept/delete"
    },
    course: {
        list: '/exam-admin/exam/course/list/condition',
        chapterlist: '/exam-admin/exam/chapter/list/condition',
        sectionlist: '/exam-admin/exam/section/list/condition',
        info: '/exam-admin/exam/course/info',
        updateEffective: '/exam-admin/exam/course/update/effective',
        save: '/exam-admin/exam/course/save',
        addload: '/exam-admin/exam/course/addLoad',
        delete: '/exam-admin/exam/course/delete',
        update: '/exam-admin/exam/course/update'
    },
    commodity: {
        list: '/exam-admin/exam/commodity/list',
        info: '/exam-admin/exam/commodity/info',
        save: '/exam-admin/exam/commodity/save',
        delete: '/exam-admin/exam/commodity/delete'
    },
    offline: {
        organization: {
            list: '/exam-admin/exam/offlineorganization/list',
            info: '/exam-admin/exam/offlineorganization/info',
            save: '/exam-admin/exam/offlineorganization/save',
            delete: '/exam-admin/exam/offlineorganization/delete'
        },
        course: {
            list: '/exam-admin/exam/course/list',
            info: '/exam-admin/exam/course/info',
            save: '/exam-admin/exam/course/save',
            delete: '/exam-admin/exam/course/delete'
        },
        customer: {
            list: '/exam-admin/exam/customer/list',
            info: '/exam-admin/exam/customer/info',
            save: '/exam-admin/exam/customer/save',
            delete: '/exam-admin/exam/customer/delete'
        }
    },
    advertisement: {
        list: '/exam-admin/exam/advertisement/list',
        info: '/exam-admin/exam/advertisement/info',
        save: '/exam-admin/exam/advertisement/save',
        delete: '/exam-admin/exam/advertisement/delete'
    },
    msg: {
        list: '/exam-admin/exam/newmsg/list/condition',
        info: '/exam-admin/exam/newmsg/info',
        save: '/exam-admin/exam/newmsg/save',
        type: {
            all: '/exam-admin/exam/newmsg/type/all',
            list: '/exam-admin/exam/newmsg/type/list/condition',
            info: '/exam-admin/exam/newmsg/type/info',
            save: '/exam-admin/exam/newmsg/type/save'
        }
    },
    project: {
        listall: '/exam-admin/exam/project/list/all',
        list: '/exam-admin/exam/project/list/condition',
        info: '/exam-admin/exam/project/info',
        save: '/exam-admin/exam/project/save'
    },
    category: {
        listByProject: '/exam-admin/exam/category/list/project',
        list: '/exam-admin/exam/category/list/condition',
        info: '/exam-admin/exam/category/info',
        save: '/exam-admin/exam/category/save'
    },
    subject: {
        listByCategory: '/exam-admin/exam/subject/list/category',
        list: '/exam-admin/exam/subject/list/condition',
        info: '/exam-admin/exam/subject/info',
        save: '/exam-admin/exam/subject/save'
    },
    province: {
        all: '/exam-admin/exam/province/all',
    },
    city: {
        listall: '/exam-admin/exam/city/list/all',
    },
    teacher: {
        list: '/exam-admin/exam/teacher/list/condition',
        load: '/exam-admin/exam/teacher/load',
        info: '/exam-admin/exam/teacher/info',
        save: '/exam-admin/exam/teacher/save'
    },
    chapter: {
        info: '/exam-admin/exam/chapter/info',
        save: '/exam-admin/exam/chapter/save',
        delete: '/exam-admin/exam/chapter/delete',
    },
    section: {
        info: '/exam-admin/exam/section/info',
        save: '/exam-admin/exam/section/save',
        delete: '/exam-admin/exam/section/delete',
    },
    file: {
        upload: '/exam-admin/exam/file/upload',
        readexcel: '/exam-admin/exam/file/read/excel'
    },
    execrisetype: {
        list: '/exam-admin/exam/exercisetype/list/condition',
        listall: '/exam-admin/exam/exercisetype/list/all',
        conlist: '/exam-admin/exam/exercisecontent/list/condition',
        coninfo: '/exam-admin/exam/exercisecontent/info',
        consave: '/exam-admin/exam/exercisecontent/save',
        condelete: '/exam-admin/exam/exercisecontent/delete',
        info: '/exam-admin/exam/exercisetype/info',
        save: '/exam-admin/exam/exercisetype/save',
        patchsave: '/exam-admin/exam/exercisetype/save/patch',
        conpatchsave: '/exam-admin/exam/exercisecontent/save/patch',
        delete: '/exam-admin/exam/exercisetype/delete',
        update: '/exam-admin/exam/exercisetype/update',
        modelsave: '/exam-admin/exam/exercisetype/model/save',
        modellist: '/exam-admin/exam/exercisetype/model/list/condition',
        modeldel: '/exam-admin/exam/exercisetype/model/delete',
        modelall: '/exam-admin/exam/exercisetype/model/list/all'
    }
}