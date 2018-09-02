<?php

abstract class MasterController{
	protected $view;

	abstract public function index();

	public function __construct(){
		$this->view=new MasterView(new Request());
		$this->view->imgSources=SERVER.'/public/img/';
		$this->view->libs=SERVER.'/libs/';
	}

	public function LoadModel($model){
		$model=$model.'Model';
		$routerModel=ROOT.'models'.DS.$model.EXT;
		if(is_readable($routerModel)){
			include $routerModel;
			$model=new $model;
			return $model;
		}else{
			throw new Exception("<font color=red>MODEL NOT FOUND</font>");		
		}
	}

	public function LoadLayout($el){
		$routerLayout=ROOT.'views'.DS.'layout'.DS.$el.EXT_VIEWS;
		if(is_readable($routerLayout)){
			include $routerLayout;
		}else{
			throw new Exception("<font color=red>LAYOUT NOT FOUND</font>");
		}
	}

}

?>