<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Tags extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->Cache_model->setLang($this->input->get());
		$this->Lang_model->loadLang('front',$this->Cache_model->currentLang);
		if($this->uri->segment(3)){
			show_404();
		}
		$this->load->helper('tags');
	}
	
	public function index(){
		$config = $this->Cache_model->loadConfig();
		$tagurl = $this->uri->segment(2);
		if(!$tagurl){show_404();}
		$tags = $this->Data_model->getSingle(array('lang'=>$this->Cache_model->currentLang,'status'=>1,'url'=>$tagurl),'tags');
		if(!$tags){show_404();}
		$config['seo_title'] = $tags['title'];
		$config['seo_keywords'] = $tags['title'];
		$config['seo_description'] = $tags['title'];
		$this->load->setPath();
		$res = array(
				'config'=>$config,
				'tags'=>$tags,
				'langurl'=>$this->Cache_model->langurl
		);
		$this->load->view($config['site_template'].'/tags',$res);
	}

}