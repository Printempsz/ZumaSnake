// 蛇类
class Snake extends egret.Sprite{
	//蛇头
	public head: BodyPoint;
	//蛇身半径
	private radius: number;
	//蛇身数组
	public body: BodyPoint[];
	//蛇头颜色
	private headColor: Color;
	//蛇的速度
	public speed: number;
	//加速计时器
	public AccelerateTimer: egret.Timer;
	//加速累计时间
	public count: number;
	public constructor(x: number, y: number, r: number, n: number) {
		super();
		this.headColor = new Color();
		this.body = [];
		this.speed = 30;
		this.count = 0;
		this.Create(x, y, r, n);
	}

	/**
	* x 横坐标
	* y 纵坐标
	* r 蛇头半径
	* color 蛇头颜色
	* n 初始蛇身数量
	*/

	private Create(x: number, y: number, r: number, n: number) {

		var headcolor = this.headColor.getColor()
		this.head = new BodyPoint();
		this.head.CreateHead(3, 0x403232, r, headcolor);

		//设置坐标
		this.head.x = r;
		this.head.y = r;
		this.radius = 20;
		this.x = x;
		this.y = y;

		//加入数组
		this.body.push(this.head);
		this.addChild(this.head);
		this.setChildIndex(this.head, -999);

		for (var i = 1; i <= n-1; i++) {
			var bodyColor: Color = new Color();
			var bodycolor: number = bodyColor.getColor();
			var bodypoint: BodyPoint = new BodyPoint();
			bodypoint.CreateBody(r,bodycolor);
			bodypoint.x = this.body[this.body.length - 1].x + r;
			bodypoint.y = this.body[this.body.length - 1].y + r;
			this.body.push(bodypoint);
			this.addChild(this.body[this.body.length - 1]);
			this.setChildIndex(this.body[this.body.length - 1], 0);
		}
	}

	public Move(e: egret.TouchEvent, interval: number) {
		var mouseX = e.stageX;
		var mouseY = e.stageY;
		var animate: egret.Tween;
		

		var headX = this.x + this.body[0].x;
		var headY = this.y + this.body[0].y;
		animate = egret.Tween.get(this.body[0]);

		var length = Math.sqrt((mouseX - headX)*(mouseX - headX) + (mouseY - headY)*(mouseY - headY));
		var VectorX = (mouseX - headX)/length;
		var VectorY = (mouseY - headY)/length;
	

		 if (VectorX*length*VectorX*length+VectorY*length*VectorY*length<=this.speed*this.speed) return;

		var NextX = this.body[0].x + this.speed * VectorX;
		var NextY = this.body[0].y + this.speed * VectorY;
		
		
		
		animate.to({x: NextX, y: NextY}, interval);

		for (var i = this.body.length - 1; i >= 1; i--) {
			animate = egret.Tween.get(this.body[i]);
			animate.to({x: this.body[i -1].x, y: this.body[i -1].y}, interval);
		}
	}
	public afterEat(color:number) {
		var node: BodyPoint = new BodyPoint();
		node.CreateBody(this.radius, color);
		node.x = this.body[this.body.length - 1].x + this.radius;
		node.y = this.body[this.body.length - 1].y + this.radius;
		node.scaleX = 0.01;
		node.scaleY = 0.01;
		this.body.push(node);
		this.addChild(node);
		var animate: egret.Tween = egret.Tween.get(node);
		animate.to({scaleX: 1.0, scaleY: 1.0},500,egret.Ease.circOut);
		this.setChildIndex(this.body[this.body.length - 1],0);
	}

	

	public GetHead() {
		return this.body[0];
	}
}