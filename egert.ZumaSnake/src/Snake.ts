class Snake extends egret.Sprite{
	//蛇身数组
	public BodyList: BodyPoint[];
	//蛇身半径
	public radius: number;
	//蛇头
	public Head: BodyPoint;
	//累计食物计数数组
	public ColorCount: Object;
	//蛇的速度
	public speed: number;
	//加速计时器
	public AccelerateTimer: egret.Timer;
	//加速累计时间
	public count: number;
	//插入时用来判断是否没有插入过
	public bool:boolean;

	public id: String;

	public playercode: string;

	public SnakeName: egret.TextField;
	
	public constructor() {
		super();
		this.BodyList = [];
		this.speed = 30*0.5;
		this.ColorCount = {};
		this.count = 0;
		this.bool = true;
		this.radius = 10;
	}
	//本地蛇生成
	/**
	 * r 蛇身半径
	 * bodypoint 蛇身信息
	 */
	public Create(bodypointInfo) {
		this.id = bodypointInfo.id;
		this.playercode = bodypointInfo.code;
		let headcolor: Color = new Color();
		headcolor.Origin = headcolor.OriginColor[bodypointInfo.body[0].color];
		headcolor.Bright = headcolor.BrightColor[bodypointInfo.body[0].color];
		this.Head = new BodyPoint();
		this.Head.Create(this.radius, headcolor, true);
		this.bool = true;
		this.SnakeName = new egret.TextField();
		this.SnakeName.size = 15;
		this.SnakeName.text = this.playercode;
		this.SnakeName.textColor = 0x000000;
		this.SnakeName.height = 15;
		this.SnakeName.textAlign = egret.HorizontalAlign.LEFT;


		//设置坐标
		this.Head.x = this.radius;
		this.Head.y = this.radius;
		this.Head.id = bodypointInfo.body[0].id;
		this.SnakeName.anchorOffsetX = this.SnakeName.width/2;
		this.SnakeName.x = this.Head.x;
		this.SnakeName.y = this.Head.y - 30;
		this.x = bodypointInfo.x;
		this.y = bodypointInfo.y;

		//加入数组
		this.BodyList.push(this.Head);
		this.Head.scaleX = 0.01;
		this.Head.scaleY = 0.01;
		let animate: egret.Tween = egret.Tween.get(this.Head);
		this.addChild(this.Head);
		animate.to({scaleX: 1.0, scaleY: 1.0},300);
		this.setChildIndex(this.Head, -999);
		this.addChild(this.SnakeName);
		this.setChildIndex(this.SnakeName, -999);

		for (var i = 1; i < bodypointInfo.body.length; i++) {
			let bodycolor: Color = new Color();
			bodycolor.Origin = headcolor.OriginColor[bodypointInfo.body[i].color];
			bodycolor.Bright = headcolor.BrightColor[bodypointInfo.body[i].color];
			let bodypoint: BodyPoint = new BodyPoint();
			bodypoint.Create(this.radius, bodycolor, false);
			bodypoint.x = this.radius;
			bodypoint.y = this.radius;
			bodypoint.id = bodypointInfo.body[i].id;
			this.BodyList.push(bodypoint);
			bodypoint.x = 0.01;
			bodypoint.y = 0.01;
			animate = egret.Tween.get(bodypoint);
			this.addChild(bodypoint);
			animate.to({scaleX: 1.0, scaleY: 1.0},300);
			this.setChildIndex(bodypoint, 0);
		}
	}


	public Move(e: egret.TouchEvent, BGX, BGY, BW, BH, interval: number) {
		let mouseX = e.stageX - BGX;
		let mouseY = e.stageY - BGY;
		let animate: egret.Tween;
		let headX = this.x + this.BodyList[0].x;
		let headY = this.y + this.BodyList[0].y;
		animate = egret.Tween.get(this.BodyList[0]);

		let length = Math.sqrt((mouseX - headX)*(mouseX - headX) + (mouseY - headY)*(mouseY - headY));
		let VectorX = (mouseX - headX)/length;
		let VectorY = (mouseY - headY)/length;

		if (VectorX*length*VectorX*length+VectorY*length*VectorY*length<=this.speed*this.speed) return null;

		let NextX = this.BodyList[0].x + this.speed * VectorX;
		let NextY = this.BodyList[0].y + this.speed * VectorY;
		let target;
		target = {x: NextX, y: NextY};
		if (NextX + this.x - this.radius <= 0 || NextX + this.x + this.radius >= BW || NextY + this.y - this.radius <= 0 || NextY + this.y + this.radius >= BH) return null;
		animate.to({x: NextX, y: NextY}, interval);

		let NameAnimate = egret.Tween.get(this.SnakeName);
		NameAnimate.to({x: NextX, y: NextY - 30}, interval);

		for (var i = this.BodyList.length - 1; i >= 1; i--) {
			animate = egret.Tween.get(this.BodyList[i]);
			animate.to({x: this.BodyList[i -1].x, y: this.BodyList[i -1].y}, interval);
		}
		
		return target;
	}

	public AfterEat (color_info, id) {
		let node: BodyPoint = new BodyPoint();
		let color = new Color();
		color.Bright = color_info.Bcolor;
		color.Origin = color_info.Ocolor;
		node.Create(this.radius, color, false);
		node.id = id;
		node.x = this.BodyList[this.BodyList.length - 1].x + this.radius;
		node.y = this.BodyList[this.BodyList.length - 1].y + this.radius;
		node.scaleX = 0.01;
		node.scaleY = 0.01;
		this.BodyList.push(node);
		this.addChild(node);
		var animate: egret.Tween = egret.Tween.get(node);
		animate.to({scaleX: 1.0, scaleY: 1.0},500,egret.Ease.circOut);
		this.setChildIndex(this.BodyList[this.BodyList.length - 1],0);
	}

	public ReDraw(x,y,colornum) {
		let headcolor: Color = new Color();
		this.Head.Color.Origin = headcolor.OriginColor[colornum[0]];
		this.Head.Color.Bright = headcolor.BrightColor[colornum[0]];
		this.Head.bodypoint.graphics.clear();
		this.Head.bodypoint.graphics.lineStyle(4,0x000000);
		this.Head.bodypoint.graphics.beginFill(this.BodyList[0].Color.Origin);
		this.Head.bodypoint.graphics.drawCircle(0,0,this.radius);
		egret.Tween.removeTweens(this.Head);
		this.Head.x = x - this.x;
		this.Head.y = y - this.y;
		this.Head.scaleX = 0.01;
		this.Head.scaleY = 0.01;
		let animate: egret.Tween = egret.Tween.get(this.Head);
		this.addChild(this.Head);
		animate.to({scaleX: 1.0, scaleY: 1.0},300);
		
		this.addChild(this.Head);
		egret.Tween.removeTweens(this.SnakeName);
		this.SnakeName.x = this.Head.x;
		this.SnakeName.y = this.Head.y - 30;
		this.addChild(this.SnakeName);
		this.setChildIndex(this.SnakeName, -999);
		for(var i = 1; i<this.BodyList.length; i++) {
			let bodycolor: Color = new Color();
			this.BodyList[i].Color.Origin = bodycolor.OriginColor[colornum[i]];
			this.BodyList[i].Color.Bright = bodycolor.BrightColor[colornum[i]];
			this.BodyList[i].bodypoint.graphics.clear();
			this.BodyList[i].bodypoint.graphics.lineStyle(4,this.BodyList[i].Color.Bright);
			this.BodyList[i].bodypoint.graphics.beginFill(this.BodyList[i].Color.Origin);
			this.BodyList[i].bodypoint.graphics.drawCircle(0,0,this.radius);
			egret.Tween.removeTweens(this.BodyList[i]);
			this.BodyList[i].x = x - this.x;
			this.BodyList[i].y = y - this.y;
			this.BodyList[i].scaleX = 0.01;
			this.BodyList[i].scaleY = 0.01;
			animate = egret.Tween.get(this.BodyList[i]);
			this.addChild(this.BodyList[i]);
			animate.to({scaleX: 1.0, scaleY: 1.0},300);
			this.setChildIndex(this.BodyList[i],0);
		}
		this.bool = true;
	}

	public CreatOther(info: any) {
		this.id = info.id;
		this.playercode = info.code;
		this.Head = new BodyPoint();
		let headcolor: Color = new Color();
		headcolor.Origin = headcolor.OriginColor[info.body[0].color];
		headcolor.Bright = headcolor.BrightColor[info.body[0].color];
		this.Head.Create(this.radius, headcolor, true);
		this.Head.x = this.radius;
		this.Head.y = this.radius;
		this.Head.id = info.body[0].id;
		this.SnakeName = new egret.TextField();
		this.SnakeName.size = 15;
		this.SnakeName.text = this.playercode;
		this.SnakeName.textColor = 0x000000;
		this.SnakeName.height = 15;
		this.SnakeName.textAlign = egret.HorizontalAlign.LEFT;
		this.SnakeName.anchorOffsetX = this.SnakeName.width/2;
		this.SnakeName.x = this.Head.x;
		this.SnakeName.y = this.Head.y - 30;
		this.addChild(this.SnakeName);
		this.setChildIndex(this.SnakeName, -999);
		this.x = info.x;
		this.y = info.y;
		this.BodyList.push(this.Head);
		this.Head.scaleX = 0.01;
		this.Head.scaleY = 0.01;
		let animate: egret.Tween = egret.Tween.get(this.Head);
		this.addChild(this.Head);
		animate.to({scaleX: 1.0, scaleY: 1.0},300);
		this.setChildIndex(this.Head, -999);

		for(var i = 1; i < info.body.length; i++) {
			let bodypoint: BodyPoint = new BodyPoint();
			let bodycolor: Color = new Color();
			bodycolor.Origin = bodycolor.OriginColor[info.body[i].color];
			bodycolor.Bright = bodycolor.BrightColor[info.body[i].color];
			bodypoint.Create(this.radius, bodycolor, false);
			bodypoint.x = info.body[i].x;
			bodypoint.y = info.body[i].y;
			bodypoint.id = info.body[i].id;
			this.BodyList.push(bodypoint);
			bodypoint.scaleX = 0.01;
			bodypoint.scaleY = 0.01;
			animate = egret.Tween.get(bodypoint);
			this.addChild(bodypoint);
			animate.to({scaleX: 1.0, scaleY: 1.0},300);
			this.setChildIndex(bodypoint, 0);
		}
	}


	public OtherMove(info: any, interval) {
		for(var i = 0; i < Math.min(info.body.length, this.BodyList.length); i++) {
			let animate: egret.Tween = egret.Tween.get(this.BodyList[i]);
			animate.to({x: info.body[i].x, y: info.body[i].y},interval);
			let NameAnimate = egret.Tween.get(this.SnakeName);
			NameAnimate.to({x: info.body[0].x, y: info.body[0].y - 30}, interval);
		}
	}

	public OtherAddPoint (x: number, y: number, Ocolor: number, Bcolor: number) {
		let node: BodyPoint = new BodyPoint();
		let nodecolor = new Color();
		nodecolor.Bright = Bcolor;
		nodecolor.Origin = Ocolor;
		node.Create(this.radius, nodecolor, false);
		node.x = x - this.x;
		node.y = y - this.y;
		node.scaleX = 0.01;
		node.scaleY = 0.01;
		this.BodyList.push(node);
		this.addChild(node);
		var animate: egret.Tween = egret.Tween.get(node);
		animate.to({scaleX: 1.0, scaleY: 1.0},500,egret.Ease.circOut);
		this.setChildIndex(this.BodyList[this.BodyList.length - 1],0);
	}

	public RemoveSnake() {
		this.BodyList.forEach(bodypoint => {
			let animate = egret.Tween.get(bodypoint);
			animate.to({scaleX: 0.01, scaleY: 0.01}, 300);
		});
	}

	/**
	 * 添加新节点
	 * id: 插入球的id, pos: 插入位置, x: 插入球x坐标, y: 插入球y坐标, Bcolor:插入球浅色, Ocolor: 插入球深色
	 */
	public addSinglePoint(head: BodyPoint, pos: number, x: number, y: number, Bcolor: number, Ocolor: number) {
		let pointColor = new Color();
		pointColor.Bright = Bcolor;
		pointColor.Origin = Ocolor;
		head.bodypoint.graphics.clear();
		head.bodypoint.graphics.lineStyle(4, Bcolor);
		head.bodypoint.graphics.beginFill(Ocolor);
		head.bodypoint.graphics.drawCircle(0,0,this.radius);
		head.bodypoint.graphics.endFill();
		egret.Tween.removeTweens(head);
		head.x = x - this.x;
		head.y = y - this.y;
		
		if(pos <= this.BodyList.length - 1) {
			let index = this.getChildIndex(this.BodyList[pos - 1]);
        	this.addChildAt(head, index);
			this.BodyList.splice(pos, 0, head);
		}
		else {
			let index = this.getChildIndex(this.BodyList[pos - 1]);
        	this.addChildAt(head, index);
			this.BodyList.push(head);
		}
	}



	/**
	 * 蛇身消除判断
	 * pos: 插入位置（检测起点）, size: 蛇身长度
	 */
	public ZumaRemove(pos, size) {
		let infors;
		infors = new Object();
		let head = pos;
		let last = pos;
		let FlagColor;
		if(pos === this.BodyList.length) pos--;
		head = pos;
		FlagColor = this.BodyList[pos].Color.Origin;
		console.log(head);
		while (this.BodyList[head].Color.Origin === FlagColor && head) head--;
		if(head || this.BodyList[head].Color.Origin !== FlagColor) head++;
		if (head < 2) head = 2;
		if(last < size) {
			while(this.BodyList[last].Color.Origin === FlagColor && last < size) {
				last++; 
				if(last === size) break;
			}
		}
		
		if(last - head > 2) {
			for(var i = head; i < last; i++) {
				this.removeChild(this.BodyList[i]);
			}
			this.BodyList.splice(head, last - head);
			infors.size = size + head - last;
			infors.head = head;
			infors.last = last;
			infors.judge = 1;
			return infors;
		}
		else {
			infors.head = head;
			infors.last = last;
			infors.judge = 0;
			return infors;
		}
	}

	public otherZumaRemove(head, last) {
		if(last - head > 2) {
			let snake = this;
			for(var i = head; i < last; i++) {
				this.removeChild(this.BodyList[i]);
			}
			this.BodyList.splice(head, last - head);
		}
	}

	public bodypointModify(x: number, y: number) {
		this.Head.bodypoint.graphics.clear();
        this.Head.bodypoint.graphics.lineStyle(4,this.Head.Color.Bright);
        this.Head.bodypoint.graphics.beginFill(this.Head.Color.Origin);
        this.Head.bodypoint.graphics.drawCircle(0,0,this.radius);
        this.Head.bodypoint.graphics.endFill(); 
		this.Head.x = x;
		this.Head.y = y;
	}

	/**
	 * 蛇头改变
	 */
	public headChange() {
		this.Head = this.BodyList[0];
		this.Head.bodypoint.graphics.clear();
        this.Head.bodypoint.graphics.lineStyle(4,0x000000);
        this.Head.bodypoint.graphics.beginFill(this.Head.Color.Origin);
        this.Head.bodypoint.graphics.drawCircle(0,0,this.radius);
        this.Head.bodypoint.graphics.endFill(); 
	}

	public AddPoint(infos: Array<any>) {
		infos.forEach(info => {
			let node = new BodyPoint();
			let color = new Color();
			color.Bright = color.BrightColor[info.color];
			color.Origin = color.OriginColor[info.color];
			node.Create(this.radius, color, false);
			node.id = info.id;
			node.x = this.BodyList[this.BodyList.length - 1].x + this.radius;
			node.y = this.BodyList[this.BodyList.length - 1].y + this.radius;
			this.BodyList.push(node);
			this.addChild(node);
			this.setChildIndex(this.BodyList[this.BodyList.length - 1],0);
		});
	}
}