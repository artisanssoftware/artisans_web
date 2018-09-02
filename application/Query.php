<?php

include 'Connection'.EXT_PHP;

class Query{
	private $data_list=array();	
	private $instace=null;
	private $query=null;
	public $request=null;

	public function __construct(){
		$this->instace=Connection::getInstance();
		$this->request=(object)new Request();
	}

	public function executeQuery($sql_query){
		if(!$this->query=mysql_query($sql_query,$this->instace->getConnection())){
			die("::the query not executed::");
		}
		return $this->query;
	}

	public function getDataList($query_executed){
		$this->data_list=array();
		
		if(1!=$query_executed)
		while($data=mysql_fetch_object($query_executed)){
			$this->data_list[]=$data;
		}
		return $this->data_list;
	}

	public function convertToJson($data_list){
		return json_encode($data_list);
	}

}