// r.js "build" script

({
    baseUrl: '.',
    paths: {
        app: 'js/app'
        ,text: 'vendor/requirejs-text/text'
        ,browser: 'js/browser'
    },
    name: 'app',
    out: 'js/app-min.js'
//    modules: [{
//        name: 'js/app'
//    }],
//    dir: 'test'
})
