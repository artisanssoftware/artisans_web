<?php

class Bootstrap{

	public static  function run(Request $req){

		$controller=$req->getController().'Controller';
		$routerController=ROOT.'controllers'.DS.$controller.EXT;
		$method=$req->getMethod();
		$args=$req->getArgs();

		if(is_readable($routerController)){
			include $routerController;
			$controller=new $controller;

			if(method_exists($controller,$method)){
				$method=$req->getMethod();

			}else{
				throw new Exception("<font color=red>METHOD NOT FOUND</font>");				
			}

			if(isset($args)){
				call_user_func_array(array($controller,$method),$args);
			}else{
				call_user_func(array($controller,$method));
			}

		}else{
			throw new Exception("<font color=red>CONTROLLER NOT FOUND</font>");		
		}

	}

}

?>