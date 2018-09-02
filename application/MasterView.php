<?php

class MasterView{
	protected $controller;
	public $imgSources;
	public $location;
	public $libs;

	public function __construct(Request $req){
		$this->controller=$req->getController();
		$this->location='';
	}

	public function setController($controller){
		$this->controller=$controller;
	}

	public function getController(){
		return $this->controller;
	}

	public function render($view,$item=false){
		$routerView=ROOT.'views'.DS.$this->getController().DS.$view.EXT_VIEWS;

		if(is_readable($routerView)){
			include $routerView;
		}else{
			throw new Exception("<font color=red>VIEW NOT FOUND</font>");			
		}

	}

}

?>