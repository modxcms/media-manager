define(
    ['utils/version'],

    function() {
        Ext.ns('Media.window');
        /**
         * @class Media.Update
         * @extends MODx.Window
         * @param config
         * @xtype media-update
         */
        Media.Update = function(config) {
            config = config || {};

            Ext.applyIf(config, {
                title: _('rename')
                ,url: MODx.isRevo('>=', '2.3.0-dev') ? MODx.config.connector_url : (MODx.config.connectors_url + 'browser/file.php')
                ,closeAction: 'close'
                ,baseParams: {
                    action: (MODx.isRevo('>=', '2.3.0-dev') ? 'browser/file/' : '') + 'rename'
                }
                ,formDefaults: {
                    anchor: '100%'
                }
                ,fields: [{
                    xtype: 'hidden'
                    ,name: 'path'
                    ,value: config.record.relativeUrl
                },{
                    xtype: 'hidden'
                    ,name: 'source'
                },{
                    xtype: 'textfield'
                    ,fieldLabel: _('new_name')
                    ,name: 'name'
                }]
            });
            Media.Update.superclass.constructor.call(this, config);
        };
        Ext.extend(Media.Update, MODx.Window);
        Ext.reg('media-update', Media.Update);

        return Media.Update;
    }
);
