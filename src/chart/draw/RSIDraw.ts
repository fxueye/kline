namespace chart{
	export class RSIDraw implements IChartDraw<IRSI> {
		private mView:BaseKChartView;
		private mRsi1Color:number = Color.MA5;
		private mRsi2Color:number = Color.MA10;
		private mRsi3Color:number = Color.MA20;
		private mLineWidth:number = 1;
		private mTextSize:number = 12;
		public constructor(view:BaseKChartView) {
			this.mView = view;
		}
		drawTranslated(lastPoint:IRSI,curPoint:IRSI,lastX:number,curX:number,postion:any){
			this.mView.drawChildLine(lastX,lastPoint.getRsi1(),curX,curPoint.getRsi1(),this.mLineWidth,this.mRsi1Color);
			this.mView.drawChildLine(lastX,lastPoint.getRsi2(),curX,curPoint.getRsi2(),this.mLineWidth,this.mRsi2Color);
			this.mView.drawChildLine(lastX,lastPoint.getRsi3(),curX,curPoint.getRsi3(),this.mLineWidth,this.mRsi3Color);
		}
		drawText(postion:any,x:number,y:number){
			let text = "";
			let point:IRSI = this.mView.getItem(postion);
			text = "RSI1:"+this.mView.formatValue(point.getRsi1()) + " ";
			let lab = this.mView.drawText(x,y,text,this.mTextSize,this.mRsi1Color);
			x += lab.width;
			text = "RSI2:" + this.mView.formatValue(point.getRsi2()) + " ";
			lab = this.mView.drawText(x,y,text,this.mTextSize,this.mRsi2Color);
			x += lab.width;
			text = "RSI3:" + this.mView.formatValue(point.getRsi3()) + " ";
			this.mView.drawText(x,y,text,this.mTextSize,this.mRsi3Color);
		}
		getMaxValue(point:IRSI):number{
			return Math.max(point.getRsi1(),Math.max(point.getRsi2(),point.getRsi3()));
		}
		getMinValue(point:IRSI):number{
			return Math.min(point.getRsi1(),Math.min(point.getRsi2(),point.getRsi3()));
		}
		getValueFormatter():IValueFormatter{
			return new ValueFormatter();
		}
		public setTextSize(size:number){
			this.mTextSize = size;
		}
		public setLineWidth(width:number){
			this.mLineWidth = width;
		}
		public setRsi1Color(color:number){
			this.mRsi1Color = color;
		}
		public setRsi2Color(color:number){
			this.mRsi2Color = color;
		}
		public setRsi3Color(color:number){
			this.mRsi3Color = color;
		}
	}
}