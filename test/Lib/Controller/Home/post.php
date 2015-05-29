<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Post extends CI_Controller {
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
	public function guestbook(){
		$post = $this->input->post(NULL,TRUE);
		if(!$post){show_404();}
		$data = array();
		$data['title'] = trim($post['title']);
		$message = '';
		$iserror = FALSE;
		if($data['title']==''){
			$message .= lang('titletip');
			$iserror = TRUE;
		}
		$data['author'] = trim($post['author']);
		if($data['author']==''){
			$message .= lang('authortip');
			$iserror = TRUE;
		}
		$data['email'] = trim($post['email']);
		if($data['email']==''){
			$message .= lang('emailtip1');
			$iserror = TRUE;
		}
		if (!preg_match ("/^[0-9a-zA-Z]+(?:[\_\-][a-z0-9\-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]+$/i",$data['email'])) {
			$message .= lang('emailtip2');
			$iserror = TRUE;
		}
		$data['content'] = trim($post['content']);
		if($data['content']==''){
			$message .= lang('contenttip');
			$iserror = TRUE;
		}
		if($message==''){
			$category = $this->Data_model->getSingle(array('id'=>$post['category'],'model'=>'guestbook'),'category');
			if($category&&$category['isdisabled']==0){
				$data['category'] = $post['category'];
				$data['status'] = 0;
				$data['lang'] = $category['lang'];
				$data['createtime'] = time();
				if($this->Data_model->addData($data,'guestbook')){
					$message = lang('submit_success');
				}else{
					$message = lang('submit_error');
					$iserror = TRUE;
				}
			}else{
				if(isset($category['isdisabled'])){
					$message = lang('submit_isdisabled');
				}else{
					$message = lang('submit_error');
				}
				
				$iserror = TRUE;
			}
		}
		$config = $this->Cache_model->loadConfig();
		$config['seo_title'] = $iserror?lang('submit_error'):lang('submit_success');
		$config['seo_keywords'] = '';
		$config['seo_description'] = '';
		$url = isset($_SERVER['HTTP_REFERER'])&&$_SERVER['HTTP_REFERER']!=''?$_SERVER['HTTP_REFERER']:base_url($this->Cache_model->langurl);
		$actionurl[] = array('name'=>lang('reback'),'url'=>$url);
		$this->load->setPath();
		$res = array(
				'config'=>$config,
				'message'=>$message,
				'actionurl'=>$actionurl,
				'langurl'=>$this->Cache_model->langurl
		);
		$this->load->view($config['site_template'].'/message',$res);
	}
}