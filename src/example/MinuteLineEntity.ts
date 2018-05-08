class MinuteLineEntity implements Chart.IMinuteLine{
	public constructor() {

	}
	public time:Date;
	public price:number;
	public avg:number;
	public volume:number;
	getAvgPrice():number{
		return this.avg;
	}
	getPrice():number{
		return this.price;
	}
	getDate():Date{
		return this.time;
	}
	getVolume():number{
		return this.volume;
	}
}