<template>
  <Modal ref="modalRef">
    <template #back
      ><Button
        v-if="!searchVisible"
        :variant="'secondary'"
        @click="backToSearch()"
        :iconBefore="chevronLeftSvg"
        >Back to search</Button
      ></template
    >
    <template #heading>{{ heading }}</template>
    <div v-if="searchVisible">
      <input
        class="search-modal__input"
        type="text"
        v-model="search"
        placeholder="Search the pages"
      />
      <p v-if="!searchResults.length">No results</p>
      <ul class="search-modal__result-list" v-if="searchResults.length">
        <li class="search-modal__result-item" v-for="result in searchResults" :key="result.page.id">
          <Button :variant="'secondary'" @click="showPage(result.page)"
            >Page {{ result.page.id }}</Button
          >
          <p v-html="sanitizeHtml(result.snippet)"></p>
        </li>
      </ul>
    </div>
    <div v-if="!searchVisible" class="search-modal__page-list">{{ pageList }}</div>
    <p v-if="!searchVisible" v-html="sanitizeHtml(pageContent)"></p>
  </Modal>
</template>

<script setup lang="ts">
import sanitizeHtml from 'sanitize-html'

import { computed, ref } from 'vue'
import Modal from '../Modal/Modal.vue'
import Button from '../Button/Button.vue'
import chevronLeftSvg from '../../assets/chevron-left-feathericons.svg'
import type { BookPage } from '@/types'
import { filterResultsByQuery, useShowPage } from './SearchModal.utils'

/**
 * MODAL RELATED
 */
const modalRef = ref<InstanceType<typeof Modal> | null>(null)

// Forward exposed methods from Modal.vue
defineExpose({
  open: () => {
    resetModal()
    modalRef.value?.open()
  },
  close: () => modalRef.value?.close(),
})

function resetModal() {
  searchVisible.value = true
  search.value = ''
}

/**
 * SEARCH FEATURE
 */

type SearchResult = {
  page: BookPage
  snippet: string
}

const search = ref<string>('')

const searchResults = computed<SearchResult[]>(() => {
  if (!search.value) return []

  const query = search.value.toLowerCase()
  const filteredResults = filterResultsByQuery(query)

  return filteredResults
})

/**
 * OPEN PAGE
 */
const searchVisible = ref<boolean>(true)
const pageNumber = ref<number | null>(null)
const pageContent = ref('')
const pageList = ref<string>('')
const heading = computed(() => (searchVisible.value ? 'Search' : `Page ${pageNumber.value}`))

const { showPage, backToSearch } = useShowPage(searchVisible, pageNumber, pageContent, pageList)
</script>

<style scoped>
.search-modal__input {
  margin-bottom: var(--gap-m);
}
.search-modal__result-list {
  /* Reset styles */
  list-style: none;
  padding: 0;
  /* Custom styles */
  display: flex;
  flex-direction: column;
  gap: var(--gap-m);
}
.search-modal__result-item {
  padding-bottom: var(--gap-s);
  border-bottom: 1px solid var(--color-accent-subtle);
}
.search-modal__result-item > p {
  padding: var(--padding-xs);
}
.search-modal__page-list {
  text-align: center;
  text-transform: uppercase;
  font-size: var(--font-size-body-s);
  font-weight: bold;
}
.search-modal__page-list::before,
.search-modal__page-list::after {
  content: ' — ';
}
</style>
