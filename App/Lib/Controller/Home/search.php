<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Search extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->Cache_model->setLang($this->input->get());
		$this->Lang_model->loadLang('front',$this->Cache_model->currentLang);
		$this->load->helper('tags');
		if($this->uri->segment(4)){show_404();}
	}
	
	public function index(){
		$model= $this->input->post('model',TRUE);
		$keyword = $this->input->post('keyword',TRUE);
		$model = $model==''?$this->uri->segment(2):$model;
		$keyword = $keyword==''?urldecode($this->uri->segment(3)):$keyword;
		$config = $this->Cache_model->loadConfig();
		if($model==''||$this->Data_model->getDataNum(array('varname'=>$model,'issearch'=>1),'model')==0){
			$config['seo_title'] = lang('search_error');
			$config['seo_keywords'] = '';
			$config['seo_description'] = '';
			$actionurl[] = array('name'=>lang('home'),'url'=>base_url($this->Cache_model->langurl));
			$this->load->setPath();
			$res = array(
					'config'=>$config,
					'message'=>lang('search_error'),
					'actionurl'=>$actionurl,
					'langurl'=>$this->Cache_model->langurl
			);
			$this->load->view($config['site_template'].'/message',$res);
		}else{
			$datawhere = array(
					'puttime <'=>time(),
					'status'=>1,
					'lang'=>$this->Cache_model->currentLang,
					'title like'=>'%'.$keyword.'%'
			);
			$currentpage = intval($this->uri->segment(4));
			$currentpage = $currentpage?$currentpage:1;
			$totalnum = $this->Data_model->getDataNum($datawhere,$model);
			$this->load->library('pagination');
			$pageconfig['base_url'] = site_url('search/'.$model.'/'.urlencode($keyword));
			$pageconfig['total_rows'] =$totalnum;
			$pageconfig['per_page'] = 20;
			$pageconfig['uri_segment'] = 4;
			$pageconfig['langurl'] = $this->Cache_model->langurl;
			$this->pagination->initialize($pageconfig);
			$list = $this->Data_model->getData($datawhere,'listorder,puttime desc',$pageconfig['per_page'],($currentpage-1)*$pageconfig['per_page'],$model);
			$config['seo_title'] = $keyword;
			$config['seo_keywords'] = $keyword;
			$config['seo_description'] = $keyword;
			$this->load->setPath();
			$res = array(
					'config'=>$config,
					'langurl'=>$this->Cache_model->langurl,
					'list'=>$this->Cache_model->handleModelData($list),
					'pagestr'=>$this->pagination->create_links(),
			);
			$this->load->view($config['site_template'].'/search',$res);
		}
	}
}