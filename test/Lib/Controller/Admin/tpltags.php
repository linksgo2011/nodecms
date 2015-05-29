<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tpltags extends CI_Controller {
	var $tablefunc = 'tpltags';
	var $fields = array('title','type','value','description','listorder');
	var $funcarr = array('add','order','del');
	var $typearr = array('system','model','seo','content');
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('array');
		$this->load->model('Purview_model');
		$this->Data_model->setTable($this->tablefunc);
	}
	
	public function index(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$post = $this->input->post(NULL,TRUE);
		$getwhere = array();
		$search['type'] = trim($post['type']);
		$search['keyword'] = trim($post['keyword']);
		$search['searchtype'] = trim($post['searchtype']);
		if($search['type']!=''){
			$getwhere['type']=$search['type'];
		}
		if($search['searchtype']=='id'){
			if($search['keyword']!=''){
				$getwhere[$search['searchtype']]=$search['keyword'];
			}
		}else{
			if($search['keyword']!=''){
				$getwhere[$search['searchtype'].' like']='%'.$search['keyword'].'%';
			}
		}
		$pagearr=array(
			'currentpage'=>	isset($post['currentpage'])&&$post['currentpage']>0?$post['currentpage']:1,
			'totalnum'=>$this->Data_model->getDataNum($getwhere),
			'pagenum'=>20
		);
		$data = $this->Data_model->getData($getwhere,'type,listorder,id desc',$pagearr['pagenum'],($pagearr['currentpage']-1)*$pagearr['pagenum']);
		$res = array(
				'tpl'=>'list',
				'tablefunc'=>$this->tablefunc,
				'search'=>$search,
				'typearr'=>$this->typearr,
				'liststr'=>$this->_setlist($data,true),
				'pagestr'=>show_page($pagearr,$search),
				'funcstr'=>$this->Purview_model->getFunc($this->tablefunc,$this->funcarr),
		);
		$this->load->view($this->tablefunc,$res);
	}
	
	public function add(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'add');
		$post = $this->input->post();
		if($post['action']==site_aurl($this->tablefunc)){
			$data = elements($this->fields,$post);
			$id=$this->Data_model->addData($data);
			show_jsonmsg(array('status'=>200,'remsg'=>$this->_setlist($this->Data_model->getSingle(array('id'=>$id)),false)));
		}else{
			$res = array(
					'tpl'=>'view',
					'tablefunc'=>$this->tablefunc,
					'typearr'=>$this->typearr
			);
			show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,true)));
		}
	}

	public function edit(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'edit');
		$post = $this->input->post();
		if($post['id']&&$post['action']==site_aurl($this->tablefunc)){
			$data = elements($this->fields,$post);
			$this->Data_model->editData(array('id'=>$post['id']),$data);
			show_jsonmsg(array('status'=>200,'id'=>$post['id'],'remsg'=>$this->_setlist($this->Data_model->getSingle(array('id'=>$post['id'])),false)));
		}else{
			$id = $this->uri->segment(4);
			if($id>0&&$view = $this->Data_model->getSingle(array('id'=>$id))){
				$res = array(
						'tpl'=>'view',
						'tablefunc'=>$this->tablefunc,
						'view'=>$view,
						'typearr'=>$this->typearr
				);
				show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,true)));
			}else{
				show_jsonmsg(array('status'=>203));
			}
		}
	}
	
	public function order(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'order');
		$data = $this->Data_model->listorder($this->input->post('ids',true),$this->input->post('listorder',true),'listorder');
		show_jsonmsg(array('status'=>200,'remsg'=>$this->_setlist($data,true)));
	}
	
	public function del(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'del');
		$ids = $this->input->post('optid',true);
		if($ids){
			$this->Data_model->delData($ids);
			show_jsonmsg(array('status'=>200,'remsg'=>lang('delok'),'ids'=>$ids));
		}else{
			show_jsonmsg(array('status'=>203));
		}
	}
	
	function _setlist($data,$ismultiple=true){
		$newdata = $ismultiple?$data:($newdata[0]=$data);
		if($ismultiple){
			$newdata = $data;
		}else{
			$newdata = array(0=>$data);
		}
		$newstr = '';
		foreach($newdata as $key=>$item){
			$item['func'] = '';
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'edit')){
				$item['func'] .= $this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/edit/'.$item['id']),'edit');
			}
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'order')){
				$item['func'] .= $this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/order'),'order');
			}
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'del')){
				$item['func'] .=  $this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/del/'.$item['id']),'sdel',$item['id']);	
			}
			$newstr.='<tr id="tid_'.$item['id'].'">
			<td width=30><input type=checkbox name="optid[]" value='.$item['id'].'></td>
			<td width=50><input type="hidden" name="ids[]" value="'.$item['id'].'"><input type="text" name="listorder[]" class="input-order" size="3" value="'.$item['listorder'].'"></td>
			<td width=40>'.$item['id'].'</td>
			<td width=180><font color="green">['.lang('tpltags_'.$item['type']).']</font>'.$item['title'].'</td>
			<td><div class="codebox"><pre>'.htmlspecialchars($item['value']).'</pre></div></td>
			<td width=50>'.$item['func'].'</td></tr>';
		}
		return $newstr;
	}
}