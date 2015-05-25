<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Clearcache extends CI_Controller {
	var $tablefunc = 'clearcache';
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->model('Purview_model');
	}
	
	public function index(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$res = array(
				'tablefunc'=>$this->tablefunc
		);
		$this->load->view($this->tablefunc,$res);
	}
	
	public function clear(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$this->Cache_model->clean();
		$res = array(
			'tablefunc'=>$this->tablefunc,
			'message'=>lang('clearcache_notice')
			);
		$this->load->view($this->tablefunc,$res);
	}
}