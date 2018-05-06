namespace chart{
	export class ValueFormatter implements IValueFormatter {
		public constructor() {
		}
		public format(value:number){
			return value.toFixed(2);
		}
	}
}