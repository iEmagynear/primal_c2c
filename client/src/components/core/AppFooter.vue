<template>
  <v-footer
    id="core-footer"
    absolute
    height="82"
  >
    <div class="footer-items">
      <span
        v-for="link in links"
        :key="link.name"
      >
        <a
          :href="link.Link"
          class="tertiary--text footer-links">{{ link.name }}</a>
      </span>
    </div>
    <v-spacer/>
    <span class="font-weight-light copyright">
      &copy;
      {{ (new Date()).getFullYear() }}
      <v-icon
        color="tertiary"
        size="17">mdi-heart</v-icon>
      Empowering a young generation!
    </span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      { name: 'C2C Webpage', Link: 'https://www.c2ckids.com/' },
      { name: 'Dashboard by Primal.', Link: 'https://www.primal-logic.io/'}
    ]
  })
}
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
