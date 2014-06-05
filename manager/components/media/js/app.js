'use strict';

require.config({
    paths: {
        vendor: '../vendor'
        ,text: '../vendor/requirejs-text/text'
        //,home: '../vendor/demo/js/demo'
    }
});

require(
    ['browser/View', 'vendor/requirejs-domready/domReady!'],

    function(Home, domReady) {
        MODx.add('media-panel-home');
    }
);
