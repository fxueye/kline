namespace chart{
	/**
	 * 蜡烛图接口
	 */
	export interface ICandle {
		//开盘价
		getOpenPrice():number;
		//最高价
		getHighPrice():number;
		//最低价
		getLowPrice():number;
		//收盘价
		getClosePrice():number;
		//五(月，日，时，分，5分等)均价
		getMA5Price():number;
		//十(月，日，时，分，5分等)均价
		getMA10Price():number;
		// 二十(月，日，时，分，5分等)均价
		getMA20Price():number;
	}
}