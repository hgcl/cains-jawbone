<script setup lang="ts">
import Button from '../Button/Button.vue'
import IconButton from '../IconButton/IconButton.vue'
import chevronsLeft from '../../assets/chevrons-left-feathericons.svg'
import chevronsRight from '../../assets/chevrons-right-feathericons.svg'
import chevronsUp from '../../assets/chevrons-up-feathericons.svg'
import chevronsDown from '../../assets/chevrons-down-feathericons.svg'
import type { BookPage } from '../../types'
import { truncateText } from './Card.utils'

const { page } = defineProps<{
  page: BookPage
}>()
const emit = defineEmits<{
  (e: 'toggleSorted', value: boolean): void
  (e: 'clickMoveLeft', event: MouseEvent): void
  (e: 'clickMoveRight', event: MouseEvent): void
  (e: 'clickOpenDialog', event: MouseEvent): void
}>()
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
      <Button @click="(e) => emit('clickOpenDialog', e)"
        >View<span class="visually-hidden"> page {{ page.id }}</span></Button
      >
      <div class="card__checkbox">
        <input
          type="checkbox"
          :id="`sorted${page.id}`"
          :name="`sorted${page.id}`"
          :checked="page.list === 2"
          @change="emit('toggleSorted', ($event.target as HTMLInputElement).checked)"
        /><label :for="`sorted${page.id}`">Sorted</label>
      </div>
    </div>
  </article>
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
  margin-right: calc(-1 * var(--padding-s));
}

/* View and sort/view buttons */
.card__buttons {
  display: flex;
  gap: var(--gap-m);
  justify-content: center;
}
.card__checkbox {
  /* Reset styles */
  /* Custom styles -- similar to <Button> */
  display: flex;
  gap: var(--gap-xs);
  border: 1px solid var(--color-accent-subtle);
  border-radius: var(--border-radius);
  padding: var(--padding-xs);
}
.card__checkbox,
.card__checkbox > * {
  cursor: pointer;
  font-size: var(--font-size-body-s);
  font-weight: bold;
  text-transform: uppercase;
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
