/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
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