define(
    ['browser/List', 'browser/Data', 'browser/Store', 'browser/Navigation'],

    /**
     * @param {Media.ListView} List
     * @param {Media.DataView} Data
     * @param {Ext.data.JsonStore} store
     */
    function(List, Data, store) {
        /**
         * @class Media.HomeView
         * @extends MODx.Panel
         * @param {Object} config
         * @xtype media-panel-home
         */
        Media.HomeView = function(config) {
            config = config || {};

            var viewType = Ext.state.Manager.get('media-view', 'data');

            Ext.apply(config, {
                border: false
                ,baseCls: 'modx-formpanel'
                ,cls: 'container'
                ,layout: 'anchor'
                ,anchor: '100%'
                //,autoHeight: true
                ,defaults: {
                    layout: 'anchor'
                }
                ,items: [{
                    html: '<h2>' + _('media.management') + '</h2>'
                    ,border: false
                    ,cls: 'modx-page-header'
                },{
                    xtype: 'container'
                    ,items: [{
                        html: _('media.management_desc')
                        ,border: false
                        ,bodyCssClass: 'panel-desc'
                    },{
                        xtype: 'panel'

                        ,tbar: [{
                            text: 'Add files'
                            ,handler: this.showDropZone
                            ,scope: this
                        }/*,{
                            text: 'Batch actions'
                        },{
                            text: 'Display'
                        }*/,{
                            text: 'Get selected'
                            ,handler: this.countSelected
                            ,scope: this
                        },'->',{
                            // List
                            text: '<i class="icon icon-th-list"></i>'
                            ,handler: this.showListView
                            ,scope: this
                        },{
                            // Data
                            text: '<i class="icon icon-th-large"></i>'
                            ,handler: this.showDataView
                            ,scope: this
                        }]


                        ,layout: 'column'
                        ,defaults: {
                            border: false
                        }
                        ,items: [{
                            // Trees
                            width: 250
                            ,items: [{
                                xtype: 'media-manager-nav'
                                ,store: store
                                ,border: false
                            }]
                        },{
                            // Display
                            items: [{
                                xtype: 'media-'+ viewType
                                ,itemId: 'browser-view'
                                ,height: '100%'
                                ,border: false
                            }]
                            ,height: '100%'
                            ,currentType: viewType
                            ,id: 'content-wrapper'
                            ,columnWidth: 1
                        }]
                    }]
                }]
            });
            Media.HomeView.superclass.constructor.call(this, config);
        };
        Ext.extend(Media.HomeView, Ext.Container, {
            /**
             * @param {string} type
             *
             * @return {boolean|void}
             */
            showView: function(type) {
                var container = this.getWrapper();
                if (container.currentType === type) {
                    // Already requested view
                    return false;
                }
                // Previously selected record (if any)
                var selected = this.getView().getSelectedIndexes();
                console.log('selected', selected);
                //container.removeAll();
                //container.removeAt(1);
                this.getView().destroy();
                var content;
                switch (type) {
                    case 'list':
                        container.currentType = 'list';
                        content = new List;
                        break;
                    case 'data':
                        container.currentType = 'data';
                        content = new Data;
                        break;
                }

                //content.columnWidth = 1;
                Ext.state.Manager.set('media-view', container.currentType);
                container.add(content);
                container.doLayout();

                if (selected.length > 0) {
                    console.log('previous selection found');
                    Ext.defer(function() {
                        Ext.each(selected, function(idx) {
                            console.log('Restoring selection', idx);
                            content.select(idx, true);
                        });
                    }, 100);
                }

            }

            ,countSelected: function() {
                console.log(this.getView().getSelectedIndexes());
            }
            ,showListView: function() {
                return this.showView('list');
            }

            ,showDataView: function() {
                return this.showView('data');
            }

            ,getWrapper: function() {
                return Ext.getCmp('content-wrapper');
            }
            ,getView: function() {
                return this.getWrapper().items.items[0];
                //return this.getWrapper().items.items[1].items.items[0];

                return this.getWrapper()
                    .getComponent('browser-view');
                    //.find('itemId', 'browser-view')[0];
            }

            ,showDropZone: function() {
                this.getView()
                    .getUploader()
                    .showDropZone();
            }

            ,createRecord: function(btn, vent) {
                this.getView()
                    .createRecord(btn, vent);
            }
        });
        Ext.reg('media-panel-home', Media.HomeView);

        return Media.HomeView;
    }
);

