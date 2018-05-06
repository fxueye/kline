namespace chart{
	/**
	 * RSI指标接口
	 */
	export interface IRSI {
		//RSI1值
		getRsi1():number;
		//RSI2值
		getRsi2():number;
		//RSI3值
		getRsi3():number;
	}
}