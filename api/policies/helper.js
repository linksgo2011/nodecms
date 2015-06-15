/**
 * view helper 助手
 */
module.exports = function(req, res, next) {

	/**
	 * 时间格式化
	 * @param  int unix unix 时间戳（秒）
	 */
	res.locals.dateFormat = function(unix) {
		var now = new Date(parseInt(unix) * 1000);
		return now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
	}
	next();
};