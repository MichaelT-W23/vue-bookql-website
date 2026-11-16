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
}
</style>