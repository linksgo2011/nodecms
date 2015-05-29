<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Profile extends CI_Controller {
	var $tablefunc = 'profile';
	var $fields = array('email','realname','sex','tel','mobile','fax','address');
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('array');
		$this->load->model('Purview_model');
	}
	
	public function index()
	{
		$this->Purview_model->checkPurview($this->tablefunc);
		$func = '';
		if($this->Purview_model->checkPurviewFunc($this->tablefunc,'save')){
			$func = $this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc.'/save').'\',\'save\')','save');
		}
		$res = array(
			'tablefunc'=>$this->tablefunc,
			'view'=>$this->Data_model->getSingle(array('id'=> $this->session->userdata('uid')),'user'),
			'func'=>$func
		);
		$this->load->view($this->tablefunc,$res);
	}

	public function save(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'save');
		$post = $this->input->post(NULL,TRUE);
		$data = elements($this->fields,$post);
		$data['updatetime'] = time();
		$data['lastip'] = $this->input->ip_address();
		$this->Data_model->editData(array('id'=>$this->session->userdata('uid')),$data,'user');
		show_jsonmsg(array('status'=>200));
	}
}


 