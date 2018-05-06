namespace chart{
	/**
	 * 布林线接口
	 */
	export interface IBOLL {
		//上轨线
		getUp():number;
		//中轨线
		getMb():number;
		//下轨线
		getDn():number;
	}
}