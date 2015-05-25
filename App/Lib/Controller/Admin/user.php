<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User extends CI_Controller {
	var $tablefunc = 'user';
	var $fields = array('username','usergroup','email','realname','sex','tel','mobile','fax','address','status');
	var $funcarr = array('add','del');
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
		$search['usergroup'] = trim($post['usergroup']);
		$search['keyword'] = trim($post['keyword']);
		$search['searchtype'] = trim($post['searchtype']);
		if($search['usergroup']>0){
			$getwhere['usergroup']=$search['usergroup'];
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
		
		$data = $this->Data_model->getData($getwhere,'id desc',$pagearr['pagenum'],($pagearr['currentpage']-1)*$pagearr['pagenum']);
		
		$res = array(
				'tpl'=>'list',
				'tablefunc'=>$this->tablefunc,
				'search'=>$search,
				'usergroup'=>$this->Data_model->getData(array('status'=>1),'listorder',0,0,'usergroup'),
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
			if($this->Data_model->getSingle(array('username'=>$post['username']))){
				show_jsonmsg(array('status'=>206));
			}
			$time = time();
			$userip = $this->input->ip_address();
			$this->load->helper('string');
			$salt = random_string('alnum',6);
			$data = elements($this->fields,$post);
			$data['createtime'] = $time;
			$data['updatetime'] = $time;
			$lang['lasttime'] = $time;
			$data['regip'] = $userip;
			$data['lastip'] = $userip;
			$data['salt'] = $salt;
			$data['password'] = md5pass($post['password'],$salt);
			$id=$this->Data_model->addData($data);
			show_jsonmsg(array('status'=>200,'remsg'=>$this->_setlist($this->Data_model->getSingle(array('id'=>$id)),false)));
		}else{
			$res = array(
					'tpl'=>'view',
					'tablefunc'=>$this->tablefunc,
					'usergroup'=>$this->Data_model->getData(array('status'=>1),'listorder',0,0,'usergroup')
			);
			show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,true)));
		}
	}

	public function edit(){
		
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'edit');
		$post = $this->input->post(NULL,TRUE);
		if($post['id']&&$post['action']==site_aurl($this->tablefunc)){
			if($this->Data_model->getSingle(array('username'=>$post['username'],'id !='=>$post['id']))){
				show_jsonmsg(array('status'=>206));
			}
			$time = time();
			$data = elements($this->fields,$post);
			$data['updatetime'] = $time;
			if($post['password']!=''){
				$this->load->helper('string');
				$salt = random_string('alnum',6);
				$data['password'] = md5pass($post['password'],$salt);
				$data['salt'] = $salt;
			}
			$datawhere = array('id'=>$post['id']);
			$this->Data_model->editData($datawhere,$data);
			show_jsonmsg(array('status'=>200,'id'=>$post['id'],'remsg'=>$this->_setlist($this->Data_model->getSingle(array('id'=>$post['id'])),false)));
		}else{
			$id = $this->uri->segment(4);
			if($id>0&&$view = $this->Data_model->getSingle(array('id'=>$id))){
				$res = array(
						'tpl'=>'view',
						'tablefunc'=>$this->tablefunc,
						'view'=>$view,
						'usergroup'=>$this->Data_model->getData(array('status'=>1),'listorder',0,0,'usergroup')
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
			if($this->Purview_model->checkPurviewFunc($this->tablefunc,'del')&&$item['id']>1){
				$item['func'] .=  $this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/del/'.$item['id']),'sdel',$item['id']);	
			}
			$disabled = $item['id']==1?'disabled':'';
			$newstr .='<tr id="tid_'.$item['id'].'">
			<td width=30><input type=checkbox name="optid[]" '.$disabled.' value='.$item['id'].'></td>
			<td width=40>'.$item['id'].'</td>
			<td width=80>'.$item['username'].'</td>
			<td width=120>'.$item['email'].'</td>
			<td width=100>'.$item['realname'].'</td>
			<td>'.$item['mobile'].'</td>
			<td width=120>'.date('Y-m-d H:i:s',$item['createtime']).'</td>
			<td width=120>'.date('Y-m-d H:i:s',$item['lasttime']).'</td>
			<td width=50 >'.lang('status'.$item['status']).'</td>
			<td width=50>'.$item['func'].'</td></tr>';
		}
		return $newstr;
	}
}