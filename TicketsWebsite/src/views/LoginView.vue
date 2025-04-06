<template>
    <div class="page">
        <div class="right">
            <div class="login">
                <h1 class="login__welcome">{{ $t("LoginPage.Welcome") }}</h1>
                <!--========= Login Form =========-->
                <div class="login__form">
                    <form @submit.prevent="Login()" method="post">
                        <!--========= Email Input =========-->
                        <div class="input">
                            <label for="Email" class="input__title">{{ $t("LoginPage.Email") }}</label>
                            <br>
                            <input type="text" class="text__input" :placeholder="$t('LoginPage.Email')" id="Email"
                                v-model="Email" />
                            <br>
                            <label for="Email" class="input__error email"></label>
                        </div>

                        <!--========= Password Input =========-->
                        <div class="input">
                            <label for="Password" class="input__title">{{ $t("LoginPage.Password") }}</label>
                            <br>
                            <input type="password" class="text__input" :placeholder="$t('LoginPage.Password')"
                                id="Password" v-model="Password" />
                            <br>
                            <label for="Password" class="input__error password"></label>
                        </div>

                        <div class="input">
                            <router-link to="" class="forget__link">{{ $t("LoginPage.Forget") }}</router-link>
                        </div>

                        <!--========= Submit Button =========-->
                        <button type="submit" class="submit__button">{{ $t("LoginPage.Login") }}</button>
                    </form>
                </div>

                <!--========= Footer =========-->
                <div class="login__footer">
                    <ul class="footer__list">
                        <li class="footer__item">
                            <router-link :to="{ name: 'home' }" class="footer__link">{{ $t("LoginPage.Home")
                                }}</router-link>
                        </li>
                        <li class="footer__item">
                            <router-link to="About" class="footer__link">{{ $t("LoginPage.About") }}</router-link>
                        </li>
                        <li class="footer__item">
                            <router-link to="Contact" class="footer__link">{{ $t("LoginPage.Contact") }}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="left">
            <div class="r">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import jquery from 'jquery';
let $ = jquery;
export default Vue.extend({
    name: "LoginView",
    data() {
        return {
            Email: "",
            Password: "",
            errors: 0
        }
    },
    mounted() {
        let page = document.getElementsByClassName("page")[0];
        if (this.$i18n.locale == "ar") {
            page.style.direction = "rtl";
        }

        $("#Email").on("focus", function () {
            $(".email").text("");
            $(this).removeClass("error__class");
        });

        $("#Email").blur(function () {
            $(this).removeClass("error__class");
        });

        $("#Password").on("focus", function () {
            $(".password").text("");
            $(this).removeClass("error__class");
        });

        $("#Password").blur(function () {
            $(this).removeClass("error__class");
        });
    },
    methods: {
        Login() {
            this.errors = 0;

            if (this.Email.trim().length == 0) {
                this.Email = "";
                $("#Email").addClass("error__class");
                $(".email").text(this.$t("LoginPage.MissingEmail"));
                this.errors++;
            }

            if (this.Password.trim().length == 0) {
                this.Password = "";
                $("#Password").addClass("error__class");
                $(".password").text(this.$t("LoginPage.MissingPassword"));
                this.errors++;
            }

            if (this.errors == 0) {
                this.$store.dispatch("Login", { Email: this.Email, Password: this.Password }).then((res) => {
                    if (res.status == 200) {
                        location.replace("http://" + location.host + "/" + this.$i18n.locale + "/Dashboard");
                    }
                }).catch((err) => {
                    if (err.response.data.err == "No Email Found") {
                        $("#Email").addClass("error__class");
                        $(".email").text(this.$i18n.t("LoginPage.NoEmailFound"));
                    }
                    if (err.response.data.err == "Password is Wrong") {
                        $("#Password").addClass("error__class");
                        $(".password").text(this.$i18n.t("LoginPage.WrongPassword"));
                    }
                })
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    justify-content: space-evenly;
    height: 100vh;
    overflow: hidden;
}

.left,
.right {
    width: 50%;
    height: 100%;
}

.right {
    display: flex;
    align-items: center;
    justify-content: center;

}

.login {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}

.login__welcome {
    color: var(--FONT-COLOR);
}

.input {
    margin: 0.5rem;
    margin-top: 2rem;
}

.input:first-child {
    margin-top: 0.5rem;
}

.input__title {
    color: var(--FONT-COLOR);
    font-weight: bold;
}

.text__input {
    width: 365px;
    height: 45px;
    padding: 0 1rem;
    border: 2px solid #bbb;
    border-radius: 5px;
    font-weight: bold;
    margin-top: 1rem;
    color: var(--FONT-COLOR);
    transition: all 300ms ease-in-out;
}

.text__input:focus {
    outline-width: 3px;
    outline-style: solid;
    outline-color: var(--HOVER-COLOR);
    border: 2px solid var(--PRIMARY-COLOR);
}

.error__class {
    border: 2px solid var(--ERROR-COLOR);
}

.text__input::placeholder {
    font-weight: bold;
    color: var(--FONT-COLOR);
}

.input__error {
    display: block;
    padding-top: 0.5rem;
    font-weight: bold;
    color: var(--ERROR-COLOR);
}

.submit__button {
    width: 365px;
    height: 40px;
    background-color: var(--PRIMARY-COLOR);
    margin: 0.5rem;
    margin-top: 2rem;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
    font-size: 1rem;
    transition: background 300ms ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: var(--HOVER-COLOR);
    }
}

.forget__link {
    color: var(--GRAY-COLOR);
    font-weight: bold;
    font-size: 0.9rem;
    transition: color 300ms ease-in-out;

    &:hover {
        color: var(--HOVER-COLOR);
    }
}

.footer__list {
    display: flex;
    list-style-type: none;
}

.footer__item {
    margin: 0 1rem;
}

.footer__link {
    font-weight: bold;
    transition: color 300ms ease-in-out;

    &:hover {
        color: var(--HOVER-COLOR);
    }
}

.left {
    display: flex;
    justify-content: center;
    align-items: center;
}

.r {
    display: flex;
    justify-content: space-evenly;
}

.line {
    width: 85px;
    height: 3000px;
    background-color: var(--PRIMARY-COLOR);
    transform: rotate(35deg);
    margin: 0rem 2rem;
}

@media screen and (max-height: 600px) {
    .left {
        display: none;
    }
}

@media screen and (max-width: 1242px) {
    .left {
        display: none;
    }
}
</style>