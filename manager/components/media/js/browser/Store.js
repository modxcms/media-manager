define(
    [],

    /**
     * @return {Ext.data.JsonStore}
     */
    function() {
        /**
         * Shared store for both view types
         *
         * @type {Ext.data.JsonStore}
         */
        var params = Ext.state.Manager.get('media-view-store', {
            source: MODx.config.default_media_source
            ,dir: ''
        });
        Ext.apply(params, {
            action: (MODx.isRevo('>=', '2.3.0-dev') ? 'browser/directory/' : '') + 'getFiles'
        });

        var store = new Ext.data.JsonStore({
            url: MODx.isRevo('>=', '2.3.0-dev')
                ? MODx.config.connector_url
                : MODx.config.connectors_url+'browser/directory.php'
            ,baseParams: params
            ,root: 'results'
            ,totalProperty: 'total'
            ,fields: ['id', 'name', 'description', 'thumb', 'size', 'selected']
        });

        store.load();

        store.on('load', function() {
            var save = store.lastOptions || {};
            if (save.params) {
                save = save.params;
                Ext.state.Manager.set('media-view-store', {
                    source: save.source
                    ,dir: save.dir
                });
            }
        });

        return store;
    }
);
