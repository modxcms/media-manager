<?php
/**
 * @see modManagerResponse::loadControllerclass
 *
 * @var modManagerResponse $this
 * @var bool $prefixNamespace
 *
 * @var string $theme
 * @var array $paths
 * @var string $f
 * @var string $className
 * @var string $classFile
 * @var string $classPath
 */

if (!class_exists('MediaManagerController')) {
    require_once dirname(dirname(__DIR__)) . '/index.class.php';
}

/**
 * Home controller
 */
class MediaBrowserManagerController extends MediaManagerController
{
    /**
     * @inherit
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('media');
    }

    public function loadCustomCssJs()
    {
        $require = $this->service->config['mgr_url'] . 'vendor/requirejs/require.js';
        $min = false;
        $app = $this->jsURL .'app';
        if ($min) {
            $app = $this->jsURL .'app-min';
        }

        $this->addHtml(
<<<HTML
<script src="{$require}" data-main="{$app}"></script>
HTML
        );
    }
}

/**
 * For Revo 2.2
 */
class MediaDefaultBrowserManagerController extends MediaBrowserManagerController
{

}
