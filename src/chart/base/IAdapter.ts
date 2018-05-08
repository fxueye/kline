/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export interface IAdapter {
		getCount():number;
		getItem(position:number):any;
		getDate(position:number):Date;
		registerDataSetObserver(observer:any):void;
		unregisterDataSetObserver(observer:any):void;
		notifyDataSetChanged();
	}
}