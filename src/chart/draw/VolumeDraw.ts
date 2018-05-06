namespace chart{
	export class VolumeDraw implements IChartDraw<IVolume> {
		private mView:BaseKChartView;
		private mRedColor:number = Color.RED;
		private mGreenColor:number = Color.GREEN;
		private mMa5Color:number = Color.MA5;
		private mMa10Color:number = Color.MA10;
		private mTextSize:number = 12;
		private mLineWidth:number = 1;
		private mPillarWidth:number = 8;

		public constructor(view:BaseKChartView) {
			this.mView = view;
		}
		drawTranslated(lastPoint:IVolume,curPoint:IVolume,lastX:number,curX:number,postion:any){
			this.drawHistogram(curPoint,lastPoint,curX,postion);
			this.mView.drawChildLine(lastX,lastPoint.getMA5Volume(),curX,curPoint.getMA5Volume(),this.mLineWidth,this.mMa5Color);
			this.mView.drawChildLine(lastX,lastPoint.getMA10Volume(),curX,curPoint.getMA10Volume(),this.mLineWidth,this.mMa10Color);
		}
		drawText(postion:any,x:number,y:number){
			let text = "";
			let point:IVolume = this.mView.getItem(postion);
			text = "VOL:"+this.getValueFormatter().format(point.getVolume())+ " ";
			let lab = this.mView.drawText(x,y,text,this.mTextSize,this.mView.getTextColor());
			x += lab.width;
			text = "MA5:" + this.getValueFormatter().format(point.getMA5Volume())+ " ";
			lab = this.mView.drawText(x,y,text,this.mTextSize,this.mMa5Color);
			x += lab.width;
			text = "MA10:" + this.getValueFormatter().format(point.getMA10Volume())+ " ";
			this.mView.drawText(x,y,text,this.mTextSize,this.mMa10Color);
		}
		getMaxValue(point:IVolume):number{
			return Math.max(point.getVolume(),Math.max(point.getMA5Volume(),point.getMA10Volume()));
		}
		getMinValue(point:IVolume):number{
			return Math.min(point.getVolume(),Math.min(point.getMA5Volume(),point.getMA10Volume()));
		}
		getValueFormatter():IValueFormatter{
			return new BigValueFormatter();
		}
		private drawHistogram(curPoint:IVolume,lastPoint:IVolume,curX:number,postion:number){
			let r = this.mPillarWidth/2;
			let top = this.mView.getChildY(curPoint.getVolume());
			let bottom = this.mView.getChildRect().bottom;
			if(curPoint.getClosePrice() >=  curPoint.getOpenPrice()){
				this.mView.drawRect(curX - r,top,curX + r,bottom,this.mRedColor);
			}else{
				this.mView.drawRect(curX - r,top,curX + r,bottom,this.mGreenColor);
			}
		}
		public setLineWidth(width:number){
			this.mLineWidth = width;
		}
		public setPillarWidth(width:number){
			this.mPillarWidth = width;
		}
		public setTextSize(size:number){
			this.mTextSize = size;
		}
		public setMa5Color(color:number){
			this.mMa5Color = color;
		}
		public setMa10Color(color:number){
			this.mMa10Color = color;
		}
	}
}