namespace chart{
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