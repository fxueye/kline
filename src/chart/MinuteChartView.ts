/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export class MinuteChartView extends ScrollAndScaleView {
		public static ONE_MINUTE = 60000;
		private mMinute:number = 60000;
		private mHeight:number = 0;
		private mWidth:number = 0;
		private mVolumeHeight:number = 200;
		private mTopPadding:number = 15;
		private mBottomPadding:number = 15;
		private mGridRows:number = 6;
		private mGrildColumns:number = 5;
		private mAvgColor:number = Color.RED;
		private mGridColor:number = Color.GRID_LINE;
		private mGridWidth:number = 1;
		private mTextColor:number = Color.TEXT;
		private mPriceColor:number = Color.RED;
		private mBackgroundColor:number = Color.BACK_GROUND;
		private mVolumeRedColor:number = Color.RED;
		private mVolumeGreenColor:number = Color.GREEN;

		private mValueMin:number;
		private mValueMax:number;
		private mVolumeMax:number;

		private mValueStart:number;
		private mScaleY:number = 1;
		private mVolumeScaleY:number = 1;
		private mTextSize:number = 12;

		private mSelectIndex:number = -1;
		private mPoints:Array<IMinuteLine> = new Array<IMinuteLine>();
		private mFirstStartTime:Date;
		private mFirstEndTime:Date;
		private mSecondStartTime:Date;
		private mSecondEndTime:Date;
		private mTotalTime:number;
		private mPointWidth:number;
		private mVolumeFormatter:IValueFormatter;

		public constructor() {
			super();
			this.init();
			this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addedToStage,this);
		}
		private init():void{
			this.mPriceColor = 0xFF6600;
			this.mAvgColor = 0x90A901;
			this.mTextColor = 0xB1B2B6;
			this.mGridColor = 0x353941;
			this.mVolumeFormatter = new BigValueFormatter();
		}
		private addedToStage(evt:egret.Event){
			this.onSizeChanged();
		}
		private onSizeChanged(){
			this.stage.removeEventListener(egret.Event.RESIZE,this.onSizeChanged,this);
			this.mWidth = this.width;
			let height = this.height - this.mTopPadding - this.mBottomPadding;
			this.mHeight =  height - this.mVolumeHeight;
			this.stage.addEventListener(egret.Event.RESIZE,this.onSizeChanged,this);
			this.notifyChanged();
		}

		public initData(data:Array<IMinuteLine>,startTime:Date,endTime:Date,firstEndTime:Date,secondStartTime:Date,yesClosePrice:number){
			this.mFirstStartTime = startTime;
			this.mSecondEndTime = endTime;
			if(this.mFirstStartTime.getTime() >= this.mSecondEndTime.getTime()){
				console.error("start time not gt end time!");
				return;
			}
			this.mTotalTime = this.mSecondEndTime.getTime() - this.mFirstStartTime.getTime();
			if(firstEndTime != null && secondStartTime != null){
				this.mFirstEndTime = firstEndTime;
				this.mSecondStartTime = secondStartTime;
				if(!(this.mFirstStartTime.getTime() < this.mFirstEndTime.getTime()) && 
				this.mFirstEndTime.getTime() < this.mSecondStartTime.getTime() && 
				this.mSecondStartTime.getTime() < this.mSecondEndTime.getTime()){
					console.error("time error!");
					return;
				}
				this.mTotalTime -= this.mSecondStartTime.getTime() - this.mFirstEndTime.getTime() - this.mMinute;
			}
			this.setValueStart(yesClosePrice);
			if(data != null){
				this.mPoints = new Array<IMinuteLine>();
				this.mPoints.push.apply(this.mPoints,data);
			}
			if(this.mIsShow)
				this.notifyChanged();
		}
		public onDraw(){
			this.drawBackGround();
			this.drawGrid();
			this.drawLines();
			this.drawLongPress();
			this.drawTexts();
			this.drawValue(this.isLongPress ? this.mSelectIndex : this.mPoints.length - 1);
		}
		private drawValue(index:number){
			let texTemp = new egret.TextField();
			texTemp.text = "1";
			texTemp.size = this.mTextSize;
			if(index >= 0 && index < this.mPoints.length){
				let y = - texTemp.height;
				let point:IMinuteLine = this.mPoints[index];
				let text = "Pice:" + point.getPrice().toFixed(2)+" ";
				let x = 0;
				this.drawText(x,y,text,this.mTextSize,this.mPriceColor);
				texTemp.text = text;
				x+=texTemp.width;
				text = "AVG:" + point.getAvgPrice().toFixed(2) + " ";
				this.drawText(x,y,text,this.mTextSize,this.mAvgColor);
				text = "VOL:" + this.mVolumeFormatter.format(point.getVolume());
				texTemp.text = text;
				this.drawText(this.mWidth - texTemp.width,this.mHeight ,text,this.mTextSize,this.mTextColor);
			}
		}
		private drawTexts(){
			let texTemp = new egret.TextField();
			texTemp.text = "1";
			texTemp.size = this.mTextSize;
			this.drawText(0,0,this.mValueMax.toFixed(2),this.mTextSize,this.mTextColor);
			this.drawText(0,this.mHeight - texTemp.height,this.mValueMin.toFixed(2),this.mTextSize,this.mTextColor);
			let rowValue = (this.mValueMax - this.mValueMin )/ this.mGridRows;
			let rowSpace = this.mHeight/this.mGridRows;
			for(var i = 1; i < this.mGridRows;i++){
				let text = (rowValue * (this.mGridRows - i) + this.mValueMin).toFixed(2);
				texTemp.text = text;
				let y = rowSpace * i;
				this.drawText(0,y,text,this.mTextSize,this.mTextColor);
			}
			let text = ((this.mValueMax - this.mValueStart) * 100 /this.mValueStart).toFixed(2) + "%";
			texTemp.text = text;
			this.drawText(this.mWidth - texTemp.width,0,text,this.mTextSize,this.mTextColor);
			text =((this.mValueMin - this.mValueStart) * 100/this.mValueStart).toFixed(2) + "%";
			texTemp.text = text;
			this.drawText(this.mWidth - texTemp.width,this.mHeight - texTemp.height,text,this.mTextSize,this.mTextColor);
			for(var i = 1; i < this.mGridRows;i++){
				text = ((rowValue * (this.mGridRows - i) + this.mValueMin - this.mValueStart) * 100 / this.mValueStart).toFixed(2) + "%";
				texTemp.text = text;
				this.drawText(this.mWidth - texTemp.width,rowSpace * i ,text,this.mTextSize,this.mTextColor);
			}
			text = DateUtil.ShortTimeFormat(this.mFirstStartTime);
			let y= this.mHeight + this.mVolumeHeight + texTemp.height / 2;
			texTemp.text = text;
			this.drawText(0,y,text,this.mTextSize,this.mTextColor);
			text = DateUtil.ShortTimeFormat(this.mSecondEndTime);
			texTemp.text = text;
			this.drawText(this.mWidth - texTemp.width,y,text,this.mTextSize,this.mTextColor);

			this.drawText(0,this.mHeight,this.mVolumeFormatter.format(this.mVolumeMax),this.mTextSize,this.mTextColor);
		}
		private drawLines(){
			if(this.mPoints.length > 0){
				let lastPoint = this.mPoints[0];
				let lastX = this.getX(0);
				for(var i = 0; i < this.mPoints.length;i++){
					let curPoint:Chart.IMinuteLine = this.mPoints[i];
					let curX = this.getX(i);
					this.drawLine(lastX,this.getY(lastPoint.getPrice()),curX,this.getY(curPoint.getPrice()),1,this.mPriceColor);
					this.drawLine(lastX,this.getY(lastPoint.getAvgPrice()),curX,this.getY(curPoint.getAvgPrice()),1,this.mAvgColor);
					if((i == 0 && curPoint.getPrice() <= this.mValueStart) || curPoint.getPrice() <= lastPoint.getPrice()){
						this.drawLine(curX,this.getVolumeY(0),curX,this.getVolumeY(curPoint.getVolume()),2,this.mVolumeGreenColor);
					}else{
						this.drawLine(curX,this.getVolumeY(0),curX,this.getVolumeY(curPoint.getVolume()),2,this.mVolumeRedColor);
					}
					lastPoint = curPoint;
					lastX = curX;
				}
			}

		}
		private drawLongPress(){
			if(this.isLongPress){
				let point:IMinuteLine = this.mPoints[this.mSelectIndex];
				let x = this.getX(this.mSelectIndex);
				this.drawLine(x,0,x,this.mHeight + this.mVolumeHeight,1,this.mTextColor);
				this.drawLine(0,this.getY(point.getPrice()),this.mWidth,this.getY(point.getPrice()),1,this.mTextColor);
				let text = DateUtil.ShortTimeFormat(point.getDate());
				let texTemp = new egret.TextField();
				texTemp.size = this.mTextSize;
				texTemp.text = text;
				x = x - texTemp.width/2;
				if(x < 0){
					x = 0;
				}
				if(x > this.mWidth - texTemp.width){
					x = this.mWidth - texTemp.width;
				}
				this.drawRect(x,this.mHeight + this.mVolumeHeight + texTemp.height,x + texTemp.width,this.mVolumeHeight+this.mHeight + texTemp.height /2,this.mBackgroundColor);
				this.drawText(x,this.mHeight + this.mVolumeHeight + texTemp.height/2,text,this.mTextSize,this.mTextColor);
				let r = texTemp.height / 2;
				let y = this.getY(point.getPrice());
				text = point.getPrice().toFixed(2);
				texTemp.text = text;
				this.drawRect(0,y - r,texTemp.width,y + r,this.mBackgroundColor);
				this.drawText(0, y - texTemp.height / 2,text,this.mTextSize,this.mTextColor);
				text = ((point.getPrice() - this.mValueStart) * 100 / this.mValueStart).toFixed(2) + "%";
				this.drawRect(this.mWidth - texTemp.width,y - r,this.mWidth,y + r ,this.mBackgroundColor);
				this.drawText(this.mWidth - texTemp.width,y - texTemp.height / 2 ,text,this.mTextSize,this.mTextColor);

			}
		}

		private drawBackGround(){
			this.drawRect(0,0,this.mWidth,this.height,this.mBackgroundColor,true);
		}
		private drawGrid(){
			this.translate(0 , this.mTopPadding);
			this.scale(1,1);
			let rowSpace = this.mHeight / this.mGridRows;
			for(var i = 0; i <= this.mGridRows; i++){
				this.drawLine(0,rowSpace * i,this.mWidth,rowSpace * i,this.mGridWidth,this.mGridColor,true);
			}
			this.drawLine(0,rowSpace * this.mGridRows / 2,this.mWidth,rowSpace * this.mGridRows /2,this.mGridWidth,this.mGridColor,true);
			this.drawLine(0,this.mHeight +this.mVolumeHeight,this.mWidth,this.mHeight + this.mVolumeHeight,this.mGridWidth,this.mGridColor,true);
			
			let columsSpace = this.mWidth/this.mGrildColumns;
			for(var i = 0; i <= this.mGrildColumns;i++){
				this.drawLine(columsSpace * i,0,columsSpace * i,this.mHeight + this.mVolumeHeight,this.mGridWidth,this.mGridColor,true);
			}
			
		}
		private calculateSelectedX(x:number){
			this.mSelectIndex = Math.floor(x / this.getX(this.mPoints.length - 1) * (this.mPoints.length - 1) + 0.5);
			if(this.mSelectIndex < 0){
				this.mSelectIndex = 0;
			}
			if(this.mSelectIndex > this.mPoints.length - 1){
				this.mSelectIndex = this.mPoints.length - 1;
			}
		}
		private getX(position:number):number{
			let date = this.mPoints[position].getDate();
			if(this.mSecondStartTime != null && date.getTime() >= this.mSecondStartTime.getTime()){
				return (date.getTime() - this.mSecondStartTime.getTime() + this.mMinute+this.mFirstEndTime.getTime() - this.mFirstStartTime.getTime())/this.mTotalTime * (this.mWidth - this.mPointWidth) + this.mPointWidth / 2;
			}else{
				return (date.getTime() - this.mFirstStartTime.getTime()) / this.mTotalTime * (this.mWidth - this.mPointWidth) + this.mPointWidth / 2;
			}

		}
		private getVolumeY(value:number):number{
			return (this.mVolumeMax - value ) * this.mVolumeScaleY + this.mHeight;
		}
		private getY(value:number){
			return (this.mValueMax - value) * this.mScaleY;
		}
		public notifyChanged(){
			this.mValueMax = Number.MIN_VALUE;
			this.mValueMin = Number.MAX_VALUE;
			this.mVolumeMax = Number.MIN_VALUE;
			for(var i = 0; i < this.mPoints.length; i++){
				let point:IMinuteLine = this.mPoints[i];
				this.mValueMax = Math.max(this.mValueMax,point.getPrice());
				this.mValueMin = Math.min(this.mValueMin,point.getPrice());
				this.mVolumeMax = Math.max(this.mVolumeMax,point.getVolume());
			}
			let offsetValueMax = this.mValueMax - this.mValueStart;
			let offsetValueMin = this.mValueStart - this.mValueMin;

			let offset = (offsetValueMax > offsetValueMin ? offsetValueMax : offsetValueMin) * 1.2;
			this.mValueMax = this.mValueStart + offset;
			this.mValueMin = this.mValueStart - offset;
			this.mScaleY = this.mHeight / (this.mValueMax - this.mValueMin);
			if(this.mValueMax == this.mValueMin){
				this.mValueMax += Math.abs(this.mValueMax  * 0.05);
				this.mValueMin -= Math.abs(this.mValueMax * 0.05);
				if(this.mValueMax == 0){
					this.mValueMax = 1;
				}
			}
			if(this.mVolumeMax == 0){
				this.mVolumeMax = 1;
			}
			this.mVolumeMax *= 1.1;
			this.mVolumeScaleY = this.mVolumeHeight / this.mVolumeMax;
			this.mPointWidth = this.mWidth / this.getMaxPointCount();
			
			this.invalidate();
		}
		
		public setValueStart(valueStart:number){
			this.mValueStart = valueStart;
		}

		private getMaxPointCount():number{
			return this.mTotalTime/this.mMinute;
		}

		public onLongPress(evt:egret.TouchEvent){
			super.onLongPress(evt);
			this.calculateSelectedX(evt.stageX - this.x);
			this.invalidate();
		}
		public changePoint(position:number,point:IMinuteLine){
			this.mPoints[position] = point;
			this.notifyChanged();
		}
		public getItemSize(){
			return this.mPoints.length;
		}
		public refreshLastPoint(point:IMinuteLine){
			this.changePoint(this.getItemSize() - 1,point);
		}
		public addPoint(point:IMinuteLine){
			this.mPoints.push(point);
			this.notifyChanged();
		}
		public getItem(position:number){
			return this.mPoints[position];
		}
		public setVolumeHeight(value:number){
			this.mVolumeHeight = value;
		}

		onLeftSide():void{

		}
		onRightSide():void{

		}
		invalidate():void{
			if(this.mIsShow){
				this.clearView();	
				this.onDraw();
			}
		}
		getMinScrollX():number{
			return 0;
		}
		getMaxScrollX():number{
			return 0;
		}

		onScrollChanged():void{

		}
		onScaleChanged():void{

		}
	}
}