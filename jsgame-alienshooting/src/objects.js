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

	halfWidth :function(){
		return Math.floor(this.width/2);
	}
}
