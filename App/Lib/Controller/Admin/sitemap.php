<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sitemap extends CI_Controller {
	var $tablefunc = 'sitemap';
	var $backuppath = './data/sitemap/';
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('file');
		$this->load->helper('number');
		$this->load->model('Purview_model');
	}
	
	public function index(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$func = '';
		$isdel = $this->Purview_model->checkPurviewFunc($this->tablefunc,'del');
		$isgenerate = $this->Purview_model->checkPurviewFunc($this->tablefunc,'generate');
		$func .= $isgenerate?$this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc.'/generate').'\',\'generate\')','generate'):'';
		$func .= $isdel?$this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc.'/del').'\',\'del\')','del'):'';
		$btngenerate = $this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc.'/generate').'\',\'generate\')','generate');
		$list = get_dir_file_info($this->backuppath);
		$res = array(
				'tablefunc'=>$this->tablefunc,
				'list'=>get_dir_file_info($this->backuppath),
				'func'=>$func,
				'isdel'=>$isdel,
				'langarr'=>$this->Cache_model->loadLang(),
				'isdownload'=>$this->Purview_model->checkPurviewFunc($this->tablefunc,'download'),
				'btngenerate'=>$btngenerate
		);
		$this->load->view($this->tablefunc,$res);
	}
	
	public function generate(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'generate');
		$generate  = $this->input->post('generate',TRUE);
		$generate = array('zh_cn','en');
		$baidu_sitemap = '<?xml  version="1.0" encoding="utf-8" ?><urlset>';
		$google_sitemap = '<urlset xmlns="'.base_url('data/sitemap/google.xml').'">';
		$sitemap='<url><loc>'.base_url().'</loc></url>';
		$sitemap = '';
		$time = time();
		foreach($generate as $lang){
			$langurl = $this->Lang_model->loadLangUrl($lang);
			$sitemap.='<url><loc>'.base_url($langurl).'</loc></url>';
			$categoryarr = $this->Cache_model->loadAllCategory($lang);
			foreach($categoryarr as $category){
				$sitemap.='<url><loc>'.$category['url'].'</loc></url>';
			}
			$articlearr = $this->Data_model->getData(array('lang'=>$lang,'status'=>1,'puttime <'=>$time),'',0,0,'article');
			foreach($articlearr as $article){
				$sitemap.='<url><loc>'.site_url('detail/'.$categoryarr[$article['category']]['dir'].'/'.$article['id'].$langurl).'</loc></url>';
			}
			$productarr = $this->Data_model->getData(array('lang'=>$lang,'status'=>1,'puttime <'=>$time),'',0,0,'product');
			foreach($productarr as $product){
				$sitemap.='<url><loc>'.site_url('detail/'.$categoryarr[$product['category']]['dir'].'/'.$product['id'].$langurl).'</loc></url>';
			}
			$askarr = $this->Data_model->getData(array('lang'=>$lang,'status'=>1,'puttime <'=>$time),'',0,0,'ask');
			foreach($askarr as $ask){
				$sitemap.='<url><loc>'.site_url('detail/'.$categoryarr[$ask['category']]['dir'].'/'.$ask['id'].$langurl).'</loc></url>';
			}
			$downarr = $this->Data_model->getData(array('lang'=>$lang,'status'=>1,'puttime <'=>$time),'',0,0,'down');
			foreach($downarr as $down){
				$sitemap.='<url><loc>'.site_url('detail/'.$categoryarr[$down['category']]['dir'].'/'.$down['id'].$langurl).'</loc></url>';
			}
			$hrarr = $this->Data_model->getData(array('lang'=>$lang,'status'=>1,'puttime <'=>$time),'',0,0,'hr');
			foreach($hrarr as $hr){
				$sitemap.='<url><loc>'.site_url('detail/'.$categoryarr[$hr['category']]['dir'].'/'.$hr['id'].$langurl).'</loc></url>';
			}
		}
		$sitemap.='</urlset>';
		$this->load->helper('file');
		write_file($this->backuppath.'baidu.xml.', $baidu_sitemap.$sitemap);
		write_file($this->backuppath.'google.xml.', $google_sitemap.$sitemap);
		show_jsonmsg(array('status'=>205));
	}
	
	public function download(){
		$this->Purview_model->checkPurview($this->tablefunc,'download');
		$name = $this->uri->segment(4);
		if($name){
			$filename = $name.'.xml';
			$data = file_get_contents($this->backuppath.$filename);
			$this->load->helper('download');
			force_download($filename,$data);
		}else{
			redirect(site_aurl($this->tablefunc));
		}
	}
	
	
	
	public function del(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'del');
		$ids = $this->input->post('optid');
		if($ids){
			if(is_array($ids)){
				foreach($ids as $item){
					@unlink($this->backuppath.base64_decode($item));
				}
			}else{
				@unlink($this->backuppath.base64_decode($ids));
			}
			show_jsonmsg(array('status'=>200,'remsg'=>lang('delok'),'ids'=>$ids));
		}else{
			show_jsonmsg(203);
		}
	}
}


 