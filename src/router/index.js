import { createRouter, createWebHistory, START_LOCATION } from 'vue-router';

import Books from '../views/Books.vue';
import Authors from '../views/Authors.vue';
import Genres from '../views/Genres.vue';
import AddBook from '../views/AddBook.vue';
import AddAuthor from '../views/AddAuthor.vue';

const routes = [
	{
		path: '/',
		component: Books
	},
	{
		path: '/authors',
		component: Authors
	},
	{
		path: '/genres',
		component: Genres
	},
	{
		path: '/add-book',
		component: AddBook
	},
	{
		path: '/add-author',
		component: AddAuthor
	}
]

if ('scrollRestoration' in window.history) {
	window.history.scrollRestoration = 'manual';
}

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		// Fresh load / refresh: always start at the top
		if (from === START_LOCATION) {
			return { top: 0 };
		}
		// Back/forward: restore position
		return savedPosition || { top: 0 };
	}
});

export default router;