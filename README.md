# Media Manager

2.2.x Media Manager Plugin to become part of 2.3

> Notes : the current "release" is also an experimentation to using RequireJS a Bower to help build CMPs, so do not feel scared about the "non conventional" way of doing things

## Manual installation

> This assume your Revolution installation is in a sub folder (ie. http://localhost/revo/)

* git clone at the same level your Revo installation is
* create a `namespace` with the following parameters
    * name : `media`
    * core path : `/path/to/media-manager/core/components/media/`
* create `media.core_path` system setting with the following parameters
    * key : `media.core_path`
    * value : `/path/to/media-manager/core/components/media/`
    * namespace : `media`
* create `media.manager_url` system setting with the following parameters
    * key : `media.manager_url`
    * value : `/url/to/media-manager/manager/components/media/`
    * namespace : `media`
* create `config.core.php` at the root of `media-manager` folder with the following

```
<?php

define('MODX_CORE_PATH', "/path/to/revolution/core/");
define('MODX_CONFIG_KEY', 'config');
```
* browse to `manager/components/media/` & run `bower install`
* you should then be able to access the media manager by going to `http://localhost/modx/manager/?a=browser&namespace=media`
