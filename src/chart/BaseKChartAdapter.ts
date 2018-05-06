namespace chart{
	export abstract class BaseKChartAdapter implements IAdapter {
		private mDataSerObservable:DataSetObservable  = new DataSetObservable();
		public constructor() {
		}
		notifyDataSetChanged():void{
			if(this.getCount() > 0){
				this.mDataSerObservable.notifyChanged();
			}else{
				this.mDataSerObservable.notifyInvalidated();
			}
		}
		getCount():any{};
		getItem(position:number):any{}
		getDate(position:number):any{}
		registerDataSetObserver(observer:any):void{
			this.mDataSerObservable.registerObserver(observer);
		}
		unregisterDataSetObserver(observer:any):void{
			this.mDataSerObservable.unregisterObserver(observer);
		}

	}
}