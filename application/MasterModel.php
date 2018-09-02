<?php

class MasterModel{
	public $db;
	public function __construct(){
		$this->db=new DataLayer();
	}

}

?>