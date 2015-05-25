<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
	}
	
	public function index()
	{
		$this->load->view('login');
	}
	
	public function ajaxlogin(){
		$remsg = $this->load->view('ajaxlogin','',true);
		show_jsonmsg(200,$remsg);
	}
	
	public function lose(){
		$this->load->vars('lose',1);
		$this->load->view('login');
	}
}