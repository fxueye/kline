namespace chart{
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