namespace chart{
	export class MainDraw implements IChartDraw<ICandle> {
		private mCandleWidth:number = 0;
		private mCandleLineWidth:number = 0;
		private mRedColor:number;
		private mGreenColor:number;
		private ma5Color:number;
		private ma10Color:number;
		private ma20Color:number;
		private mLineWidth:number = 1;
		private mTextSize:number = 12;

		private mSelectorTextColor:number;
		private mSelectorBackground:number;
		private mSelectorTextSize:number;

		private mCandleSolid:boolean = true;

		private mView:BaseKChartView;
		public constructor(view:BaseKChartView) {
			this.mView = view;
			this.mRedColor = Color.RED;
			this.mGreenColor = Color.GREEN;
		}
		drawTranslated(lastPoint:ICandle,curPoint:ICandle,lastX:number,curX:number,postion:any){
			this.drawCandle(curX,curPoint.getHighPrice(),curPoint.getLowPrice(),curPoint.getOpenPrice(),curPoint.getClosePrice());
			if(lastPoint.getMA5Price() != 0){
				this.mView.drawMainLine(lastX,lastPoint.getMA5Price(),curX,curPoint.getMA5Price(),this.mLineWidth,this.ma5Color);
			}
			if(lastPoint.getMA10Price() != 0){
				this.mView.drawMainLine(lastX,lastPoint.getMA10Price(),curX,curPoint.getMA10Price(),this.mLineWidth,this.ma10Color);
			}
			if(lastPoint.getMA20Price() != 0){
				this.mView.drawMainLine(lastX,lastPoint.getMA20Price(),curX,curPoint.getMA20Price(),this.mLineWidth,this.ma20Color);
			}
		}
		drawText(postion:number,x:number,y:number){
			let point:ICandle = this.mView.getItem(postion);
			let text = "";
			text = "MA5:" + this.mView.formatValue(point.getMA5Price()) +" ";
			let lab = this.mView.drawText(x,y,text,this.mTextSize,this.ma5Color);
			x += lab.width;
			text = "MA10:" + this.mView.formatValue(point.getMA10Price()) +" ";
			lab = this.mView.drawText(x,y,text,this.mTextSize,this.ma10Color);
			x += lab.width;
			text = "MA20:" + this.mView.formatValue(point.getMA20Price()) +" ";
			this.mView.drawText(x,y,text,this.mTextSize,this.ma20Color);
			if(this.mView.isLongPress){
				
			}
		}
		getMaxValue(point:ICandle):number{
			return Math.max(point.getHighPrice(),point.getMA20Price());
		}
		getMinValue(point:ICandle):number{
			return Math.min(point.getMA20Price(),point.getLowPrice());
		}
		getValueFormatter():IValueFormatter{
			return new ValueFormatter();
		}
		public setCandleWidth(value:number){
			this.mCandleWidth = value;
		}
		public setCandleLineWidth(value:number){
			this.mCandleLineWidth = value;
		}
		public setMa5Color(value:number){
			this.ma5Color = value;
		}
		public setMa10Color(value:number){
			this.ma10Color = value;
		}
		public setMa20Color(value:number){
			this.ma20Color = value;
		}
		public setSelectorTextColor(value:number){
			this.mSelectorTextColor = value;
		}
		public setSelectorTextSize(value:number){
			this.mSelectorTextSize = value;
		}
		public setSelectorBackgroundColor(value:number){
			this.mSelectorBackground = value;
		}
		public setLineWidth(value:number){
			this.mLineWidth = value;
		}
		public setTextSize(value:number){
			this.mTextSize = value;
		}
		public setCandleSolid(value:boolean){
			this.mCandleSolid = value;
		}
		public drawCandle(x:number,high:number,low:number,open:number,close:number){
			high = this.mView.getMainY(high);
			low = this.mView.getMainY(low);
			open = this.mView.getMainY(open);
			close = this.mView.getMainY(close);
			let r = this.mCandleWidth/2;
			let lineR = this.mCandleLineWidth/2;
			if(open > close){
				//实心
				if(this.mCandleSolid){
					
					this.mView.drawRect(x - r,close,x + r,open,this.mRedColor);
					this.mView.drawRect(x - lineR,high,x + lineR,low,this.mRedColor);
				}else{
					this.mView.drawLine(x,high,x,close,this.mCandleLineWidth,this.mRedColor);
					this.mView.drawLine(x,open,x,low,this.mCandleLineWidth,this.mRedColor);
					this.mView.drawLine(x - r + lineR,open,x - r + lineR,close,this.mCandleLineWidth,this.mRedColor);
					this.mView.drawLine(x + r - lineR,open,x + r -lineR,close,this.mCandleLineWidth,this.mRedColor);

					this.mView.drawLine(x - r,open,x + r,open,this.mCandleLineWidth * this.mView.getScaleX(),this.mRedColor);
					this.mView.drawLine(x - r,open,x + r,close,this.mCandleLineWidth * this.mView.getScaleX(),this.mRedColor);

				}
			}else if(open < close){
				this.mView.drawRect(x - r,open,x + r,close,this.mGreenColor);
				this.mView.drawRect(x - lineR,high,x + lineR,low,this.mGreenColor);
			}else{
				// this.mView.drawRect(x - r,open,x + r,close + 1,this.mRedColor);
				// this.mView.drawRect(x - lineR,high,x + lineR, low,this.mRedColor);
			}

		}
		//先择器
		private drawSelector(){
			//TODO
		}
	}
}