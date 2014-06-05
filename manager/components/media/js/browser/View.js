define(
    ['browser/List', 'browser/Data', 'browser/Store'],

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
                ,autoHeight: true
                ,defaults: {
                    layout: 'anchor'
                }
                ,items: [{
                    html: '<h2>' + _('media.management') + '</h2>'
                    ,border: false
                    ,cls: 'modx-page-header'
                },{
                    xtype: 'panel'
                    ,autoHeight: true
                    ,items: [{
                        html: _('media.management_desc')
                        ,border: false
                        ,bodyCssClass: 'panel-desc'
                    },{
                        xtype: 'panel'
                        ,id: 'content-wrapper'
                        ,autoHeight: true
                        ,bodyStyle: {
                            overflow: 'hidden'
                        }
                        ,tbar: [{
                            text: 'Add files'
                            ,handler: this.showDropZone
                            ,scope: this
                        },{
                            text: 'Batch actions'
                        },{
                            text: 'Display'
                        },{
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

                        ,items: [{
                            xtype: 'media-'+ viewType
                        }]
                        ,currentType: viewType

                        ,bbar: new Ext.PagingToolbar({
                            pageSize: config.pageSize || (parseInt(MODx.config.default_per_page) || 20)
                            ,store: store
                            //,displayInfo: true
//                            ,data: {blih: 'blah'}
//                            ,tpl: new Ext.XTemplate('<tpl for=".">{[console.log(values)]} - {blih}</tpl>')
                            //,items: pgItms
                        })
                    }]
                }]
            });
            Media.HomeView.superclass.constructor.call(this, config);
        };
        Ext.extend(Media.HomeView, MODx.Panel, {
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
                container.removeAll();
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

