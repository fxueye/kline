/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export abstract class ScrollAndScaleView extends egret.DisplayObjectContainer {
		private mBgLayer:egret.DisplayObjectContainer;
		private mTextLayer:egret.DisplayObjectContainer;
		private mDrawLayer:egret.DisplayObjectContainer;
		private mTopLayer:egret.DisplayObjectContainer;
		private mEvet:egret.Sprite;
		private mStartPoint:egret.Point;
		private mEndPoint:egret.Point;
		private mMoveDistance:number = 10; 
		private mlastPoint:egret.Point;
		private mIsMove:boolean;
		private mTimer:egret.Timer;
		private mTime:number = 0;
		private mTouchEvet:egret.TouchEvent;
		
		//缩放逻辑
		private mTouchPoints:any = {names:[]};
		private mDistance:number = 0;
		private mDefAngle:number = 0;
		private mTouchCon:number = 0;
		private mC:number = 0.017453292; //2PI/360
		
	
		protected mTouch:boolean = false;
		protected mIsShow:boolean = false;

		private mRectShpes:Array<egret.Shape>;
		private mLineShpe:egret.Shape;
		private mBgLineShpe:egret.Shape;
		
		protected mScrollX:number = 0;
		protected mScaleX:number = 1;
		//绘图用
		private mDrawScaleX:number = 1; 
		private mDrawScaleY:number = 1;// 暂时无用不做y 缩放

		private mTempScrollX:number = 0;
		private mTempScaleX:number = 1;
		private mTempDx:number = 0;
		private mTempDy:number = 0;

		protected mScaleMax:number = 2;
		protected mScaleMin:number = 0.5;  

		private mMultipleTouch:boolean = false;
		private mScrollEnable:boolean = true;
		private mScaleEnable:boolean = true;
		private mIsLongPress:boolean = false;

		private mDx:number = 0;
		private mDy:number = 0;

		public constructor() {
			super();

			this.mRectShpes = new Array<egret.Shape>();
			this.mLineShpe = new egret.Shape();
			this.mBgLineShpe = new egret.Shape();
			this.mBgLayer = new egret.DisplayObjectContainer();
			this.mDrawLayer = new egret.DisplayObjectContainer();
			this.mTextLayer = new egret.DisplayObjectContainer();
			this.mTopLayer = new egret.DisplayObjectContainer();
			this.mEvet = new egret.Sprite();

			this.mEvet.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this);
			this.mEvet.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchCancel,this);
			this.mEvet.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouchEnd,this);
			this.mEvet.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouchMove,this);
			this.mEvet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);

			this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
		}
		private onAddToStage():void{
			this.mBgLayer.width = this.width;
			this.mBgLayer.height = this.height;
			this.mTextLayer.width = this.width;
			this.mTextLayer.height = this.height;
			this.mDrawLayer.width = this.width;
			this.mDrawLayer.height  = this.height;
			this.addChild(this.mBgLayer);
			this.addChild(this.mDrawLayer);
			this.addChild(this.mTextLayer);
			this.mTopLayer.width = this.width;
			this.mTopLayer.height = this.height;
			// this.mTopLayer.touchEnabled = true;
			this.addChild(this.mTopLayer);
			this.mEvet.touchEnabled = true;
			this.mEvet.width = this.width;
			this.mEvet.height = this.height;
			this.mEvet.graphics.beginFill(0x000000);
			this.mEvet.graphics.drawRect(0,0,this.width,this.height);
			this.mEvet.graphics.endFill(); 	
			this.mEvet.alpha = 0;
			this.mTopLayer.addChild(this.mEvet);
			// this.mEvet.graphics.
			this.mIsShow = true;
			this.mTimer = new egret.Timer(100,0);
			this.mTimer.addEventListener(egret.TimerEvent.TIMER,this.timeFunc,this);
			// this.mTimer.start();
		}
		public get DrawView():egret.DisplayObjectContainer{
			return this.mDrawLayer;
		}
		public translate(dx:number,dy:number){
			this.mDx = dx;
			this.mDy = dy;
		}
		public save(){
			this.mTempScrollX = this.mScrollX;
			this.mTempScaleX = this.mDrawScaleX;
			this.mTempDx = this.mDx;
			this.mTempDy = this.mDy;
		}
		public restore(){
			this.mScrollX = this.mTempScrollX;
			this.mDrawScaleX = this.mTempScaleX;
			this.mDx = this.mTempDx;
			this.mDy = this.mTempDy;
		}
		public scale(x:number,y:number){
			this.mDrawScaleX = x;
			this.mDrawScaleY = y;
		}
		public drawText(x:number,y:number,text:string,size:number = 12,color:number = 0xFFFFFF):egret.TextField{
			let textLab = new egret.TextField();
			textLab.text = text;
			textLab.x = x * this.mDrawScaleX + this.mDx;
			textLab.y = y * this.mDrawScaleY + this.mDy;
			textLab.textColor = color;
			textLab.size = size;
			this.mTextLayer.addChild(textLab);
			return textLab;
		}
		public drawLine(startX,startY,stopX,stopY,thickness: number = 1, color: number = Color.RED,isBg:boolean = false){
			// console.log("draw line:",startX,startY,stopX,stopY,thickness,color);
			let shape = this.mLineShpe;
			if(isBg){
				shape = this.mBgLineShpe;
			}
			// shape = new egret.Shape();
			shape.graphics.lineStyle(thickness,color);
			shape.graphics.moveTo(startX * this.mDrawScaleX + this.mDx,startY * this.mDrawScaleY + this.mDy);
			shape.graphics.lineTo(stopX * this.mDrawScaleX + this.mDx,stopY * this.mDrawScaleY + this.mDy);
			shape.graphics.endFill();
			if(!isBg)
				this.mDrawLayer.addChild(shape);
			else
				this.mBgLayer.addChild(shape);
		}
		public drawRect(left:number,top:number,right:number,bottom:number,color:number = Color.RED,isBg:boolean = false){
			// console.log("draw rect:",left,top,right,bottom,color);
			let shape = new egret.Shape();
			shape.graphics.beginFill(color,1);
			shape.graphics.drawRect(left * this.mDrawScaleX + this.mDx,top * this.mDrawScaleY + this.mDy,(right - left) * this.mDrawScaleX,(bottom - top) * this.mDrawScaleY);
			shape.graphics.endFill();
			if(!isBg)
				this.mDrawLayer.addChild(shape);
			else
				this.mBgLayer.addChild(shape);
			this.mRectShpes.push(shape);
		}
		public clearView(){
			this.translate(0,0);
			if(this.mLineShpe){
				this.mLineShpe.graphics.clear();
			}
			if(this.mBgLineShpe){
				this.mLineShpe.graphics.clear();
			}
			if(this.mRectShpes.length > 0){
				for(let shape of this.mRectShpes){
					if(shape){
						shape.graphics.clear();
					}
				}
				this.mRectShpes = null;
				this.mRectShpes = new Array<egret.Shape>();
			}
			if(this.mBgLayer){
				this.mBgLayer.removeChildren();
			}
			if(this.mDrawLayer){
				this.mDrawLayer.removeChildren();
			}
			if(this.mTextLayer){
				this.mTextLayer.removeChildren();
			}

		}
 		public scrollTo(x:number){
			if(!this.isScrollEnable){
				return;
			}
			let oldx = this.mScrollX;
			this.mScrollX = x;
			if(this.mScrollX < this.getMinScrollX()){
				this.mScrollX = this.getMinScrollX();
				this.onRightSide();
			}else if(this.mScrollX > this.getMaxScrollX()){
				this.mScrollX = this.getMaxScrollX();
				this.onLeftSide();
			}
			this.onScrollChanged();

		}
		public scaleTo(scale:number){
			if(!this.isScaleEnable){
				return;
			}
			let oldScale = this.mScaleX;
			this.mScaleX = scale;
			if(this.mScaleX < this.getScaleXMin()){
				this.mScaleX = this.getScaleXMin();
			}else if(this.mScaleX > this.getScaleXMax()){
				this.mScaleX = this.getScaleXMax();
			}
			this.onScaleChanged();
		}

		public get isLongPress():boolean{
			return this.mIsLongPress;
		}
		public setScaleEnable(value:boolean){
			this.mScaleEnable = value;
		}
		public setScrollEnable(value:boolean){
			this.mScaleEnable = value;
		}
		public getScrollX():number{
			return this.mScrollX;
		}
		public getScaleX():number{
			return this.mScaleX;
		}
		public setScrollX(scrollX:number){
			this.mScrollX = scrollX;
		}

		protected onTouchBegin(evt:egret.TouchEvent){
			this.mTouch = true;
			this.mStartPoint = new egret.Point(evt.stageX,evt.stageY);

			//手势缩放
			if(this.mTouchPoints[evt.touchPointID] == null){
				this.mTouchPoints[evt.touchPointID] = new egret.Point(evt.stageX,evt.stageY);
				this.mTouchPoints["names"].push(evt.touchPointID);
			}
			this.mTouchCon++ ;
			if(this.mTouchCon == 2){
				this.mDistance = this.getTouchDistance();
			}

			this.mTimer.start();

			this.mMultipleTouch = this.mTouchCon  > 1;
			this.mTouchEvet = evt;
		}

		protected onTouchCancel(evt:egret.TouchEvent){
			// console.log(evt);
			// console.log(evt.stageX);
			this.mIsMove = false;
			this.mTouch = false;
			this.mlastPoint = null;
			this.mMultipleTouch = this.mTouchCon  > 1;
			//手势缩放
			this.mTouchEvet = evt;
			// this.invalidate();
		}
		protected onTouchEnd(evt:egret.TouchEvent){
			this.mTouch = false;
			this.mIsLongPress = false;
			this.mEndPoint = new egret.Point(evt.stageX,evt.stageY);
			this.mIsMove = false;
			this.mlastPoint = null;
			//手势缩放
			delete this.mTouchPoints[evt.touchPointID];
			this.mTouchCon--;
			if(this.mTouchCon < 0){
				this.mTouchCon = 0;
			}
			if(!this.mIsMove){
				this.mTimer.stop();
				this.mTime = 0;
			}
			this.mMultipleTouch = this.mTouchCon  > 1;
			this.mTouchEvet = evt;
			this.invalidate();
		}
		protected onTouchMove(evt:egret.TouchEvent){
			if(this.mTouchCon == 1 && !this.mIsLongPress){
				let currPoint=  new egret.Point(evt.stageX,evt.stageY);
				if(this.mlastPoint != null){
					let x = currPoint.x - this.mlastPoint.x;
					if(Math.abs(x) > this.mMoveDistance){
						this.scrollTo(this.getScrollX() + x);
						this.invalidate();
						this.mlastPoint = currPoint;
					}
				}
				if(!this.mIsMove){
					this.mlastPoint = currPoint;
					this.mIsMove = true;
					this.mTime = 0;
					this.mTimer.stop();
				}
			}
			if(this.mTouchCon == 1 && this.mIsLongPress){
				this.onLongPress(evt);
			}
			
			//手势缩放
			if(this.mTouchPoints[evt.touchPointID] != null){
				this.mTouchPoints[evt.touchPointID].x = evt.stageX;
				this.mTouchPoints[evt.touchPointID].y = evt.stageY;
			}
			if(this.mTouchCon == 2){
				let newdistance = this.getTouchDistance();
				let scale = newdistance/ this.mDistance;
				this.onScale(scale)
			}
			this.mMultipleTouch = this.mTouchCon  > 1;
			this.mTouchEvet = evt;
		}
		private timeFunc(){
			this.mTime += 1;
			if(this.mTime >= 2){
				if(!this.mIsLongPress)
					this.onLongPress(this.mTouchEvet);
			}
		}
		private getTouchDistance():number{
			let distance:number = 0;
			let names = this.mTouchPoints["names"];
			let p1 = this.mTouchPoints[names[names.length - 1]];
			let p2 = this.mTouchPoints[names[names.length - 2]];
			if(p1 != null && p2 != null){
				distance = egret.Point.distance(p1,p2);
			}
			return distance;
		}
		public onScale(scale:number){
			this.scaleTo(scale);
		}
		
		protected onTouchTap(evt:egret.TouchEvent){
			// console.log(evt);
			// console.log(evt.stageX);
			this.mMultipleTouch = this.mTouchCon  > 1;
			this.mTouchEvet = evt;
		}
		public onLongPress(evt:egret.TouchEvent){
			this.mIsLongPress = true;
		}
		public isTouch():boolean{
			return this.mTouch;
		}
		public isMultipleTouch():boolean{
			return this.mMultipleTouch;
		}
		public getScaleXMax():number{
			return this.mScaleMax;
		}
		public getScaleXMin():number{
			return this.mScaleMin;
		}
		public isScrollEnable():boolean{
			return this.mScrollEnable;
		}
		public isScaleEnable():boolean{
			return this.mScaleEnable;
		}
		public setScaleXMax(value:number){
			this.mScaleMax = value;
		}
		public setScaleXMin(value:number){
			this.mScaleMin = value;
		}
		public setMoveDistance(value:number){
			this.mMoveDistance = value;
		}
		
		abstract onLeftSide():void;
		abstract onRightSide():void;
		abstract invalidate():void;
		abstract getMinScrollX():number;
		abstract getMaxScrollX():number;
		abstract onScrollChanged():void;
		abstract onScaleChanged():void;
	}
}