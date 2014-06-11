define(
    ['utils/version'],

    function() {
        /**
         * Light container with all available media sources trees
         *
         * @class MODx.panel.FileTree
         * @extends Ext.Container
         * @param {Object} config
         * @xtype modx-panel-filetree
         */
        Media.Navigation = function(config) {
            config = config || {};

            Ext.applyIf(config, {
                _treePrefix: 'media-source-tree-'
                ,autoHeight: true
                ,defaults: {
                    autoHeight: true
                    ,border: false
                }
            });
            Media.Navigation.superclass.constructor.call(this, config);
            this.on('render', this.getSourceList, this);
        };
        Ext.extend(Media.Navigation, Ext.Container, {
            /**
             * Query the media sources list
             */
            getSourceList: function () {
                MODx.Ajax.request({
                    url: MODx.config.connectors_url  + (MODx.isRevo('>=', '2.3.0-dev') ? '' : 'source/index.php')
                    ,params: {
                        action: (MODx.isRevo('>=', '2.3.0-dev') ? 'source/' : '') + 'getList'
                    }
                    ,listeners: {
                        success: {
                            fn: function (data) {
                                this.onSourceListReceived(data.results);
                            }
                            ,scope: this
                        }
                        ,failure: {
                            fn: function (data) {
                                // Check if this really is an error
                                if (data.total > 0 && data.results != undefined) {
                                    this.onSourceListReceived(data.results);
                                }
                                return false;
                            }
                            ,scope: this
                        }
                    }
                })
            }

            /**
             * Iterate over the given media sources list to add their trees
             *
             * @param {Array} sources
             */
            ,onSourceListReceived: function (sources) {
                for (var k = 0; k < sources.length; k++) {
                    var source = sources[k]
                        ,exists = this.getComponent(this._treePrefix + source.id);

                    if (!exists) {
                        var tree = this.loadTree(source);
                    }

                    this.add(tree);
                    tree = exists = void 0;
                }
                this.doLayout();
            }

            /**
             * Load the tree configuration for the given media source
             *
             * @param {Object} source
             * @returns {Object}
             */
            ,loadTree: function (source) {
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
                    ,hideFiles: true
                });
            }

            /**
             * Update the store parameters when a node is clicked
             *
             * @param {Ext.tree.TreeNode} node
             * @param {Ext.EventObject} vent
             */
            ,listData: function (node, vent) {
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
