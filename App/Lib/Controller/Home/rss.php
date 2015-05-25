<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Rss extends CI_Controller {
	var $defaultLang;
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
		$dir = $this->uri->segment(2);
		if($dir==''){
			$this->_index();
		}else{
			$thiscategory = $this->Cache_model->loadCategoryByDir($dir);
			if(!$thiscategory){
				show_404();
			}
			if($thiscategory['model']=='page'||$thiscategory['model']=='guestbook'){
				redirect(site_url('category/'.$dir.$this->Cache_model->langurl),'location',301);
			}else{
				$this->_list($thiscategory);
			}
		}
	}
	
	function _index(){
		$config = $this->Cache_model->loadConfig();
		$config['seo_title'] = lang('rss');
		$config['seo_keywords'] = lang('rss');
		$config['seo_description'] = lang('rss');
		$this->load->setPath();
		$res = array(
				'config'=>$config,
				'langurl'=>$this->defaultLang['langurl']
		);
		$this->load->view($config['site_template'].'/rssindex',$res);
	}
	
	function _list($thiscategory){
		$list = $this->Cache_model->loadModel($thiscategory['model'],$thiscategory['id'],'puttime',20,1);
		$config = $this->Cache_model->loadConfig();
		$config['seo_title'] = $thiscategory['title']==''?$thiscategory['name']:$thiscategory['title'];
		$config['seo_keywords'] = $thiscategory['keywords']==''?$thiscategory['name']:$thiscategory['keywords'];
		$config['seo_description'] = $thiscategory['description']==''?'':$thiscategory['description'];
		$this->load->setPath();
		$res = array(
				'config'=>$config,
				'langurl'=>$this->Cache_model->langurl,
				'list'=>$list,
				'category'=>$thiscategory,
				'current_url'=>site_url('category/'.$thiscategory['dir'].$this->Cache_model->langurl)
		);
		$this->load->view($config['site_template'].'/rss',$res);
	}
}