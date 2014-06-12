define(
    [
        'text!tpl/preview.html'
        ,'browser/Update', 'browser/upload'
    ],

    /**
     * @param {string} previewTpl Preview panel markup
     * @param Update
     * @param {Ext.ux.UploadPlugin} Upload
     */
    function(previewTpl, Update, Upload) {
        /**
         * Shared methods for both view types
         */
        var shared = {
            previewSelector: 'div.preview'
            /**
             * Build the preview panel for the given record
             *
             * @param {Object} record
             * @param vent
             *
             * @returns {*}
             */
            ,getPreview: function(record, vent) {
                return new Ext.XTemplate(previewTpl, {
                    compiled: true
                    ,disableFormats: true
                })
                    .apply(record.json);
            }

            /**
             *
             * @param node
             * @param vent
             * @returns {*}
             */
            ,displayPreview: function(node, vent) {
                if (!vent) {
                    vent = node.event;
                    node = node.node;
                }
                var elem = Ext.get(node).down(this.previewSelector);
                if (elem) {
                    // Preview already existing
                    return this.fadeAndDestroy(elem);
                }
                var record = this.getRecord(node);

                this.beforeShowPreview(node, vent, record);
                var preview = this.getPreview(record, vent);
                this.previewToDOM(node, preview);
                this.afterPreviewRendered(node, record);
            }

            /**
             * Fade the given element and remove it from the DOM
             *
             * @param {Ext.Element} elem
             */
            ,fadeAndDestroy: function(elem) {
                elem.animate({
                    opacity: {
                        to: 0
                        ,from: 1
                    }
                }, '', function() {
                    elem.remove();
                });
            }

            /**
             * Build the given content and append it to the given node
             *
             * @param node
             * @param content
             */
            ,previewToDOM: function(node, content) {
                Ext.DomHelper.append(node, content);
                var elem = Ext.get(node).down(this.previewSelector);
                this.animatePreview(elem);
            }

            ,afterPreviewRendered: function(node, record) {

            }

            ,animatePreview: function(elem) {
                var close = elem.child('a.close');
                close.on('click', function(target, vent) {
                    this.fadeAndDestroy(elem);
                    var data = elem.up('li.record');
                    if (data) {
                        data.child('.inline-actions').addClass('x-hidden');
                    }
                }, this);

                elem.animate({
                    opacity: {
                        to: 1
                        ,from: 0
                    }
                });
            }

            ,beforeShowPreview: function(node, vent, record) {
                // @todo toggle expanded class
                Ext.each(
                    // Grab existing preview panels
                    this.el.query('div.preview')

                    ,function(previewNode, idx, array) {
                        // Remove the preview panel
                        previewNode.parentNode.removeChild(previewNode);
                    }
                );
            }

            /**
             * Toggle selection for the given record index
             *
             * @param {Number} index
             */
            ,toggleSelection: function(index) {
                var node = this.getNode(index)
                    ,record = this.getRecord(node);

                if (this.getSelectedIndexes().indexOf(index) != -1) {
                    this.deselect(index);
                    record.set('selected', false);
                } else {
                    this.select(index, true);
                    record.set('selected', true);
                }
            }

            ,navigateTo: function(elem, index, node, vent) {
                console.log('navigate!', index);
            }

            ,updateRecord: function(record, e) {
                if (!e) {
                    e = record.event;
                    record = record.record.json;
                }
                this.RenameWindow = MODx.load({
                    xtype: 'media-update'
                    ,record: record
                    ,listeners: {
                        success: {
                            fn: this.refreshStore
                            ,scope: this
                        }
                        ,failure: function(response) {
                            console.error('[shared#updateRecord]', response);
                        }
                    }
                });
                this.RenameWindow.setValues(record);
                this.RenameWindow.show(e.target);
            }

            ,removeRecord: function(record) {
                if (record.event && record.node) {
                    record = record.record.json;
                }
                MODx.msg.confirm({
                    title: _('media.cmpitem_remove')
                    ,text: _('media.cmpitem_remove_confirm')
                    ,url: Media.config.connector_url
                    ,params: {
                        action: 'cmpitem/remove'
                        ,id: record.id
                    }
                    ,listeners: {
                        success: {
                            fn: this.refreshStore
                            ,scope: this
                        }
                    }
                });
            }

            /**
             * Wrapper method to reload the JSON store
             */
            ,refreshStore: function() {
                this.store.reload();
            }
        };

        return shared;
    }
);
