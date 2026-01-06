<template>
  <main id="main">
    <div class="header">
      <h1>Cain's Jawbone</h1>
      <Button href="#getting-started" :variant="'secondary'">Need help?</Button>
    </div>

    <Button @click="openSearchModal" :iconBefore="searchSvg">Search content</Button>
    <SearchModal ref="dialogRef" />
    <PagesOverview />
  </main>
  <footer>
    <h2 id="getting-started">Getting started</h2>
    <ul class="typography">
      <li>
        Here is a 100-page murder mystery... but the pages are all in the wrong order. To solve the
        puzzle, you must reorder the book, and find the names of the murderers and victims within
        the story.
      </li>
      <li>
        To reorder pages, you need to move them between the <em>Unsorted</em> and
        <em>Sorted</em> tabs. There are two ways to do that:
        <ol>
          <li>
            Open a page to read, and click on the <em>Unsort page</em>/<em>Sort page</em> button.
          </li>
          <li>
            Use the
            <em>Page order</em>
            field in the
            <em>Sorted</em>
            tab to add/remove sorted pages in batch.
          </li>
        </ol>
      </li>
      <li>
        Write down your thoughts in the <em>Notes</em> tab. You can also use paper and pen if you
        prefer to go analog!
      </li>
      <li>
        Regularly save your notes with the <em>Export</em> option (in the <em>Notes</em> tab). Once
        the page is reloaded, your progress will be reset.
      </li>
      <li>This website works on mobile, but you will have a better experience on desktop.</li>
      <li>
        Find some help among other mystery-seeking people on
        <a href="https://www.reddit.com/r/CainsJawbone/">Reddit</a>.
      </li>
      <li>
        Learn more about this fascinating book on
        <a href="https://en.wikipedia.org/wiki/Cain%27s_Jawbone">Wikipedia</a>.
      </li>
    </ul>

    <Button href="#main" :iconAfter="chevronsUpSvg">Back to top</Button>
  </footer>
</template>

<script setup lang="ts">
import Button from '../components/Button/Button.vue'
import SearchModal from '../components/SearchModal/SearchModal.vue'
import PagesOverview from '../components/PagesOverview/PagesOverview.vue'
import searchSvg from '../assets/search-feathericons.svg'
import chevronsUpSvg from '../assets/chevrons-up-feathericons.svg'
import { ref } from 'vue'

const dialogRef = ref<InstanceType<typeof SearchModal> | null>(null)

function openSearchModal() {
  dialogRef.value?.open()
}
</script>

<style scoped>
/* Main */
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-xl);
  max-width: 1480px;
  background-color: var(--color-background);
  /* Updated through media queries */
  padding: var(--padding-m) var(--padding-xs);
}
main .header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-l);
}
h1 {
  text-align: center;
}

/* Footer */
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
  h1 {
    font-size: 10vw;
  }
  main {
    padding: var(--padding-m);
  }
  footer {
    padding: var(--padding-l);
  }
}
@media (width > 800px) {
  main {
    padding: var(--padding-l);
  }
}
</style>
