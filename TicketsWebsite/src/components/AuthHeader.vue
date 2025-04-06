<template>
    <header>
        <nav class="navbar">
            <div class="navbar__title">
                <img src="../assets/logo.png" width="40" height="40" />
                <h1>Zimam</h1>
            </div>
            <ul class="navbar__list">
                <li class="navbar__item"><router-link :to="{ name: 'Dashboard' }" class="navbar__link">{{
                    $t("Dashboard.Header.Dashboard") }}</router-link></li>
                <li class="navbar__item"><router-link :to="{ name: 'CreateTicket' }" class="navbar__link">{{
                    $t("Dashboard.Header.Send") }}</router-link></li>
                <li class="navbar__item"><router-link :to="{ name: 'Profile' }" class="navbar__link">{{
                    $t("Dashboard.Header.Profile") }}</router-link></li>
                <li class="navbar__item"><router-link :to="{ name: 'Logout' }" class="navbar__link">
                        {{ $t("Dashboard.Header.Logout") }}</router-link></li>
            </ul>
        </nav>
    </header>
</template>

<script>
import Vue from 'vue';
export default Vue.extend({
    name: "AuthHeader",
});

</script>

<style lang="scss" scoped>
.navbar {
    width: 100%;
    height: 80px;
    background-color: var(--BG2-COLOR);
    box-shadow: 0px 0px 15px 10px rgba(0, 0, 0, 0.328);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8rem 0 8rem;
    z-index: 4500;
}

.navbar__title {
    display: flex;
    align-items: center;
    color: #fff;

    h1 {
        margin: 0 1rem;
    }
}

.navbar__list {
    list-style-type: none;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
}

.navbar__item {
    margin: 0 1rem;
}

.navbar__link {
    color: var(--FONT-COLOR);
    font-weight: bold;
    transition: color 300ms ease-in-out;

    &:hover {
        color: var(--PRIMARY-COLOR);
    }
}
</style>