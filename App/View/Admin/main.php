<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="<?=base_url('images/favicon.ico')?>" />
<style>* { padding:0; margin:0; }
html, body { height:100%; border:none 0; }
iframe { width:100%; height:100%; border:none 0; }
</style><title><?=lang('system_adminname')?> - Powered by <?=lang('system_name')?> <?=lang('system_version')?></title>
<link rel="stylesheet" type="text/css" href="<?=base_url()?>css/style.css" />
<script type="text/javascript" src="<?=base_url()?>js/jquery.min.js"></script>
<script type="text/javascript" src="<?=base_url()?>js/admin.public.js"></script>
<script type="text/javascript" src="<?=base_url()?>js/jquery.artDialog.js?skin=default"></script>
<script type="text/javascript" src="<?=base_url()?>js/datejs/WdatePicker.js"></script>
<script type="text/javascript" charset="utf-8" src="<?=base_url()?>js/kindeditor/kindeditor-min.js"></script>
<script type="text/javascript" src="<?=base_url()?>js/language/<?=$this->Cache_model->defaultAdminLang;?>.js"></script>
<script type="text/javascript">
var baseurl = "<?=base_url()?>";
var siteaurl = "<?=site_aurl()?>";
var siteurl = "<?=site_url()?>";
</script>
</head><body>
<iframe src="<?=site_aurl('main/main_index')?>"></iframe></body></html>