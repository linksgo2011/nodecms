/**
 * 进入后台首页
 * @return
 */
module.exports = Controller("Admin/BaseController", function() {
	"use strict";
	return {
		indexAction:function (){
			this.display(VIEW_PATH+"/Admin/admin_index.html");
		}
	};
});