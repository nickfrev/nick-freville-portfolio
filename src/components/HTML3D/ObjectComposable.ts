import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import type { ComponentInternalInstance } from 'vue';
import { Transform } from './Transform';
import HTML3D from './HTML3D.vue';

export type SceneObject = ReturnType<typeof becomeObject>['objectExposables'];

export const objectProps = {
	transform: {
		type: Transform,
		default() {
			return new Transform();
		},
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

export function becomeObject(props: { transform: Transform }, callbacks?: objectCallbacks) {
	const transform = ref(props.transform);
	const instance = getCurrentInstance() as ComponentInternalInstance;

	const world = getWorld(instance);

	const selfIsCamera = isCamera(instance);

	onMounted(() => {
		if (!selfIsCamera) {
			// The Camera is controlled separately due to it's importance to a smooth user experience
			world.registerNewObject(instance.exposed as SceneObject);
		}
	});

	function getCSS() {
		if (selfIsCamera) {
			const perspective = 800;
			return `perspective(${perspective}px) ` + transform.value.getCameraTransformCSS(perspective);
		}

		return transform.value.getTransformCSS();
	}

	function update() {
		objectStyle.transform = getCSS();
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
	});

	// Helper functions
	function localToWorldTransform(localTransform: Transform | DOMMatrix) {
		// const isTransform = localTransform instanceof Transform;
		// const selfLocal = transform.value
		// 	.getMatrix()
		// 	.multiply(isTransform ? localTransform.getMatrix() : localTransform);
		// const selfLocalTransform = Transform.fromMatrix(selfLocal);
		// const parent = instance?.parent;
		// if (!parent) {
		// 	return selfLocalTransform;
		// }
		// if (isCamera(parent)) {
		// 	return selfLocalTransform;
		// }
		// // If the parent has a transform component we can get the transform relative to that
		// if (
		// 	parent.exposed &&
		// 	'transform' in parent.exposed &&
		// 	'localToWorldTransform' in parent.exposed
		// ) {
		// 	return parent.exposed.localToWorldTransform(selfLocal);
		// }
		// return selfLocalTransform;
	}

	const objectExposables = {
		transform,
		update,
		localToWorldTransform,
		render,
		tick,
		world,
	};
	return { world, objectStyle, objectExposables };
}
