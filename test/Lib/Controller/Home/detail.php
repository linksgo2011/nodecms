<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Detail extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->Cache_model->setLang($this->input->get());
		$this->Lang_model->loadLang('front',$this->Cache_model->currentLang);
		$this->load->helper('tags');
		if(!$this->uri->segment(3)||!is_numeric($this->uri->segment(3))){
			show_404();
		}
	}
	
	public function index(){
		$dir = $this->uri->segment(2);
		$thiscategory = $this->Cache_model->loadCategoryByDir($dir);
		if(!$thiscategory){show_404();}
		$id = $this->uri->segment(3);
		if(!is_numeric($id)){show_404();}
		$detail = $this->Cache_model->loadDetail($thiscategory,$id);
		if(!$detail){show_404();}
		$this->Data_model->setHits($detail['id'],$thiscategory['model']);
		$config = $this->Cache_model->loadConfig();
		$config['seo_title'] = $thiscategory['title']==''?$thiscategory['name']:$thiscategory['title'];
		$config['seo_keywords'] = $thiscategory['keywords']==''?$thiscategory['name']:$thiscategory['keywords'];
		$config['seo_description'] = $thiscategory['description']==''?'':$thiscategory['description'];
		$this->load->setPath();
		$res = array(
				'config'=>$config,
				'langurl'=>$this->Cache_model->langurl,
				'detail'=>$detail,
				'category'=>$thiscategory
		);
		$tpl = $thiscategory['tpldetail']==''?$thiscategory['model'].'_detail':$thiscategory['tpldetail'];
		$this->load->view($config['site_template'].'/'.$tpl,$res);
	}
}