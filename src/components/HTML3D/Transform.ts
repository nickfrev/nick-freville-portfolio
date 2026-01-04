export class Angle {
	pitch: number = 0;
	yaw: number = 0;
	roll: number = 0;

	constructor(pitch: number = 0, yaw: number = 0, roll: number = 0) {
		this.pitch = pitch;
		this.yaw = yaw;
		this.roll = roll;
	}

	getRotationCSS() {
		return `rotateZ(${this.yaw}deg) rotateY(${this.roll}deg) rotateX(${this.pitch}deg)`;
	}
}

export class Position {
	x: number = 0;
	y: number = 0;
	z: number = 0;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getPositionCSS(offset: Position) {
		return `translate3d(${this.x + offset.x}px, ${-(this.y + offset.y)}px, ${this.z + offset.z}px)`;
	}
}

export class Transform {
	position: Position = new Position();
	angle: Angle = new Angle();

	positionOffset: Position = new Position();
	angleOffset: Angle = new Angle();

	constructor(
		x: number = 0,
		y: number = 0,
		z: number = 0,
		pitch: number = 0,
		yaw: number = 0,
		roll: number = 0,
	) {
		this.position = new Position(x, y, z);
		this.angle = new Angle(pitch, yaw, roll);
	}

	getTransformCSS() {
		// DOMMatrix()
		return this.position.getPositionCSS(this.positionOffset) + this.angle.getRotationCSS();
	}
}
