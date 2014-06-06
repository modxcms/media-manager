define(
    [],

    function() {

        Media.Navigation = function(config) {
            config = config || {};

            Ext.applyIf(config, {
                id: Ext.id()
                ,listeners: {

                }
            });
            Media.Navigation.superclass.constructor.call(this, config);
            //this.getSourceList();
        };
        Ext.extend(Media.Navigation, MODx.panel.FileTree, {
            onSourceListReceived: function(sources) {
                var Store = this.store;

                for (var k = 0; k < sources.length; k++) {
                    var source = sources[k];

                    var id = 'media-source-' + source.id
                        ,exists = Ext.getCmp(id);

                    if (!exists) {
                        var tree = MODx.load({
                            xtype: 'modx-tree-directory'
                            ,id: id
                            ,rootName: source.name
                            ,hideSourceCombo: true
                            ,source: source.id
                            ,tbar: false
                            ,tbarCfg: {
                                hidden: true
                            }
                            ,listeners: {
                                click: {
                                    fn: function(node, vent) {
                                        var path = node.id
                                            ,source = node.getOwnerTree().source;

                                        console.log('Path %s source %s', path, source);
                                        Store.load({
                                            params: {
                                                action: 'browser/directory/getFiles'
                                                ,dir: path
                                                ,source: source
                                            }
                                        });
                                    }
                                    ,scope: this
                                }
                            }
                        });

                        this.add(tree);
                    }
                }
                this.doLayout();
            }
        });
        Ext.reg('media-manager-nav', Media.Navigation);

        return Media.Navigation;
    }
);
