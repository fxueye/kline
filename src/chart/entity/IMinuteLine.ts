namespace chart{
	/**
	 * 分时图实体接口
	 */
	export interface IMinuteLine {
		//获取均价
		getAvgPrice():number;
		//获取成交价
		getPrice():number;
		//获取指标对应的时间
		getDate():Date;
		//成交量
		getVolume():number;
	}
}