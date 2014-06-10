define(
    [
        'text!browser/data.html'
        ,'browser/Store', 'browser/shared'
    ],

    /**
     * @param {string} dataTpl
     * @param {Ext.data.JsonStore} store
     * @param {Object} shared
     */
    function(dataTpl, store, shared) {
        /**
         * DataView
         *
         * @extends Ext.DataView
         */
        Media.DataView = function(config) {
            config = config || {};

            Ext.applyIf(config, {
                store: store
                ,itemSelector: 'li.record'
                ,autoEl: {
                    tag: 'ul'
                    ,cls: 'data'
                }
                ,plugins: ['upload']
                ,tpl: this.getTemplate()
                ,trackOver: true
                ,listeners: {
                    click: this.onClickTest
                    ,mouseenter: this.displayMenu
                    ,mouseleave: this.maskMenu
                    ,dblclick: this.navigateTo
                    //,resize: this.onResize
                }
            });
            Media.DataView.superclass.constructor.call(this, config);

            this.on('removed', function() {
                this.cleanResizeListeners();
            }, this);
            // Dirty hack to resize the preview panel
            this.on('render', function() {
                Ext.getCmp('modx-content')
                    .on('resize', this.onResize, this);
            }, this);
            this.store.on('load', function(store, records, options) {
                var selected = this.getSelectedIndexes();
                if (selected.length > 0) {
                    this.selected.clear();
                }
            }, this);
        };
        Ext.extend(Media.DataView, Ext.DataView, Ext.applyIf({
            /**
             * Generate the template for each record
             *
             * @returns {Ext.XTemplate}
             */
            getTemplate: function() {
                var me = this
                    ,config = {
                        compiled: true
                        ,disableFormats: true
                        ,bootstrap: function(xindex, xcount, values) {
                            this.setActionsListeners(values);
                        }
                        /**
                         * Compute the CSS class based on even/odd record
                         *
                         * @param {number} xindex
                         *
                         * @return {string}
                         */
                        ,getClass: function(xindex) {
                            var className = 'even';
                            if (xindex % 2 !== 0) {
                                className = 'odd';
                            }

                            return className;
                        }
                        /**
                         * Place listeners on clickable elements (mostly available actions when hovering a record)
                         *
                         * @param {Object} values
                         *
                         * @return void
                         */
                        ,setActionsListeners: function(values) {
                            Ext.defer(function() {
                                var recordIdx = me.store.find('id', values.id)
                                    ,record = me.store.getAt(recordIdx)
                                    ,containerNode = me.getNode(record)
                                    ,container = Ext.get(containerNode)
                                    ,actions = container.query('.inline-actions .do')
                                ;
                                Ext.each(actions, function(node, idx, array) {
                                    var elem = Ext.get(node)
                                        ,classes = elem.dom.className.split(' ')
                                    ;
                                    if (classes.length != 2) {
                                        console.error('unknown action', classes);
                                        return;
                                    }
                                    var action = classes[1];

                                    elem.on('click', function(vent, target, options) {
                                        if (!this[action]) {
                                            console.error('action %s not found in scope %o', action, this);
                                            return;
                                        }
                                        var params = {
                                            node: containerNode
                                            ,record: record
                                            ,index: recordIdx
                                            ,event: vent
                                        };
                                        console.info('Should be running action %s with params %o', action, params);
                                        this[action](params);
                                    }, me);
                                });
                            }, 1);
                        }
                    };

                return new Ext.XTemplate(dataTpl, config);
            }

            /**
             * Remove any previously set resize listener on modx-content
             *
             * @return void
             */
            ,cleanResizeListeners: function() {
                var target = Ext.getCmp('modx-content');
                if (target.hasListener('resize')) {
                    var listeners = target.events['resize'].listeners;
                    Ext.each(listeners, function(listener, k) {
                        if (listener && listener.scope && listener.scope instanceof Media.DataView) {
                            listeners.splice(k, 1);
                        }
                    });
                }
            }
            /**
             * Handle some preview panel resizing if needed
             *
             * @return void
             */
            ,onResize: function() {
                console.log('[Data#onResize]', this.el);
                var preview = this.el.child(this.previewSelector);
                if (!preview) {
                    return;
                }
                // Deferring to let the container (#modx-content) size being applied
                Ext.defer(function() {
                    // Set the preview panel size according to its container
                    preview.setWidth(this.el.getWidth());
                    var containerX = this.el.getX()
                        ,previewX = preview.getX()
                    ;
                    // Handle badly aligned preview panel (on viewport/modx-content resize)
                    if (previewX < containerX) {
                        preview.setStyle('left', '0');
                    } else if (previewX > containerX) {
                        preview.setStyle('left', this.getPreviewLeft(preview));
                    }
                }, 100, this);
            }
            ,onClickTest: function(me, index, node, vent) {
                //return this.displayPreview(node, vent);
            }

            ,getInlineActions: function(node) {
                return Ext.get(node).down('div.inline-actions');
            }

            ,toggleMenu: function(me, index, node, vent) {
                this.getInlineActions(node)
                    .toggleClass('x-hidden');
            }
            ,displayMenu: function(me, index, node, vent) {
                this.getInlineActions(node)
                    .removeClass('x-hidden');
            }
            ,maskMenu: function(me, index, node, vent) {
                this.getInlineActions(node)
                    .addClass('x-hidden');
            }

            ,beforeShowPreview: function() {
                var me = this;
                Ext.each(
                    // Grab existing preview panels
                    this.el.query(this.previewSelector)

                    ,function(node, idx, array) {
                        Ext.get(node).parent(this.itemSelector).setHeight(me.originalSize);
                        // Remove the preview panel
                        node.parentNode.removeChild(node);
                    }
                );
            }

            ,afterPreviewRendered: function(node, record) {
                var preview = this.el.child(this.previewSelector)
                    ,clicked = preview.parent(this.itemSelector);

                this.originalSize = clicked.getHeight();
                var size = this.originalSize + preview.getHeight() - 10;
                console.log('afterPreviewRendered size', size);
                //clicked.setHeight(size);
                clicked.animate({
                    height: {
                        to: size
                        ,from: this.originalSize
                    }
                });

                preview
                    // Make the same width as the container
                    .setWidth(this.el.getWidth())
                    // Make sure it is displayed on top of other elements
                    .setStyle('z-index', '1')
                    // Set the appropriate left position
                    .setStyle('left', this.getPreviewLeft(preview))
                ;
            }

            ,selectRecord: function(params) {
                var idx = params.index;
                this.toggleSelection(idx);
//                if (this.getSelectedIndexes().indexOf(idx) != -1) {
//                    // unselect
//                    this.deselect(idx);
//                } else {
//                    // select
//                    this.select(idx, true);
//                }
            }

            ,fadeAndDestroy: function(elem) {
                console.log('fadeAndDestroy size', this.originalSize);
                var clicked = elem.parent(this.itemSelector);
                clicked.animate({
                    height: {
                        to: this.originalSize
                    }
                });
                elem.animate({
                    opacity: {
                        to: 0
                        ,from: 1
                    }
                }, '', function() {
                    elem.remove();
                });
            }

            ,getPreviewLeft: function(preview) {
                var recordElem = preview.parent(this.itemSelector);
                // Compute the container x position with the clicked record one to get the 'left' pixels we need to put the preview at
                var elemX = recordElem.getX()
                    ,contX = this.el.getX()
                    ,diff = contX - elemX + 'px'
                ;

                return diff;
            }

        }, shared));
        Ext.reg('media-data', Media.DataView);

        return Media.DataView;
    }
);
