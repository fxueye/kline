//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }
    private mdatas:Array<Chart.IMinuteLine>;
    private minuteChartView:Chart.MinuteChartView;
    private minuteChartView2:Chart.MinuteChartView;
    private textfield: egret.TextField;
    private mTimer:egret.Timer;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        
        // var chartView:Chart.KChartView = new Chart.KChartView();
        // var adapter = new KChartAdapter();
        // var datas:Array<KLineEntity> = new Array<KLineEntity>();
        // var jsonArr = RES.getRes("ibm_json");
        // for(var js of jsonArr){
        //    let data:KLineEntity = new KLineEntity();
        //    data.pase(js);
        //    datas.push(data);
        // }
        // Chart.DataHelperUtil.calculate(datas);
        // adapter.addFooterData(datas);
        // chartView.setAdapter(adapter);
        // chartView.setDateTimeFormatter(new Chart.DateFormatter());
        // chartView.setGridRows(4);
        // chartView.setGridColumns(4);
        // chartView.setTabViewWidth(25);

        // chartView.width = this.width;
        // chartView.height = this.height/2;
        // chartView.y = this.height / 2;
        // this.addChild(chartView);

        // this.minuteChartView = new Chart.MinuteChartView();
        // this.minuteChartView2 = new Chart.MinuteChartView();
        // this.minuteChartView.setVolumeHeight(100);
        // this.minuteChartView2.setVolumeHeight(100);
        // this.minuteChartView.width = this.width / 2 ;
        // this.minuteChartView.height = this.height / 2;

        // this.minuteChartView2.width = this.width / 2;
        // this.minuteChartView2.height = this.height / 2;

        // this.minuteChartView2.x = this.width / 2;



        // let startTime = new Date("1970-01-01 09:30");
        // let endTime = new Date("1970-01-01 15:00");
        // let firstEndTime = new Date("1970-01-01 11:30");
        // let secondStartTime = new Date("1970-01-01 13:00");
        // this.mdatas = this.getMinuteData(startTime,endTime,firstEndTime,secondStartTime);
        // let ds2 = new Array<Chart.IMinuteLine>();
        // for(var i = 0 ; i < this.mdatas.length; i++){
        //     ds2.push(this.mdatas[this.mdatas.length - i - 1]);
        // }
        // let ds = new Array<Chart.IMinuteLine>();
        // this.mTimer = new egret.Timer(500,0);
        // this.mTimer.addEventListener(egret.TimerEvent.TIMER,this.timeFunc,this);
        // this.mTimer.start();
        // let yesClosePrice = this.mdatas[0].getPrice() - 0.5 + Math.random();
        // this.minuteChartView2.initData(ds2,startTime,endTime,firstEndTime,secondStartTime,yesClosePrice)
        // this.minuteChartView.initData(ds,startTime,endTime,firstEndTime,secondStartTime,yesClosePrice);
        // this.addChild(this.minuteChartView);
        // this.addChild(this.minuteChartView2);

    }
    public timeFunc(){
        if(this.mdatas.length == 0){
            this.mTimer.stop();
            return;
        }
        this.minuteChartView.addPoint(this.mdatas.pop());
    }
    private getMinuteData(startTime:Date,endTime:Date,firstEndTime:Date,secondStartTime:Date):Array<Chart.IMinuteLine>{
        let datas:Array<MinuteLineEntity>  = Array<MinuteLineEntity>();
        let startDate = startTime.getTime();
        if(firstEndTime == null && secondStartTime == null){
            while(startDate <=  endTime.getTime()){
                let data:MinuteLineEntity = new MinuteLineEntity();
                data.time = new Date(startDate);
                startDate += 60000;
                datas.unshift(data);
            }
        }else{
            while(startDate <= firstEndTime.getTime()){
                let data:MinuteLineEntity = new MinuteLineEntity();
                data.time = new Date(startDate);
                startDate += 60000;
                datas.unshift(data);
            }
            startDate = secondStartTime.getTime();
            while(startDate <= endTime.getTime()){
                let data:MinuteLineEntity = new MinuteLineEntity();
                data.time = new Date(startDate);
                startDate += 60000;
                datas.unshift(data);
            }
        }
        this.randomLine(datas);
        this.randomVolume(datas);
        let sum = 0;
        for(var i = 0; i < datas.length;i++){
            let data:MinuteLineEntity = datas[i];
            sum+= data.price;
            data.avg = sum/(i+1);
        }
        return datas;
    }
    private randomLine(datas:Array<MinuteLineEntity>){
        let STEP_MAX = 0.9;
        let STEP_CHANGE = 1;
        let HEIGHT_MAX = 200;
        let height = (Math.random() * HEIGHT_MAX);
        let slope = (Math.random() * 2 - STEP_MAX);
        for(var i = 0; i < datas.length;i++){
            height += slope;
            slope += (Math.random() * STEP_CHANGE) * 2 - STEP_MAX;
            if(slope > STEP_MAX){
                slope = STEP_MAX;
            }
            if(slope < -STEP_MAX){
                slope = -STEP_MAX;
            }
            if(height > HEIGHT_MAX){
                height = HEIGHT_MAX;
                slope *= -1;
            }
            if(height > 0){
                height = 0;
                slope *= -1;
            }
            datas[i].price = height + 1000;
        }
    }
    private randomVolume(datas:Array<MinuteLineEntity>){
        for(var data of datas){
            data.volume = Math.floor(Math.random() * Math.random() * Math.random() * Math.random() * 10000000);
        }
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
    }

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }
}
