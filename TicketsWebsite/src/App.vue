<template>
  <div id="app" class="page">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap"
      rel="stylesheet" />
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'AppView',
  async mounted() {
    let page = document.getElementsByClassName("page")[0];
    if (this.$i18n.locale == "ar") {
      page.style.direction = "rtl";
    }
  }
});
</script>


<style lang="scss">
:root {

  /* Font */
  --FONT-SIZE: clamp(1.2rem, 0.9vw, 2rem);
  --FONT-COLOR: #2c3e50;

  /* Colors */
  --BG-COLOR: #121212;
  --BG2-COLOR: #1D1D1D;

  --PRIMARY-COLOR: #8884ff;
  --HOVER-COLOR: #4f4caf;
  --GRAY-COLOR: #bbb;
  --ERROR-COLOR: rgb(250, 82, 82);

  @media (prefers-color-scheme: dark) {
    --BG-COLOR: #121212;
    --BG2-COLOR: #1D1D1D;
    --FONT-COLOR: #eee;
    --PRIMARY-COLOR: #8884ff;
    --HOVER-COLOR: #4f4caf;
    --GRAY-COLOR: #bbb;
    --ERROR-COLOR: rgb(250, 82, 82);
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: "IBM Plex Sans Arabic", sans-serif;
  font-weight: 500;
  color: #2c3e50;
  background-color: var(--BG-COLOR);
  min-height: 100vh;
}

a {
  text-decoration: none;
  color: var(--FONT-COLOR);
}

button,
input {
  background: none;
  border: none;
  outline: none;
  font: inherit;
}
</style>
