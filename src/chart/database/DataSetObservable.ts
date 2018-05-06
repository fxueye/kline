namespace chart{
	export class DataSetObservable extends Observable<DataSetObserver> {
		public constructor() {
			super();
		}
		public notifyChanged():void{
			for(let observer of this.mObservers){
				observer.onChanged();
			}
		}
		public notifyInvalidated():void{
			for(let observer of this.mObservers){
				observer.onInvalidated();
			}
		}
	}
}