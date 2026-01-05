import { reactive, ref } from 'vue';
import { Transform } from './Transform';

export const objectProps = {
	transform: {
		type: Transform,
		default() {
			return new Transform();
		},
	},
};

export function becomeObject(props: { transform: Transform }, isCamera: boolean = false) {
	const transform = ref(props.transform);

	function getCSS() {
		if (isCamera) {
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

	const objectExposables = {
		transform,
		update,
	};
	return { objectStyle, objectExposables };
}
