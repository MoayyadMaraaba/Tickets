<template>
    <div class="page">

    </div>
</template>

<script lang="js">
import Vue from 'vue';

export default Vue.extend({
    async mounted() {
        localStorage.clear();
        this.$router.push({ name: 'home' });
        location.reload();
    }
})
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
}
</style>