/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export class BigValueFormatter implements IValueFormatter {
		private values:number[] = [10000,1000000,100000000];
		private units:string[] = ["万","百万","亿"];
		public constructor() {
		}
		public format(value:number):string{
			let unit:string = "";
			let i:number = this.values.length - 1;
			while(i >= 0){
				if(value > this.values[i]){
					value /= this.values[i];
					unit = this.units[i];
					break;
				}
				i--;
			}
			return value.toFixed(2) + unit;
		}
	}
}