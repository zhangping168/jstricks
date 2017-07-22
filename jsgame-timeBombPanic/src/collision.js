function hitTestRectangle(s1, s2) {
	var hit = false;

	var distanceX = Math.abs(s1.centerX() - s2.centerX());
	var distanceY = Math.abs(s1.centerY() - s2.centerY());

	if ((distanceX < s1.halfWidth() + s2.halfWidth()) && (distanceY < s1.halfHeight() + s2.halfHeight())) {

		hit = true;
		console.log('objects has collision');
	}

	return hit;
}