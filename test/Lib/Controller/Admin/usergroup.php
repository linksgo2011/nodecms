<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Usergroup extends CI_Controller {
	var $tablefunc = 'usergroup';
	var $fields = array('varname','listorder','status');
	var $funcarr = array('add','order','del');
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('array');
		$this->load->model('Purview_model');
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
			$this->Purview_model->resetPurview();
			show_jsonmsg(array('status'=>200,'remsg'=>lang('delok'),'ids'=>$ids));
		}else{
			show_jsonmsg(array('status'=>203));
		}
	}
	
	public function order(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'order');
		$data = $this->Data_model->listorder($this->input->post('ids',true),$this->input->post('listorder',true),'listorder');
		show_jsonmsg(array('status'=>200,'remsg'=>$this->_setlist($data,true)));
	}
	
	public function grant(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'grant');
		$post = $this->input->post(NULL,TRUE);
		if($post['id']&&$post['action']==site_aurl($this->tablefunc)){
			$purviewids = $this->input->post('purviewid');
			
			if($purviewids){
				$arr = $this->Data_model->getData(array('status'=>1,'id'=>$purviewids),'listorder',0,0,'purview');
				$newpurviewid = array();
				$newpurviewarr = array();
				foreach($arr as $key=>$item){
					$newpurviewid[] = $item['id'];
					$newpurviewarr[$item['class']]['id'] = $item['id'];
					$newpurviewarr[$item['class']]['class'] = $item['class'];
					$newpurviewarr[$item['class']]['method'] = $this->input->post($item['class'].'_method');
					$grouppurview[$item['parent']][] = $item;
					if($item['parent']==0){
						$parentpurview[$item['id']] = $item;	
					}
				}
				$purview = array(0=>$newpurviewid,1=>$newpurviewarr,2=>$grouppurview,3=>$parentpurview);
			}else{
				$purview = array();
			}
			$this->Data_model->editData( array('id'=>$post['id']),array('purview'=>serialize($purview)));
			show_jsonmsg(200);
		}else{
			$id = $this->uri->segment(4);
			if($id>0&&$view = $this->Data_model->getSingle(array('id'=>$id))){
				$purview = unserialize($view['purview']);
				$arr = $this->Data_model->getData(array('status'=>1),'',0,0,'purview');
				foreach($arr as $item) {
					$item['checkid'] = '<input type=checkbox '.(isset($purview[0])&&$purview[0]&&@in_array($item['id'],$purview[0])?'checked':'').' name=\'purviewid[]\' value='.$item['id'].'>';
					$item['title'] = lang('func_'.$item['class']);
					if($item['method']!=''){
						$item['methodcheck'] = '<input type="checkbox"  name="'.$item['class'].'_method[]"  onclick="checkAll(this,\''.$item['class'].'_method[]\')">'.lang('checkall');
						$item['method'] = explode(',',$item['method']);
						foreach($item['method'] as $methodview){
							$item['methodcheck'] .= '<input type="checkbox" '.(isset($purview[1][$item['class']]['method'])&&$purview[1][$item['class']]['method']&&in_array($methodview,$purview[1][$item['class']]['method'])?'checked':'').'  name="'.$item['class'].'_method[]" value="'.$methodview.'">'.lang('btn_'.$methodview);
						}
					}else{
						$item['methodcheck']  = '';
					}
					$newarr[] = $item;
				}
				$str = "<tr>" .
						"<td width=30>\$checkid</td>" .
						"<td width=150>\$spacer \$title</td>" .
						"<td>\$methodcheck</td>";
				$arr = array('listarr'=>$newarr,'liststr'=>$str);
				$this->load->library('tree', $arr);
				$res = array(
						'tpl'=>'grant',
						'tablefunc'=>$this->tablefunc,
						'view'=>$view,
						'liststr'=>$this->tree->getlist(),
				);
				show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,true)));
			}else{
				show_jsonmsg(array('status'=>203));
			}
		}
	}
	
	function _setlist($data,$ismultiple=true){
		$newdata = $ismultiple?$data:array(0=>$data);
		$newstr = '';
		foreach($newdata as $key=>$item){
			$item['func'] = '';
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'edit')){
				$item['func'] .= $this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/edit/'.$item['id']),'edit');
			}
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'del')&&$item['id']>1){
				$item['func'] .=  $this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/del/'.$item['id']),'sdel',$item['id']);	
			}
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'grant')){
				$item['func'] .=  $this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/grant/'.$item['id']),'grant',$item['id']);
			}
			$disabled = $item['id']==1?'disabled':'';
			$newstr.='<tr id="tid_'.$item['id'].'">
			<td width=30><input type=checkbox name="optid[]" '.$disabled.' value='.$item['id'].'></td>
			<td width=50><input type="hidden" name="ids[]" value="'.$item['id'].'"><input type="text" name="listorder[]" class="input-order" size="3" value="'.$item['listorder'].'"></td>
			<td width=40>'.$item['id'].'</td>
			<td width=100>'.lang($item['varname']).'</td>
			<td>'.$item['varname'].'</td>
			<td width=50 >'.lang('status'.$item['status']).'</td>
			<td width=80>'.$item['func'].'</td></tr>';
		}
		return $newstr;
	}
}


 