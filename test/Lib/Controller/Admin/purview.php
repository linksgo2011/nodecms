<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Purview extends CI_Controller {
	var $tablefunc = 'purview';
	var $fields = array('parent','class','method','listorder','status');
	var $funcarr = array('add','order');
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('array');
		$this->load->model('Purview_model');
		$this->Data_model->setTable($this->tablefunc);
	}
	
	public function index()
	{
		$this->Purview_model->checkPurview($this->tablefunc);
		$purviewarr = $this->Data_model->getData('','listorder');
		$isedit = $this->Purview_model->checkPurviewFunc($this->tablefunc,'edit')?true:false;
		$isdel = $this->Purview_model->checkPurviewFunc($this->tablefunc,'del')?true:false;
		foreach($purviewarr as $item) {
			$item['status']=$item['status']==1?lang('status1'):lang('status0');
			$item['func'] = '';
			$item['title'] = lang('func_'.$item['class']);
			$item['func'] .= $isedit?$this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/edit/'.$item['id']),'edit'):'';
			$item['func'] .= $isdel?$this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/del/'.$item['id']),'sdel',$item['id']):'';
			$newarr[] = $item;
		}
		$str = "<tr id='id_\$id'>
				<td width=30><input type=checkbox name='optid[]' value='\$id'></td>
				<td width=40>\$id</td>
				<td width=200>\$spacer <input type='hidden' name='ids[]' value='\$id'><input type='text' name='listorder[]' class='input-order' size='3' value='\$listorder'>\$title</td>
				<td width=120>\$class</td>
				<td>\$method</td>
				<td width=50 align='left'>\$status</td>
				<td width=50>\$func</td></tr>";
		$arr = array('listarr'=>$newarr,'liststr'=>$str);
		$this->load->library('tree', $arr);
		$res = array(
			'tpl'=>'list',
			'tablefunc'=>$this->tablefunc,
			'liststr'=>$this->tree->getlist(),
			'funcstr'=>$this->Purview_model->getFunc($this->tablefunc,$this->funcarr),
		);
		$this->load->view($this->tablefunc,$res);
	}
	
	public function add(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'add');
		$post = $this->input->post(NULL,TRUE);
		if($post['action']==site_aurl($this->tablefunc)){
			if($this->Data_model->getSingle(array('class'=>$post['class']))){
				show_jsonmsg(array('status'=>206));
			}
			$data = elements($this->fields,$post);
			$id=$this->Data_model->addData($data);
			show_jsonmsg(array('status'=>205));
		}else{
			$res = array(
				'tpl'=>'view',
				'tablefunc'=>$this->tablefunc,
				'parent'=> $this->Data_model->getData(array('parent'=>0)),
			);
			show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,true)));
		}
	}

	public function edit(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'edit');
		$post = $this->input->post(NULL,TRUE);
		if($post['id']&&$post['action']==site_aurl($this->tablefunc)){
			if($this->Data_model->getSingle(array('class'=>$post['class'],'id !='=>$post['id']))){
				show_jsonmsg(array('status'=>206));
			}
			$data = elements($this->fields,$post);
			$datawhere = array('id'=>$post['id']);
			$this->Data_model->editData($datawhere,$data);
			$this->Purview_model->resetPurview();
			show_jsonmsg(array('status'=>205));
		}else{
			$id = $this->uri->segment(4);
			if($id>0&&$view = $this->Data_model->getSingle(array('id'=>$id))){
				$res = array(
						'tpl'=>'view',
						'tablefunc'=>$this->tablefunc,
						'parent'=> $this->Data_model->getData(array('parent'=>0)),
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
			$this->Purview_model->resetPurview();
			show_jsonmsg(array('status'=>205));
		}else{
			show_jsonmsg(array('status'=>203));
		}
	}
	
	public function order(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'order');
		$this->Data_model->listorder($this->input->post('ids',true),$this->input->post('listorder',true));
		$this->Purview_model->resetPurview();
		show_jsonmsg(array('status'=>205));
	}
}


 