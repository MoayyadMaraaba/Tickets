<template>
  <div class="page">
    <!--=========== Header ===========-->
    <HeaderComponent />

    <!--=========== Welcome Section ===========-->
    <section class="page__section welcome" id="Welcome">
      <section class="welcome__content">
        <h1 class="welcome__title">Welcome</h1>
        <p class="welcome__description">If you have any questions, please click the button below.</p>
        <router-link :to="{ name: 'Login' }" class="login__link">Contact Us</router-link>
      </section>
      <section class="welcome__figure">
        <img src="../assets/Welcome.svg" width="400">
      </section>
    </section>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeaderComponent from "../components/HeaderComponent.vue";

export default Vue.extend({
  name: 'HomeView',
  components: {
    HeaderComponent
  },
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
}

.welcome {
  display: flex;
  height: 90vh;
}

.welcome__content,
.welcome__figure {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.welcome__title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--FONT-COLOR);
}

.welcome__title strong {
  color: var(--PRIMARY-COLOR);
}

.welcome__description {
  text-align: left;
  font-weight: bold;
  color: #bbb;
  width: 400px;
}

.login__link {
  width: 400px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-align: center;
  margin-top: 1rem;
  border-radius: 5px;
  background-color: var(--PRIMARY-COLOR);
}
</style>
