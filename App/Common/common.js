//这里定义一些全局通用的函数，该文件会被自动加载

/**
 * 多语言支持
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
global.lang = function (key) {
	//TODO 从数据库获取语言
	var lang = "zh_cn"
	var langlib = require(RESOURCE_PATH+"/resource/language/"+lang+"/admin_lang.js");
	return langlib[key];
};

/**
 * 获取网站根URL
 * @return {[type]} [description]
 */
global.site_url  =  global.base_url = function(url) {
	var base = "/";
	if(!url){
		return base;
	}else{
		return base+url.trim("/");
	}
};


/**
 * 获取后台地址
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
global.site_aurl = function(url){
	var base = "/admin/";
	if(!url){
		return base;
	}else{
		return base+url.trim("/");
	}
};