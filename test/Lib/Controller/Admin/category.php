<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Category extends CI_Controller {
	var $tablefunc = 'category';
	var $fields = array('parent','name','title','isexternal','externalurl','target','dir','keywords','description','content','model','thumb','color','tpllist','tpldetail','pagesize','isnavigation','isdisabled','listorder');
	var $funcarr = array('add','order');
	var $editlang,$modelarr,$langurl;
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('array');
		$this->load->model('Purview_model');
		$this->Data_model->setTable($this->tablefunc);
		$this->editlang=$this->Lang_model->getEditLang();
		$this->langurl = $this->Lang_model->loadLangUrl($this->editlang);
		$this->modelarr = mult_to_single($this->Data_model->getData(array('status'=>1),'listorder',0,0,'model'),'varname');
	}
	
	public function index(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$categoryarr = $this->Data_model->getData(array('lang'=>$this->editlang),'listorder');
		if($categoryarr){
			$isadd = $this->Purview_model->checkPurviewFunc($this->tablefunc,'add')?true:false;
			$isedit = $this->Purview_model->checkPurviewFunc($this->tablefunc,'edit')?true:false;
			$isdel = $this->Purview_model->checkPurviewFunc($this->tablefunc,'del')?true:false;
			foreach($categoryarr as $item) {
				$item['isnavigation']=$item['isnavigation']==1?lang('yes'):lang('no');
				$item['modelstr']= $item['isexternal']==1?lang('category_isexternal'):lang('model_'.$item['model']);
				$item['url'] = $item['isexternal']==1?$item['externalurl']:site_url('category/'.$item['dir'].$this->langurl);
				$item['color'] = $item['color']==''?'':' style="color:'.$item['color'].'" ';
				$item['func'] = '';
				$item['func'] .= $isedit?$this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/edit/'.$item['id']),'edit'):'';
				$item['func'] .= $isdel?$this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/del/'.$item['id']),'sdel',$item['id']):'';
				$item['funca'] = $isadd?$this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/add/'.$item['id']),'add'):'';
				$newarr[] = $item;
			}
			$str = "<tr>
					<td width=40>\$id</td>
					<td><div class='fl' \$color>\$spacer <input type='hidden' name='ids[]' value='\$id'><input type='text' name='listorder[]' class='input-order' size='3' value='\$listorder'><a href='\$url' target='_blank'> \$name</a></div> \$funca</td>
					<td width=150>\$modelstr</td>
					<td width=150>\$dir</td>
					<td width=80 align='left'>\$isnavigation</td>
					<td width=50>\$func</td></tr>";
			$arr = array('listarr'=>$newarr,'liststr'=>$str);
			$this->load->library('tree', $arr);
			$liststr = $this->tree->getlist();
		}else{
			$liststr = '';
		}
		$funcstr = $this->Purview_model->getFunc($this->tablefunc,$this->funcarr);
		$res = array(
				'tpl'=>'list',
				'tablefunc'=>$this->tablefunc,
				'modelarr'=>$this->modelarr,
				'liststr'=>$liststr,
				'funcstr'=>$funcstr
				
		);
		$this->load->view($this->tablefunc,$res);
	}
	
	public function add(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'add');
		$post = $this->input->post(NULL,TRUE);
		if($post['action']==site_aurl($this->tablefunc)){
			if($this->Data_model->getSingle(array('lang'=>$this->editlang,'dir'=>$post['dir']))){
				show_jsonmsg(array('status'=>206));
			}
			$data = elements($this->fields,$post);
			if($data['parent']>0){
				$view = $this->Data_model->getSingle(array('id'=>$data['parent']));
				$data['lft'] = $view['rht'];
				$this->db->set('rht', 'rht+2', FALSE);
				$this->db->where(array('rht >='=>$data['lft'],'lang'=>$this->editlang));
				$this->db->update('category');
				$this->db->set('lft', 'lft+2', FALSE);
				$this->db->where(array('lft >'=>$data['lft'],'lang'=>$this->editlang));
				$this->db->update('category');
			}else{
				$maxnum = $this->Data_model->getDataNum(array('lang'=>$this->editlang));
				$data['lft'] = $maxnum*2+1;
			}
			$data['rht'] = $data['lft']+1;
			$data['lang'] = $this->editlang;
			$this->Data_model->addData($data);
			$this->Cache_model->deleteSome($this->tablefunc.'_'.$this->editlang);
			show_jsonmsg(array('status'=>205));
		}else{
			$parentid = intval($this->uri->segment(4));
			$parentid = $parentid?$parentid:0;
			$parent  = $this->Data_model->getData(array('lang'=>$this->editlang),'listorder');
			$arr = array('listarr'=>$parent,'tid'=>$parentid,'liststr'=>"<option value='\$id' \$selected \$disabled >\$spacer \$name</option>");
			$this->load->library('tree', $arr);
			$parentstr=$this->tree->getlist();
			$parentstr = '<option value="0">'.lang('category_top').'</option>'.$parentstr;
			$res = array(
					'tpl'=>'view',
					'tablefunc'=>$this->tablefunc,
					'modelarr'=>$this->modelarr,
					'parentstr'=>$parentstr,
					'view'=>array('parent'=>$parentid)
			);
			show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,true)));
		}
	}

	public function edit(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'edit');
		$post = $this->input->post(NULL,TRUE);
		if($post['id']&&$post['action']==site_aurl($this->tablefunc)){
			if($this->Data_model->getSingle(array('lang'=>$this->editlang,'dir'=>$post['dir'],'id !='=>$post['id']))){
				show_jsonmsg(array('status'=>206));
			}
			$data = elements($this->fields,$post);
			$view = $this->Data_model->getSingle(array('id'=>$post['id']));
			if($view['parent'] != $data['parent']){
				$pview = $this->Data_model->getSingle(array('id'=>$data['parent']));
				if(!$pview){
					$maxnum = $this->Data_model->getDataNum(array('lang'=>$this->editlang));
					$pview['lft'] = $maxnum*2;
					$pview['rht'] = $pview['lft']+1;
				}
				$betweeval = $view['rht']-$view['lft'];
				
				$alldata = $this->Data_model->getData(array('lang'=>$this->editlang,'lft >='=>$view['lft'],'rht <='=>$view['rht']),'lft');
				$ids = array();
				foreach($alldata as $item){
					$ids[] = $item['id'];
				}
				if($pview['rht']>$view['rht']){
					$this->db->set('lft', 'lft-'.$betweeval.'-1', FALSE);
					$this->db->where(array('lft >'=>$view['rht'],'lft <'=>$pview['rht'],'lang'=>$this->editlang));
					$this->db->update('category');
					$this->db->set('rht', 'rht-'.$betweeval.'-1', FALSE);
					$this->db->where(array('rht >'=>$view['rht'],'rht <'=>$pview['rht'],'lang'=>$this->editlang));
					$this->db->update('category');
					$val = $pview['rht']-$view['rht']-1;
					$this->db->set('lft', 'lft+'.$val, FALSE);
					$this->db->set('rht', 'rht+'.$val, FALSE);
					$this->db->where_in('id',$ids);
					$this->db->update('category');
				}else{
					$this->db->set('lft', 'lft+'.$betweeval.'+1', FALSE);
					$this->db->where(array('lft >'=>$pview['rht'],'lft <'=>$view['lft'],'lang'=>$this->editlang));
					$this->db->update('category');
					
					$this->db->set('rht', 'rht+'.$betweeval.'+1', FALSE);
					$this->db->where(array('rht >='=>$pview['rht'],'rht <'=>$view['lft'],'lang'=>$this->editlang));
					$this->db->update('category');
					
					$val = $view['lft']-$pview['rht'];
					$this->db->set('rht', 'rht-'.$val, FALSE);
					$this->db->set('lft', 'lft-'.$val, FALSE);
					$this->db->where_in('id',$ids);
					$this->db->update('category');
				}
			}
			$this->Data_model->editData(array('id'=>$post['id']),$data);
			$this->Cache_model->deleteSome($this->tablefunc.'_'.$this->editlang);
			show_jsonmsg(205);
		}else{
			$id = $this->uri->segment(4);
			if($id>0&&$view = $this->Data_model->getSingle(array('id'=>$id))){
				$parentstr = '';
				$parent = $this->Data_model->getData(array('lang'=>$this->editlang,'parent !='=>$id));
				$arr = array('listarr'=>$parent,'tid'=>$view['parent'],'did'=>$id,'liststr'=>"<option value='\$id' \$selected \$disabled >\$spacer \$name</option>");
				$this->load->library('tree', $arr);
				$parentstr=$this->tree->getlist();
				$parentstr = '<option value="0">'.lang('category_top').'</option>'.$parentstr;
				$res = array(
						'tpl'=>'view',
						'tablefunc'=>$this->tablefunc,
						'modelarr'=>$this->modelarr,
						'parentstr'=>$parentstr,
						'view'=>$view
				);
				show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,true)));
			}else{
				show_jsonmsg(203);
			}
		}
	}
	
	public function del(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'del');
		$id = $this->input->post('optid',TRUE);
		if($id){
			$view = $this->Data_model->getSingle(array('id'=>$id));
			$mywidth = $view['rht']-$view['lft']+1;
			$this->db->where(array('lang'=>$this->editlang,'lft >'=>$view['lft'],'rht <'=>$view['rht']));
			$this->db->delete('category');
			$this->db->set('rht','rht-'.$mywidth,FALSE);
			$this->db->where(array('lang'=>$this->editlang,'rht >'=>$view['rht']));
			$this->db->update('category');
			$this->db->set('lft','lft-'.$mywidth,FALSE);
			$this->db->where(array('lang'=>$this->editlang,'lft >'=>$view['rht']));
			$this->db->update('category');
			$this->Data_model->delData($id);
			$this->Cache_model->deleteSome($this->tablefunc.'_'.$this->editlang);
			show_jsonmsg(array('status'=>205));
		}else{
			show_jsonmsg(203);
		}
	}
	
	public function order(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'order');
		$data = $this->Data_model->listorder($this->input->post('ids',true),$this->input->post('listorder',true),'listorder');
		$this->Cache_model->deleteSome($this->tablefunc.'_'.$this->editlang);
		show_jsonmsg(array('status'=>205));
	}
}


 