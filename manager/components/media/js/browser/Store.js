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
        var store = new Ext.data.JsonStore({
            url: MODx.config.connector_url
            ,baseParams: {
                action: 'browser/directory/getFiles'
                ,source: MODx.config.default_media_source
            }
            ,root: 'results'
            ,totalProperty: 'total'
            ,fields: ['id', 'name', 'description']
        });
        store.load();

        return store;
    }
);
