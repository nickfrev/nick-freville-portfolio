import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import type { ComponentInternalInstance } from 'vue';
import { Transform } from './Transform';

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

export function becomeObject(props: { transform: Transform }, callbacks?: objectCallbacks) {
	const transform = ref(props.transform);
	// todo: determine if checking for null is a good idea here
	const instance = getCurrentInstance() as ComponentInternalInstance;
	const selfIsCamera = isCamera(instance);
	let childrenComponents: ComponentInternalInstance[] = [];

	onMounted(() => {
		const parent = instance.parent;
		if (parent && parent.exposed && 'registerChildComponent' in parent.exposed) {
			parent.exposed.registerChildComponent(instance);
		}
	});

	function registerChildComponent(child: ComponentInternalInstance) {
		if (child.parent === instance) {
			childrenComponents.push(child);
		}
	}

	function tickChildrenComponents() {
		childrenComponents = childrenComponents.filter((x) => x.parent === instance);
		for (const child of childrenComponents) {
			if (child && child.exposed && 'tick' in child.exposed) {
				child.exposed.tick();
			}
		}
	}

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

	function tick() {
		if (transform.value.checkAndClearChangeFlag()) {
			update();
		}
		callbacks?.tick?.();
		tickChildrenComponents();
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
		tick,
		registerChildComponent,
	};
	return { objectStyle, objectExposables };
}
