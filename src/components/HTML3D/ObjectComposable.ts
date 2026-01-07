import { reactive, ref, getCurrentInstance } from 'vue';
import { Transform } from './Transform';
import type { ComponentInternalInstance } from 'vue';

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

export function becomeObject(props: { transform: Transform }) {
	const transform = ref(props.transform);

	// todo: determine if checking for null is a good idea here
	const instance = getCurrentInstance() as ComponentInternalInstance;
	const selfIsCamera = isCamera(instance);

	function getCSS() {
		if (selfIsCamera) {
			const perspective = 800;
			return `perspective(${perspective}px) ` + transform.value.getCameraTransformCSS(perspective);
		}

		return transform.value.getTransformCSS();
	}

	function update() {
		objectStyle.transform = getCSS();
	}

	const objectStyle = reactive({
		transform: getCSS(),
	});

	// Helper functions
	function localToWorldTransform(localTransform: Transform | DOMMatrix) {
		// const parentLocal = transform.value.getMatrix().multiply(localTransform.getMatrix());
		const isTransform = localTransform instanceof Transform;
		const selfLocal = transform.value
			.getMatrix()
			.multiply(isTransform ? localTransform.getMatrix() : localTransform);
		const selfLocalTransform = Transform.fromMatrix(selfLocal);

		console.log(localTransform);
		const parent = instance?.parent;
		if (!parent) {
			console.log('has no parent');
			return selfLocalTransform;
		}

		if (isCamera(parent)) {
			console.log('parent is camera');
			console.log(selfLocalTransform);
			return selfLocalTransform;
		}

		// If the parent has a transform component we can get the transform relative to that
		if (
			parent.exposed &&
			'transform' in parent.exposed &&
			'localToWorldTransform' in parent.exposed
		) {
			console.log('has parent');

			return parent.exposed.localToWorldTransform(selfLocal);
		}

		console.log('default');
		return selfLocalTransform;
	}

	const objectExposables = {
		transform,
		update,
		localToWorldTransform,
	};
	return { objectStyle, objectExposables };
}
