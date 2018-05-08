/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export class StringUtil {
		public constructor() {
		}
		public static Trim(str:string){
			return str.replace(/(^\s*)|(\s*$)/g, "");
		}
	}
}
