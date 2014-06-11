define(
    ['text!tpl/uploader.html'],

    /**
     * @param {string} UploaderTpl
     */
    function(UploaderTpl) {
        /**
         * Plugin to handle drag & drop to components
         *
         * @param {Object} config
         *
         * @extend Ext.util.Observable
         *
         * @ptype upload
         */
        Ext.ux.UploadPlugin = function(config) {
            config = config || {};

            Ext.applyIf(config, {
                component: null
                ,dz: null
                ,listenerTry: 0
            });
            Ext.ux.UploadPlugin.superclass.constructor.call(this, config);
        };

        Ext.extend(Ext.ux.UploadPlugin, Ext.util.Observable, {
            /**
             * @param {Ext.Component} component
             */
            init: function(component) {
                this.listenerTry = 0;
                console.info('Plugin init', component);

                // Add a reference to the "extended" component
                this.component = component;
                this.addContainerEvents();

                // Allow the component to access this instance
                this.component.getUploader = this.getUploader.createDelegate(this);

                // Add the drop zone DOM element
                this.component.on('render', this.setDropZone, this);
                if (!this.storeHasListener()) {
                    this.component.store.on('load', function() {
                        this.setDropZone();
                    }, this);
                }
            }

            ,addContainerEvents: function() {
                this.component.addEvents('beforeShowDropZone');

                this.component.on('beforeShowDropZone', function() {
                    console.log('on before show drop zone');

                    var preview = this.component.el.query('div.preview');
                    if (preview.length === 1) {
                        this.component.fadeAndDestroy(Ext.get(preview[0]));
                    }
                }, this);
            }

            ,storeHasListener: function() {
                var store = this.component.store;

                if (store.hasListener('load')) {
                    var listeners = store.events['load'].listeners;
                    Ext.each(listeners, function(listener, k) {
                        if (listener && listener.scope && listener.scope instanceof Ext.ux.UploadPlugin) {
                            console.info('Previous listener already set to store', k, 'removing it');
                            listeners.splice(k, 1);
                            return true;
                        }
                    });
                }

                return false;
            }

            /**
             * @returns {Ext.ux.UploadPlugin}
             */
            ,getUploader: function() {
                return this;
            }

            ,setDropZone: function() {
                // Deferred because of store loading & records rendering
                Ext.defer(function() {
                    var source = this.component
                        ,el = source.getEl();

                    var dzQuery = el.query('.dropzone');
                    if (dzQuery.length > 0) {
                        console.info('Dropzone already found, skipping');
                        this.dz = Ext.get(dzQuery[0]);
                        return false;
                    }
                    console.info('Adding dropzone, source %o, el %o', source, el);
                    // Get the last record node (@todo: handle other containers/xtypes)
                    var lastNode = el.query(source.itemSelector +':last-of-type')
                        ,last = Ext.get(lastNode[0])
                        // Inject the drop zone in the DOM
                        ,raw = '<div class="dropzone">Drop files</div>'
                        ,tpl = new Ext.XTemplate(raw).apply()
                    ;
                    if (!last) {
                        if (this.listenerTry < 2) {
                            this.listenerTry += 1;
                            console.log('No last node found, scheduling again', this.listenerTry);
                            return this.setDropZone();
                        } else {
                            console.error('Too much tries : ', this, this.listenerTry);
                            return false;
                        }
                    }
                    this.listenerTry = 0;
                    console.info('last record node', last);
                    this.dz = Ext.DomHelper.insertAfter(last, tpl, true);
                    // Hide it
                    this.hideDropZone();

                    // add appropriate listeners
                    this.setListeners();
                }, 250, this);
            }

            ,setListeners: function() {
                var el = this.component.getEl()
                    ,dz = this.dz;

                this.relayEvents(dz, ['dragleave', 'dragover', 'drop', 'mouseleave']);
                el.on('dragenter', this.onDragEnter, this, {
                    stopEvent: true
//                    ,preventDefault: true
//                    ,stopPropagation: true
//                    ,normalized: false
//                    ,single: true
                });
//                el.on('dragleave', function() {
//                    console.log('el dragleave');
//                }, this);

                this.on({
                    dragleave: this.onDragLeave
                    ,dragover: this.onDragOver
                    ,drop: this.onDrop
                    ,mouseleave: this.hideDropZone
                    ,scope: this
                });
            }

            ,onDragEnter: function(vent, elem, options) {
                vent.stopPropagation();
                vent.preventDefault();

                console.log('onDragEnter: dz %o, elem %o', this.dz, elem);
                this.showDropZone();

                return false;
            }
            ,onDragOver: function(vent) {
                vent.stopPropagation();
                vent.preventDefault();

                return false;
            }
            ,onDragLeave: function(vent, elem, options) {
                vent.stopPropagation();
                vent.preventDefault();

                console.log('onDragLeave', elem);
                this.hideDropZone();
            }
            ,onDrop: function(vent, elem, options) {
                vent = window.event;
                vent.stopPropagation();
                vent.preventDefault();

                console.log('onDrop', vent, elem);
                var content = [];
                var files = vent.target.files || vent.dataTransfer.files;

                if (!files || files.length < 1) {
                    this.hideDropZone();
                }

                Ext.each(files, function(file) {
                    console.log('file', file);
                    content.push(file);
                });

                var uploadContent = new Ext.XTemplate(UploaderTpl).apply({
                    files: content
                });

                this.dz.update(uploadContent);
                //dz.hide();
            }

            ,hideDropZone: function() {
                this.dz.hide();
                this.resetDropZone();
            }

            ,resetDropZone: function() {
                this.dz.update('Drop files');
            }

            ,showDropZone: function() {
                if (this.component.fireEvent('beforeShowDropZone', this.dz, this) !== false) {
                    this.dz.show();
                }
            }
        });

        Ext.preg('upload', Ext.ux.UploadPlugin);

        return Ext.ux.UploadPlugin;
    }
);
