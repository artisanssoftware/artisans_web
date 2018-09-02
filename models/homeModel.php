<?php
include 'GenericModelInterface'.EXT_PHP;

class homeModel extends MasterModel implements GenericModelInterface{
	public $text;

	public function __construct(){
		parent::__construct();

		foreach ($this->db->getDataList($this->db->executeQuery(
			"SELECT texto,valor FROM texto")) as $key => $value) {
			$this->text[$value->texto]=$value->valor;
		}

		$this->text=(object)$this->text;
	}

	public function getText(){
		return $this->text;
	}

	public function getTextByKey($key){
		return $this->db->convertToJson($this->db->getDataList($this->db->executeQuery(
			"SELECT valor FROM texto WHERE texto='".$key."'")));
	}

	public function search(){
		$servicio = str_replace(' ', '', $this->db->request->getArgs()[0]);

		$data=$this->db->getDataList($this->db->executeQuery(
			"SELECT service_id,
					title,description,
					image_main,images,
					action_detail,
					service_include,
					action_contact FROM services 
								WHERE REPLACE(title,' ','') LIKE '%".$servicio."%' 
								      OR REPLACE(description,' ','') LIKE '%".$servicio."%' 
								      OR REPLACE(service_include,' ','') LIKE '%".$servicio."%'"));
		
		if(count($data)<1)
			echo "<script>
					document.querySelector('body').style.display='none';
					location.href='../../portaldeservicios';
				  </script>";

		return $data;
	}

	public function add(){

	}

	public function set(){
	}

	public function del(){
	}

	public function get(){
		return $this->db->getDataList($this->db->executeQuery(
			"SELECT service_id,
					title,description,
					image_main,images,
					action_detail,
					service_include,
					action_contact FROM services"));
	}
}

?>