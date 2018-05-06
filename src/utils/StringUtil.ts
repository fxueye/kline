namespace chart{
	export class StringUtil {
		public constructor() {
		}
		public static Trim(str:string){
			return str.replace(/(^\s*)|(\s*$)/g, "");
		}
	}
}
