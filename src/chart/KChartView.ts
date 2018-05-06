namespace chart{
	export class KChartView extends BaseKChartView {
		private isRefreshing:boolean = false;
		private isLoadMoreEnd:boolean = false;
		private mLastScrollEnable:boolean;
		private mLastScaleEnable:boolean;

		private mBOLLDraw:BOLLDraw;
		private mMainDraw:MainDraw;
		private mMACDDraw:MACDDraw;
		private mKDJDraw:KDJDraw;
		private mVolumeDarw:VolumeDraw;
		private mRSIDraw:RSIDraw;

		public constructor() {
			super();
			this.initView();
		}
		private initView(){
			this.mMainDraw = new MainDraw(this);
			this.mBOLLDraw = new BOLLDraw(this);
			this.mMACDDraw = new MACDDraw(this);
			this.mKDJDraw = new KDJDraw(this);
			this.mVolumeDarw = new VolumeDraw(this);
			this.mRSIDraw = new RSIDraw(this);

			this.setMainDraw(this.mMainDraw);
			this.addChildDraw("VOL",this.mVolumeDarw);
			this.addChildDraw("BOLL",this.mBOLLDraw);
			this.addChildDraw("MACD",this.mMACDDraw);
			this.addChildDraw("KDJ",this.mKDJDraw);
			this.addChildDraw("RSI",this.mRSIDraw);

			this.setPointWidth(18);
			this.setTextSize(12);
			this.setTextColor(Color.TEXT);
			this.setLineWidth(1);
			this.setBackgroundColor(Color.BACK_GROUND);
			this.setGridLineWidth(1);
			this.setGridLineColor(Color.GRID_LINE);
			//RSI
			this.setRsi1Color(Color.MA5);
			this.setRsi2Color(Color.MA10);
			this.setRsi3Color(Color.MA20);
			//kdj
			this.setKColor(Color.MA5);
			this.setDColor(Color.MA10);
			this.setJColor(Color.MA20);
			//macd
			this.setMACDWidth(8);
			this.setDIFColor(Color.MA5);
			this.setDEAColor(Color.MA10);
			this.setMACDColor(Color.MA20);
			//boll
			this.setUpColor(Color.MA5);
			this.setMbColor(Color.MA10);
			this.setDnColor(Color.MA20);
			//main
			this.setMa5Color(Color.MA5);
			this.setMa10Color(Color.MA10);
			this.setMa20Color(Color.MA20);
			
			this.setCandleWidth(12);
			this.setCandleLineWidth(3);
			this.setCandleSolid(true);
			this.mKChartTabView.dataProvider = new eui.ArrayCollection(this.mTabNames);
			this.mKChartTabView.itemRenderer = TabView;
			this.mKChartTabView.selectedItem = 0;
			this.setChildDraw(0);


		}
		public setRsi1Color(color:number){
			this.mRSIDraw.setRsi1Color(color);
		}
		public setRsi2Color(color:number){
			this.mRSIDraw.setRsi2Color(color);
		}
		public setRsi3Color(color:number){
			this.mRSIDraw.setRsi3Color(color);
		}
		public setKColor(color:number){
			this.mKDJDraw.setKColor(color);
		}
		public setDColor(color:number){
			this.mKDJDraw.setDColor(color);
		}
		public setJColor(color:number){
			this.mKDJDraw.setJColor(color);
		}
		public setDIFColor(color:number){
			this.mMACDDraw.setDIFColor(color);
		}
		public setDEAColor(color:number){
			this.mMACDDraw.setDEAColor(color);
		}
		public setMACDWidth(width:number){	
			this.mMACDDraw.setMACDWidth(width);
		}
		public setMACDColor(color:number){
			this.mMACDDraw.setMACDColor(color);
		}
		public setUpColor(color:number){
			this.mBOLLDraw.setUpColor(color);
		}
		public setMbColor(color:number){
			this.mBOLLDraw.setMbColor(color);
		}
		public setDnColor(color:number){
			this.mBOLLDraw.setDnColor(color);
		}
		public refreshComplete(){
			this.isRefreshing = false;
		}
		public refreshEnd(){
			this.isLoadMoreEnd = true;
			this.isRefreshing = false;
		}
		public resetLoadMoreEnd(){
			this.isLoadMoreEnd = false;
		}
		public setMa5Color(color:number){
			this.mMainDraw.setMa5Color(color);
			this.mVolumeDarw.setMa5Color(color);
		}
		public setMa10Color(color:number){
			this.mMainDraw.setMa10Color(color);
			this.mVolumeDarw.setMa10Color(color);
		}
		public setMa20Color(color:number){
			this.mMainDraw.setMa20Color(color);
		}
		public setTextColor(color:number){
			super.setTextColor(color);
			this.mMainDraw.setSelectorTextColor(color);
			
		}
		public setTextSize(size:number){
			super.setTextSize(size);
			this.mBOLLDraw.setTextSize(size);
			this.mMainDraw.setTextSize(size);
			this.mMACDDraw.setTextSize(size);
			this.mKDJDraw.setTextSize(size);
			this.mVolumeDarw.setTextSize(size);
			this.mRSIDraw.setTextSize(size);
		}
		public setLineWidth(pix:number){
			super.setLineWidth(pix);
			this.mMainDraw.setLineWidth(pix);
			this.mBOLLDraw.setLineWidth(pix);
			this.mMACDDraw.setLineWidth(pix);
			this.mKDJDraw.setLineWidth(pix);
			this.mVolumeDarw.setLineWidth(pix);
			this.mRSIDraw.setLineWidth(pix);
		}
		public setCandleWidth(candleWidth:number){
			this.mMainDraw.setCandleWidth(candleWidth);
		}
		public setCandleLineWidth(lineWidth:number){
			this.mMainDraw.setCandleLineWidth(lineWidth);
		}
		public setCandleSolid(candleSolid:boolean){
			this.mMainDraw.setCandleSolid(candleSolid);
		}
		public onLeftSide():void{

		}
		public onRightSide():void{

		}
		public onScrollChanged():void{
			this.setTranslateXFromScrollX(this.mScrollX);
		}
		public onScaleChanged():void{
			this.checkAndFixScrollX();
			this.setTranslateXFromScrollX(this.mScrollX);
		}

	}
}