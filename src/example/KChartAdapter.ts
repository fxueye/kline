class KChartAdapter extends Chart.BaseKChartAdapter {
	private datas:Array<KLineEntity> = new Array<KLineEntity>();
	public constructor() {
		super();
	}
	public getCount():number{
		return this.datas.length;
	}
	public getItem(position:number):any{
		return this.datas[position];
	}
	public getDate(position:number):Date{
		return new Date(this.datas[position].Date);
	}
	public addHeaderData(datas:Array<KLineEntity>):void{
		if(datas != null && datas.length > 0){
			this.datas.unshift.apply(this.datas,datas);
			this.notifyDataSetChanged();
		}
	}
	public addFooterData(datas:Array<KLineEntity>):void{
		if(datas != null && datas.length > 0){
			this.datas.push.apply(this.datas,datas);
			this.notifyDataSetChanged();
		}
	}

}