<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sitemap extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->Cache_model->setLang($this->input->get());
		$this->Lang_model->loadLang('front',$this->Cache_model->currentLang);
		if($this->uri->segment(2)){
			show_404();
		}
		$this->load->helper('tags');
	}
	
	public function index(){
		$config = $this->Cache_model->loadConfig();
		$config['seo_title'] = lang('sitemap');
		$config['seo_keywords'] = lang('sitemap');
		$config['seo_description'] = lang('sitemap');
		$this->load->setPath();
		$res = array(
				'config'=>$config,
				'langurl'=>$this->Cache_model->langurl
		);
		$this->load->view($config['site_template'].'/sitemap',$res);
	}
	
}