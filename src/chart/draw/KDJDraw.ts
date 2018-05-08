/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export class KDJDraw implements IChartDraw<IKDJ> {
		private mView:BaseKChartView;
		private mKColor:number;
		private mDColor:number;
		private mJColor:number;
		private mTextSize:number = 12;
		private mLineWidth:number = 1;
		public constructor(view:BaseKChartView) {
			this.mView = view;
		}
		drawTranslated(lastPoint:IKDJ,curPoint:IKDJ,lastX:number,curX:number,postion:any){
			this.mView.drawChildLine(lastX,lastPoint.getK(),curX,curPoint.getK(),this.mLineWidth,this.mKColor);
			this.mView.drawChildLine(lastX,lastPoint.getD(),curX,curPoint.getD(),this.mLineWidth,this.mDColor);
			this.mView.drawChildLine(lastX,lastPoint.getJ(),curX,curPoint.getJ(),this.mLineWidth,this.mJColor);
		}
		drawText(postion:any,x:number,y:number){
			let text = "";
			let point:IKDJ = this.mView.getItem(postion);
			text = "K:"+this.mView.formatValue(point.getK())+ " ";
			let lab = this.mView.drawText(x,y,text,this.mTextSize,this.mKColor);
			x += lab.width;
			text = "D:" + this.mView.formatValue(point.getD())+ " ";
			lab = this.mView.drawText(x,y,text,this.mTextSize,this.mDColor);
			x += lab.width;
			text = "J:" + this.mView.formatValue(point.getJ())+ " ";
			this.mView.drawText(x,y,text,this.mTextSize,this.mJColor);
		}
		getMaxValue(point:IKDJ):number{
			return Math.max(point.getK(),Math.max(point.getD(),point.getJ()));
		}
		getMinValue(point:IKDJ):number{
			return Math.min(point.getK(),Math.min(point.getD(),point.getJ()));
		}
		getValueFormatter():IValueFormatter{
			return new ValueFormatter();
		}
		public setKColor(color:number){
			this.mKColor = color;
		}
		public setDColor(color:number){
			this.mDColor = color;
		}
		public setJColor(color:number){
			this.mJColor = color;
		}
		public setTextSize(size:number){
			this.mTextSize = size;
		}
		public setLineWidth(width:number){
			this.mLineWidth = width;
		}
	}
}