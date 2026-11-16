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
import NavBar from './components/NavBar.vue';

const debug = ref('');
let timer = null;

const update = () => {
	const nav = document.querySelector('.navbar');
	const main = document.querySelector('.main-view');
	const title = document.querySelector('.page-title');
	const vv = window.visualViewport;

	debug.value = [
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

onMounted(() => {
	update();
	timer = setInterval(update, 250);
	window.addEventListener('scroll', update, { passive: true });
});

onBeforeUnmount(() => {
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