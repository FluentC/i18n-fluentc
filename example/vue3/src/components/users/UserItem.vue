<template>
	<li>
		<h3>{{ userName }}</h3>
		<button @click="viewProjects">{{ $t('view-projects') }}</button>
	</li>
</template>

<script>
export default {
	props: ['id', 'userName'],
	emits: ['list-projects'],
	setup(props, context) {
		function viewProjects() {
			context.emit('list-projects', props.id);
		}

		return { viewProjects };
	},
};
</script>

<style scoped>
li {
	margin: 0.5rem 0;
	padding: 1rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.26);
	border-radius: 5px;
}

li h3 {
	margin: 0;
}
</style>