class KLineEntity implements Chart.IKLine {
	public Date:string;
	public Open:number;
	public High:number;
	public Low:number;
	public Close:number;
	public Volume:number;

    public MA5Price:number;

    public MA10Price:number;

    public MA20Price:number;

    public dea:number;

    public dif:number;

    public macd:number;

    public k:number;

    public d:number;

    public j:number;

    public rsi1:number;

    public rsi2:number;

    public rsi3:number;

    public up:number;

    public mb:number;

    public dn:number;

    public MA5Volume:number;

    public MA10Volume:number;


	public constructor(){
	}

	public pase(data:any){
		this.Date = data.Date;
		this.Open = Number(data.Open);
		this.High = Number(data.High);
		this.Low = Number(data.Low);
		this.Close = Number(data.Close);
		this.Volume =Number(data.Volume);
	}
	
	public getDatetime():string{
        return this.Date;
    }
    public getOpenPrice():number {
        return this.Open;
    }

    public getHighPrice():number {
        return this.High;
    }

    
    public getLowPrice():number {
        return this.Low;
    }

    
    public getClosePrice():number{
        return this.Close;
    }

    
    public getMA5Price():number{
        return this.MA5Price;
    }

    
    public getMA10Price():number{
        return this.MA10Price;
    }

    
    public getMA20Price():number{
        return this.MA20Price;
    }

    
    public getDea():number{
        return this.dea;
    }

    
    public getDif():number{
        return this.dif;
    }

    
    public getMacd():number{
        return this.macd;
    }

    
    public getK():number{
        return this.k;
    }

    
    public getD():number{
        return this.d;
    }

    
    public getJ():number{
        return this.j;
    }

    
    public getRsi1():number{
        return this.rsi1;
    }

    
    public getRsi2():number{
        return this.rsi2;
    }

    
    public getRsi3():number{
        return this.rsi3;
    }

    
    public getUp():number{
        return this.up;
    }

    
    public getMb():number{
        return this.mb;
    }

    
    public getDn():number{
        return this.dn;
    }

    
    public getVolume():number{
        return this.Volume;
    }

    
    public getMA5Volume():number{
        return this.MA5Volume;
    }

    
    public getMA10Volume():number{
        return this.MA10Volume;
    }
}