namespace chart{
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