<?php
define('DS',DIRECTORY_SEPARATOR);
define('ROOT',realpath(dirname(__FILE__)).DS);
define('APP_PATH',ROOT.'application'.DS);
define('EXT','.php');

include APP_PATH.'Configuration'.EXT;
include APP_PATH.'DataLayer'.EXT;
include APP_PATH.'Request'.EXT;
include APP_PATH.'Bootstrap'.EXT;
include APP_PATH.'MasterController'.EXT;
include APP_PATH.'MasterModel'.EXT;
include APP_PATH.'MasterView'.EXT;

try{
	Bootstrap::run(new Request());
}catch(Exception $e){
	print $e->getMessage();	
}

?>