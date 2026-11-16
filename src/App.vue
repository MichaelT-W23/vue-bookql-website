<template>
	<NavBar></NavBar>

	<div class="main-view">
		<router-view />
	</div>

	<!-- TEMP DEBUG -->
	<pre class="debug-box">{{ debug }}</pre>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';

const router = useRouter();

// Force top on fresh load / refresh (beats iOS Safari's restore)
const scrollTop = () => window.scrollTo(0, 0);

if ('scrollRestoration' in window.history) {
	window.history.scrollRestoration = 'manual';
}

// TEMP DEBUG
const debug = ref('');
let timer = null;

const update = () => {
	const nav = document.querySelector('.navbar');
	const main = document.querySelector('.main-view');
	const title = document.querySelector('.page-title');
	const vv = window.visualViewport;

	debug.value = [
		`restore: ${window.history.scrollRestoration}`,
		`scrollY: ${Math.round(window.scrollY)}`,
		`innerW x H: ${window.innerWidth} x ${window.innerHeight}`,
		`nav height: ${nav?.offsetHeight}`,
		`nav top: ${nav ? Math.round(nav.getBoundingClientRect().top) : '-'}`,
		`main padTop: ${main ? getComputedStyle(main).paddingTop : '-'}`,
		`title top: ${title ? Math.round(title.getBoundingClientRect().top) : '-'}`,
		`vv offsetTop: ${vv ? Math.round(vv.offsetTop) : '-'}`,
		`--nav-height: ${getComputedStyle(document.documentElement).getPropertyValue('--nav-height')}`
	].join('\n');
};

const onPageShow = (e) => {
	if (e.persisted) scrollTop();
};

onMounted(async () => {
	await router.isReady();
	scrollTop();

	if (document.readyState === 'complete') {
		requestAnimationFrame(scrollTop);
	} else {
		window.addEventListener('load', () => requestAnimationFrame(scrollTop), { once: true });
	}
	window.addEventListener('pageshow', onPageShow);

	// TEMP DEBUG
	update();
	timer = setInterval(update, 250);
	window.addEventListener('scroll', update, { passive: true });
});

onBeforeUnmount(() => {
	window.removeEventListener('pageshow', onPageShow);

	// TEMP DEBUG
	clearInterval(timer);
	window.removeEventListener('scroll', update);
});
</script>


<style>
:root {
  --nav-height: 80px;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html,
body {
  overflow-x: clip;
  width: 100%;
}

.main-view {
  padding-top: calc(var(--nav-height) + env(safe-area-inset-top, 0px));
}

/* TEMP DEBUG */
.debug-box {
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.8);
  color: #0f0;
  font-size: 12px;
  padding: 8px;
  border-radius: 6px;
  pointer-events: none;
}
</style>