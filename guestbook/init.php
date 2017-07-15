<?php 

// 错误显示等级
ini_set('display_errors', 1);

// 自动加载类
spl_autoload_register('autoload');

// 错误处理
set_error_handler('error_handler');
set_exception_handler('exception_handler');
register_shutdown_function('shutdown_function');

// 定义常量
defined('ROOT') or define('ROOT', __DIR__);


/**
 * @param string $class
 * e.g. \namespace\ClassName
 */
function autoload($class)
{
	// 去掉头尾斜杠
	$class = trim($class, "\\");
	$className = $class;

	// app\controller\Test
	// $rpos: 14
	// app\controller
	// $rpos: 3
	// app
	// false
	// 
	// root: /root; class: \foo\bar\es
	// 1. if /root/es 
	// 2. if /root/bar/es
	// 3. if /root/foo/bar/es
	while (false != ($pos = strrpos($className, '\\'))) {
		$fileName = ROOT . DIRECTORY_SEPARATOR . str_replace('\\', '/', substr($class, $pos + 1)) . ".php";

		if (file_exists($fileName)) {
			include $fileName;
			break;
		}

		$className = substr($className, 0, $pos);
	}
}

function error_handler()
{
	var_dump(func_get_args());
}

function exception_handler()
{
	
}

function shutdown_function()
{
	
}