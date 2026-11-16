<template>
	<div class="app-shell" :class="{ 'app-shell--gsa': isGoogleApp }">
		<NavBar />

		<main class="main-view">
			<router-view />
		</main>
	</div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';

const isGoogleApp = /GSA\//i.test(navigator.userAgent);

if ('scrollRestoration' in window.history) {
	window.history.scrollRestoration = 'manual';
}

document.documentElement.classList.toggle('gsa-scroll-host', isGoogleApp);
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
body,
#app {
  width: 100%;
}

html,
body {
  overflow-x: clip;
}

html.gsa-scroll-host,
html.gsa-scroll-host body,
html.gsa-scroll-host body #app {
  height: 100%;
  overflow: hidden;
}

.app-shell--gsa {
  height: 100vh;
  height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: none;
}
</style>
