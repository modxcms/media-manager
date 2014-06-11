<?php
/**
 * Media service class
 *
 * @see xPDO::getService
 */
class Media
{
    /**
     * @var array $chunks A collection of preprocessed chunk values.
     */
    protected $chunks;
    /**
     * @var modX $modx A reference to the modX object.
     */
    public $modx;
    /**
     * @var array $config A collection of properties to adjust Object behaviour.
     */
    public $config = array();
    /**
     * @var string $prefix The component prefix, mostly used during dev
     */
    public $prefix;

    /**
     * Constructs the Media object
     *
     * @param modX $modx A reference to the modX object
     * @param array $config An array of configuration options
     */
    public function __construct(modX &$modx, array $config = array())
    {
        $this->modx =& $modx;
        $this->prefix = strtolower(get_class($this));

        $this->setConfig($config);

        if (!($this->modx->lexicon instanceof modLexicon)) {
            $this->modx->getService('lexicon', 'modLexicon');
        }
        $this->modx->lexicon->load($this->prefix . ':default');
    }

    /**
     * Set the service class base configuration
     *
     * @param array $config
     *
     * @return void
     */
    public function setConfig(array $config = array())
    {
        $paths = $this->getPaths($config);

        $this->config = array_merge(array(
            'core_path' => $paths['base'],
            'assets_path' => $paths['assets'],
            'processors_path' => $paths['base'] . 'processors/',

            // Front-end
            'assets_url' => $paths['assets_url'],
            'js_url' => $paths['assets_url'] . 'web/js/',
            'css_url' => $paths['assets_url'] . 'web/css/',

            // Manager
            'connector_url' => $paths['manager_url'] . 'connector.php',
            'mgr_url' => $paths['manager_url'],
            'mgr_js_url' => $paths['manager_url'] . 'js/',
            'mgr_css_url' => $paths['manager_url'] . 'css/',
        ), $config);
    }

    /**
     * Get critical paths for the component
     *
     * @param array $config
     *
     * @return array
     */
    public function getPaths(array $config = array())
    {
        $prefix = $this->prefix;

        return array(
            // Component core path
            'base' => $this->modx->getOption(
                "{$prefix}.core_path",
                $config,
                $this->modx->getOption('core_path') . "components/{$prefix}/"
            ),
            // Web (front-end) assets path
            'assets' => $this->modx->getOption(
                "{$prefix}.assets_path",
                $config,
                $this->modx->getOption('assets_path') . "components/{$prefix}/"
            ),
            // Web (front-end) assets URL
            'assets_url' => $this->modx->getOption(
                "{$prefix}.assets_url",
                $config,
                $this->modx->getOption('assets_url') . "components/{$prefix}/"
            ),
            // Manager assets path
            'manager' => $this->modx->getOption(
                "{$prefix}.manager_path",
                $config,
                $this->modx->getOption('manager_path') . "assets/components/{$prefix}/"
            ),
            // Manager assets URL
            'manager_url' => $this->modx->getOption(
                "{$prefix}.manager_url",
                $config,
                $this->modx->getOption('manager_url') . "assets/components/{$prefix}/"
            ),
        );
    }

    /**
     * Return this service class configuration.
     * Unset sensitive data here if required.
     *
     * @return array The service class configuration
     */
    public function getConfig()
    {
        return $this->config;
    }
}
