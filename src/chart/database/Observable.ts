namespace chart{
	export abstract class Observable<T> {
		protected mObservers:Array<T> = new Array<T>();
		public constructor() {
		}
		public registerObserver(observer:T){
			if(observer == null){
				console.error("observer is null");
				return;
			}
			if(this.mObservers.indexOf(observer) != -1){
				console.error("observer is existed")
				return;
			}
			this.mObservers.push(observer);
		};
		public unregisterObserver(observer:T){
			if(observer == null){
				console.error("observer is null");
				return;
			}
			let index = this.mObservers.indexOf(observer);
			if(index == -1){
				console.error("observer is not exist");
				return;
			}
			this.mObservers.splice(index,1);
		};
		public unregisterAll(){
			this.mObservers = null;
			this.mObservers = new Array<T>();
		};
	}
}