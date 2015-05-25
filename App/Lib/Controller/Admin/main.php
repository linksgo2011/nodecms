<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Main extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->Lang_model->loadLang('admin');
		$this->load->model('Purview_model');
		$this->load->model('Cache_model');
	}
	
	public function index()
	{
		if(!$this->session->userdata('uid')){
			redirect(site_aurl('login'));
		}
		$this->load->view('main.php');
	}
	
	public function main_index()
	{
		$usergroupid=$this->session->userdata('usergroup');
		if(!$usergroupid){
			redirect(site_aurl('login'));
		}
		$purview = $this->Purview_model->getPurview($usergroupid);
		$defaultfunc = $purview[2][$purview[2][0][0]['id']][0]['class'];
		$this->load->vars('defaultfunc',$defaultfunc);
		$this->load->view('main_index.php');
	}
	
	public function main_top()
	{
		$usergroupid=$this->session->userdata('usergroup');
		if($usergroupid>0){
			$this->load->vars('username',$this->session->userdata('username'));
			$this->load->vars('varname',$this->session->userdata('varname'));
			$purview =  $this->Purview_model->getPurview($usergroupid);
			$list = $purview[2][0];
			$editlang = $this->Lang_model->getEditLang();
			$langlist = $this->Data_model->getData(array('status'=>1),'listorder',0,0,'lang');
			$this->load->vars('langlist',$langlist);
			$this->load->vars('editlang',$editlang);
			$this->load->vars('list',$list);
			$this->load->view('main_top.php');
		}else{
			top_redirect(site_aurl('main/logout'));
		}
		
	}
	
	public function main_left()
	{
		$usergroupid=$this->session->userdata('usergroup');
		if($usergroupid>0){
			$purview =  $this->Purview_model->getPurview($usergroupid);
			$parent = $this->uri->segment(4)?$this->uri->segment(4):$purview[2][0][0]['id'];
			$this->load->vars('purview',$purview);
			$this->load->vars('parent',$parent);
			$this->load->view('main_left.php');
		}else{
			top_redirect(site_aurl('main/logout'));
		}
	}
	
	public function main_center()
	{
		$this->load->view('main_center.php');
	}
	
	public function main_right()
	{
		$this->load->view('main_right.php');
	}
	
	public function main_foot()
	{
		$this->load->view('main_foot.php');
	}
	
	public function ajaxlogin(){
		$post = $this->input->post(NULL,TRUE);
		$username = trim($post['user_name']);
		$userpass = trim($post['user_pass']);
		if($this->User_model->login($username,$userpass)){
			show_jsonmsg(200);
		}else{
			show_jsonmsg(204);
		}
	}
	
	public function login(){
		$post = $this->input->post(NULL,TRUE);
		if($post['opt']=='ajax'){
			$this->load->model('User_model');
			$username = trim($post['user_name']);
			$userpass = trim($post['user_pass']);
			if($this->User_model->login($username,$userpass)){
				echo 'ok';exit;
			}else{
				echo 'error';exit;
			}
		}
		$this->load->view('login.php');
	}
	
	public function attrlist(){
		$usergroupid=$this->session->userdata('usergroup');
		if(!$usergroupid){
			$result = array('error'=>1,'message'=>lang('nopur'));
			echo json_encode($result);exit;
		}
		$attr_url = 'data/attachment/';
		$ext_arr = array('gif', 'jpg', 'jpeg', 'png', 'bmp');
		$dir_name = $this->input->get('dir');
		$path_name = $this->input->get('path');
		$order = $this->input->get('order');
		if(!in_array($dir_name,array('image','flash','media','file'))){
			echo "Invalid Directory name.";
			exit;
		}
		if($dir_name!=''){
			$attr_url .= $dir_name.'/';
			if (!file_exists($attr_url)) {
				mkdir($attr_url);
			}
		}
		$current_path = $attr_url.($path_name!=''?$path_name.'/':'');
		if ($path_name=='') {
			$current_path =$attr_url;
			$current_dir_path = '';
			$moveup_dir_path = '';
		} else {
			$current_path = $attr_url.$path_name.'/';
			$current_dir_path = $path_name;
			$moveup_dir_path = preg_replace('/(.*?)[^\/]+\/$/', '$1', $current_dir_path);
		}
		$order = $order==''?'name':strtolower($order);
		if (preg_match('/\.\./', $current_path)) {
			echo 'Access is not allowed.';
			exit;
		}
		if (!preg_match('/\/$/', $current_path)) {
			echo 'Parameter is not valid.';
			exit;
		}
		if (!file_exists($current_path) || !is_dir($current_path)) {
			echo 'Directory does not exist.';
			exit;
		}
		$this->load->helper('directory');
		$this->load->helper('file');
		$this->load->helper('number');
		$listarr = directory_map($current_path,1);
		$i = 0;
		foreach($listarr as $filename){
			$filepath = $current_path.$filename;
			$file = get_file_info($filepath);
			if(is_dir($filepath)){
				$tmpDir =directory_map($file['server_path'],1);
				$file_list[$i]['is_dir'] = true;
				$file_list[$i]['has_file'] = (count($tmpDir) > 0);
				$file_list[$i]['filesize'] = 0;
				$file_list[$i]['is_photo'] = false;
				$file_list[$i]['filetype'] = '';
				unset($tmpDir);
			}else{
				$file_list[$i]['is_dir'] = false;
				$file_list[$i]['has_file'] = false;
				$file_list[$i]['filesize'] = $file['size'];
				$file_list[$i]['dir_path'] = '';
				$file_ext = strtolower(get_suffix($file['server_path']));
				$file_list[$i]['is_photo'] = in_array($file_ext, $ext_arr);
				$file_list[$i]['filetype'] = $file_ext;
			}
			$file_list[$i]['filename'] = $filename; //文件名，包含扩展名
			$file_list[$i]['datetime'] = date('Y-m-d H:i:s', $file['date']); //文件最后修改时间
			$i++;
		}
		usort($file_list, 'cmp_func');
		$result = array();
		$result['moveup_dir_path'] = $moveup_dir_path;
		$result['current_dir_path'] = $current_dir_path;
		$result['current_url'] = $current_path;
		$result['total_count'] = count($file_list);
		$result['file_list'] = $file_list;
		echo json_encode($result);
	}
	
	function attrupload(){
		$usergroupid=$this->session->userdata('usergroup');
		if(!$usergroupid){
			$result = array('error'=>1,'message'=>lang('nopur'));
			echo json_encode($result);exit;
		}
		$save_path = 'data/attachment/';
		$ext_arr = array(
				'image' => array('gif', 'jpg', 'jpeg', 'png', 'bmp'),
				'flash' => array('swf', 'flv'),
				'media' => array('swf', 'flv', 'mp3', 'wav', 'wma', 'wmv', 'mid', 'avi', 'mpg', 'rm', 'rmvb'),
				'file' => array('gif', 'jpg', 'jpeg', 'png', 'bmp','doc', 'docx', 'xls', 'xlsx', 'ppt', 'htm', 'html', 'txt', 'zip', 'rar', 'gz', 'bz2'),
		);
		$attrconfig = $this->Cache_model->loadConfig('attr');
		$dir_name = $this->input->get('dir');
		if(!in_array($dir_name,array('image','flash','media','file'))){
			$result = array('error'=>1,'message'=>"Invalid Directory name.");
			echo json_encode($result);
		}
		$save_path .= $dir_name.'/';
		if (!file_exists($save_path)) {
				mkdir($save_path);
		}
		$save_path .= date('Ymd').'/';
		if (!file_exists($save_path)) {
			mkdir($save_path);
		}
		$uploadconfig['upload_path'] = $save_path;
		$uploadconfig['allowed_types'] = implode('|',$ext_arr[$dir_name]);
		$uploadconfig['max_size'] = $attrconfig['attr_maxsize']?$attrconfig['attr_maxsize']:0;
		$uploadconfig['encrypt_name']  = TRUE;
		$uploadconfig['remove_spaces']  = TRUE;
		$this->load->library('upload', $uploadconfig);
		if(!$this->upload->do_upload('imgFile')){
			$result = array('error'=>1,'message'=>$this->upload->display_errors('',''));
		}else{
			$data = $this->upload->data();
			if($this->input->post('iswater')==1&&$dir_name=='image'&&$attrconfig['water_type']>0){
				$this->load->library('image_lib');
				$waterconfig['source_image'] = $save_path.$data['file_name'];
				$waterconfig['quality'] = $attrconfig['water_quality'];
				$waterconfig['wm_padding'] = $attrconfig['water_padding'];
				
				switch($attrconfig['water_position']){
					case 'topleft':
						$waterconfig['wm_vrt_alignment'] = 'top';
						$waterconfig['wm_hor_alignment'] = 'left';
						break;
					case 'topcenter':
						$waterconfig['wm_vrt_alignment'] = 'top';
						$waterconfig['wm_hor_alignment'] = 'center';
						break;
					case 'topright':
						$waterconfig['wm_vrt_alignment'] = 'top';
						$waterconfig['wm_hor_alignment'] = 'right';
						break;
					case 'middleleft':
						$waterconfig['wm_vrt_alignment'] = 'middle';
						$waterconfig['wm_hor_alignment'] = 'left';
						break;
					case 'middlecenter':
						$waterconfig['wm_vrt_alignment'] = 'middle';
						$waterconfig['wm_hor_alignment'] = 'center';
						break;
					case 'middleright':
						$waterconfig['wm_vrt_alignment'] = 'middle';
						$waterconfig['wm_hor_alignment'] = 'right';
						break;
					case 'bottomleft':
						$waterconfig['wm_vrt_alignment'] = 'bottom';
						$waterconfig['wm_hor_alignment'] = 'left';
						break;
					case 'bottomcenter':
						$waterconfig['wm_vrt_alignment'] = 'bottom';
						$waterconfig['wm_hor_alignment'] = 'center';
						break;
					case 'bottomright':
						$waterconfig['wm_vrt_alignment'] = 'bottom';
						$waterconfig['wm_hor_alignment'] = 'right';
						break;
					default:
						$waterconfig['wm_vrt_alignment'] = 'bottom';
						$waterconfig['wm_hor_alignment'] = 'right';
						break;
				}
				if($attrconfig['water_type']==1){
					$waterconfig['wm_type'] = 'overlay';
					$waterconfig['wm_overlay_path'] = $attrconfig['water_image_path'];
					$waterconfig['wm_opacity'] = $attrconfig['water_opacity'];
				}elseif($attrconfig['water_type']==2){
					$waterconfig['wm_type'] = 'text';
					$waterconfig['wm_text'] = $attrconfig['water_text_value'];
					$waterconfig['wm_font_path'] = $attrconfig['water_text_font'];
					$waterconfig['wm_font_size'] = $attrconfig['water_text_size'];
					$waterconfig['wm_font_color'] = $attrconfig['water_text_color'];
				}
				$this->image_lib->initialize($waterconfig);
				$this->image_lib->watermark();
			}
			$result = array('error'=>0,'url'=>base_url($save_path.$data['file_name']));
		}
		echo json_encode($result);
	}
	
	public function logout(){
		$this->load->model('User_model');
		$this->User_model->logout();
		redirect(site_aurl('login'));
	}
	
	public function setlang(){
		$this->load->model('Lang_model');
		$lang = $this->input->post('lang');
		$this->Lang_model->setLang('edit',$lang);
		show_jsonmsg(200);
	}
}