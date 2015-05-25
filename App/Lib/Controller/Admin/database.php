<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Database extends CI_Controller {
	var $tablefunc = 'database';
	var $backuppath = './data/backup/';
	var $funcarr = array('backup','optimize');
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->helper('number');
		$this->load->model('Purview_model');
	}
	
	public function index()
	{
		$this->Purview_model->checkPurview($this->tablefunc);
		$res = array(
				'tpl'=>'list',
				'tablefunc'=>$this->tablefunc,
				'list'=> $this->db->query("SHOW TABLE STATUS")->result_array(),
				'funcstr'=>$this->Purview_model->getFunc($this->tablefunc,$this->funcarr)
		);
		$this->load->view($this->tablefunc,$res);
	}
	
	public function backup(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'backup');
		$tables = $this->input->post('optid',TRUE);
		if(!$tables){
			show_jsonmsg(array('status'=>203));
		}
		$this->load->dbutil();
		$sqlname = date('Ymd'.time().'_'.rand(1000,9999));
		$prefs = array(
				'tables'      => $tables,
				'ignore'      => array(),
				'format'      => 'zip',
				'filename'    => $sqlname.'.sql',
				'add_drop'    => TRUE,
				'add_insert'  => TRUE,
				'newline'     => "\n"
		);
		$backup =& $this->dbutil->backup($prefs);
		$this->load->helper('file');
		write_file($this->backuppath.$sqlname.'.zip', $backup);
		show_jsonmsg(array('status'=>200));
	}
	
	public function optimize(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'optimize');
		$tables = $this->input->post('optid',TRUE);
		if(!$tables){
			show_jsonmsg(array('status'=>203));
		}
		$this->load->dbutil();
		foreach($tables as $table){
			$this->dbutil->optimize_table($table);
		}
		show_jsonmsg(array('status'=>205));
	}
	
	public function download(){
		$this->Purview_model->checkPurview($this->tablefunc,'download');
		$id = $this->uri->segment(4);
		if($id){
			$filename = base64_decode($id);
			$data = file_get_contents($this->backuppath.$filename);
			$this->load->helper('download');
			force_download($filename,$data);
		}else{
			$this->load->helper('file');
			$list = get_dir_file_info($this->backuppath);
			$res = array(
					'tpl'=>'download',
					'tablefunc'=>$this->tablefunc,
					'list'=>$list,
					'funcstr'=>$this->Purview_model->getFunc($this->tablefunc,array('del')),
					'isdel'=>$this->Purview_model->checkPurviewFunc($this->tablefunc,'del')
			);
			$this->load->view($this->tablefunc,$res);
		}
	}
	
	public function upgrade(){
		$this->Purview_model->checkPurview($this->tablefunc,'upgrade');
		if($this->input->post('action')){
			$upgradesql = trim($this->input->post('upgradesql',TRUE));
			if($upgradesql){
				$sqlarr = splitsql($upgradesql);
				foreach($sqlarr as $sql){
					$this->db->query($sql);
				}
				show_jsonmsg(array('status'=>200));
			}else{
				show_jsonmsg(array('status'=>200,'remsg'=>lang('database_sqlerror')));
			}
		}else{
			$res = array(
					'tpl'=>'upgrade',
					'tablefunc'=>$this->tablefunc,
					'funcstr'=>$this->Purview_model->getFunc($this->tablefunc,array('upgrade'))
			);
			$this->load->view($this->tablefunc,$res);
		}
	}
	
	public function del(){
		$this->Purview_model->checkPurviewAjax($this->tablefunc,'del');
		$ids = $this->input->post('optid');
		if($ids){
			if(is_array($ids)){
				foreach($ids as $item){
					@unlink($this->backuppath.base64_decode($item));
				}
			}else{
				@unlink($this->backuppath.base64_decode($ids));
			}
			show_jsonmsg(array('status'=>200,'remsg'=>lang('delok'),'ids'=>$ids));
		}else{
			show_jsonmsg(203);
		}
	}
}


 