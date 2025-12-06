<script setup lang="ts">
import { computed, ref } from 'vue'
import bookJson from '../../assets/book.json'
import Modal from '../Modal/Modal.vue'
import Button from '../Button/Button.vue'
import type { BookPage } from '@/types'

/**
 * MODAL RELATED
 */
const modalRef = ref<InstanceType<typeof Modal> | null>(null)

// Forward exposed methods from Modal.vue
defineExpose({
  open: () => modalRef.value?.open(),
  close: () => modalRef.value?.close(),
})

/**
 * SEARCH FEATURE
 */

type SearchResult = {
  page: BookPage
  snippet: string
}

const search = defineModel<string>('')

const searchResults = computed<SearchResult[]>(() => {
  if (!search.value) return []

  const query = search.value.toLowerCase()

  return bookJson
    .map((page) => {
      // Search `query` in `bookJson`, if no result => index === -1
      const index = page.content.toLowerCase().indexOf(query)
      if (index === -1) return null

      // Create snippet
      const snippetLength = 30
      const start = Math.max(0, index - snippetLength)
      // `index + query.length` gives the position right after the end of the search term
      const end = Math.min(page.content.length, index + query.length + snippetLength)
      let snippet = page.content.slice(start, end)
      if (start > 0) snippet = '...' + snippet
      if (end < page.content.length) snippet = snippet + '...'

      return { page, snippet }
    })
    .filter((result) => result !== null)
})

/**
 * OPEN PAGE
 */
const searchVisible = ref<boolean>(true)
const pageNumber = ref<number | null>(null)
const pageContent = ref('')
const heading = computed(() => (searchVisible.value ? 'Search' : `Page ${pageNumber.value}`))

function showPage(page: BookPage) {
  // Hide search (and show page)
  searchVisible.value = false

  pageNumber.value = page.id
  pageContent.value = page.content
}

function backToSearch() {
  searchVisible.value = true
}
</script>

<template>
  <Modal ref="modalRef">
    <template #back
      ><Button v-if="!searchVisible" @click="backToSearch()">Back to search</Button></template
    >
    <template #heading>{{ heading }}</template>
    <div v-if="searchVisible">
      <input type="text" v-model="search" placeholder="Search book content" />
      <ul>
        <li v-for="result in searchResults" :key="result.page.id">
          <Button variant="secondary" @click="showPage(result.page)"
            >Page {{ result.page.id }}</Button
          >
          <p>{{ result.snippet }}</p>
        </li>
      </ul>
    </div>
    <div v-if="!searchVisible">
      <p>{{ pageContent }}</p>
    </div>
  </Modal>
</template>

<style scoped>
h3 {
  color: var(--color-accent);
  text-align: center;
  margin-bottom: var(--gap-m);
}
ul {
  /* Reset styles */
  list-style: none;
  padding: 0;
  /* Custom styles */
  display: flex;
  flex-direction: column;
  gap: var(--gap-s);
  margin-top: var(--gap-m);
}
li {
  padding-bottom: var(--gap-s);
  border-bottom: 1px solid var(--color-accent-subtle);
}
li > p {
  padding-left: var(--padding-s);
}
</style>
