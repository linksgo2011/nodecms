/**
 * Admin/MainController
 *
 * @description :: Server-side logic for managing Admin/mains
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next) {
		res.locals.headers = {
			'breadcrumb': [{
				name: "后台首页",
				link: "/admin/main"
			}],
			'title': '后台首页',
			'description': "整站数据信息",
			'parent_purview': "personal",
			'purview': "adminindex"
		}
		return res.view();
	}
};