<template>
	<base-container>
		<h2>{{ $t('active-users') }}</h2>
		<base-search
			@search="updateSearch"
			:search-term="enteredSearchTerm"
		></base-search>
		<div>
			<button @click="sort('asc')" :class="{ selected: sorting === 'asc' }">
				{{ $t('sort-ascending') }}
			</button>
			<button @click="sort('desc')" :class="{ selected: sorting === 'desc' }">
				{{ $t('sort-descending') }}
			</button>
		</div>
		<ul>
			<user-item
				v-for="user in displayedUsers"
				:key="user.id"
				:user-name="user.fullName"
				:id="user.id"
				@list-projects="$emit('list-projects', $event)"
			></user-item>
		</ul>
	</base-container>
</template>

<script>
import { toRefs } from 'vue';
import useSearch from '../../hooks/search';
import useSort from '../../hooks/sort';
import UserItem from './UserItem.vue';

export default {
	components: {
		UserItem,
	},
	props: ['users'],
	setup(props) {
		const { users } = toRefs(props);

		const { enteredSearchTerm, availableItems, updateSearch } = useSearch(
			users,
			'fullName'
		);

		const { displayedUsers, sorting, sort } = useSort(
			availableItems,
			'fullName'
		);

		return { enteredSearchTerm, updateSearch, displayedUsers, sorting, sort };
	},
};
</script>

<style scoped>
ul {
	list-style: none;
	margin: 0;
	padding: 0;
}
</style>