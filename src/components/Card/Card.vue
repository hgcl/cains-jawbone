<script setup lang="ts">
import { ref } from 'vue'
import PageModal from '../PageModal/PageModal.vue'
import Button from '../Button/Button.vue'
import IconButton from '../IconButton/IconButton.vue'
import chevronsLeft from '../../assets/chevrons-left-feathericons.svg'
import chevronsRight from '../../assets/chevrons-right-feathericons.svg'
import chevronsUp from '../../assets/chevrons-up-feathericons.svg'
import chevronsDown from '../../assets/chevrons-down-feathericons.svg'
import type { BookPage } from '../../types'
import { truncateText, useOpenDialog } from './Card.utils'

defineProps<{
  page: BookPage
}>()
const emit = defineEmits<{
  (e: 'clickSendToSort', event: MouseEvent): void
  (e: 'clickSendToUnsorted', event: MouseEvent): void
  (e: 'clickMoveLeft', event: MouseEvent): void
  (e: 'clickMoveRight', event: MouseEvent): void
}>()

// Selected page that should be shown in the dialog
const selectedPage = ref<BookPage | null>(null)

// The dialog component exposes `.open()` through a template ref
const dialogRef = ref<InstanceType<typeof PageModal> | null>(null)

const openDialog = useOpenDialog(selectedPage, dialogRef)
</script>

<template>
  <article class="card">
    <h3 class="card__page" v-if="page">Page {{ page.id }}</h3>
    <div class="card__preview-arrows-wrapper">
      <p class="card__preview">
        <span v-html="truncateText(page.content, 'end')"></span> [...]
        <span v-html="truncateText(page.content, 'start')"></span>
      </p>
      <div v-if="page.list === 2" class="card__arrows_desktop">
        <IconButton :icon="chevronsLeft" @click="(e) => emit('clickMoveLeft', e)"
          >Move left</IconButton
        ><IconButton :icon="chevronsRight" @click="(e) => emit('clickMoveRight', e)"
          >Move right</IconButton
        >
      </div>
      <div v-if="page.list === 2" class="card__arrows_mobile">
        <IconButton :icon="chevronsUp" @click="(e) => emit('clickMoveLeft', e)">Move up</IconButton
        ><IconButton :icon="chevronsDown" @click="(e) => emit('clickMoveRight', e)"
          >Move down</IconButton
        >
      </div>
    </div>
    <div class="card__buttons">
      <Button @click="openDialog(page)"
        >View<span class="visually-hidden"> page {{ page.id }}</span></Button
      >
      <Button
        class="card__button_sort"
        v-if="page.list === 1"
        @click="(e) => emit('clickSendToSort', e)"
        >Sort<span aria-hidden="true"> &uarr;</span></Button
      >
      <Button
        class="card__button_remove"
        v-if="page.list === 2"
        @click="(e) => emit('clickSendToUnsorted', e)"
        >Remove<span aria-hidden="true"> &darr;</span></Button
      >
    </div>
  </article>

  <PageModal ref="dialogRef" :page="selectedPage" />
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--gap-m);
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  cursor: grab;
  /* Updated through media queries */
  width: 100%;
  padding: var(--padding-s) var(--padding-m);
  /* Necessary for .card__arrows_desktop positioning */
  position: relative;
}
.card__page {
  text-align: center;
}

/* Content preview */
.card__preview {
  color: var(--color-foreground);
}
.card__preview > span:last-of-type {
  /* Updated through media queries */
  display: none;
}

/* Move cards up-down/left-right */
.card__preview-arrows-wrapper {
  display: flex;
  align-items: center;
  gap: var(--gap-s);
}
.card__arrows_desktop {
  display: none;
}
.card__arrows_mobile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--gap-s);
  margin-right: -1rem;
}

/* View and sort/remove buttons */
.card__buttons {
  display: flex;
  gap: var(--gap-m);
  justify-content: center;
}

/* INTERACTIONS */
.card:active {
  cursor: grabbing;
}

/* MEDIA QUERIES */
@media (width > 568px) {
  .card {
    height: 312px;
    width: 100%;
    max-width: 216px;
    padding: var(--padding-m);
  }
  .card__preview > span:last-of-type {
    display: unset;
  }

  /* Move page up-down arrows are replaced by left-right */
  .card__arrows_desktop {
    position: absolute;
    display: flex;
    justify-content: space-between;
    top: 1.5rem;
    left: 0;
    padding: 0 0.5rem;
    width: 100%;
    /* Arrows will be made visible on hover/focus */
    opacity: 0;
  }
  .card__arrows_mobile {
    display: none;
  }

  /* INTERACTIONS */
  .card:hover .card__arrows_desktop,
  .card:focus-within .card__arrows_desktop {
    opacity: 1;
  }
}
</style>
