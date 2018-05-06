namespace chart{
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