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

export function becomeObject(props: { transform: Transform }) {
	const transform = ref(props.transform);

	function update() {
		objectStyle.transform = transform.value.getTransformCSS();
	}

	const objectStyle = reactive({
		transform: transform.value.getTransformCSS(),
	});

	const objectExposables = {
		transform,
		update,
	};
	return { objectStyle, objectExposables };
}
