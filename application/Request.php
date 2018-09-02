<?php

class Request{

	private $controller;
	private $method;
	private $args;
	private $url=array();

	public function __construct(){
		
		if(isset($_GET['url'])){
			$this->url=filter_input(INPUT_GET,'url',FILTER_SANITIZE_URL);
			$this->url=explode('/',$this->url);
			$this->url=array_filter($this->url);
		}

		$this->controller=strtolower(array_shift($this->url));
		$this->method=strtolower(array_shift($this->url));
		$this->args=$this->url;


		if(!$this->controller){
			$this->controller=DEFAULT_CONTROLLER;
		}

		if(!$this->method){
			$this->method=DEFAULT_METHOD;
		}

		if(!isset($this->args)){
			$this->args=array();
		}

	}

	public function getController(){
		return $this->controller;
	}

	public function getMethod(){
		return $this->method;
	}
	
	public function getArgs(){
		return $this->args;
	}	

}

?>