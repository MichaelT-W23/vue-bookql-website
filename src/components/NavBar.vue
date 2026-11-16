<template>
  <nav class="navbar">
    <div class="nav-container">
      <button
        class="icon-button menu-toggle"
        @click="toggleMenu"
        :aria-expanded="menuOpen"
        aria-label="Toggle menu"
      >
        <font-awesome-icon :icon="menuOpen ? 'xmark' : 'bars'" />
      </button>

      <div class="nav-links">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="nav-link"
        >
          {{ link.name }}
        </router-link>
      </div>

      <button class="icon-button search-button" @click="openSearch" aria-label="Search">
        <font-awesome-icon icon="search" />
      </button>
    </div>

    <!-- Mobile dropdown -->
    <transition name="dropdown">
      <div v-if="menuOpen" class="mobile-menu">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="mobile-link"
          @click="closeMenu"
        >
          {{ link.name }}
        </router-link>
      </div>
    </transition>
  </nav>

  <!-- Mobile menu backdrop -->
  <div
    v-if="menuOpen"
    class="menu-backdrop"
    @click="closeMenu"
  ></div>

  <!-- Overlay -->
  <div
    v-if="showSearch"
    class="overlay"
    @click="closeSearch"
  ></div>

  <!-- Side View -->
  <NewSearchModal
    v-if="showSearch"
    @close="closeSearch"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import NewSearchModal from './NewSearchModal.vue'

library.add(faSearch, faBars, faXmark)

const links = ref([
  { name: 'Books 📚', path: '/' },
  { name: 'Authors ✍🏻', path: '/authors' },
  { name: 'Genres 🧙🏻‍♂️', path: '/genres' },
  { name: 'Add Book 📘', path: '/add-book' },
  { name: 'Add Author 🖋️', path: '/add-author' }
])

const showSearch = ref(false)
const menuOpen = ref(false)
const route = useRoute()

const openSearch = () => {
  menuOpen.value = false
  showSearch.value = true
}

const closeSearch = () => {
  showSearch.value = false
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

watch(() => route.path, closeMenu)
</script>

<style scoped>
.navbar {
  background: #C06C84;
  width: 100%;
  position: sticky;
  top: 0;
  height: var(--nav-height, 80px);
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  padding: 12px 10px;
  font-size: 20px;
  font-weight: 600;
  color: #f1f1f1;
  text-decoration: none;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  background: #F4A261;
}

.icon-button {
  background: none;
  border: none;
  color: #f1f1f1;
  font-size: 21px;
  cursor: pointer;
  padding: 10px;
  border-radius: 6px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background-color: #F4A261;
}

.search-button {
  margin-left: 10px;
}

.menu-toggle {
  display: none;
}

/* Mobile dropdown */
.mobile-menu {
  position: absolute;
  top: var(--nav-height, 80px);
  left: 0;
  width: 100%;
  background: #C06C84;
  display: flex;
  flex-direction: column;
  padding: 8px 12px 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.mobile-link {
  padding: 14px 16px;
  font-size: 18px;
  font-weight: 600;
  color: #f1f1f1;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 6px;
}

.mobile-link:hover,
.mobile-link.router-link-exact-active {
  background: #F4A261;
}

.menu-backdrop {
  position: fixed;
  inset: var(--nav-height, 80px) 0 0 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 900;
}

@media (max-width: 937.98px) {
  .nav-container {
    justify-content: space-between;
  }

  .nav-links {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .search-button {
    margin-left: 0;
  }
}

@media (min-width: 938px) {
  .mobile-menu,
  .menu-backdrop {
    display: none;
  }
}
</style>