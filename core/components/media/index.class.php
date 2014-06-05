<?php
/**
 * Abstract manager controller
 */
abstract class MediaManagerController extends modExtraManagerController
{
    /**
     * @var Media $service An instance of the service class
     */
    public $service;
    /**
     * @var string $jsURL The URL for the JS assets for the manager
     */
    public $jsURL;
    /**
     * @var string $cssURL The URL for the CSS assets for the manager
     */
    public $cssURL;

    /**
     * Get the current modX version
     *
     * @return array
     */
    public static function getModxVersion()
    {
        return @include_once MODX_CORE_PATH . "docs/version.inc.php";
    }

    /**
     * @inherit
     */
    public function initialize()
    {
        $path = $this->modx->getOption(
            'media.core_path',
            null,
            $this->modx->getOption('core_path') . 'components/media/'
        );
        $this->service =& $this->modx->getService('media', 'services.Media', $path);
        $this->jsURL = $this->service->config['mgr_js_url'];
        $this->cssURL = $this->service->config['mgr_css_url'];
        $this->loadBase();
        $this->loadRTE();
    }

    /**
     * Load the "base" required assets
     *
     * @return void
     */
    public function loadBase()
    {
        $this->addCss($this->cssURL . 'app.css');

        $this->addHtml(
<<<HTML
<script>
    Ext.ns('Media');
    Media.config = {$this->modx->toJSON($this->service->getConfig())};
    Media.action = {$this->getAction()};
</script>
HTML
        );
    }

    /**
     * Get the appropriate action for the current MODX version
     *
     * @return string The action
     */
    public function getAction()
    {
        $version = $this->modx->getVersionData();
        if (version_compare($version['full_version'], '2.3.0-dev') >= 0) {
            return '\'?namespace=media\'';
        }

        return 'MODx.action["media:index"]';
    }

    /**
     * Load RTE if enabled
     *
     * @return void
     */
    public function loadRTE()
    {
        if ($this->service->config['use_rte']) {
            new meltingmedia\rte\Loader(
                $this->modx,
                array(
                    'namespace' => $this->service->prefix,
                )
            );
        }
    }

    /**
     * @inherit
     */
    public function getLanguageTopics()
    {
        return array('media:default');
    }

    /**
     * Convenient method to get the modExt URL
     *
     * @return string
     */
    public function getModExtURL()
    {
        return $this->modx->config['manager_url'].'assets/modext/';
    }
}

/**
 * Default index (home) controller "wrapper"
 */
class IndexManagerController extends MediaManagerController
{
    /**
     * @inherit
     */
    public static function getDefaultController()
    {
        $version = self::getModxVersion();
        if (version_compare($version['full_version'], '2.3.0') >= 0) {
            return 'browser';
        }

        return 'default/browser';
    }
}
