namespace chart{
	export abstract class DataSetObserver {
		public constructor() {
		}
		public onChanged():void{};
		public onInvalidated():void{};
	}
}