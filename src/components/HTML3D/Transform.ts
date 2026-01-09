export function toRad(degrees: number) {
	return degrees * (Math.PI / 180);
}

export function toDeg(radians: number) {
	return radians * (180 / Math.PI);
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

	getMagnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	getNormal() {
		const magnitude = this.getMagnitude();
		return new Vector(this.x / magnitude, this.y / magnitude, this.z / magnitude);
	}
}

export class Transform {
	matrix: DOMMatrix;
	renderOffset: DOMMatrix;
	hasChanged = false;

	constructor(
		x: number = 0,
		y: number = 0,
		z: number = 0,
		pitch: number = 0,
		yaw: number = 0,
		roll: number = 0,
	) {
		this.matrix = new DOMMatrix();
		this.renderOffset = new DOMMatrix();
		this.setPosition(x, y, z);
		this.setAngle(pitch, yaw, roll);
	}

	checkAndClearChangeFlag() {
		const retValue = this.hasChanged;
		this.hasChanged = false;
		return retValue;
	}

	setMatrix(newMatrix: DOMMatrix) {
		this.hasChanged = true;
		this.matrix = newMatrix;
	}

	getPosition() {
		return new Vector(this.matrix.m41, this.matrix.m42, this.matrix.m43);
	}

	setPositionX(x: number) {
		this.hasChanged = true;
		this.matrix.m41 = x;
	}

	setPositionY(y: number) {
		this.hasChanged = true;
		this.matrix.m42 = -y;
	}

	setPositionZ(z: number) {
		this.hasChanged = true;
		this.matrix.m43 = z;
	}

	setPosition(x: Vector): void;
	setPosition(x: [number | null, number | null, number | null]): void;
	setPosition(x: number | null, y?: number | null, z?: number | null): void;
	setPosition(
		x: Vector | [number | null, number | null, number | null] | number | null,
		y?: number | null,
		z?: number | null,
	): void {
		this.hasChanged = true;
		if (x instanceof Vector) {
			this.matrix.m41 = x.x;
			this.matrix.m42 = -x.y;
			this.matrix.m43 = x.z;
		} else if (x instanceof Array) {
			if (x[0] != null) {
				this.matrix.m41 = x[0]; // x
			}
			if (x[1] != null) {
				this.matrix.m42 = -x[1]; // y
			}
			if (x[2] != null) {
				this.matrix.m43 = x[2]; // z
			}
		} else {
			if (x != null) {
				this.matrix.m41 = x;
			}
			if (y != null) {
				this.matrix.m42 = -y;
			}
			if (z != null) {
				this.matrix.m43 = z;
			}
		}
	}

	clearAngle() {
		this.hasChanged = true;
		this.matrix.m11 = 1;
		this.matrix.m12 = 0;
		this.matrix.m13 = 0;

		this.matrix.m21 = 0;
		this.matrix.m22 = 1;
		this.matrix.m23 = 0;

		this.matrix.m31 = 0;
		this.matrix.m32 = 0;
		this.matrix.m33 = 1;
	}

	setAngle(angle: Angle): void;
	setAngle(angleArray: [number, number, number]): void;
	setAngle(pitch: number, yaw: number, roll: number): void;
	setAngle(pitch: Angle | [number, number, number] | number, yaw?: number, roll?: number): void {
		this.clearAngle();
		if (pitch instanceof Angle) {
			this.matrix.rotateAxisAngleSelf(0, 0, 1, pitch.yaw);
			this.matrix.rotateAxisAngleSelf(0, 1, 0, pitch.roll);
			this.matrix.rotateAxisAngleSelf(1, 0, 0, -pitch.pitch);
		} else if (pitch instanceof Array) {
			this.matrix.rotateAxisAngleSelf(0, 0, 1, pitch[1]);
			this.matrix.rotateAxisAngleSelf(0, 1, 0, pitch[2]);
			this.matrix.rotateAxisAngleSelf(1, 0, 0, -pitch[0]);
		} else {
			this.matrix.rotateAxisAngleSelf(0, 0, 1, yaw);
			this.matrix.rotateAxisAngleSelf(0, 1, 0, roll);
			this.matrix.rotateAxisAngleSelf(1, 0, 0, -pitch);
		}
	}

	getRenderMatrix() {
		const renderMatrix = this.renderOffset.multiply(this.matrix);
		return renderMatrix;
	}

	getMatrix() {
		return this.matrix;
	}

	getCameraRenderMatrix(perspective: number): DOMMatrix {
		const cameraRenderMatrix = this.matrix.inverse();
		cameraRenderMatrix.m43 += perspective;

		return cameraRenderMatrix;
	}

	getTransformCSS() {
		return this.getRenderMatrix().toString();
	}

	getCameraTransformCSS(perspective: number) {
		return this.getCameraRenderMatrix(perspective).toString();
	}

	getForward() {
		return new Vector(-this.matrix.m21, this.matrix.m22, -this.matrix.m23);
	}

	getRight() {
		return new Vector(this.matrix.m11, -this.matrix.m12, this.matrix.m13);
	}

	getUp() {
		return new Vector(this.matrix.m31, -this.matrix.m32, this.matrix.m33);
	}

	// getLookNormal() {
	// 	const temp = this.getRight();
	// 	return new Vector(-temp.y, temp.x, 0).getNormal();
	// }

	get2DLookNormal() {
		const temp = this.getRight();
		return new Vector(-temp.y, temp.x, 0).getNormal();
	}

	print() {
		console.log('------------------------------');
		this.printMatrix(this.matrix);

		if (!this.renderOffset.isIdentity) {
			console.log('++++++++++++++++++++++++++++++');
			this.printMatrix(this.renderOffset);
		}
		console.log('------------------------------');
	}

	printMatrix(matrix: DOMMatrix, decimal: number = 3) {
		function fixedSpace(value: number) {
			return (value >= 0 ? ' ' : '') + value.toFixed(decimal);
		}
		console.log(
			fixedSpace(matrix.m11),
			fixedSpace(matrix.m12),
			fixedSpace(matrix.m13),
			fixedSpace(matrix.m14),
		);
		console.log(
			fixedSpace(matrix.m21),
			fixedSpace(matrix.m22),
			fixedSpace(matrix.m23),
			fixedSpace(matrix.m24),
		);
		console.log(
			fixedSpace(matrix.m31),
			fixedSpace(matrix.m32),
			fixedSpace(matrix.m33),
			fixedSpace(matrix.m34),
		);
		console.log(
			fixedSpace(matrix.m41),
			fixedSpace(matrix.m42),
			fixedSpace(matrix.m43),
			fixedSpace(matrix.m44),
		);
	}
}
