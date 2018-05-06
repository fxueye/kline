namespace chart{
	/**
	 * 成交量接口
	 */
	export interface IVolume {
		//开盘件
		getOpenPrice():number;
		//收盘价
		getClosePrice():number;
		//成交量
		getVolume():number;
		//五(月，日，时，分，5分等)均量
		getMA5Volume():number;
		//十(月，日，时，分，5分等)均量
		getMA10Volume():number;
	}
}