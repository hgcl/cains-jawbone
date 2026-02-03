<template>
  <article class="card">
    <h3 class="card__page" v-if="page">Page {{ page.id }}</h3>
    <div class="card__preview-arrows-wrapper">
      <p class="card__preview">
        <span v-html="sanitizeHtml(truncateText(page.content, 'end'))"></span>
        <span class="card__preview__dots"> [...] </span>
        <span v-html="sanitizeHtml(truncateText(page.content, 'start'))"></span>
      </p>
      <div v-if="page.list === 2" class="card__arrows_desktop">
        <IconButton :icon="chevronsLeft" @click="(e) => emit('click:moveleft', e)"
          >Move left</IconButton
        ><IconButton :icon="chevronsRight" @click="(e) => emit('click:moveright', e)"
          >Move right</IconButton
        >
      </div>
      <div v-if="page.list === 2" class="card__arrows_mobile">
        <IconButton :icon="chevronsUpSvg" @click="(e) => emit('click:moveleft', e)"
          >Move up</IconButton
        ><IconButton :icon="chevronsDownSvg" @click="(e) => emit('click:moveright', e)"
          >Move down</IconButton
        >
      </div>
    </div>
    <ButtonElement
      @click="(e) => emit('open:dialog', e)"
      class="card__open-page-button"
      :iconBefore="bookOpenSvg"
      >Full page<span class="visually-hidden"> page {{ page.id }}</span>
    </ButtonElement>
  </article>
</template>

<script setup lang="ts">
import sanitizeHtml from 'sanitize-html'

import ButtonElement from '../ButtonElement/ButtonElement.vue'
import IconButton from '../IconButton/IconButton.vue'
import chevronsLeft from '../../assets/chevrons-left-feathericons.svg'
import chevronsRight from '../../assets/chevrons-right-feathericons.svg'
import chevronsUpSvg from '../../assets/chevrons-up-feathericons.svg'
import chevronsDownSvg from '../../assets/chevrons-down-feathericons.svg'
import bookOpenSvg from '../../assets/book-open-feathericons.svg'
import type { BookPage } from '../../types'
import { truncateText } from './CardPreview.utils'

const { page } = defineProps<{
  page: BookPage
}>()
const emit = defineEmits<{
  (e: 'click:moveleft', event: MouseEvent): void
  (e: 'click:moveright', event: MouseEvent): void
  (e: 'open:dialog', event: MouseEvent): void
}>()
</script>

<style scoped>
#page-array__2 .card {
  cursor: grab;
}
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--gap-m);
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
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
.card__preview__dots {
  opacity: 0.6;
}

.card__open-page-button {
  margin-left: auto;
  margin-right: auto;
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
  margin-right: calc(-1 * var(--padding-s));
}

/* View and sort/view buttons */
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
    height: 100%;
    width: 100%;
    /* max-width must be in `em` so that the `font-size: 200%` test passes */
    max-width: 12.5em;
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
    top: var(--padding-m);
    left: 0;
    padding: 0 var(--padding-xs);
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
