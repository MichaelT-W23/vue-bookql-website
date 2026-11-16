<template>
	<NavBar></NavBar>

	<div class="main-view">
		<router-view />	
	</div>
</template>


<script setup>
import NavBar from './components/NavBar.vue';
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
  /* padding-top: calc(var(--nav-height) + env(safe-area-inset-top, 0px)); */
  padding-top: 80px;
}
</style>