<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Model extends CI_Controller {
	var $tablefunc = 'model';
	var $fields = array('varname','issearch','isrecommend','listorder','status');
	var $funcarr = array('add','order','del');
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('array');
		$this->load->helper('myfunc');
		$this->load->model('Data_model');
		$this->load->model('Purview_model');
		$this->load->model('Cache_model');
		$this->Data_model->setTable($this->tablefunc);
	}
	
	public function index(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$data = $this->Data_model->getData('','listorder');
		$res = array(
				'tpl'=>'list',
				'tablefunc'=>$this->tablefunc,
				'liststr'=>$this->_setlist($data,true),
				'funcstr'=>$this->Purview_model->getFunc($this->tablefunc,$this->funcarr),
		);
		$this->load->view($this->tablefunc,$res);
	}
	
	public function add(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'add');
		$post = $this->input->post(NULL,TRUE);
		if($post['action']==site_aurl($this->tablefunc)){
			if($this->Data_model->getSingle(array('varname'=>$post['varname']))){
				show_jsonmsg(array('status'=>206));
			}
			$data = elements($this->fields,$post);
			$id=$this->Data_model->addData($data);
			$this->Cache_model->deleteSome($this->tablefunc);
			show_jsonmsg(array('status'=>200,'remsg'=>$this->_setlist($this->Data_model->getSingle(array('id'=>$id)),false)));
		}else{
			$res = array(
					'tpl'=>'view',
					'tablefunc'=>$this->tablefunc,
			);
			show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,true)));
		}
	}

	public function edit(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'edit');
		$post = $this->input->post(NULL,TRUE);
		if($post['id']&&$post['action']==site_aurl($this->tablefunc)){
			if($this->Data_model->getSingle(array('varname'=>$post['varname'],'id !='=>$post['id']))){
				show_jsonmsg(array('status'=>206));
			}
			$data = elements($this->fields,$post);
			$datawhere = array('id'=>$post['id']);
			$this->Data_model->editData($datawhere,$data);
			$this->Purview_model->resetPurview();
			$this->Cache_model->deleteSome($this->tablefunc);
			show_jsonmsg(array('status'=>200,'id'=>$post['id'],'remsg'=>$this->_setlist($this->Data_model->getSingle(array('id'=>$post['id'])),false)));
		}else{
			$id = $this->uri->segment(4);
			if($id>0&&$view = $this->Data_model->getSingle(array('id'=>$id))){
				$res = array(
						'tpl'=>'view',
						'tablefunc'=>$this->tablefunc,
						'view'=>$view
				);
				show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,true)));
			}else{
				show_jsonmsg(array('status'=>203));
			}
		}
	}
	
	public function del(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'del');
		$ids = $this->input->post('optid',true);
		if($ids){
			$this->Data_model->delData($ids);
			$this->Cache_model->deleteSome($this->tablefunc);
			show_jsonmsg(array('status'=>200,'remsg'=>lang('delok'),'ids'=>$ids));
		}else{
			show_jsonmsg(array('status'=>203));
		}
	}
	
	public function order(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'order');
		$data = $this->Data_model->listorder($this->input->post('ids',true),$this->input->post('listorder',true),'listorder');
		$this->Cache_model->deleteSome($this->tablefunc);
		show_jsonmsg(array('status'=>200,'remsg'=>$this->_setlist($data,true)));
	}
	
	function _setlist($data,$ismultiple=true){
		$newdata = $ismultiple?$data:array(0=>$data);
		$newstr = '';
		foreach($newdata as $key=>$item){
			$item['func'] = '';
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'edit')){
				$item['func'] .= $this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/edit/'.$item['id']),'edit');
			}
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'del')){
				$item['func'] .=  $this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/del/'.$item['id']),'sdel',$item['id']);	
			}
			$newstr.='<tr id="tid_'.$item['id'].'">
			<td width=30><input type=checkbox name="optid[]" value='.$item['id'].'></td>
			<td width=50><input type="hidden" name="ids[]" value="'.$item['id'].'"><input type="text" name="listorder[]" class="input-order" size="3" value="'.$item['listorder'].'"></td>
			<td width=40>'.$item['id'].'</td>
			<td width=100>'.lang('model_'.$item['varname']).'</td>
			<td>'.$item['varname'].'</td>
			<td width=100>'.($item['issearch']==1?lang('yes'):lang('no')).'</td>
			<td width=100>'.($item['isrecommend']==1?lang('yes'):lang('no')).'</td>
			<td width=50 >'.lang('status'.$item['status']).'</td>
			<td width=50>'.$item['func'].'</td></tr>';
		}
		return $newstr;
	}
}


 