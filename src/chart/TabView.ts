/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export class TabView extends eui.ItemRenderer{
		private labelDisplay:eui.Label;
		public constructor() {
			super();
		}
		protected dataChanged(): void{
			this.labelDisplay.textColor = 0xFFFFFF;
			this.labelDisplay.size = 18;	
		}
	}
}