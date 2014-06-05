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
            url: Media.config.connector_url
            ,baseParams: {
                action: 'cmpitem/getList'
            }
            ,root: 'results'
            ,totalProperty: 'total'
            ,fields: ['id', 'name', 'description']
        });
        store.load();

        return store;
    }
);
