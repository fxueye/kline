/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export abstract class BaseKChartView extends ScrollAndScaleView {
		private mChildDrawPosition:number = 0;
		private mTranslateX:number = Number.MIN_VALUE;
		private mWidth:number = 0;
		private mTopPadding:number = 0;
		private mBottomPadding:number = 0;
		private mMainScaleY:number = 1;
		private mChildScaleY:number = 1;
		private mDataLen:number = 0;
		private mMainMaxValue:number = Number.MAX_VALUE;
		private mMainMinValue:number = Number.MIN_VALUE;
		private mChildMaxValue:number = Number.MAX_VALUE;
		private mChildMinValue:number = Number.MIN_VALUE;
		private mStartIndex:number = 0;
		private mStopIndex:number = 0;
		private mPointWidth:number = 6;
		private mGridRows:number = 4;
		private mGridColumns:number = 4;
		private mGridColor:number;
		private mGridLineWidth:number;
		private mTextColor:number;
		private mTextSize:number;
		private mBackgroundColor:number = Color.BACK_GROUND;
		private mTabBarBackgroundColor:number = Color.TAB_BACK_GROUND;
		private mSelectedLineColor:number= Color.TEXT;
		private mSelectedIndex:number;
		private mBMainDraw:IChartDraw<any>;
		private mAdapter:IAdapter;
		private mDataSetObserver:DataSetObserver = new Dso(this);
		private mItemCount:number;//当前点的个数
		private mChildDraw:IChartDraw<any>;
		private mChildDraws:Array<IChartDraw<any>> = new Array<IChartDraw<any>>();
		private mValueFormatter:IValueFormatter;
		private mDateTimeFormatter:IDateTimeFormatter;
		protected mKChartTabView:KChartTabView;
		protected mTabNames:Array<string>;
		private mOverScrollRange:number = 0;
		private mMainRect:Rect;
		private mTabRect:Rect;
		private mChildRect:Rect;
		private mLineWidth:number;

		private mBtnLeft:eui.Button;
		private mBtnRight:eui.Button;
		private mBtnUp:eui.Button;
		private mBtnDown:eui.Button;

		


		private mTabViewHeight:number = 50;

		public constructor() {
			super();
			this.init();
			this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddedToStage,this);
		}
		private init(){
			this.mTabNames = new Array<string>();
			this.mTopPadding = 15;
			this.mBottomPadding = 15;			
			this.mKChartTabView = new KChartTabView();
			this.mBtnLeft = new eui.Button();
			this.mBtnRight = new eui.Button();
			this.mBtnUp = new eui.Button();
			this.mBtnDown = new eui.Button();
		}
		protected onAddedToStage(){
			
			this.mKChartTabView.height = this.mTabViewHeight;
			this.mBtnLeft.label = "←";
			this.mBtnLeft.height = this.mTabViewHeight;
			this.mBtnRight.label = "→";
			this.mBtnRight.height = this.mTabViewHeight;

			this.mBtnUp.label = "^";
			this.mBtnUp.height = this.mTabViewHeight / 2;
			
			this.mBtnDown.label = "^";
			this.mBtnDown.height = this.mTabViewHeight / 2;

			
			this.addChild(this.mKChartTabView);
			this.addChild(this.mBtnRight);
			this.addChild(this.mBtnLeft);
			this.addChild(this.mBtnUp);
			this.addChild(this.mBtnDown);

	

			this.mBtnRight.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRight,this);
			this.mBtnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLeft,this);
			this.mBtnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUp,this);
			this.mBtnDown.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDown,this);
			this.onSizeChanged();

			this.mKChartTabView.dataProvider = new eui.ArrayCollection(this.mTabNames);
			this.mKChartTabView.itemRenderer = TabView;
			this.mKChartTabView.selectedItem = 0;
			this.setChildDraw(0);

		}
		private onSizeChanged(){

			this.stage.removeEventListener(egret.Event.RESIZE,this.onSizeChanged,this);
			this.mWidth = this.width;
			this.initRect(this.width,this.height);
			this.stage.addEventListener(egret.Event.RESIZE,this.onSizeChanged,this);
			this.notifyChanged();
		}
		private initRect(w:number,h:number){
			let mainChildSpace = this.mKChartTabView.height;
			let displayHeight = h - this.mTopPadding - this.mBottomPadding - mainChildSpace;
			let mainHeight = displayHeight * 0.75;
			let childHeight = displayHeight * 0.25;
			this.mMainRect = new Rect(0,this.mTopPadding,this.mWidth,this.mTopPadding + mainHeight);
			this.mTabRect = new Rect(0,this.mMainRect.bottom,this.width,this.mMainRect.bottom + mainChildSpace);
			this.mChildRect = new Rect(0,this.mTabRect.bottom,this.mWidth,this.mTabRect.bottom + childHeight);

			this.mKChartTabView.x = this.mTabRect.left;
			this.mKChartTabView.y = this.mTabRect.top;
			this.mKChartTabView.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onItemTap,this);

			this.mBtnRight.x = this.mTabRect.right - this.mBtnRight.width;
			this.mBtnRight.y = this.mTabRect.top;

			this.mBtnUp.x = this.mBtnRight.x - this.mBtnRight.width;
			this.mBtnUp.y = this.mBtnRight.y;

			this.mBtnDown.x = this.mBtnRight.x - this.mBtnRight.width;
			this.mBtnDown.y = this.mBtnUp.y + this.mBtnUp.height;
			let lab = <eui.Label>this.mBtnDown.labelDisplay;
			lab.rotation = 180;

			this.mBtnLeft.x = this.mBtnUp.x - this.mBtnUp.width;
			this.mBtnLeft.y = this.mBtnUp.y;
			


		}
		private onDraw(){
			this.calculateValue();
			this.drawBackGround();
			this.drawGird();
			this.drawK();
			this.drawAllText();
			this.drawValue(this.isLongPress ? this.mSelectedIndex:this.mStopIndex);
		}
		public invalidate(){
			if(this.mIsShow){
				this.clearView();	
				this.onDraw();
			}
		}
		private onUp(){
			this.scaleTo(this.getScaleX() + 0.1);
			this.invalidate();
		}
		private onDown(){
			this.scaleTo(this.getScaleX() - 0.1);
			this.invalidate();
		}
		private onRight(){
			this.scrollTo(this.getScrollX() - 100);
			this.invalidate();

		}
		private onLeft(){
			this.scrollTo(this.getScrollX() + 100);
			this.invalidate();
		}
		
		private drawValue(position:number){
			let labTemp = new egret.TextField();
			labTemp.text = "0";
			labTemp.size = this.mTextSize;
			if(position >= 0 && position < this.mItemCount){
				if(this.mBMainDraw != null){
					let y = this.mMainRect.top - labTemp.height;
					let x = 0;
					this.mBMainDraw.drawText(position,x,y);
				}
				if(this.mChildDraw != null){
					let y = this.mChildRect.top;
					labTemp.text = this.mChildDraw.getValueFormatter().format(this.mChildMaxValue);
					let x = labTemp.width;
					this.mChildDraw.drawText(position,x,y);
				}
			}
		}
		private drawAllText(){
			//k线值
			let labTemp = new egret.TextField();
			labTemp.size = this.mTextSize;
			if(this.mBMainDraw != null){
				let tab = this.drawText(0,this.mMainRect.top,this.formatValue(this.mMainMaxValue),this.mTextSize,this.mTextColor);
				tab = this.drawText(0,this.mMainRect.bottom - tab.height,this.formatValue(this.mMainMinValue),this.mTextSize,this.mTextColor);
				let rowValue = (this.mMainMaxValue  - this.mMainMinValue) / this.mGridRows;
				let rowSpace = this.mMainRect.height() / this.mGridRows;
				for(var i = 1; i < this.mGridRows; i++){
					let text = this.formatValue(rowValue * (this.mGridRows - i) + this.mMainMinValue);
					this.drawText(0,rowSpace * i + this.mMainRect.top - tab.height/2,text,this.mTextSize,this.mTextColor);
				}
			}
			//子线值
			if(this.mChildDraw != null){
				let tab = this.drawText(0,this.mChildRect.top,this.mChildDraw.getValueFormatter().format(this.mChildMaxValue),this.mTextSize,this.mTextColor);
				this.drawText(0,this.mChildRect.bottom - tab.height,this.mChildDraw.getValueFormatter().format(this.mChildMinValue),this.mTextSize,this.mTextColor);
			}
			//时间
			let columnSpace = this.mWidth / this.mGridColumns;
			let y = this.mChildRect.bottom;
			let startX = this.getX(this.mStartIndex) - this.mPointWidth/2;
			let stopX = this.getX(this.mStopIndex) + this.mPointWidth/2;
			for(var i = 1; i < this.mGridColumns; i++){
				let translateX = this.xToTranslateX(columnSpace * i);
				if(translateX >= startX && translateX <= stopX){
					let index = this.indexOfTranslateX(translateX);
					let text = this.formatDateTime(this.mAdapter.getDate(index))
					labTemp.text = text;
					this.drawText(columnSpace * i - labTemp.width/2,y,text,this.mTextSize,this.mTextColor);
				}
			}


			

			let translateX =this.xToTranslateX(0);
			if(translateX >= startX && translateX <= stopX){
				let text = this.formatDateTime(this.getAdapter().getDate(this.mStartIndex));
				this.drawText(0,y,text,this.mTextSize,this.mTextColor);
			}
			translateX = this.xToTranslateX(this.mWidth);
			if(translateX >= startX && translateX <= stopX){
				let text = this.formatDateTime(this.getAdapter().getDate(this.mStopIndex));
				labTemp.text = text;
				this.drawText(this.mWidth - labTemp.width,y,text,this.mTextSize,this.mTextColor);
			}
			if(this.isLongPress){

				let point:IKLine = this.getItem(this.mSelectedIndex);
				let text = this.formatValue(point.getClosePrice());
				let r = labTemp.height/2;
				y = this.getMainY(point.getClosePrice());
				let x;
				if(this.translateXtoX(this.getX(this.mSelectedIndex)) < this.getChartWidth()/2){
					x = 0;
					this.drawRect(x,y - r,labTemp.width,y + r,this.mBackgroundColor);
				}else{
					x = this.mWidth - labTemp.width;
					this.drawRect(x,y - r,this.mWidth,y + r,this.mBackgroundColor);
				}
				this.drawText(x,y,text,this.mTextSize,this.mTextColor);
			}


		}
		private drawK(){
			this.save();
			this.scale(this.mScaleX,1);
			this.translate(this.mTranslateX * this.mScaleX ,0);
			for(var i = this.mStartIndex; i <= this.mStopIndex; i++){
				let currentPoint = this.getItem(i);
				let currentPointX = this.getX(i);
				let lastPoint = i == 0 ? currentPoint: this.getItem(i - 1 );
				let lastX = i == 0 ? currentPointX: this.getX(i - 1);
				if(this.mBMainDraw != null){
					this.mBMainDraw.drawTranslated(lastPoint,currentPoint,lastX,currentPointX,i);
				}
				if(this.mChildDraw != null){
					this.mChildDraw.drawTranslated(lastPoint,currentPoint,lastX,currentPointX,i);
				}
			}
			if(this.isLongPress){
				let point:IKLine = this.getItem(this.mSelectedIndex);
				let x = this.getX(this.mSelectedIndex);
				let y = this.getMainY(point.getClosePrice());
				this.drawLine(x,this.mMainRect.top,x,this.mMainRect.bottom,this.mLineWidth,this.mSelectedLineColor);
				this.drawLine(-this.mTranslateX,y,-this.mTranslateX + this.mWidth / this.mScaleX,y,this.mLineWidth,this.mSelectedLineColor);
				this.drawLine(x,this.mChildRect.top,x,this.mChildRect.bottom,this.mLineWidth,this.mSelectedLineColor);
			}
			this.restore();

		}
		private drawBackGround(){
			this.drawRect(0,0,this.mWidth,this.height,this.mBackgroundColor,true);
			this.drawRect(0,this.mTabRect.top,this.mTabRect.right,this.mTabRect.bottom,this.mTabBarBackgroundColor,true);
		}
		private drawGird(){
			let rowSpace = this.mMainRect.height()/this.mGridRows;
			for(var i = 0; i <= this.mGridRows; i++){
				this.drawLine(0,rowSpace * i + this.mMainRect.top, this.mWidth,rowSpace * i + this.mMainRect.top,this.mGridLineWidth,this.mGridColor,true);
			}
			this.drawLine(0,this.mChildRect.top,this.mWidth,this.mChildRect.top,this.mGridLineWidth,this.mGridColor,true);
			this.drawLine(0,this.mChildRect.bottom,this.width,this.mChildRect.bottom,this.mGridLineWidth,this.mGridColor,true);
			let columnSpace = this.mWidth/ this.mGridColumns;
			for(var i = 0;i <= this.mGridColumns;i++){
				this.drawLine(columnSpace * i,this.mMainRect.top,columnSpace * i,this.mMainRect.bottom,this.mGridLineWidth,this.mGridColor,true);
				this.drawLine(columnSpace * i,this.mChildRect.top,columnSpace * i,this.mChildRect.bottom,this.mGridLineWidth,this.mGridColor,true);
			}
		}
		private calculateValue(){
			if(!this.isLongPress){
				this.mSelectedIndex = -1;
			}
			this.mMainMaxValue = Number.MIN_VALUE;
			this.mMainMinValue = Number.MAX_VALUE;
			this.mChildMaxValue = Number.MIN_VALUE;
			this.mChildMinValue = Number.MAX_VALUE;
			this.mStartIndex = this.indexOfTranslateX(this.xToTranslateX(0));
			this.mStopIndex = this.indexOfTranslateX(this.xToTranslateX(this.mWidth));
			for(var i = this.mStartIndex; i <= this.mStopIndex; i++){
				let point:IKLine  = <IKLine>this.getItem(i);
				if(this.mBMainDraw != null){
					this.mMainMaxValue = Math.max(this.mMainMaxValue,this.mBMainDraw.getMaxValue(point));
					this.mMainMinValue = Math.min(this.mMainMinValue,this.mBMainDraw.getMinValue(point));
				}
				if(this.mChildDraw != null){
					this.mChildMaxValue = Math.max(this.mChildMaxValue,this.mChildDraw.getMaxValue(point));
					this.mChildMinValue = Math.min(this.mChildMinValue,this.mChildDraw.getMinValue(point));
				}
			}
			if(this.mMainMaxValue != this.mMainMinValue){
				let padding = (this.mMainMaxValue - this.mMainMinValue) * 0.05;
				this.mMainMaxValue += padding;
				this.mMainMinValue -= padding;
			}else{
				this.mMainMaxValue += Math.abs(this.mMainMaxValue * 0.05);
				this.mMainMinValue -= Math.abs(this.mMainMinValue * 0.05);
				if(this.mMainMaxValue == 0){
					this.mMainMaxValue = 1;
				}
			}
			if(this.mChildMaxValue == this.mChildMinValue){
				this.mChildMaxValue += Math.abs(this.mChildMaxValue * 0.05);
				this.mChildMinValue -= Math.abs(this.mChildMinValue * 0.05);
				if(this.mChildMaxValue == 0){
					this.mChildMaxValue = 1;
				}
			}
			this.mMainScaleY = this.mMainRect.height() * 1/(this.mMainMaxValue - this.mMainMinValue);
			this.mChildScaleY = this.mChildRect.height() * 1/(this.mChildMaxValue - this.mChildMinValue);
			//TODO 动画

		}
		public indexOfTranslateX(translateX:number){
			return this.findIndexOfTranslateX(translateX,0,this.mItemCount - 1);
		}
		public findIndexOfTranslateX(translateX:number,start:number,end:number){
			if(end == start){
				return start;
			}
			if(end - start == 1){
				let startValue = this.getX(start);
				let endValue = this.getX(end);
				return Math.abs(translateX - startValue) < Math.abs(translateX - endValue) ? start : end;
			}
			let mid = Math.floor(start + (end - start) / 2);
			let midValue = this.getX(mid);
			if(translateX < midValue){
				return this.findIndexOfTranslateX(translateX,start,mid);
			}else if(translateX > midValue){
				return this.findIndexOfTranslateX(translateX,mid,end);
			}else{
				return mid;
			}
		}
		public onLongPress(evt:egret.TouchEvent){
			super.onLongPress(evt);
			let lastIndex = this.mSelectedIndex;
			this.calculateSelectedX(evt.stageX - this.x);
			this.invalidate();
		}

		private calculateSelectedX(x:number){
			this.mSelectedIndex = this.indexOfTranslateX(this.xToTranslateX(x));
			if(this.mSelectedIndex < this.mStartIndex){
				this.mSelectedIndex = this.mStartIndex;
			}
			if(this.mSelectedIndex > this.mStopIndex){
				this.mSelectedIndex = this.mStopIndex;
			}
		}

		public getX(position:number){
			return position * this.mPointWidth;
		}
		public translateXtoX(translateX:number){
			return (translateX + this.mTranslateX) * this.mScaleX;
		}
		public xToTranslateX(x:number){
			return -this.mTranslateX + x/this.mScaleX;
		}
		public setTranslateXFromScrollX(scrollX:number){
			this.mTranslateX = scrollX + this.getMinTranslateX();
		}
		public getMinScrollX():number{
			return -Math.floor(this.mOverScrollRange / this.mScaleX);
		}
		public getMaxScrollX():number{
			return Math.round(this.getMaxTranslateX() - this.getMinTranslateX());
		}
		private getMinTranslateX():number{
			return -this.mDataLen + this.mWidth/this.mScaleX - this.mPointWidth /2;
		}
		private getMaxTranslateX(){
			if(!this.isFullScreen()){
				return this.getMinTranslateX();
			}
			return this.mPointWidth/2;
		}
		public getTopPadding():number{
			return this.mTopPadding;
		}
		public getChartWidth():number{
			return this.mWidth;
		}
		public getChildRect():Rect{
			return this.mChildRect;
		}
		public setOverScrollRange(overScrollRange:number){
			if(overScrollRange  < 0){
				overScrollRange = 0;
			}
			this.mOverScrollRange = overScrollRange;
		}
		public setTopPadding(topPadding:number){
			this.mTopPadding = topPadding;
		}
		public setBottomPadding(bottomPadding:number){
			this.mBottomPadding =bottomPadding;
		}
		public isFullScreen():boolean{
			return this.mDataLen >= this.mWidth/this.mScaleX;
		}
		private onItemTap(evt:eui.ItemRenderer){
			this.setChildDraw(evt.itemIndex);
		}
		public setChildDraw(position:number){
			this.mChildDraw = this.mChildDraws[position];
			this.mChildDrawPosition = position;
			this.invalidate();
		}
		public setMainDraw(mainDraw:IChartDraw<any>){
			this.mBMainDraw = mainDraw;
		}
		public addChildDraw(name:string,childDraw:IChartDraw<any>){
			this.mChildDraws.push(childDraw);
			this.mTabNames.push(name);
		}
		public drawChildLine(startX:number,startValue:number,stopX:number,stopValue:number,lineWidth: number = 1, color: number = Color.RED){
			this.drawLine(startX,this.getChildY(startValue),stopX,this.getChildY(stopValue),lineWidth,color);
		}
		public drawMainLine(startX:number,startValue:number,stopX:number,stopValue:number,lineWidth: number = 1, color: number = Color.RED){
			this.drawLine(startX,this.getMainY(startValue),stopX,this.getMainY(stopValue),lineWidth,color);
		}
		
		public getMainY(value:number):number{
			return (this.mMainMaxValue - value) * this.mMainScaleY + this.mMainRect.top;
		}
		public getChildY(value:number):number{
			return (this.mChildMaxValue -value ) * this.mChildScaleY + this.mChildRect.top;
		}

		public getItem(position:number){
			if(this.mAdapter != null){
				return this.mAdapter.getItem(position);
			}else{
				return null;
			}
		}
		public formatValue(value:number){
			if(this.getValueFormatter() == null){
				this.setValueFormatter(new ValueFormatter());
			}
			return this.getValueFormatter().format(value);
		}
		public formatDateTime(date:Date){
			if(this.getDateTimeFormatter() == null)
			{
				this.setDateTimeFormatter(new TimeFormatter());
			}
			return this.getDateTimeFormatter().format(date);
		}
		public setValueFormatter(value:IValueFormatter){
			this.mValueFormatter = value;
		}
		public getValueFormatter():IValueFormatter{
			return this.mValueFormatter;
		}
		public getAdapter():IAdapter{
			return this.mAdapter;
		}
		public setItemCount(value:number){
			this.mItemCount = value;
		}
		public setPointWidth(value:number){
			this.mPointWidth = value;
		}
		public getLineWidth():number{
			return this.mLineWidth;
		}
		public setTextColor(color:number){
			this.mTextColor = color;
		}
		public setTextSize(size:number){
			this.mTextSize = size;
		}
		public getTextSize():number{
			return this.mTextSize;
		}
		public setLineWidth(pix:number){
			this.mLineWidth = pix;
		}
		public setBackgroundColor(color:number){
			this.mBackgroundColor = color;
		}
		public setTabBarBackgroundColor(color:number){
			this.mTabBarBackgroundColor = color;
		}
		public setGridLineWidth(value:number){
			this.mGridLineWidth = value;
		}
		public setGridLineColor(value:number){
			this.mGridColor = value;
		}
		public setAdapter(adapter:IAdapter){
			if(this.mAdapter != null && this.mDataSetObserver != null){
				this.mAdapter.unregisterDataSetObserver(this.mDataSetObserver);
			}
			this.mAdapter = adapter;
			if(this.mAdapter != null){
				this.mAdapter.registerDataSetObserver(this.mDataSetObserver);
				this.mItemCount = this.mAdapter.getCount();
			}else{
				this.mItemCount = 0;
			}
			this.notifyChanged();
		}
		public setDateTimeFormatter( dateTimeFormatter:IDateTimeFormatter){
			this.mDateTimeFormatter = dateTimeFormatter;
		}
		public getDateTimeFormatter():IDateTimeFormatter{
			return this.mDateTimeFormatter;
		}
		public setGridRows(gridRows:number){
			if(gridRows < 0){
				gridRows = 1;
			}
			this.mGridRows = gridRows;
		}
		public setGridColumns(gridColumns:number){
			if(gridColumns < 1){
				gridColumns = 1;
			}
			this.mGridColumns = gridColumns;
		}
		public notifyChanged():void{
			if(this.mItemCount != 0){
				this.mDataLen = (this.mItemCount - 1) * this.mPointWidth;
				this.checkAndFixScrollX();
				this.setTranslateXFromScrollX(this.mScrollX);
			}else{
				this.setScrollX(0);
			}

			this.invalidate();
		}
		public checkAndFixScrollX(){
			if(this.mScrollX < this.getMinScrollX()){
				this.mScrollX = this.getMinScrollX();
			}else if(this.mScrollX > this.getMaxScrollX()){
				this.mScrollX = this.getMaxScrollX();
			}
		}
		public getTextColor():number{
			return this.mTextColor;
		}
		public getSelectedIndex():number{
			return this.mSelectedIndex;
		}
		public setTabViewWidth(width:number){
			if(this.mTabViewHeight < width)
				this.mTabViewHeight = width;
		}
	}
	class Dso extends DataSetObserver{
		private mKChartView:BaseKChartView;
		public constructor(obj:BaseKChartView){
			super();
			this.mKChartView = obj;
		}
		public onChanged():void{
			this.mKChartView.setItemCount(this.mKChartView.getAdapter().getCount());
			this.mKChartView.notifyChanged();
		}
		public onInvalidated():void{
			this.mKChartView.setItemCount(this.mKChartView.getAdapter().getCount());
			this.mKChartView.notifyChanged();
		}
	}
	export interface OnSelectedChangedListener{
		onSelectedChanged(view:BaseKChartView, point:egret.Point, index:number):void;
	}

}