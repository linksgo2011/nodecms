<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->Cache_model->setLang($this->input->get());
		$this->Lang_model->loadLang('front',$this->Cache_model->currentLang);
		if($this->uri->segment(1)){
			show_404();
		}
		$this->load->helper('tags');
	}
		
	public function index(){
		$config = $this->Cache_model->loadConfig();
		$config['seo_title'] = $config['site_title'];
		$config['seo_keywords'] = $config['site_keywords'];
		$config['seo_description'] = $config['site_description'];
		$this->load->setPath();
		$res = array(
				'config'=>$config,
				'currentLang'=>$this->Cache_model->currentLang,
				'langurl'=>$this->Cache_model->langurl
		);
		$tpl = $config['site_home']==''?'home':$config['site_home'];
		$this->load->view($config['site_template'].'/'.$tpl,$res);
	}
	
}