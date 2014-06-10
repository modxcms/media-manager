'use strict';

require.config({
    paths: {
        vendor: '../vendor'
        ,text: '../vendor/requirejs-text/text'
    }
});

require(
    ['browser/View', 'utils/version', 'vendor/requirejs-domready/domReady!'],

    function(View, Version, domReady) {
        MODx.add('media-panel-home');
    }
);
