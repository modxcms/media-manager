define(
    [],

    function() {
        Ext.ns('Media.window');
        /**
         * @class Media.window.CreateCmpItem
         * @extends MODx.Window
         * @param config
         * @xtype media-window-cmpitem-create
         */
        Media.window.CreateCmpItem = function(config) {
            config = config || {};

            Ext.applyIf(config, {
                title: _('media.cmpitem_create')
                ,url: Media.config.connector_url
                ,closeAction: 'close'
                ,baseParams: {
                    action: 'cmpitem/create'
                }
                ,fields: [{
                    xtype: 'hidden'
                    ,name: 'id'
                },{
                    xtype: 'textfield'
                    ,fieldLabel: _('media.name')
                    ,name: 'name'
                    ,anchor: '100%'
                },{
                    xtype: 'textarea'
                    ,fieldLabel: _('media.description')
                    ,name: 'description'
                    ,anchor: '100%'
                }]
            });
            Media.window.CreateCmpItem.superclass.constructor.call(this, config);
        };
        Ext.extend(Media.window.CreateCmpItem, MODx.Window);
        Ext.reg('media-window-cmpitem-create', Media.window.CreateCmpItem);

        /**
         * @class Media.window.UpdateCmpItem
         * @extends Media.window.CreateCmpItem
         * @param config
         * @xtype media-window-cmpitem-update
         */
        Media.window.UpdateCmpItem = function(config) {
            config = config || {};

            Ext.applyIf(config, {
                title: _('media.cmpitem_update')
                ,baseParams: {
                    action: 'cmpitem/update'
                }
            });
            Media.window.UpdateCmpItem.superclass.constructor.call(this, config);
        };
        Ext.extend(Media.window.UpdateCmpItem, Media.window.CreateCmpItem);
        Ext.reg('media-window-cmpitem-update', Media.window.UpdateCmpItem);

    }
);
