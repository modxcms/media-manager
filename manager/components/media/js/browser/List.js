define(
    [
        'text!tpl/list.html'
        ,'browser/Store', 'browser/shared'
    ],

    /**
     * @param {string} listTpl
     * @param {Ext.data.JsonStore} store
     * @param {Object} shared
     */
    function(listTpl, store, shared) {

        Media.ListView = function(config) {
            config = config || {};

            Ext.applyIf(config, {
                store: store
                ,itemSelector: 'dl.record'
                ,hideHeaders: true
                //,multiSelect: true
                ,plugins: ['upload']

                //,internalTpl: new Ext.XTemplate('')
                ,tpl: new Ext.XTemplate(listTpl)

                ,columns: [{
                    header: ''
                    ,tpl: '<input type="checkbox" class="selector" <tpl if="selected">checked</tpl> />'
                    ,width: .03
                },{
                    header: _('media.name')
                    ,dataIndex: 'name'
                    ,width: .47
                },{
                    header: _('media.description')
                    ,dataIndex: 'description'
                    ,sortable: false
                    ,width: .47
                },{
                    header: ''
                    ,tpl: '<div class="grid-menu"><a class="listActions menu"><i class="menu icon icon-gear"></i>&nbsp;<i class="menu icon icon-angle-down"></i></a></div>'
                    ,width: .03
                }]

                ,listeners: {
                    click: this.onClickTest
                    ,dblclick: this.navigateTo
                }
            });
            Media.ListView.superclass.constructor.call(this, config);
            this.store.on('load', function(store, records, options) {
                var selected = this.getSelectedIndexes();
                if (selected.length > 0) {
                    this.selected.clear();
                }
            }, this);
        };
        Ext.extend(Media.ListView, Ext.list.ListView, Ext.applyIf({
            showMenu: function(list, index, node, vent) {
                vent.stopEvent();
                vent.preventDefault();

                // Clicked item
                var target = vent.getTarget('', '', true);
                if (!target.hasClass('grid-menu')) {
                    // Make sure the target is the top most container
                    target = target.findParent('.grid-menu', 5, true);
                }

                // Menu should already be visible
                if (target.hasClass('active')) {
                    return this.hideMenu(target);
                }

                target.addClass('active');
                var menu = new Ext.menu.Menu({
                    defaultAlign: 'tl-b?'
                    //defaultAlign: 'tr-br'
                    ,enableScrolling: false
                    ,floating: false
                    ,renderTo: target
                });

                // Listeners to mask the menu
                menu.on('itemclick', function(me) {
                    menu.destroy();
                    target.removeClass('active');
                });
                target.on('mouseleave', function(vent, elem) {
                    if (target.hasClass('active')) {
                        this.hideMenu(target);
                    }
                }, this);

                // Sub menus
                menu.add({
                    text: 'Edit'
                    ,handler: function(btn, vent) {
                        var record = this.getRecord(node).json;
                        this.updateRecord(record, vent);
                    }
                    ,scope: this
                });

                menu.add({
                    text: 'Remove'
                    ,handler: function(btn, vent) {
                        var record = this.getRecord(node).json;
                        this.removeRecord(record);
                    }
                    ,scope: this
                });
            }

            ,hideMenu: function(container) {
                var menuElem = container.child('.x-menu')
                    ,menu = Ext.getCmp(menuElem.id);
                menu.destroy();
                container.removeClass('active');
            }

            ,onClickTest: function(me, index, node, vent) {
                var record = this.getRecord(node)
                    ,target = vent.getTarget('', '', true);

                if (target.is('input.selector')) {
                    return this.toggleSelection(index);
                }
                //console.log('target', target);
                if (target.hasClass('preview') || target.up('.preview') || target.is('input[type="checkbox"]')) {
                    return false;
                }

                if (target.is('a.menu') || target.is('i.menu') &&  target.parent().hasClass('menu')) {
                    console.log('icon!');
                    return this.showMenu(me, index, node, vent);
                }

                return this.displayPreview(node, vent);
            }

            ,previewToDOM: function(node, preview) {
                var container = Ext.get(node);

                container.insertHtml('beforeEnd', preview);
                var previewElement = container.down('div.preview');
                this.animatePreview(previewElement);
            }
        }, shared));
        Ext.reg('media-list', Media.ListView);

        return Media.ListView;
    }
);
