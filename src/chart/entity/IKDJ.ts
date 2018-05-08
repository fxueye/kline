/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	/**
	 * KDJ指标接口
	 */
	export interface IKDJ {
		//K值
		getK():number;
		//D值
		getD():number;
		//J值
		getJ():number;
	}
}