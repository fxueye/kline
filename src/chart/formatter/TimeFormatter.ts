/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export class TimeFormatter implements IDateTimeFormatter {
		public constructor() {
		}
		public format(date:Date):string{
			if(date == null){
				return "";
			}
			return DateUtil.ShortTimeFormat(date);
		}
	}
}