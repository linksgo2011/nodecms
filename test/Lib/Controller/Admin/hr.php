<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class hr extends CI_Controller {
	var $tablefunc = 'hr';
	var $fields = array('category','title','keywords','description','content','num','city','year','thumb','color','isbold','hits','tpl','listorder','status');
	var $funcarr = array('add','order','del');
	var $categoryarr,$recommendarr,$editlang,$langurl;
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('array');
		$this->load->helper('date');
		$this->load->model('Purview_model');
		$this->load->model('Tags_model');
		$this->Data_model->setTable($this->tablefunc);
		$this->editlang=$this->Lang_model->getEditLang();
		$this->langurl = $this->Lang_model->loadLangUrl($this->editlang);
		$this->categoryarr = mult_to_single($this->Data_model->getData(array('isdisabled'=>0,'lang'=>$this->editlang,'model'=>$this->tablefunc),'parent,listorder',0,0,'category'));
		$this->recommendarr = $this->Data_model->getData(array('status'=>1,'model'=>$this->tablefunc,'lang'=>$this->editlang),'listorder',0,0,'recommend');
	}
	
	public function index(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$post = $this->input->post(NULL,TRUE);
		$getwhere = array();
		$search['category'] = trim($post['category']);
		$search['keyword'] = trim($post['keyword']);
		$search['searchtype'] = trim($post['searchtype']);
		$search['recommend'] = trim($post['recommend']);
		if($search['category']>0){
			$getwhere['category']=$search['category'];
		}
		if($search['recommend']>0){
			$getwhere['findinset']=$search['recommend'].',recommends';
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
		$getwhere['lang'] = $this->editlang;
		$pagearr=array(
			'currentpage'=>	isset($post['currentpage'])&&$post['currentpage']>0?$post['currentpage']:1,
			'totalnum'=>$this->Data_model->getDataNum($getwhere),
			'pagenum'=>20
		);
		$data = $this->Data_model->getData($getwhere,'listorder,id desc',$pagearr['pagenum'],($pagearr['currentpage']-1)*$pagearr['pagenum']);
		$res = array(
				'tpl'=>'list',
				'tablefunc'=>$this->tablefunc,
				'search'=>$search,
				'categoryarr'=>$this->categoryarr,
				'recommendarr'=>$this->recommendarr,
				'liststr'=>$this->_setlist($data,true),
				'pagestr'=>show_page($pagearr,$search),
				'funcstr'=>$this->Purview_model->getFunc($this->tablefunc,$this->funcarr),
		);
		$this->load->view($this->tablefunc,$res);
	}
	
	public function add(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'add');
		$post = $this->input->post(NULL,TRUE);
		if($post['action']==site_aurl($this->tablefunc)){
			$data = elements($this->fields,$post);
			$time = time();
			$data['createtime'] = $time;
			$data['updatetime'] = $time;
			$data['puttime'] = human_to_unix($post['puttime']);
			$data['uid'] = $this->session->userdata('uid');
			$data['lang'] = $this->editlang;
			$data['tags'] = $this->Tags_model->loadTagIds($post['tags'],$this->editlang);
			$data['recommends'] = isset($post['recommends'])&&$post['recommends']?implode(',',$post['recommends']):'';
			$id=$this->Data_model->addData($data);
			$this->Cache_model->deleteSome($this->tablefunc.'_'.$this->editlang);
			$this->Cache_model->deleteSome('recommend_'.$this->editlang.'_'.$this->tablefunc);
			show_jsonmsg(array('status'=>200,'remsg'=>$this->_setlist($this->Data_model->getSingle(array('id'=>$id)),false)));
		}else{
			$res = array(
				'tpl'=>'view',
				'tablefunc'=>$this->tablefunc,
				'categoryarr'=>$this->categoryarr,
				'recommendarr'=>$this->recommendarr,
				'recommends'=>array()
			);
			show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,true)));
		}
	}

	public function edit(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'edit');
		$post = $this->input->post(NULL,TRUE);
		if($post['id']&&$post['action']==site_aurl($this->tablefunc)){
			$data = elements($this->fields,$post);
			$data['updatetime'] = time();
			$data['puttime'] = human_to_unix($post['puttime']);
			$data['uid'] = $this->session->userdata('uid');
			$data['tags'] = $this->Tags_model->loadTagIds($post['tags'],$this->editlang);
			$data['recommends'] = isset($post['recommends'])&&$post['recommends']?implode(',',$post['recommends']):'';
			$this->Data_model->editData(array('id'=>$post['id']),$data);
			$category = $this->Data_model->getSingle(array('id'=>$data['category']),'category');
			$cachefile = $category['model'].'/detail_'.$this->editlang.'_'.$category['dir'].'_'.$post['id'];
			if(file_exists('data/cache/'.$cachefile)){
				$this->Cache_model->delete($cachefile);
			}
			$this->Cache_model->deleteSome($this->tablefunc.'_'.$this->editlang);
			$this->Cache_model->deleteSome('recommend_'.$this->editlang.'_'.$this->tablefunc);
			$this->Cache_model->deleteSome($category['dir'].'/related_'.$this->editlang.'_'.$post['id']);
			show_jsonmsg(array('status'=>200,'id'=>$post['id'],'remsg'=>$this->_setlist($this->Data_model->getSingle(array('id'=>$post['id'])),false)));
		}else{
			$id = $this->uri->segment(4);
			if($id>0&&$view = $this->Data_model->getSingle(array('id'=>$id))){
				$res = array(
						'tpl'=>'view',
						'tablefunc'=>$this->tablefunc,
						'view'=>$view,
						'categoryarr'=>$this->categoryarr,
						'recommendarr'=>$this->recommendarr,
						'recommends'=>$view['recommends']==''?array():explode(',',$view['recommends']),
						'tags'=>$this->Tags_model->loadTags($view['tags'],$this->editlang)
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
		$this->Cache_model->deleteSome($this->tablefunc.'_'.$this->editlang);
		$this->Cache_model->deleteSome('recommend_'.$this->editlang.'_'.$this->tablefunc);
		show_jsonmsg(array('status'=>200,'remsg'=>$this->_setlist($data,true)));
	}
	
	public function del(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'del');
		$ids = $this->input->post('optid',true);
		if($ids){
			$this->Data_model->delData($ids);
			$this->Cache_model->deleteSome($this->tablefunc.'_'.$this->editlang);
			$this->Cache_model->deleteSome('recommend_'.$this->editlang.'_'.$this->tablefunc);
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
			$categorystr = isset($this->categoryarr[$item['category']])?'[<a href="'.site_url('category/'.$this->categoryarr[$item['category']]['dir'].$this->langurl).'" target="_blank"><font color="green">'.$this->categoryarr[$item['category']]['name'].'</font></a>]':'';
			$newstr.='<tr id="tid_'.$item['id'].'">
			<td width=30><input type=checkbox name="optid[]" value='.$item['id'].'></td>
			<td width=50><input type="hidden" name="ids[]" value="'.$item['id'].'"><input type="text" name="listorder[]" class="input-order" size="3" value="'.$item['listorder'].'"></td>
			<td width=40>'.$item['id'].'</td>
			<td>'.$categorystr.'<a href="'.site_url('detail/'.$this->categoryarr[$item['category']]['dir'].'/'.$item['id'].$this->langurl).'" target="_blank" style="color:'.$item['color'].'">'.$item['title'].'</a></td>
			<td width=80>'.$item['hits'].'</td>
			<td width=80>'.$item['realhits'].'</td>
			<td width=50 >'.lang('status'.$item['status']).'</td>
			<td width=50>'.$item['func'].'</td></tr>';
		}
		return $newstr;
	}
}