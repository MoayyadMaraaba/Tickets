<template>
    <div class="h">
        <header class="header" id="header">
            <div class="header__logo">
                <img src="../assets/logo.png" width="40" height="40" alt="logo">
                <h2 class="header__title">Zimam</h2>
            </div>
            <nav class="header__nav">
                <ul class="nav__list">
                    <li class="nav__item">
                        <router-link to="" class="nav__link">{{ $t("Header.Home") }}</router-link>
                    </li>
                    <li class="nav__item" v-if="!isUserLoggedIn && !isAgentLoggedIn && !isAdminLoggedIn">
                        <router-link :to="{ name: 'Login' }" class="nav__link">{{ $t("Header.Login")
                        }}</router-link>
                    </li>
                    <li class="nav__item" v-if="!isUserLoggedIn && !isAgentLoggedIn && !isAdminLoggedIn">
                        <router-link :to="{ name: 'Register' }" class="nav__link">{{ $t("Header.Register") }}</router-link>
                    </li>
                    <li class="nav__item" v-if="isUserLoggedIn || isAgentLoggedIn || isAdminLoggedIn">
                        <router-link :to="{ name: 'Dashboard' }" class="nav__link">{{ $t("Header.Dashboard")
                        }}</router-link>
                    </li>
                    <li class="nav__item" v-if="isUserLoggedIn || isAgentLoggedIn || isAdminLoggedIn">
                        <router-link :to="{ name: 'Logout' }" class="nav__link">{{ $t("Header.Logout")
                        }}</router-link>
                    </li>
                </ul>
            </nav>
        </header>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: "HeaderComponent",
    data() {
        return {
            isUserLoggedIn: false,
            isAgentLoggedIn: false,
            isAdminLoggedIn: false,
        }
    },
    mounted() {
        this.isUserLoggedIn = this.$store.getters.isLoggedIn;
        this.isAgentLoggedIn = this.$store.getters.isAgentLoggedIn;
        this.isAdminLoggedIn = this.$store.getters.isAdminLoggedIn;

        let header: any = document.getElementById("header");
        function scrollFunction() {
            if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
                header.classList.add("header__background");
            } else {
                header.classList.remove("header__background");
            }
        }

        window.onscroll = function () { scrollFunction() };
    },
})
</script>

<style lang="scss" scoped>
.h {
    display: flex;
    justify-content: center;
    position: fixed;
    width: 100%;
    margin-top: 1rem;
}

.header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 8vh;
    width: 70%;
    transition: background 300ms ease-in-out;
    border-radius: 100px;
}

.header__background {
    background-color: var(--BG2-COLOR);
    box-shadow: 0px 0px 15px 10px rgba(0, 0, 0, 0.455);
}

.header__logo {
    display: flex;
    justify-content: center;
    align-items: center;
}

.header__logo img {
    display: block;
}

.header__title {
    color: var(--FONT-COLOR);
    padding-left: 1.5rem;
}

.nav__list {
    display: flex;
    list-style-type: none;
}

.nav__item {
    display: block;
    padding: 0 1rem;
}

.nav__link {
    color: var(--FONT-COLOR);
    font-weight: bold;
    transition: color 300ms ease-in-out;

    &:hover {
        color: var(--PRIMARY-COLOR);
    }
}
</style>