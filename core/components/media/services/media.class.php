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

        if ($this->config['use_autoloader']) {
            $this->autoLoad();
        }
        if ($this->config['add_package']) {
            $this->modx->addPackage($this->prefix, $this->config['model_path']);
        }
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
            'model_path' => $paths['base'] . 'model/',
            'processors_path' => $paths['base'] . 'processors/',
            'chunks_path' => $paths['base'] . 'elements/chunks/',
            'chunks_suffix' => '.html',
            'add_package' => true,
            // DB migrations
            'migrations_path' => $paths['base'] . 'migrations/',

            // Composer/auto loading
            'use_autoloader' => false,
            'vendor_path' => $paths['base'] . 'vendor/',

            'use_rte' => false,

            // Front-end
            'assets_url' => $paths['assets_url'],
            'js_url' => $paths['assets_url'] . 'web/js/',
            'css_url' => $paths['assets_url'] . 'web/css/',

            // Manager
            'mgr_url' => $paths['manager_url'],
            'connector_url' => $paths['manager_url'] . 'connector.php',
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
                $this->modx->getOption('manager_path') . "components/{$prefix}/"
            ),
            // Manager assets URL
            'manager_url' => $this->modx->getOption(
                "{$prefix}.manager_url",
                $config,
                $this->modx->getOption('manager_url') . "components/{$prefix}/"
            ),
        );
    }

    /**
     * Initialize the auto-loader if found
     *
     * @return void
     */
    private function autoLoad()
    {
        $loader = $this->config['vendor_path'] . 'autoload.php';
        if (file_exists($loader)) {
            require_once $loader;
        } else {
            $this->modx->log(modX::LOG_LEVEL_ERROR, 'Autoloader file not found');
        }
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

    /**
     * Gets a Chunk; also falls back to file-based templates
     * for easier debugging.
     *
     * @param string $name The name of the Chunk
     * @param array $properties The properties for the Chunk
     *
     * @return string The processed content of the Chunk
     */
    public function getChunk($name, $properties = array())
    {
        $chunk = null;
        if (!isset($this->chunks[$name])) {
            // First search for file system
            $chunk = $this->getTplChunk($name, $properties);
            if (empty($chunk)) {
                // Then check for a modChunk
                $chunk = $this->modx->getObject('modChunk', array(
                    'name' => $name,
                ));
                if ($chunk == false) {
                    return false;
                }
            }
            $this->chunks[$name] = $chunk->getContent();
        }

        $o = $this->chunks[$name];
        $chunk = $this->modx->newObject('modChunk');
        $chunk->setContent($o);
        $chunk->setCacheable(false);

        return $chunk->process($properties);
    }

    /**
     * Returns a modChunk object from a template file.
     *
     * @param string $name The name of the Chunk. Will parse to name.$postfix
     * @param array $properties
     *
     * @return modChunk|boolean Returns the modChunk object if found, otherwise
     * false.
     */
    public function getTplChunk($name, array $properties = array())
    {
        $chunk = false;
        $suffix = $this->modx->getOption('chunks_suffix', $properties, $this->config['chunks_suffix']);
        $path = $this->modx->getOption('chunks_path', $properties, $this->config['chunks_path']);
        $f = $path . strtolower($name) . $suffix;
        if (file_exists($f)) {
            $o = file_get_contents($f);
            /** @var $chunk modChunk */
            $chunk = $this->modx->newObject('modChunk');
            $chunk->set('name', $name);
            $chunk->setContent($o);
        }

        return $chunk;
    }
}
