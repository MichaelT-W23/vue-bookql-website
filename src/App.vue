<template>
	<NavBar></NavBar>

	<div class="main-view">
		<router-view />
	</div>
</template>


<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';

const router = useRouter();

const scrollTop = () => window.scrollTo(0, 0);

if ('scrollRestoration' in window.history) {
	window.history.scrollRestoration = 'manual';
}

// iOS pull-to-refresh leaves leftover momentum that carries the page
// past 0 after reload. For the first 2s, if the user hasn't touched,
// wait for scrolling to settle, then snap back to the top.
let touched = false;
let settleTimer = null;
let guardActive = true;

const onTouch = () => {
	touched = true;
	clearTimeout(settleTimer);
	stopGuard();
};

const onGuardScroll = () => {
	clearTimeout(settleTimer);
	settleTimer = setTimeout(() => {
		if (!touched && window.scrollY > 0) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, 120);
};

const stopGuard = () => {
	if (!guardActive) return;
	guardActive = false;
	window.removeEventListener('touchstart', onTouch);
	window.removeEventListener('scroll', onGuardScroll);
};

window.addEventListener('touchstart', onTouch, { passive: true });
window.addEventListener('scroll', onGuardScroll, { passive: true });
const guardTimeout = setTimeout(stopGuard, 2000);

const onPageShow = (e) => {
	if (e.persisted) scrollTop();
};

onMounted(async () => {
	await router.isReady();
	scrollTop();
	window.addEventListener('pageshow', onPageShow);
});

onBeforeUnmount(() => {
	clearTimeout(guardTimeout);
	clearTimeout(settleTimer);
	stopGuard();
	window.removeEventListener('pageshow', onPageShow);
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