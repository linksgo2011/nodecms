<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Htaccess extends CI_Controller {
	var $tablefunc = 'htaccess';
	var $filepath = './.htaccess';
	var $defaultpath = './data/bak/.htaccess';
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('file');
		$this->load->model('Purview_model');
	}
	
	public function index()
	{
		$this->Purview_model->checkPurview($this->tablefunc);
		$func = '';
		if($this->Purview_model->checkPurviewFunc($this->tablefunc,'save')){
			$func .= $this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc.'/save').'\',\'save\')','save');
		}
		if($this->Purview_model->checkPurviewFunc($this->tablefunc,'restore')){
			$func .= $this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc.'/restore').'\',\'restore\')','restore');
		}
		$res = array(
				'tablefunc'=>$this->tablefunc,
				'content'=>read_file($this->filepath),
				'func'=>$func
		);
		$this->load->view($this->tablefunc,$res);
	}

	public function save(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'save');
		$content=trim($this->input->post('content',TRUE));
		write_file($this->filepath, $content);
		show_jsonmsg(array('status'=>200));
	}
	
	public function restore(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'restore');
		$file = read_file($this->defaultpath);
		write_file($this->filepath, $file);
		show_jsonmsg(array('status'=>205));
	}
}