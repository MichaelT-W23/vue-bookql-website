<template>
	<NavBar></NavBar>

	<div class="main-view" ref="mainView">
		<router-view />
	</div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';

const mainView = ref(null);
const router = useRouter();

// window scroll no longer exists, so reset the container on page change
router.afterEach(() => {
  if (mainView.value) mainView.value.scrollTop = 0;
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
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.main-view {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  overflow-x: clip;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
  padding-top: calc(var(--nav-height) + env(safe-area-inset-top, 0px));
}
</style>