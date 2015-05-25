<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Adminindex extends CI_Controller {
	var $tablefunc = 'adminindex';
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->model('Purview_model');
		$this->load->helper('file');
	}
	
	public function index()
	{
		$this->Purview_model->checkPurview($this->tablefunc);
		$uid=$this->session->userdata('uid');
		$user = $this->Data_model->getSingle(array('id'=>$uid),'user');
		$this->load->vars('user',$user);
		$this->load->view('adminindex.php');
	}
}