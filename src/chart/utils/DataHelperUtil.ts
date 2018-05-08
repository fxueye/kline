namespace Chart{
	export class DataHelperUtil {
		public constructor() {
		}
		public static calculate(datas:Array<KLineEntity>){
			this.calculateMA(datas);
			this.calculateBOLL(datas);
			this.calculateMACD(datas);
			this.calculateKDJ(datas);
			this.calculateVolumeMA(datas);
			this.calculateRSI(datas);
		}
		public static calculateRSI(datas:Array<KLineEntity>){
			let rsi1 = 0;
			let rsi2 = 0;
			let rsi3 = 0;
			let rsi1ABSEma = 0;
			let rsi2ABSEma = 0;
			let rsi3ABSEma = 0;
			let rsi1MaxEma = 0;
			let rsi2MaxEma = 0;
			let rsi3MaxEma = 0;
			for(var i = 0; i < datas.length; i++){
				let point:KLineEntity = datas[i];
				const closePrice = datas[i].getClosePrice();
				if(i == 0){
					rsi1 = 0;
					rsi2 = 0;
					rsi3 = 0;
					rsi1ABSEma = 0;
					rsi2ABSEma = 0;
					rsi3ABSEma = 0;
					rsi1MaxEma = 0;
					rsi2MaxEma = 0;
					rsi3MaxEma = 0;
				}else{
					let Rmax = Math.max(0,closePrice - datas[i - 1].getClosePrice());
					let RAbs = Math.abs(closePrice - datas[i - 1].getClosePrice());
					rsi1MaxEma = (Rmax + (6 - 1) * rsi1MaxEma) / 6;
					rsi1ABSEma = (RAbs + (6 - 1) * rsi1ABSEma) / 6;

					rsi2MaxEma = (Rmax + (12 -1) * rsi2MaxEma) / 12;
					rsi2ABSEma = (RAbs + (12 -1) * rsi2ABSEma) / 12;

					rsi3MaxEma = (Rmax + (24 - 1) * rsi3MaxEma) / 24;
					rsi3ABSEma = (RAbs + (24 - 1) * rsi3ABSEma) / 24;
					rsi1 = (rsi1MaxEma / rsi1ABSEma) * 100;
					rsi2 = (rsi2MaxEma / rsi2ABSEma) * 100;
					rsi3 = (rsi3MaxEma / rsi3ABSEma) * 100;
				}
				point.rsi1 = rsi1;
				point.rsi2 = rsi2;
				point.rsi3 = rsi3;
			}

		}
		public static calculateVolumeMA(datas:Array<KLineEntity>){
			let volumeMa5 = 0;
			let volumeMa10 = 0;
			for(var i = 0;i < datas.length; i++){
				let point:KLineEntity = datas[i];
				volumeMa5 += point.getVolume();
				volumeMa10 += point.getVolume();
				if(i >= 5){
					volumeMa5 -= datas[i - 5].getVolume();
					point.MA5Volume = (volumeMa5 / 5);
				}else{
					point.MA5Volume = (volumeMa5 / (i + 1));
				}
				if(i >= 10){
					volumeMa10 -= datas[i - 10].getVolume();
					point.MA10Volume = (volumeMa10 / 10);
				}else{
					point.MA10Volume = (volumeMa10 / (i + 1));
				}
			}
		}
		//kdj
		public static calculateKDJ(datas:Array<KLineEntity>){
			let k = 0;
			let d = 0;
			for(var i = 0; i < datas.length;i++){
				let point:KLineEntity = datas[i];
				const closePrice = point.getClosePrice();
				let startIndex = i - 8;
				if(startIndex < 0){
					startIndex = 0;
				}
				let max9 = Number.MIN_VALUE;
				let min9 = Number.MAX_VALUE;
				for(var index = startIndex; index <= i; index++){
					let data = datas[index];
					max9 = Math.max(max9,data.getHighPrice());
					min9 = Math.min(min9,data.getLowPrice());
				}
				let rsv = 100 * (closePrice - min9)/(max9 - min9);
				if(i == 0){
					k = rsv;
					d = rsv;
				}else{
					k = (rsv + 2 * k)/3;
					d = (k + 2 * d)/3;
				}
				point.k = k;
				point.d = d;
				point.j = 3 * k - 2 * d;
			}
		}
		//macd
		public static calculateMACD(datas:Array<KLineEntity>){
			let ema12 = 0;
			let ema26 = 0;
			let dif = 0;
			let dea = 0;
			let macd = 0;
			for(var i = 0; i < datas.length; i++){
				let point:KLineEntity  = datas[i];
				const closePrice = point.getClosePrice();
				if(i == 0){
					ema12 = closePrice;
					ema26 = closePrice;
				}else{
					//                EMA（12） = 前一日EMA（12） X 11/13 + 今日收盘价 X 2/13
					//                EMA（26） = 前一日EMA（26） X 25/27 + 今日收盘价 X 2/27
					ema12 = ema12 * 11/13 + closePrice * 2/13;
					ema26 = ema26 * 25/27 + closePrice * 2/27;
				}
				//            DIF = EMA（12） - EMA（26） 。
				//            今日DEA = （前一日DEA X 8/10 + 今日DIF X 2/10）
				//            用（DIF-DEA）*2即为MACD柱状图。
				dif = ema12 - ema26;
				dea = dea * 8 / 10 + dif * 2/10;
				macd = (dif - dea) * 2;
				point.dif = dif;
				point.dea = dea;
				point.macd = macd;
			}
		}
		//ma
		public static calculateMA(datas:Array<KLineEntity>){
			let ma5 = 0;
			let ma10 = 0;
			let ma20 = 0;
			for(var i = 0; i < datas.length;i++){
				var point = datas[i];
				const closePrice = point.getClosePrice();
				ma5 += closePrice;
				ma10 += closePrice;
				ma20 += closePrice;
				if(i >= 5){
					ma5 -= datas[i - 5].getClosePrice();
					point.MA5Price = ma5/5;
				}else{
					point.MA5Price = ma5/(i + 1);
				}
				if(i >= 10){
					ma10 -= datas[i - 10].getClosePrice();
					point.MA10Price = ma10 / 10;
				}else{
					point.MA10Price = ma10/( i + 1);
				}
				if(i >= 20){
					ma20 -= datas[i - 20].getClosePrice();
					point.MA20Price = ma20 / 20;
				}else{
					point.MA20Price = ma20 / (i + 1);
				}
			}


		}
		//布林
		public static calculateBOLL(datas:Array<KLineEntity>){
			for(var i  = 0; i < datas.length; i++){
				var point = datas[i];
				// console.log(point);
				var closePrice = point.getClosePrice();
				if(i == 0){
					point.mb = closePrice;
					point.up = 0;
					point.dn = 0;
				}else{
					var n = 20;
					if(i < 20){
						n = i + 1;
					}
					var md = 0;
					for(var j = i - n + 1; j <= i; j++){
						var c = datas[j].getClosePrice();
						var m = point.getMA20Price();
						var value = c - m;
						md += value * value;
					}
					md = md / (n - 1 );
					md = Math.sqrt(md);
					point.mb = point.getMA20Price();
					point.up = point.mb + 2 * md;
					point.dn = point.mb - 2 * md;
				}
			}
		}
	}

}