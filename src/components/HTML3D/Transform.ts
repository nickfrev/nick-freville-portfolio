function toRad(degrees: number) {
	return degrees * (Math.PI / 180);
}

export class Angle {
	pitch: number = 0;
	yaw: number = 0;
	roll: number = 0;

	constructor(pitch: number = 0, yaw: number = 0, roll: number = 0) {
		this.pitch = pitch;
		this.yaw = yaw;
		this.roll = roll;
	}

	getRotationCSS(offset: Angle = new Angle()) {
		return `rotateZ(${this.yaw + offset.yaw}deg) rotateY(${this.roll + offset.roll}deg) rotateX(${this.pitch + offset.pitch}deg) `;
	}

	getCameraRotationCSS() {
		return `rotateX(${this.pitch}deg) rotateZ(${this.yaw}deg) `;
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

	getPositionCSS(offset: Position = new Position(), scale: number = 1) {
		return `translate3d(${(this.x + offset.x) / scale}px, ${-(this.y + offset.y) / scale}px, ${(this.z + offset.z) / scale}px) `;
	}

	getCameraPositionCSS() {
		return `translate3d(${-this.x}px, ${this.y}px, ${-this.z}px) `;
	}
}

export class Transform {
	position: Position;
	angle: Angle;
	scale: number;

	positionOffset: Position = new Position();
	angleOffset: Angle = new Angle();

	constructor(
		x: number = 0,
		y: number = 0,
		z: number = 0,
		pitch: number = 0,
		yaw: number = 0,
		roll: number = 0,
		scale: number = 1,
	) {
		this.position = new Position(x, y, z);
		this.angle = new Angle(pitch, yaw, roll);
		this.scale = scale;
	}

	getTransformCSS() {
		// DOMMatrix()
		return (
			`scale3d(${this.scale}, ${this.scale}, ${this.scale}) ` +
			this.position.getPositionCSS(this.positionOffset, this.scale) +
			this.angle.getRotationCSS(this.angleOffset)
		);
	}

	getCameraTransformCSS(perspective: number) {
		return (
			`translateZ(${perspective}px) ` +
			this.angle.getCameraRotationCSS() +
			this.position.getCameraPositionCSS()
		);
	}

	getLookNormal() {
		const lookNormal = {
			x: -Math.sin(toRad(this.angle.yaw)) * Math.sin(toRad(this.angle.pitch)),
			y: Math.cos(toRad(this.angle.yaw)) * Math.sin(toRad(this.angle.pitch)),
			z: Math.cos(toRad(this.angle.pitch)),
		};
		const magnitude = Math.sqrt(
			lookNormal.x * lookNormal.x + lookNormal.y * lookNormal.y + lookNormal.z * lookNormal.z,
		);
		lookNormal.x = lookNormal.x / magnitude;
		lookNormal.y = lookNormal.y / magnitude;
		lookNormal.z = lookNormal.z / magnitude;

		return lookNormal;
	}

	get2DLookNormal() {
		const lookNormal = {
			x: -Math.sin(toRad(this.angle.yaw)),
			y: Math.cos(toRad(this.angle.yaw)),
			z: 0,
		};
		const magnitude = Math.sqrt(lookNormal.x * lookNormal.x + lookNormal.y * lookNormal.y);
		lookNormal.x = lookNormal.x / magnitude;
		lookNormal.y = lookNormal.y / magnitude;
		lookNormal.z = 0;

		return lookNormal;
	}
}
