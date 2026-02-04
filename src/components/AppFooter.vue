<template>
  <footer>
    <h2 id="getting-started">Getting started</h2>
    <ul class="typography">
      <li>
        A 100-page murder mystery lies before you, its pages hopelessly out of order. Piece it back
        together to reveal the story — and the killers and victims hidden within it.
      </li>
      <li>
        To reorder pages, move them between the <em>Unsorted</em> and <em>Sorted</em> tabs. You can
        do this by:
        <ol>
          <li>
            Opening a page and toggling it between the <em>Sorted</em> and <em>Unsorted</em> tabs,
          </li>
          <li>
            Using the
            <em>Page order</em>
            field in the
            <em>Sorted</em>
            tab to add/remove sorted pages in batch.
          </li>
        </ol>
      </li>
      <li>Record your thoughts in the <em>Notes</em> tab (or on paper, if you prefer).</li>
      <li>
        Export your notes from the <em>Notes</em> tab. Note that your progress is saved unless you
        clear your cache.
      </li>
      <li>
        For help, visit <a href="https://www.reddit.com/r/CainsJawbone/">Reddit</a>, or learn more
        about the book on <a href="https://en.wikipedia.org/wiki/Cain%27s_Jawbone">Wikipedia</a>.
      </li>
    </ul>
    <p>© {{ currentYear }} Cain's Jawbone. All Rights Reserved.</p>
    <BaseButton href="#main" :iconAfter="chevronsUpSvg">Back to top</BaseButton>
  </footer>
</template>

<script setup lang="ts">
import BaseButton from './base/BaseButton.vue'
import chevronsUpSvg from '../assets/chevrons-up-feathericons.svg'

const currentYear = new Date().getFullYear()
</script>

<style scoped>
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-l);
  color: var(--color-foreground);
  background-color: var(--color-background);
  /* Updated through media queries */
  padding: var(--padding-m);
}
footer h2 {
  color: var(--color-accent);
}
footer > * {
  max-width: 608px;
}
footer ul {
  padding-left: var(--padding-s);
}
footer li {
  margin-bottom: var(--gap-s);
}

/* MEDIA QUERIES */
@media (width > 568px) {
  footer {
    padding: var(--padding-l);
  }
}
</style>
