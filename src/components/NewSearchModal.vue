<template>
  <div class="search-panel">
    <div class="panel-header">
      <h3 class="panel-title">Search</h3>

      <button
        class="close-button"
        @click="$emit('close')"
        aria-label="Close search"
      >
        <font-awesome-icon :icon="faTimes" />
      </button>
    </div>

    <div class="input-wrapper">
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="search"
        inputmode="search"
        enterkeyhint="search"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        class="search-input"
        placeholder="Search by title or author..."
      />

      <button
        v-if="searchQuery"
        class="clear-button"
        @click="clearSearch"
        aria-label="Clear search"
      >
        <font-awesome-icon :icon="faTimes" />
      </button>
    </div>

    <div class="separator"></div>

    <div v-if="filteredBooks.length" class="results">
      <ul>
        <li v-for="book in filteredBooks" :key="book.uuid">
          <strong>📚 {{ book.title }}</strong>
          <br />
          <span class="author">
            by {{ book.author.name }} ({{ book.publicationYear }})
          </span>
        </li>
      </ul>
    </div>

    <p v-else-if="searchQuery" class="no-results">
      No results found.
    </p>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['close'])

const searchQuery = ref("")
const inputRef = ref(null)

const GET_ALL_BOOKS = gql`
  query {
    getAllBooks {
      uuid
      title
      publicationYear
      genre
      author {
        name
      }
    }
  }
`

const { result } = useQuery(GET_ALL_BOOKS)

const filteredBooks = computed(() => {
  if (!result.value || !searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()

  return result.value.getAllBooks.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.name.toLowerCase().includes(query)
  )
})

let previousOverflow = ""

onMounted(() => {
  nextTick(() => inputRef.value?.focus())
  window.addEventListener("keydown", handleEsc)

  // Lock background scroll while panel is open
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = "hidden"
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleEsc)
  document.body.style.overflow = previousOverflow
})

function handleEsc(e) {
  if (e.key === "Escape") {
    emit('close')
  }
}

function clearSearch() {
  searchQuery.value = ""
  inputRef.value?.focus()
}

</script>


<style scoped>

.search-panel {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);

  width: min(420px, calc(100vw - 32px));
  max-height: calc(100vh - 140px);
  max-height: calc(100dvh - 140px);

  background: white;
  border-radius: 12px;
  padding: 20px;
  z-index: 2000;

  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);

  display: flex;
  flex-direction: column;

  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.panel-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.input-wrapper {
  position: relative;
  width: 100%;
  margin-top: 15px;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 12px 44px 12px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 16px; /* 16px+ prevents iOS auto-zoom on focus */
  outline: none;
  transition: border 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
}

/* Hide native search clear button (we have our own) */
.search-input::-webkit-search-cancel-button,
.search-input::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}

.search-input:focus {
  border-color: #C06C84;
}

.clear-button {
  position: absolute;
  right: 6px;
  top: 50%;
  font-size: 17px;
  transform: translateY(-50%);

  background: none;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;
  border-radius: 50%;

  transition: all 0.2s ease;
}

.clear-button svg {
  color: #999;
  transition: color 0.2s ease;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;

  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button svg {
  color: #333;
  transition: color 0.2s ease;
}

.separator {
  width: 100%;
  height: 2px;
  background: #eee;
  margin: 15px 0;
  flex-shrink: 0;
}

.results {
  flex: 1;
  min-height: 0;
  max-height: 300px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding-right: 5px;
}

.results ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.results li {
  background: #5FA8D3;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  word-break: break-word;
  transition: background 0.15s ease;
}

.results li:active {
  background: #4e95be;
}

.author {
  font-weight: normal;
}

.no-results {
  color: teal;
  font-weight: bold;
  font-size: 16px;
}

/* Hover effects only on devices that actually hover */
@media (hover: hover) {
  .close-button:hover {
    background: rgba(192, 108, 132, 0.15);
  }

  .close-button:hover svg {
    color: #C06C84;
  }

  .results li:hover {
    background: #4e95be;
  }
}

/* Mobile: full-screen panel */
@media (max-width: 600px) {
  .search-panel {
    top: 0;
    left: 0;
    transform: none;

    width: 100%;
    height: 100vh;
    height: 100dvh;
    max-height: none;

    border-radius: 0;
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top));
    padding-bottom: calc(16px + env(safe-area-inset-bottom));

    box-shadow: none;
  }

  .results {
    max-height: none;
  }

  .results li {
    padding: 14px;
  }
}

</style>