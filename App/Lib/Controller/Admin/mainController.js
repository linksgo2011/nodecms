/**
 * 后台首页
 * @return
 */
module.exports = Controller("Admin/BaseController", function() {
	"use strict";
	return {
		indexAction: function(){
			this.display(VIEW_PATH+"/Admin/main.html");
		},
		main_indexAction: function(){
			this.display(VIEW_PATH+"/Admin/main_index.html");
		},
		main_topAction:function(){
			this.display(VIEW_PATH+"/Admin/main_top.html");
		},
		main_leftAction:function(){
			this.display(VIEW_PATH+"/Admin/main_left.html");
		},
		main_centerAction:function(){
			this.display(VIEW_PATH+"/Admin/main_center.html");
		},
		main_rightAction:function(){
			this.display(VIEW_PATH+"/Admin/main_right.html");
		},
		main_footAction:function(){
			this.display(VIEW_PATH+"/Admin/main_foot.html");
		},
		ajaxloginAction:function(){

		},
		loginAction: function() {
			var self = this;
			if(!this.isAjax()){
				this.end("bad request");
				return ;
			}
			var username = this.post("user_name");
			var password = this.post("user_pass");
			if (!username || !password) {
				this.json({
					result: false,
					msg: "用户名或者密码输入错误!"
				});
			}		

			var user = D("User");
			var loginResult = user.login({
				username: username,
				password: password
			}).then(function(user){
				self.json({
					result:true,
					redirect:"/admin/main"
				});
			},function(msg){
				self.json({
					result:false,
					msg:msg
				});
			});
		},
		attrlistAction:function(){

		},
		attruploadAction:function(){

		},
		logoutAction:function(){

		},
		setlangAction:function(){

		}
	};
});