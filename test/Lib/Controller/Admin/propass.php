<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Propass extends CI_Controller {
	var $tablefunc = 'propass';
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
		$user = $this->Data_model->getSingle(array('id'=>$this->session->userdata('uid')),'user');
		if($user['password']!=md5pass($post['oldpassword'],$user['salt'])){
			show_jsonmsg(array('status'=>207,'remsg'=>lang('user_oldpasserror')));
		}
		if(trim($post['password'])!=trim($post['password1'])){
			show_jsonmsg(array('status'=>207,'remsg'=>lang('user_confirmerror')));
		}
		$data = array(
				'password'=>md5pass(trim($post['password']),$user['salt']),
				'updatetime'=>time(),
				'lastip'=>$this->input->ip_address()
		);
		$this->Data_model->editData(array('id'=>$this->session->userdata('uid')),$data,'user');
		show_jsonmsg(array('status'=>205));
	}
}