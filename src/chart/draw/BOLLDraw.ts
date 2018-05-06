namespace chart{
	export class BOLLDraw implements IChartDraw<IBOLL>{
		private mUpColor:number = 0xFFFFFF;
		private mMbColor:number = 0xFFFFFF;
		private mDnColor:number = 0xFFFFFF;
		private mLineWidth:number = 1;
		private mTextSize:number = 12;

		private mView:BaseKChartView;
		public constructor(view:BaseKChartView) {
			this.mView = view;
		}
		drawTranslated(lastPoint:IBOLL,curPoint:IBOLL,lastX:number,curX:number,postion:any){
			this.mView.drawChildLine(lastX,lastPoint.getUp(),curX,curPoint.getUp(),this.mLineWidth,this.mUpColor);
			this.mView.drawChildLine(lastX,lastPoint.getMb(),curX,curPoint.getMb(),this.mLineWidth,this.mMbColor);
			this.mView.drawChildLine(lastX,lastPoint.getDn(),curX,curPoint.getDn(),this.mLineWidth,this.mDnColor);
		}
		drawText(postion:any,x:number,y:number){
			let text = "";
			let point:IBOLL = this.mView.getItem(postion);
			text = "UP:" + this.mView.formatValue(point.getUp()) +" ";
			let lab = this.mView.drawText(x,y,text,this.mTextSize,this.mUpColor);
			x += lab.width;
			text = "MB:" + this.mView.formatValue(point.getMb()) +" ";
			lab = this.mView.drawText(x,y,text,this.mTextSize,this.mMbColor);
			x += lab.width;
			text = "DN:" + this.mView.formatValue(point.getDn()) +" ";
			this.mView.drawText(x,y,text,this.mTextSize,this.mDnColor);
		}
		getMaxValue(point:IBOLL):number{
			if(isNaN(point.getUp())){
				return point.getMb();
			}
			return point.getUp();
		}
		getMinValue(point:IBOLL):number{
			if(isNaN(point.getDn())){
				return point.getMb();
			}
			return point.getDn();
		}
		getValueFormatter():IValueFormatter{
			return new ValueFormatter();
		}
		public setUpColor(value:number){
			this.mUpColor = value;
		}
		public setMbColor(value:number){
			this.mMbColor = value;
		}
		public setDnColor(value:number){
			this.mDnColor = value;
		}
		public setLineWidth(value:number){
			this.mLineWidth = value;
		}
		public setTextSize(value:number){
			this.mTextSize = value;
		}
		
	}
}