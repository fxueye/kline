/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	/**
	 * MACD指标接口
	 */
	export interface IMACD {
		//DEA值
		getDea():number;
		//DIF值
		getDif():number;
		//MACD值
		getMacd():number;
	}
}