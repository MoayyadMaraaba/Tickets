<template>
    <footer class="footer">
        <div class="col info">
            <img src="../assets/logo.png" width="40" height="40" class="info__image">
            <h2 class="info__name">{{ $t("Footer.Name") }}</h2>
            <p class="info__description">{{ $t("Footer.description") }}</p>
            <p class="copyright">{{ $t("Footer.Name") }} &copy; {{ year }}</p>
        </div>
        <div class="col sitemap">
            <h2 class="map">Links</h2>
            <ul class="links">
                <li class="links__item">
                    <router-link :to="{ name: 'home' }" class="item__link">{{ $t("Footer.Home") }}</router-link>
                </li>
                <li class="links__item"><router-link :to="{ name: 'CreateTicket' }" class="item__link">{{
                    $t("Footer.Contact") }}</router-link></li>
                <li class="links__item"><router-link :to="{ name: 'Dashboard' }" class="item__link">{{
                    $t("Footer.Dashboard") }}</router-link></li>
            </ul>
        </div>
        <div class="col">
            <h2 class="contact">{{ $t("Footer.Contact") }}</h2>
            <ul class="contact__list">
                <li class="contact__item">
                    <h4><i class="fa-regular fa-envelope"></i> {{ $t("Footer.Email") }} :
                        <span>support@zimamsys.com</span></h4>
                </li>
                <li class="contact__item">
                    <h4><i class="fa-solid fa-phone"></i> {{ $t("Footer.Phone") }} : <span>+97059999999</span></h4>
                </li>
                <li class="contact__item">
                    <h4><i class="fa-solid fa-location-dot"></i> {{ $t("Footer.Address") }} : <span>Al-Ain Street</span></h4>
                </li>
            </ul>
        </div>
    </footer>
</template>

<script>
import Vue from 'vue';
export default Vue.extend({
    name: "FooterComponent",
    components: {},
    data() {
        return {
            year: 0
        }
    },
    async mounted() {
        const date = new Date();
        this.year = date.getFullYear();
    }
})
</script>

<style lang="scss" scoped>
.footer {
    width: 100%;
    background-color: var(--BG2-COLOR);
    display: flex;
    flex-wrap: wrap;
}

.col {
    width: calc(100% / 3);
    padding: 1.5rem;
}

.info__company {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
}

.info__name {
    color: var(--FONT-COLOR);
    padding: 1rem 0;
}

.info__description {
    color: var(--GRAY-COLOR);
    font-weight: bold;
    width: 70%;
    text-align: justify;
}

.copyright {
    padding: 1rem 0 0 0;
    color: grey;
    font-weight: bold;
    font-size: 0.9rem;
}

.map {
    color: var(--FONT-COLOR);
    margin: 0;
}

.links {
    list-style-type: none;
}

.links__item {
    margin: 1rem 0;
}

.item__link {
    font-weight: bold;
    color: grey;
    transition: all 300ms ease-in-out;

    &:hover {
        color: var(--PRIMARY-COLOR);
    }
}

.contact {
    color: var(--FONT-COLOR);
    padding: 0 0 1rem 0;
}

.contact__list {
    list-style-type: none;
}

.contact__item {
    margin: 0 0 1rem 0;
    color: var(--FONT-COLOR);
    span {
        color: grey;
    }
}
</style>