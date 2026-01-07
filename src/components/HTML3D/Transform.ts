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

	toAxisAngle() {
		// todo
	}

	toQuaternion() {
		// todo
	}
}

export class Vector {
	x: number = 0;
	y: number = 0;
	z: number = 0;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

export class Transform {
	position: Vector;
	angle: Angle;
	scale: number;

	positionOffset: Vector = new Vector();
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
		this.position = new Vector(x, y, z);
		this.angle = new Angle(pitch, yaw, roll);
		this.scale = scale;
	}

	static fromMatrix(matrix: DOMMatrix) {
		const x = matrix.m41;
		const y = matrix.m42;
		const z = matrix.m43;

		const pitch = 0;
		const yaw = 0;
		const roll = 0;

		return new Transform(x, y, z, pitch, yaw, roll);
	}

	getRenderMatrix() {
		const matrix = new DOMMatrix();
		matrix.translateSelf(
			this.position.x + this.positionOffset.x,
			-(this.position.y + this.positionOffset.y), // Invert y because chrome renders y = 0 as top of screen
			this.position.z + this.positionOffset.z,
		);

		matrix.scale3dSelf(this.scale, this.scale, this.scale);

		matrix.rotateAxisAngleSelf(0, 0, 1, -this.angle.yaw); // Invert yaw because we inverted y
		matrix.rotateAxisAngleSelf(0, 1, 0, this.angle.roll);
		matrix.rotateAxisAngleSelf(1, 0, 0, this.angle.pitch);

		return matrix;
	}

	getMatrix() {
		const matrix = new DOMMatrix();
		matrix.translateSelf(this.position.x, this.position.y, this.position.z);
		matrix.scale3dSelf(this.scale, this.scale, this.scale);

		matrix.rotateAxisAngleSelf(0, 0, 1, this.angle.yaw);
		matrix.rotateAxisAngleSelf(0, 1, 0, this.angle.roll);
		matrix.rotateAxisAngleSelf(1, 0, 0, -this.angle.pitch);

		return matrix;
	}

	getCameraRenderMatrix(perspective: number): DOMMatrix {
		const matrix = new DOMMatrix();
		matrix.translateSelf(0, 0, perspective);

		matrix.rotateAxisAngleSelf(1, 0, 0, this.angle.pitch);
		matrix.rotateAxisAngleSelf(0, 0, 1, -this.angle.yaw); // Invert yaw because we inverted y

		matrix.translateSelf(
			-(this.position.x + this.positionOffset.x),
			this.position.y + this.positionOffset.y, // Invert y because chrome renders y = 0 as top of screen
			-(this.position.z + this.positionOffset.z),
		);

		return matrix;
	}

	getTransformCSS() {
		return this.getRenderMatrix().toString();
	}

	getCameraTransformCSS(perspective: number) {
		return this.getCameraRenderMatrix(perspective).toString();
	}

	getLookNormal() {
		const lookNormal = {
			x: Math.sin(toRad(this.angle.yaw)) * Math.sin(toRad(this.angle.pitch)),
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
			x: Math.sin(toRad(this.angle.yaw)),
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
