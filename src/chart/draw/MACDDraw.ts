/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export class MACDDraw implements IChartDraw<IMACD> {
		private mRedColor:number = Color.RED;
		private mGreenColor:number = Color.GREEN;
		private mDIFColor:number = Color.RED;
		private mDEAColor:number = Color.RED;
		private mMACDColor:number = Color.RED;
		private mMACDWidth:number = 0;
		private mView:BaseKChartView;
		private mLineWidth:number = 1;
		private mTextSize:number = 12;
		public constructor(view:BaseKChartView) {
			this.mView = view;
		}
		drawTranslated(lastPoint:IMACD,curPoint:IMACD,lastX:number,curX:number,postion:any){
			this.drawMACD(curX,curPoint.getMacd());
			this.mView.drawChildLine(lastX,lastPoint.getDea(),curX,curPoint.getDea(),this.mLineWidth,this.mDEAColor);
			this.mView.drawChildLine(lastX,lastPoint.getDif(),curX,curPoint.getDif(),this.mLineWidth,this.mDIFColor);
		}
		drawText(postion:any,x:number,y:number){
			let text = "";
			let point:IMACD = this.mView.getItem(postion);
			text = "DIF:"+this.mView.formatValue(point.getDif()) + " ";
			let lab = this.mView.drawText(x,y,text,this.mTextSize,this.mDIFColor);
			x += lab.width;
			text = "DEA:" + this.mView.formatValue(point.getDea())+ " ";
			lab = this.mView.drawText(x,y,text,this.mTextSize,this.mDEAColor);
			x += lab.width;
			text = "MACD:" + this.mView.formatValue(point.getMacd())+ " ";
			this.mView.drawText(x,y,text,this.mTextSize,this.mMACDColor);
		}
		getMaxValue(point:IMACD):number{
			return Math.max(point.getMacd(),Math.max(point.getDea()),point.getDif());
		}
		getMinValue(point:IMACD):number{
			return Math.min(point.getMacd(),Math.min(point.getDea(),point.getDif()));
		}
		getValueFormatter():IValueFormatter{
			return new ValueFormatter();
		}
		private drawMACD(x:number,macd:number){
			let macdy = this.mView.getChildY(macd);
			let r = this.mMACDWidth/2;
			let zeroy = this.mView.getChildY(0);
			if(macd > 0){
				this.mView.drawRect(x - r ,macdy,x + r,zeroy,this.mRedColor);
			}else{
				this.mView.drawRect(x - r ,zeroy,x + r,macdy,this.mGreenColor);
			}
		}
		public setLineWidth(width:number){
			this.mLineWidth = width;
		}
		public setDIFColor(color:number){
			this.mDIFColor = color;
		}
		public setDEAColor(color:number){
			this.mDEAColor = color;
		}
		public setMACDColor(color:number){
			this.mMACDColor = color;
		}
		public setMACDWidth(width:number){
			this.mMACDWidth = width;
		}
		public setTextSize(size:number){
			this.mTextSize = size;
		}

	}
}