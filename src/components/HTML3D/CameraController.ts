import { Vector, Transform, Angle } from './Transform';
import Camera3D from './Camera3D.vue';

export default class CameraController {
	transformBuffer = new Transform();
	cameraPositionBuffer = new Vector();
	cameraAngleBuffer = new Angle();
	cameraPerspectiveBuffer: number | null = 800;
	defaultCameraPerspective = 800;

	transformBufferChange = true;

	mouseDown = false;
	movement = {
		forward: false,
		backward: false,
		left: false,
		right: false,
		run: false,
	};

	lastPos = { x: 0, y: 0 };
	cameraLocked = false;

	constructor() {
		this.bindListeners();
	}

	render(camera: InstanceType<typeof Camera3D>) {
		if (this.mouseDown || this.transformBufferChange) {
			this.checkForCameraTransformChange(camera);
		}
	}

	tick() {
		this.moveTick();
	}

	bindListeners() {
		document.addEventListener('keydown', this.onKeyDown.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	lockCamera(lock: boolean) {
		this.cameraLocked = lock;
	}

	allowMove() {
		return !this.cameraLocked;
	}

	setCameraPerspective(value: number | null) {
		if (!this.allowMove()) {
			return;
		}
		this.transformBufferChange = true;
		this.cameraPerspectiveBuffer = value;
	}

	getCameraPerspective() {
		return this.cameraPerspectiveBuffer;
	}

	setCameraPos(x: null | number = null, y: null | number = null, z: null | number = null) {
		if (!this.allowMove()) {
			return;
		}
		this.transformBufferChange = true;

		if (x !== null) {
			this.cameraPositionBuffer.x = x;
		}
		if (y !== null) {
			this.cameraPositionBuffer.y = y;
		}
		if (z !== null) {
			this.cameraPositionBuffer.z = z;
		}
	}

	addToCameraPos(x: null | number = null, y: null | number = null, z: null | number = null) {
		if (!this.allowMove()) {
			return;
		}
		this.transformBufferChange = true;
		if (x !== null) {
			this.cameraPositionBuffer.x += x;
		}
		if (y !== null) {
			this.cameraPositionBuffer.y += y;
		}
		if (z !== null) {
			this.cameraPositionBuffer.z += z;
		}
	}

	setCameraAng(pitch: null | number = null, yaw: null | number = null, roll: null | number = null) {
		if (!this.allowMove()) {
			return;
		}
		this.transformBufferChange = true;

		if (pitch !== null) {
			this.cameraAngleBuffer.pitch = pitch;
		}
		if (yaw !== null) {
			this.cameraAngleBuffer.yaw = yaw;
		}
		if (roll !== null) {
			this.cameraAngleBuffer.roll = roll;
		}
	}

	addToCameraAng(
		pitch: null | number = null,
		yaw: null | number = null,
		roll: null | number = null,
	) {
		if (!this.allowMove()) {
			return;
		}
		this.transformBufferChange = true;
		if (pitch !== null) {
			this.cameraAngleBuffer.pitch += pitch;
		}
		if (yaw !== null) {
			this.cameraAngleBuffer.yaw += yaw;
		}
		if (roll !== null) {
			this.cameraAngleBuffer.roll += roll;
		}
	}

	// focusCameraOn(target: { transform: Transform }) {
	// 	// const lookNormal = target.transform.getLookNormal();
	// 	// setCameraPos(
	// 	// 	target.transform.position.x + lookNormal.x * 100,
	// 	// 	target.transform.position.y + lookNormal.y * 100,
	// 	// 	target.transform.position.z + lookNormal.z * 100,
	// 	// );
	// }

	checkForCameraTransformChange(camera: InstanceType<typeof Camera3D>) {
		if (this.transformBufferChange) {
			this.transformBufferChange = false;

			this.cameraAngleBuffer.roll = 0;
			this.cameraAngleBuffer.pitch =
				this.cameraAngleBuffer.pitch > 179 ? 179 : this.cameraAngleBuffer.pitch;
			this.cameraAngleBuffer.pitch =
				this.cameraAngleBuffer.pitch < 1 ? 1 : this.cameraAngleBuffer.pitch;

			// Write this to a local variable so we don't need camera elsewhere
			this.transformBuffer.setPosition(this.cameraPositionBuffer);
			this.transformBuffer.setAngle(this.cameraAngleBuffer);

			camera.transform.setPosition(this.cameraPositionBuffer);
			camera.transform.setAngle(this.cameraAngleBuffer);
			camera.setCameraPerspective(this.cameraPerspectiveBuffer);
		}
	}

	/////
	// Mouse Controls for looking around
	/////

	onMouseDown(event: MouseEvent) {
		if (event.button == 2) {
			this.mouseDown = true;

			this.lastPos = { x: event.clientX, y: event.clientY };
			event.stopPropagation();
			event.preventDefault();

			// Blur the active element so we are not typing in text boxes
			if (document.activeElement && 'blur' in document.activeElement) {
				(document.activeElement as HTMLElement).blur();
			}
		}
	}

	onMouseUp(event: MouseEvent) {
		if (event.button == 2) {
			this.mouseDown = false;
			this.movement.forward = false;
			this.movement.backward = false;
			this.movement.left = false;
			this.movement.right = false;
			this.movement.run = false;
			event.stopPropagation();
			event.preventDefault();
		}
	}

	onMouseLeave() {
		this.mouseDown = false;
	}

	onMouseMove(event: MouseEvent) {
		if (this.mouseDown) {
			const diff = { x: event.clientX - this.lastPos.x, y: event.clientY - this.lastPos.y };
			this.lastPos = { x: event.clientX, y: event.clientY };
			this.addToCameraAng(-diff.y * 0.25, diff.x * 0.25);

			if (this.cameraPerspectiveBuffer === null) {
				this.setCameraPerspective(this.defaultCameraPerspective);
			}

			event.stopPropagation();
			event.preventDefault();
		}
	}

	onContextMenu(event: MouseEvent) {
		event.stopPropagation();
		event.preventDefault();
	}

	/////
	// Keyboard Controls
	/////

	moveTick() {
		if (!this.allowMove()) {
			return;
		}
		const moveVector = new Vector();
		const speed = 15 * (this.movement.run ? 3 : 1);

		moveVector.y = this.movement.forward ? speed : this.movement.backward ? -speed : 0;
		moveVector.x = this.movement.right ? speed : this.movement.left ? -speed : 0;
		// Get the movement vectors
		const lookNormal = this.transformBuffer.get2DLookNormal();

		// Add that to the current position
		if (moveVector.y || moveVector.x) {
			// Project the move vector along the look normal
			this.addToCameraPos(
				lookNormal.x * moveVector.y + lookNormal.y * moveVector.x,
				lookNormal.y * moveVector.y - lookNormal.x * moveVector.x,
			);
		}
	}

	onKeyDown(event: KeyboardEvent) {
		if (this.mouseDown) {
			if (event.code == 'KeyW') {
				this.movement.forward = true;
			} else if (event.code == 'KeyS') {
				this.movement.backward = true;
			} else if (event.code == 'KeyA') {
				this.movement.left = true;
			} else if (event.code == 'KeyD') {
				this.movement.right = true;
			} else if (event.code == 'ShiftLeft') {
				this.movement.run = true;
			}
		}
	}

	onKeyUp(event: KeyboardEvent) {
		if (event.code == 'KeyW') {
			this.movement.forward = false;
		} else if (event.code == 'KeyS') {
			this.movement.backward = false;
		} else if (event.code == 'KeyA') {
			this.movement.left = false;
		} else if (event.code == 'KeyD') {
			this.movement.right = false;
		} else if (event.code == 'ShiftLeft') {
			this.movement.run = false;
		}
	}
}
