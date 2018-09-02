<?php
	class contactoController extends MasterController{

		public function __construct(){
			parent::__construct();
		}

		public function index(){
			$this->view->setController("home");
			$this->view->model=$this->LoadModel('home');
			$this->LoadLayout(DEFAULT_LAYOUT.DS.'header');
			$this->view->render(DEFAULT_INDEX_VIEW);
			$this->LoadLayout(DEFAULT_LAYOUT.DS.'footer');
		}
	
	}
?>