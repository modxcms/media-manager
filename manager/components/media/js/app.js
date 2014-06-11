'use strict';

require.config({
    paths: {
        vendor: '../vendor'
        ,text: '../vendor/requirejs-text/text'
        ,tpl: '../tpl'
    }
});

require(
    ['browser/View', 'vendor/requirejs-domready/domReady!'],

    function(View, domReady) {
        MODx.add('media-panel-home');
    }
);
