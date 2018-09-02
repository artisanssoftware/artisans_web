<?php 

class Connection{

	private $connection=null;
	private static $instance=null;

	private function __construct(){}

	public function getInstance(){
		if(self::$instance==null){
			self::$instance=new Connection();
		}
		return self::$instance;
	}

	public function getConnection(){	
		if($this->connection=mysql_connect(HOST,USER,PASS)){
			mysql_select_db(DB);
			mysql_query('SET NAMES UTF8');
		}
		
		return $this->connection;
	}

}