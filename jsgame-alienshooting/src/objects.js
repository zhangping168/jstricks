var spriteObject = {
	sourceX:0,
	sourceY:0,
	sourceWidth:32,
	sourceHeight:32,

	x:0,
	y:0,
	width:32,
	height:32,
	visible:true,
	centerX: function(){
		return Math.floor(this.x+this.width/2);
	},
	centerY: function(){
		return Math.floor(this.y+this.height/2);
	},

	halfWidth :function(){
		return Math.floor(this.width/2);
	},
	halfHeight :function(){
		return Math.floor(this.height/2);
	}
};

var alienObject = Object.create(spriteObject);
alienObject.NORMAL=1;
alienObject.EXPLODED=2;
alienObject.state=alienObject.NORMAL;
alienObject.update = function(){
	this.sourceX=this.state*this.width;
}
