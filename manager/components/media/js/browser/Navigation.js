define(
    [],

    function() {

        if (!MODx.panel.FileTree) {
            // Revo 2.2
            MODx.panel.FileTree = function(config) {
                config = config || {};
                Ext.applyIf(config,{
                    border:0,
                    padding:0,
                    margin:0,
                    id: 'modx-leftbar-filetree',
                    listeners: {
                        render: {fn: this.getSourceList,scope:this}
                    }
                });
                MODx.panel.FileTree.superclass.constructor.call(this,config);

                //   this.on('render',this.o)
            };
            Ext.extend(MODx.panel.FileTree,MODx.FormPanel,{
                sourceTrees: []

                ,getSourceList: function(){
                    MODx.Ajax.request({
                        url: MODx.config.connectors_url + 'source/index.php'
                        ,params: {
                            action: 'getList'
                        }
                        ,listeners: {
                            success: {fn: function(data){
                                console.log('data received');
                                this.onSourceListReceived(data.results);
                            },scope:this},
                            failure: {fn: function(data){
                                // Check if this really is an error
                                if(data.total > 0 && data.results != undefined){
                                    this.onSourceListReceived(data.results);
                                }
                                return false;
                            },scope: this}
                        }
                    })
                }

                ,onSourceListReceived: function(sources){
                    for(var k=0;k<sources.length;k++){
                        var source = sources[k];
                        if(!this.sourceTrees[source.name]){
                            this.sourceTrees[source.name] = MODx.load({
                                xtype: 'modx-tree-directory'
                                ,id: 'source-tree-' + source.id
                                ,rootName: source.name
                                ,hideSourceCombo: true
                                ,source: source.id
                                ,tbar: false
                                ,tbarCfg: {
                                    hidden: true
                                }
                            })
                        }

                        this.add(this.sourceTrees[source.name]);
                    }
                    this.doLayout();
                    //  this.render();
                }
            });
            Ext.reg('modx-panel-filetree',MODx.panel.FileTree);
        }

        Media.Navigation = function(config) {
            config = config || {};

            Ext.applyIf(config, {
                _treePrefix: 'media-source-'
                ,id: 'media-source-list'
                ,listeners: {

                }
            });
            Media.Navigation.superclass.constructor.call(this, config);
            this.getSourceList();
        };
        Ext.extend(Media.Navigation, MODx.panel.FileTree, {
            onSourceListReceived: function(sources) {
                for (var k = 0; k < sources.length; k++) {
                    var source = sources[k]
                        ,id = this._treePrefix + source.id
                        ,exists = Ext.getCmp(id);

                    if (!exists) {
                        var tree = MODx.load({
                            xtype: 'modx-tree-directory'
                            ,id: id
                            ,itemId: id
                            ,stateId: id
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

            ,_loadTree: function(source) {
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
