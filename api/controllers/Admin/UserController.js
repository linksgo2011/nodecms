/**
 * Admin/loginController
 *
 * @description :: Server-side logic for managing admin/logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var crypto = require('crypto');

// 是否为空对象
function hasAttr(obj) {
	if (typeof obj === "object" && !(obj instanceof Array)) {
		var hasProp = false;
		for (var prop in obj) {
			hasProp = true;
			break;
		}
		return hasProp;
	}
	return false;
}

module.exports = {
	login: function(req, res, next) {
		res.locals.headers = {
			'breadcrumb': [{
				name: "后台首页",
				link: "/admin/main"
			}, {
				name: "登陆",
				link: "/admin/user/login"
			}],
			'title': '登陆',
			'description': "快速开始你的工作"
		};
		if (req.method === "POST") {
			var username = req.param("username", "");
			var password = req.param("password", "");
			// return res.end(JSON.stringify(req.body));
			if (!username || !password) {
				req.session.flash = {
					error: "用户名或者密码错误！"
				};
				return res.view();
			}
			User.findOne({
				username: username
			}).exec(function findOneCB(err, found) {
				if (err) {
					return next(err);
				}
				if (found) {
					var md5 = crypto.createHash('md5');
					md5.update(password);
					var passwordHash = md5.digest("hex");
					if (passwordHash == found.password) {
						// 登陆成功
						req.session.user = found;
						return res.redirect("/admin/main");
					}
				}
				req.session.flash = {
					error: "用户名或者密码错误！"
				}
				return res.view();
			});
		} else {
			return res.view();
		}
	},

	/**
	 * 修改密码
	 * @return
	 */
	password: function(req, res, next) {
		res.locals.errors = {};
		res.locals.params = {};
		res.locals.headers = {
			'breadcrumb': [{
				name: "后台首页",
				link: "/admin/main"
			}, {
				name: "修改密码",
				link: "/admin/user/password"
			}],
			'title': '修改密码',
			'description': "重置您的登陆密码",
			'parent_purview': "personal",
			'purview': "propass"
		};
		var user_id = req.session.user && req.session.user.id;
		if (!user_id) {
			return res.redirect('/admin/user/login');
		}

		if (req.method == "POST") {
			var params = req.allParams();
			var errors = User.pwdValidate(params);

			if (hasAttr(errors)) {
				res.locals.params = params;
				res.locals.errors = errors;
				return res.view();
			}

			var md5 = crypto.createHash('md5');
			md5.update(params.newpassword);
			var passwordHash = md5.digest("hex");
			User.findOne({
				"id": user_id
			}).exec(function findOneCB(err, data) {
				if (err) next(err);
				if (data.password !== passwordHash) {
					res.locals.errors.password = "密码输入错误";
					return res.view();
				}

				User.update({
					"id": user_id
				}, {
					password: passwordHash
				}).exec(function(err, updated) {
					if (err) next(err);
					req.session.flash = {
						'succ': "密码修改成功!"
					};
					return res.redirect("/admin/user/login");
				});
			});
		} else {
			res.view();
		}
	},

	/**
	 * 退出系统
	 * @return
	 */
	logout: function(req, res, next) {
		req.session.user = null;
		return res.redirect("/admin/user/login");
	},

	/**
	 * 修改资料
	 */
	profile: function(req, res, next) {
		res.locals.headers = {
			'breadcrumb': [{
				name: "后台首页",
				link: "/admin/main"
			}, {
				name: "修改资料",
				link: "/admin/user/password"
			}],
			'title': '修改资料',
			'description': "修改你的个人资料",
			'parent_purview': "personal",
			'purview': "profile"
		};
		res.locals.errors = {};
		res.locals.params = res.locals.user = req.session.user;
		var user_id = req.session.user && req.session.user.id;
		if (!user_id) {
			return res.redirect('/admin/user/login');
		}
			
		if (req.method == "POST") {
			User.update({
				"id": user_id
			}, req.body).exec(function(err, updated) {
				if (err) next(err);
				req.session.flash = {
					'succ': "个人资料更新成功!"
				};
				return res.redirect(req.url);
			});
		} else {
			User.findOne({
				"id": user_id
			}).exec(function findOneCB(err, data) {
				if (err) next(err);
				res.locals.params = res.locals.user = data;
				res.view();
			});
		}
	}
};