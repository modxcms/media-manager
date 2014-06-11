<?php
/**
 * Adds modActions and modMenus into package
 *
 * @var modX $modx
 */

$c = $modx->newQuery('modAction');
$c->sortby('id', 'DESC');
$c->limit(1);
/** @var modAction $last */
$last = $modx->getObject('modAction', $c);
$id = $last->get('id') + 1;

$action = $modx->newObject('modAction');
$action->fromArray(array(
    'id' => $id,
    'namespace' => 'media',
    'parent' => 0,
    'controller' => 'index',
    'haslayout' => true,
    'lang_topics' => 'media:default',
), '', true, true);

$menu = $modx->newObject('modMenu');
$menu->fromArray(array(
    'text' => 'media',
    'parent' => 'components',
    'description' => 'media.menu_desc',
), '', true, true);
$menu->addOne($action);

return $menu;
