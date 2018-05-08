/**
 * created by skw 2018/5/8
 * 281431280@qq.com
 */
namespace Chart{
	export class Rect {
		public left;
		public top;
		public right;
		public bottom;
		public constructor(left:number,top:number,right:number,bottom:number) {
			this.left = left;
			this.top =  top;
			this.right = right;
			this.bottom = bottom;
		}
		public height():number{
			return this.bottom - this.top;
		}
		public width():number{
			return this.right - this.left;
		}
	}
}