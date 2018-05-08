/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export interface IChartDraw<T> {
		drawTranslated(lastPoint:T,curPoint:T,lastX:number,curX:number,postion:any);
		drawText(postion:any,x:number,y:number);
		getMaxValue(point:T):number;
		getMinValue(point:T):number;
		getValueFormatter():IValueFormatter;
	}
}