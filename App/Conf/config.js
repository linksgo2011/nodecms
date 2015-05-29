module.exports = {
	// web服务器端口
	port: 8360, 

	db_type: 'mysql', // 数据库类型
	db_host: '127.0.0.1', // 服务器地址
	db_port: 8360, // 端口
	db_name: 'nodecms', // 数据库名
	db_user: 'root', // 用户名
	db_pwd: '', // 密码
	db_prefix: '', // 数据库表前缀
	
	//Session配置
	session_name: "nodecms",
	session_type: "File",
	session_path: "",
	session_options: {},
	session_sign: "",
	session_timeout: 24 * 3600
};