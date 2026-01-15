import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import type { ComponentInternalInstance } from 'vue';
import { Transform } from './Transform';
import HTML3D from './HTML3D.vue';
import Camera3D from './Camera3D.vue';

export type SceneObject = ReturnType<typeof becomeObject>['objectExposables'];

export const objectProps = {
	transform: {
		type: Transform,
		default() {
			return new Transform();
		},
	},
	motionSmoothing: {
		type: Number,
		default: 0,
	},
};

function isCamera(instance: ComponentInternalInstance) {
	return instance.type.__name === 'Camera3D';
}

type objectCallbacks = { tick?: () => void; update?: () => void };

function getWorld(instance: ComponentInternalInstance): InstanceType<typeof HTML3D> {
	if (!instance.parent) {
		throw '3D HTML components must exist in an HTML3D component!';
	}

	if (instance.parent && instance.parent.type.__name === HTML3D.__name) {
		// Parent is HTML3D component
		return instance.parent.exposed as InstanceType<typeof HTML3D>;
	}

	return instance.parent.exposed?.world ?? null;
}

export function becomeObject(
	props: { transform: Transform; motionSmoothing: number },
	callbacks?: objectCallbacks,
) {
	const transform = ref(props.transform);
	const motionSmoothing = ref(props.motionSmoothing);
	const instance = getCurrentInstance() as ComponentInternalInstance;

	const world = getWorld(instance);

	const selfIsCamera = isCamera(instance);
	let perspective: number | null = 800;

	onMounted(() => {
		world.registerNewObject(instance.exposed as SceneObject);
	});

	function getCSS() {
		if (selfIsCamera) {
			let perspectiveValue = '';
			if (perspective === null) {
				perspectiveValue = 'none';
			} else {
				perspectiveValue = `${perspective}px`;
			}
			return (
				`perspective(${perspectiveValue}) ` + transform.value.getCameraTransformCSS(perspective)
			);
		}

		return transform.value.getTransformCSS();
	}

	function update() {
		objectStyle.transform = getCSS();
		objectStyle.transition = `transform ${motionSmoothing.value}s ease-out`;
		callbacks?.update?.();
	}

	function render() {
		if (transform.value.checkAndClearChangeFlag()) {
			update();
		}
	}

	function tick() {
		callbacks?.tick?.();
	}

	const objectStyle = reactive({
		transform: getCSS(),
		transition: `transform ${motionSmoothing.value}s ease-out`,
	});

	function localToWorldTransform(
		localTransform: Transform,
		stopInstance?: ComponentInternalInstance,
		maxDepth: number = 10,
	) {
		let childTransform = transform.value.getLocal(localTransform);
		let parent = instance.parent;
		for (let i = 0; i < maxDepth; i++) {
			if (
				parent &&
				parent.exposed &&
				'transform' in parent.exposed &&
				parent.exposed.transform?.value instanceof Transform
			) {
				if (parent.type.__name === Camera3D.__name || parent === stopInstance) {
					break;
				}
				childTransform = parent.exposed.transform.value.getLocal(childTransform);
				parent = parent.parent;
			} else {
				break;
			}
		}
		return childTransform;
	}

	function setMotionSmoothing(value: number) {
		motionSmoothing.value = value;
	}

	function setCameraPerspective(value: number | null) {
		perspective = value;
	}

	const objectExposables = {
		transform,
		update,
		localToWorldTransform,
		setMotionSmoothing,
		setCameraPerspective,
		render,
		tick,
		world,
		instance,
	};
	return { world, objectStyle, objectExposables };
}
