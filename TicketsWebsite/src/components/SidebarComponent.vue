<template>
    <aside class="sidebar">
        <div class="sidebar__controls">
            <button class="sidebar__button" v-on:click="hideSidebar()"><i class="fa-solid fa-bars"></i></button>
        </div>
        <ul class="sidebar__list">
            <li class="sidebar__item">
                <router-link class="sidebar__link" :to="{ name: 'Dashboard' }">
                    <span class="sidebar__icon"><i class="fa-solid fa-table-columns"></i></span>
                    <span class="sidebar__content" style="display: none;">{{ $t("Dashboard.Sidebar.Dashboard") }}</span>
                </router-link>
            </li>
            <li class="sidebar__item" v-if="isAdminLoggedIn">
                <router-link class="sidebar__link" :to="{ name: 'Management' }">
                    <span class="sidebar__icon"><i class="fa-solid fa-list-check"></i></span>
                    <span class="sidebar__content" style="display: none;">{{ $t("Dashboard.Sidebar.Management") }}</span>
                </router-link>
            </li>
            <li class="sidebar__item" v-if="isAdminLoggedIn">
                <router-link class="sidebar__link" :to="{ name: 'Agents' }">
                    <span class="sidebar__icon"><i class="fa-solid fa-users"></i></span>
                    <span class="sidebar__content" style="display: none;">{{ $t("Dashboard.Sidebar.Agents") }}</span>
                </router-link>
            </li>
            <li class="sidebar__item">
                <router-link class="sidebar__link" :to="{ name: 'CreateTicket' }">
                    <span class="sidebar__icon"><i class="fa-solid fa-plus"></i></span>
                    <span class="sidebar__content" style="display: none;">{{ $t("Dashboard.Sidebar.Send") }}</span>
                </router-link>
            </li>
        </ul>
    </aside>
</template>

<script lang="js">
import Vue from "vue";
import jquery from "jquery";
let $ = jquery;

export default Vue.extend({
    name: "SidebarComponent",
    data() {
        return {
            isAdminLoggedIn: false,
            isAgentLoggedIn: false,
            isUserLoggedIn: false,
            sidebar: false,
        }
    },
    async mounted() {
        let isUser = false;
        const isAgent = this.$store.getters.isAgentLoggedIn;
        const isAdmin = this.$store.getters.isAdminLoggedIn;

        if (!isAgent && !isAdmin && this.$store.getters.isLoggedIn) {
            isUser = true;
        }

        this.isAdminLoggedIn = isAdmin;
        this.isAgentLoggedin = isAgent;
        this.isUserLoggedIn = isUser;


    },
    methods: {
        hideSidebar() {
            if (this.sidebar) {
                $(".sidebar, .sidebar__item").animate({ width: "80px" }, { duration: 400 });
                $(".sidebar__content").fadeOut(200);
                this.sidebar = false;
            } else {
                $(".sidebar, .sidebar__item").animate({ width: "300px" }, {
                    duration: 400
                });
                setTimeout(() => {
                    $(".sidebar__content").fadeIn(200);
                }, 400);
                this.sidebar = true;
            }

        },
    }
})
</script>

<style lang="scss" scoped>
.sidebar {
    width: 80px;
    background-color: #444444;
    min-height: calc(100vh - 80px);
}

.sidebar__controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 0px;
}

.sidebar__button {
    width: 50px;
    height: 50px;
    background-color: var(--PRIMARY-COLOR);
    border-radius: 50%;
    color: #fff;
    transform: translate(25px, 0px);
    transition: all 300ms ease-in-out;
    z-index: 5000;

    &:hover {
        background-color: #fff;
        color: var(--PRIMARY-COLOR);
        cursor: pointer;
    }
}

.sidebar__list {
    list-style-type: none;
}

.item {
    display: flex;
    transition: all 300ms ease-in-out;

    &:hover {
        background-color: var(--PRIMARY-COLOR);
    }
}

.sidebar__item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 65px;
}

.sidebar__link {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
    transition: background 300ms ease-in-out;

    &:hover {
        background-color: var(--PRIMARY-COLOR);
    }
}

.sidebar__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 65px;
    font-size: 1.5rem;
    color: #fff;
}

.sidebar__content {
    display: flex;
    align-items: center;
    width: 220px;
    height: 65px;
}
</style>