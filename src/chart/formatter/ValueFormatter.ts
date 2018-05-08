/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export class ValueFormatter implements IValueFormatter {
		public constructor() {
		}
		public format(value:number){
			return value.toFixed(2);
		}
	}
}