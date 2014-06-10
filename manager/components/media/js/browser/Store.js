define(
    [],

    /**
     * @return {Ext.data.JsonStore}
     */
    function() {
        var url = MODx.config.connector_url
            ,action = 'browser/directory/getFiles';

        if (!MODx.panel.FileTree) {
            url = MODx.config.connectors_url+'browser/directory.php';
            action = 'getfiles';
        }
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
            action: action
        });

        var store = new Ext.data.JsonStore({
            url: url
            ,baseParams: params
            ,root: 'results'
            ,totalProperty: 'total'
            ,fields: ['id', 'name', 'description', 'thumb', 'size']
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
