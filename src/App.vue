<template>
	<NavBar></NavBar>

	<div class="main-view">
		<router-view />
	</div>
</template>


<script setup>
import { onBeforeUnmount } from 'vue';
import NavBar from './components/NavBar.vue';

if ('scrollRestoration' in window.history) {
	window.history.scrollRestoration = 'manual';
}

// Google iOS app: pull-to-refresh leaves the page ~60px scrolled.
// For 3s after load, once scroll stops moving, snap to top —
// unless the user has touched the screen.
let touched = false;
let lastY = null;
let stillTicks = 0;

const onTouch = () => {
	touched = true;
	stop();
};

const poll = setInterval(() => {
	if (touched) return;
	const y = window.scrollY;

	stillTicks = y === lastY ? stillTicks + 1 : 0;
	lastY = y;

	if (stillTicks >= 2 && y !== 0) {
		window.scrollTo(0, 0);
		stillTicks = 0;
	}
}, 100);

const stopTimer = setTimeout(() => stop(), 3000);

function stop() {
	clearInterval(poll);
	clearTimeout(stopTimer);
	window.removeEventListener('touchstart', onTouch);
}

window.addEventListener('touchstart', onTouch, { passive: true });

onBeforeUnmount(stop);
</script>


<style>
:root {
  --nav-height: 80px;
}

@media (max-width: 937.98px) {
  :root {
    --nav-height: 60px;
  }
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
  /* STEP 2: uncomment if the snap-to-top above doesn't fix the Google app */
  /* overscroll-behavior-y: none; */
}

.main-view {
  padding-top: calc(var(--nav-height) + env(safe-area-inset-top, 0px));
}
</style>