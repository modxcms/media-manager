<?php
/**
 * Build the transport package
 */

//require_once __DIR__ . '/vendor/autoload.php';
//
//use meltingmedia\Builder\Factory;
//
//$config = include_once __DIR__ .'/package.config.php';
//$factory = new Factory($config);
//$factory->build();
//
//exit();

$tstart = explode(' ', microtime());
$tstart = $tstart[1] + $tstart[0];
set_time_limit(0);

// Define package names
define('PKG_NAME', 'Media');
define('PKG_NAME_LOWER', strtolower(PKG_NAME));
define('PKG_VERSION', '0.0.1');
define('PKG_RELEASE', 'dev');

// Define build paths
$root = dirname(dirname(__FILE__)) . '/';
$sources = array(
    'root' => $root,
    'build' => $root . '_build/',
    'data' => $root . '_build/data/',
    'resolvers' => $root . '_build/resolvers/',
    'validators' => $root . '_build/validators/',
    'chunks' => $root . 'core/components/'. PKG_NAME_LOWER .'/chunks/',
    'lexicon' => $root . 'core/components/'. PKG_NAME_LOWER .'/lexicon/',
    'docs' => $root . 'core/components/'. PKG_NAME_LOWER .'/docs/',
    'elements' => $root . 'core/components/'. PKG_NAME_LOWER .'/elements/',

    'source_assets' => $root . 'assets/components/'. PKG_NAME_LOWER,
    'manager_assets' => $root . 'manager/components/'. PKG_NAME_LOWER,
    'source_core' => $root . 'core/components/'. PKG_NAME_LOWER,
);
unset($root);

// Override with your own defines here (see build.config.sample.php)
require_once $sources['build'] . 'build.config.php';
require_once MODX_CORE_PATH . 'model/modx/modx.class.php';

// Instantiate modX
$modx = new modX();
$modx->initialize('mgr');
if (!XPDO_CLI_MODE) {
    echo '<pre>';
}
$modx->setLogLevel(modX::LOG_LEVEL_INFO);
$modx->setLogTarget('ECHO');

$modx->loadClass('transport.modPackageBuilder', '', false, true);
$builder = new modPackageBuilder($modx);
$builder->createPackage(PKG_NAME_LOWER, PKG_VERSION, PKG_RELEASE);

/** @var modNamespace $ns */
$ns = $modx->newObject('modNamespace');
$ns->fromArray(array(
    'name' => PKG_NAME_LOWER,
    //'path' => '',
), '', true);

$attr = array(
    xPDOTransport::PRESERVE_KEYS => true,
    xPDOTransport::UPDATE_OBJECT => false,
    xPDOTransport::RESOLVE_FILES => true,
    xPDOTransport::RESOLVE_PHP => true,
);
$vehicle = $builder->createVehicle($ns, $attr);

$modx->log(modX::LOG_LEVEL_INFO, 'Adding file resolvers to category...');
$vehicle->resolve('file', array(
    'source' => $sources['manager_assets'],
    'target' => "return MODX_MANAGER_PATH . 'assets/components/';",
));
$vehicle->resolve('file', array(
    'source' => $sources['source_core'],
    'target' => "return MODX_CORE_PATH . 'components/';",
));
$builder->putVehicle($vehicle);


// Now pack in the license file, readme and setup options
$modx->log(modX::LOG_LEVEL_INFO, 'Adding package attributes and setup options...');
$builder->setPackageAttributes(array(
    'license' => file_get_contents($sources['docs'] . 'license.txt'),
    'readme' => file_get_contents($sources['docs'] . 'readme.txt'),
    'changelog' => file_get_contents($sources['docs'] . 'changelog.txt'),
));

// Zip up package
$modx->log(modX::LOG_LEVEL_INFO, 'Packing up transport package zip...');
$builder->pack();

$tend = explode(' ', microtime());
$tend = $tend[1] + $tend[0];
$totalTime = sprintf("%2.4f s", ($tend - $tstart));
$modx->log(modX::LOG_LEVEL_INFO, "\n\nPackage Built. \nExecution time: {$totalTime}\n");
if (!XPDO_CLI_MODE) {
    echo '</pre>';
}
exit ();
