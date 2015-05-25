<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Template extends CI_Controller {
	var $tablefunc = 'template';
	var $defaultfolder = './data/template';
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('directory');
		$this->load->helper('file');
		$this->load->helper('number');
		$this->load->model('Purview_model');
	}
	
	public function index(){
		$this->Purview_model->checkPurview($this->tablefunc);
		$folder  = $this->input->post('folder');
		if(!$folder){
			$folder = $this->defaultfolder;
		}
		$listarr = directory_map($folder,1);
		$folderlist = array();
		$phplist = array();
		$csslist = array();
		$jslist = array();
		foreach($listarr as $list){
			$thispath = $folder.'/'.$list;
			$newlist = get_file_info($thispath);
			$newlist['permissions'] =octal_permissions(fileperms($thispath));
			$newlist['name'] = $list;
			if(is_dir($thispath)){
				$folderlist[] = $newlist;
			}else{
				$newlist['size'] = byte_format($newlist['size']);
				$ext = get_suffix($thispath);
				switch($ext){
					case 'php':
						$phplist[] = $newlist;
						break;
					case 'css':
						$csslist[] = $newlist;
						break;
					case 'js':
						$jslist[] = $newlist;
						break;
					default:
						break;
				}
			}
		}
		$res = array(
				'tpl'=>'list',
				'tablefunc'=>$this->tablefunc,
				'folderlist'=>$folderlist,
				'phplist'=>$phplist,
				'csslist'=>$csslist,
				'jslist'=>$jslist,
				'defaultfolder'=>$this->defaultfolder,
				'folder'=>$folder
		);
		$this->load->view($this->tablefunc,$res);
	}

	public function editfile(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'edit');
		$post = $this->input->post(NULL,TRUE);
		if($post['actiontype']==1){
			write_file($post['page'],$this->input->post('content'));
			show_jsonmsg(array('status'=>200));
		}else{
			$content = read_file($post['page']);
			if($content){
				$res = array(
						'tpl'=>'view',
						'tablefunc'=>$this->tablefunc,
						'page'=>$post['page'],
						'content'=>$content,
				);
				show_jsonmsg(array('status'=>200,'remsg'=>$this->load->view($this->tablefunc,$res,TRUE)));
			}else{
				show_jsonmsg(203);
			}
		}
	}
}