var routerpath_dev = 'http://localhost:8080/';
var routerpath_build = 'http://47.99.68.132:8080/';

module.exports = {
    proxy: {
        '/exam-admin': {
            target: routerpath_dev,
            changeOrigin: true,
            secure: false
        }
    }
}