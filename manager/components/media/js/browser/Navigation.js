define(
    [],

    function() {

        Media.Navigation = function(config) {
            config = config || {};

            Ext.applyIf(config, {
                _treePrefix: 'media-source-'
//                id: Ext.id()
//                ,listeners: {
//
//                }
            });
            Media.Navigation.superclass.constructor.call(this, config);
        };
        Ext.extend(Media.Navigation, MODx.panel.FileTree, {
            _onSourceListReceived: function(sources) {
                for (var k = 0; k < sources.length; k++) {
                    var source = sources[k]
                        ,id = 'media-source-' + source.id
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
                                click: this.listData
                                ,scope: this
                            }
                        });

                        this.add(tree);
                    }
                }
                this.doLayout();
            }

            ,loadTree: function(source) {
                return MODx.load({
                    xtype: 'modx-tree-directory'
                    ,itemId: this._treePrefix + source.id
                    ,stateId: this._treePrefix + source.id
                    ,id: this._treePrefix + source.id
                    ,rootName: source.name
                    ,hideSourceCombo: true
                    ,source: source.id
                    ,tbar: false
                    ,tbarCfg: {
                        hidden: true
                    }
                    ,listeners: {
                        click: this.listData
                        ,scope: this
                    }
                });
            }

            /**
             * Update the store parameters when a node is clicked
             *
             * @param {Ext.tree.TreeNode} node
             * @param {Ext.EventObject} vent
             */
            ,listData: function(node, vent) {
                var dir = node.id
                    ,Store = this.store
                    ,source = node.getOwnerTree().source
                    ,previous = Store.lastOptions.params || {};

                if (previous.dir && previous.dir == dir &&
                    previous.source && previous.source == source) {
                    // Same parameters, do nothing
                    return;
                }

                // Build the store parameters
                var options = Ext.apply({}, Store.lastOptions);
                options.params = Ext.apply(Store.lastOptions.params || {}, {
                    dir: dir
                    ,source: source
                });

                Store.load(options);
            }
        });
        Ext.reg('media-manager-nav', Media.Navigation);

        return Media.Navigation;
    }
);
