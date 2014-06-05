define(
    [
        'text!browser/preview.html'
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

            ,navigateTo: function(elem, index, node, vent) {
                console.log('navigate!', index);
            }

            ,createRecord: function(btn, e) {
                this.CmpItemWindow = MODx.load({
                    xtype: 'media-window-cmpitem-create'
                    ,listeners: {
                        success: {
                            fn: this.refreshStore
                            ,scope: this
                        }
                    }
                });
                this.CmpItemWindow.show(e.target);
            }

            ,updateRecord: function(record, e) {
                if (!e) {
                    e = record.event;
                    record = record.record.json;
                }
                this.CmpItemWindow = MODx.load({
                    xtype: 'media-window-cmpitem-update'
                    ,record: record
                    ,listeners: {
                        success: {
                            fn: this.refreshStore
                            ,scope: this
                        }
                    }
                });
                this.CmpItemWindow.setValues(record);
                this.CmpItemWindow.show(e.target);
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

            ,refreshStore: function() {
                this.store.reload();
            }
        };

        return shared;
    }
);
