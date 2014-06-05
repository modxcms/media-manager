<?php
/**
* Helper to setup the development
*
* Assumes the development is made at the same level MODX Revolution is
*/

require_once __DIR__ . '/vendor/autoload.php';

use meltingmedia\Builder\Factory;

$config = include_once __DIR__ . '/package.config.php';
$factory = new Factory($config);
$factory->useModx('2.3');
$factory->asDev();

$factory->build();

exit(0);
