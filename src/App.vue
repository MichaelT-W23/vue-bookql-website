<template>
	<NavBar></NavBar>

	<div class="main-view">
		<router-view />
	</div>
</template>


<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import NavBar from './components/NavBar.vue';

if ('scrollRestoration' in window.history) {
	window.history.scrollRestoration = 'manual';
}

// iOS can continue the pull-to-refresh bounce after the new page has loaded.
// Wait for that motion to settle before correcting the root scroll position.
const settleDelay = 180;
const guardDuration = 5000;
const scrollTolerance = 1;
let guardActive = false;
let settleTimer = null;
let guardTimer = null;

const stopGuard = () => {
	if (!guardActive) return;
	guardActive = false;
	clearTimeout(settleTimer);
	clearTimeout(guardTimer);
	window.removeEventListener('scroll', scheduleCorrection);
	window.removeEventListener('scrollend', scheduleCorrection);
	window.removeEventListener('touchstart', stopGuard);
	window.removeEventListener('pointerdown', stopGuard);
	window.removeEventListener('wheel', stopGuard);
	window.removeEventListener('keydown', stopGuard);
};

const scheduleCorrection = () => {
	if (!guardActive) return;
	clearTimeout(settleTimer);
	settleTimer = setTimeout(() => {
		if (!guardActive) return;
		if (Math.abs(window.scrollY) <= scrollTolerance) {
			stopGuard();
			return;
		}

		window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
		scheduleCorrection();
	}, settleDelay);
};

onMounted(() => {
	guardActive = true;
	window.addEventListener('scroll', scheduleCorrection, { passive: true });
	window.addEventListener('scrollend', scheduleCorrection, { passive: true });
	window.addEventListener('touchstart', stopGuard, { passive: true });
	window.addEventListener('pointerdown', stopGuard, { passive: true });
	window.addEventListener('wheel', stopGuard, { passive: true });
	window.addEventListener('keydown', stopGuard);
	guardTimer = setTimeout(stopGuard, guardDuration);
	scheduleCorrection();
});

onBeforeUnmount(() => {
	stopGuard();
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
</style>