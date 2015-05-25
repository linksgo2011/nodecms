<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Config extends CI_Controller {
	var $tablefunc = 'config';
	var $editlang = '';
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->model('Purview_model');
		$this->Data_model->setTable($this->tablefunc);
		$this->editlang=$this->Lang_model->getEditLang();
	}
	
	public function index(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$post = $this->input->post(NULL,TRUE);
		$data = $this->Data_model->getData(array('category'=>'base','lang'=>$this->editlang));
		$view = $this->_opData($data);
		if($post['action']==site_aurl($this->tablefunc)){
			$this->Purview_model->checkPurviewAjax($this->tablefunc,'base');
			foreach($post['config'] as $key=>$item){
				if($key=='site_code'){
					$tmpData = $this->input->post('config');
					$item = $tmpData['site_code'];
					unset($tmpData);
				}
				if(isset($view[$key])){
					$this->Data_model->editData(array('varname'=>$key,'lang'=>$this->editlang),array('value'=>$item));
				}else{
					$systemArr = array('site_name','site_title','site_keywords','site_description','site_code','site_logo','site_template','site_home');
					$issystem = in_array($key,$systemArr)?1:0;
					$this->Data_model->addData(array('varname'=>$key,'lang'=>$this->editlang,'category'=>'base','value'=>$item,'issystem'=>$issystem));	
				}
			}
			$this->Cache_model->delete($this->tablefunc.'_'.$this->editlang.'_base');
			show_jsonmsg(array('status'=>200));
		}else{
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'base')){
				$func = $this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc).'\',\'save\')','save');
			}
			$list = $this->Data_model->getData(array('category'=>'base','lang'=>$this->editlang,'issystem'=>0));
			$res = array(
					'tpl'=>'base',
					'tablefunc'=>$this->tablefunc,
					'func'=>$func,
					'view'=>$view,
					'liststr'=>$this->_setlist($list),
			);
			$this->load->view($this->tablefunc,$res);
		}
	}
	
	public function mail(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$post = $this->input->post(NULL,TRUE);
		$data = $this->Data_model->getData(array('category'=>'mail'));
		$view = $this->_opData($data);
		if($post['action']==site_aurl($this->tablefunc.'/mail')){
			$this->Purview_model->checkPurviewAjax($this->tablefunc,'smtp');
			foreach($post['config'] as $key=>$item){
				if(isset($view[$key])){
					$this->Data_model->editData(array('varname'=>$key),array('value'=>$item));
				}else{
					$this->Data_model->addData(array('varname'=>$key,'lang'=>0,'category'=>'mail','value'=>$item,'issystem'=>1));
				}
			}
			$this->Cache_model->delete($this->tablefunc.'_mail');
			show_jsonmsg(array('status'=>200));
		}else{
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'mail')){
				$func = $this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc.'/mail').'\',\'save\')','save');
			}
			$res = array(
					'tpl'=>'mail',
					'tablefunc'=>$this->tablefunc,
					'func'=>$func,
					'view'=>$view
			);
			$this->load->view($this->tablefunc,$res);
		}
	}
	
	public function attr(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$post = $this->input->post(NULL,TRUE);
		$data = $this->Data_model->getData(array('category'=>'attr'));
		$view = $this->_opData($data);
		if($post['action']==site_aurl($this->tablefunc.'/attr')){
			$this->Purview_model->checkPurviewAjax($this->tablefunc,'smtp');
			foreach($post['config'] as $key=>$item){
				if(isset($view[$key])){
					$this->Data_model->editData(array('varname'=>$key),array('value'=>$item));
				}else{
					$this->Data_model->addData(array('varname'=>$key,'lang'=>0,'category'=>'attr','value'=>$item,'issystem'=>1));
				}
			}
			$this->Cache_model->delete($this->tablefunc.'_attr');
			show_jsonmsg(array('status'=>200));
		}else{
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'attr')){
				$func = $this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc.'/attr').'\',\'save\')','save');
			}
			$res = array(
					'tpl'=>'attr',
					'tablefunc'=>$this->tablefunc,
					'func'=>$func,
					'view'=>$view
			);
			$this->load->view($this->tablefunc,$res);
		}
	}
	
	public function lang(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$post = $this->input->post(NULL,TRUE);
		$data = $this->Data_model->getData(array('category'=>'lang'));
		$view = $this->_opData($data);
		if($post['action']==site_aurl($this->tablefunc.'/lang')){
			$this->Purview_model->checkPurviewAjax($this->tablefunc,'lang');
			foreach($post['config'] as $key=>$item){
				if(isset($view[$key])){
					$this->Data_model->editData(array('varname'=>$key),array('value'=>$item));
				}else{
					$this->Data_model->addData(array('varname'=>$key,'lang'=>0,'category'=>'lang','value'=>$item,'issystem'=>1));
				}
			}
			$this->Cache_model->clean();
			show_jsonmsg(array('status'=>200));
		}else{
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'lang')){
				$func = $this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc.'/lang').'\',\'save\')','save');
			}
			$res = array(
					'tpl'=>'lang',
					'tablefunc'=>$this->tablefunc,
					'langarr'=>$this->Cache_model->loadLang(),
					'func'=>$func,
					'view'=>$view
			);
			$this->load->view($this->tablefunc,$res);
		}
	}
	
	public function add(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$post = $this->input->post(NULL,TRUE);
		if($post['action']==site_aurl($this->tablefunc.'/add')){
			$this->Purview_model->checkPurviewAjax($this->tablefunc,'add');
			if($this->Data_model->getSingle(array('varname'=>$post['varname'],'lang'=>$this->editlang))||$this->Data_model->getSingle(array('varname'=>$post['varname'],'lang'=>0))){
				show_jsonmsg(array('status'=>206));
			}
			$this->Data_model->addData(array('varname'=>$post['varname'],'lang'=>$this->editlang,'category'=>'base','value'=>$post['value'],'title'=>$post['title']));
			$this->Cache_model->delete($this->tablefunc.'_'.$this->editlang.'_base');
			show_jsonmsg(array('status'=>200));
		}else{
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'lang')){
				$func = $this->Purview_model->getOtherFunc('submitTo(\''.site_aurl($this->tablefunc.'/add').'\',\'save\')','save');
			}
			$res = array(
					'tpl'=>'add',
					'tablefunc'=>$this->tablefunc,
					'func'=>$func
			);
			$this->load->view($this->tablefunc,$res);
		}
	}
	
	public function del(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'del');
		$ids = $this->input->post('optid',true);
		if($ids){
			$this->Data_model->delData($ids);
			$this->Cache_model->delete($this->tablefunc.'_'.$this->editlang.'_base');
			show_jsonmsg(array('status'=>205));
		}else{
			show_jsonmsg(array('status'=>203));
		}
	}
	
	function _opData($data){
		$view = array();
		foreach($data as $item){
			$view[$item['varname']] = $item['value'];
		}
		return $view;
	}
	
	function _setlist($data){
		$newstr = '';
		foreach($data as $key=>$item){
			$item['func'] = '';
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'del')){
				$item['func'] =  $this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/del/'.$item['id']),'sdel',$item['id']);
			}
			$newstr.='<tr id="tid_'.$item['id'].'">
			<td width=100 align="right">'.$item['title'].'</td>
			<td><input type="text" name="config['.$item['varname'].']" id="'.$item['varname'].'" size="50" class="input-text fl" value="'.$item['value'].'">'.$item['func'].$item['varname'].'</td>
			</tr>';
		}
		return $newstr;
	}
}


 