namespace chart{
	export class DateFormatter implements IDateTimeFormatter {
		public constructor() {
		}
		public format(date:Date):string{
			if(date != null){
				return chart.DateUtil.DateFormat(date);
			}else{
				return "";
			}
		}
	}
}