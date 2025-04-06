<template>
    <div class="page">
        <div class="right">
            <div class="login">
                <h1 class="login__welcome">{{ $t("RegisterPage.Welcome") }}</h1>
                <!--========= Login Form =========-->
                <div class="login__form">
                    <form @submit.prevent="Register()" method="post">
                        <!--========= FullName Input =========-->
                        <div class="input">
                            <label for="FullName" class="input__title">{{ $t("RegisterPage.FullName") }}</label>
                            <br>
                            <input type="text" class="text__input" :placeholder="$t('RegisterPage.FullName')"
                                id="FullName" v-model="FullName" />
                            <br>
                            <label for="FullName" class="input__error FullName"></label>
                        </div>

                        <!--========= Email Input =========-->
                        <div class="input">
                            <label for="Email" class="input__title">{{ $t("RegisterPage.Email") }}</label>
                            <br>
                            <input type="text" class="text__input" :placeholder="$t('RegisterPage.Email')" id="Email"
                                v-model="Email" />
                            <br>
                            <label for="Email" class="input__error Email"></label>
                        </div>

                        <!--========= PhoneNumber Input =========-->
                        <div class="input">
                            <label for="PhoneNumber" class="input__title">{{ $t("RegisterPage.PhoneNumber") }}</label>
                            <br>
                            <input type="text" class="text__input" :placeholder="$t('RegisterPage.PhoneNumber')"
                                id="PhoneNumber" v-model="PhoneNumber" />
                            <br>
                            <label for="PhoneNumber" class="input__error PhoneNumber"></label>
                        </div>

                        <!--========= Password Input =========-->
                        <div class="input">
                            <label for="Password" class="input__title">{{ $t("RegisterPage.Password") }}</label>
                            <br>
                            <input type="password" class="text__input" :placeholder="$t('RegisterPage.Password')"
                                id="Password" v-model="Password" />
                            <br>
                            <label for="Password" class="input__error Password"></label>
                        </div>

                        <div class="input">
                            <router-link :to="{ name: 'Login' }" class="forget__link">{{ $t("RegisterPage.Account")
                            }}</router-link>
                        </div>

                        <!--========= Submit Button =========-->
                        <button type="submit" class="submit__button">{{ $t("RegisterPage.Register") }}</button>
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

<script lang="js">
import Vue from 'vue';
import jquery from 'jquery';
import axios from 'axios';
import url from '@/ApiUrl';
let $ = jquery;

export default Vue.extend({
    name: "RegisterView",
    data() {
        return {
            FullName: "",
            Email: "",
            PhoneNumber: "",
            Password: "",
            errors: 0
        }
    },
    async mounted() {

        $("#FullName").on("focus", function () {
            $(".FullName").text("");
            $(this).removeClass("error__class");
        });
        $("#FullName").blur(function () {
            $(this).removeClass("error__class");
        });

        $("#Email").on("focus", function () {
            $(".Email").text("");
            $(this).removeClass("error__class");
        });
        $("#Email").blur(function () {
            $(this).removeClass("error__class");
        });


        $("#PhoneNumber").on("focus", function () {
            $(".PhoneNumber").text("");
            $(this).removeClass("error__class");
        });
        $("#PhoneNumber").blur(function () {
            $(this).removeClass("error__class");
        });


        $("#Password").on("focus", function () {
            $(".Password").text("");
            $(this).removeClass("error__class");
        });
        $("#Password").blur(function () {
            $(this).removeClass("error__class");
        });
    },
    methods: {
        Register() {
            this.errors = 0;

            if (this.FullName.trim().length == 0) {
                this.FullName = "";
                $("#FullName").addClass("error__class");
                $(".FullName").text(this.$t("RegisterPage.MissingFullName"));
                this.errors++;
            }

            if (this.Email.trim().length == 0) {
                this.Email = "";
                $("#Email").addClass("error__class");
                $(".Email").text(this.$t("RegisterPage.MissingEmail"));
                this.errors++;
            }

            if (this.PhoneNumber.trim().length == 0) {
                this.PhoneNumber = "";
                $("#PhoneNumber").addClass("error__class");
                $(".PhoneNumber").text(this.$t("RegisterPage.MissingPhoneNumber"));
                this.errors++;
            }

            if (this.Password.trim().length == 0) {
                this.Password = "";
                $("#Password").addClass("error__class");
                $(".Password").text(this.$t("RegisterPage.MissingPassword"));
                this.errors++;
            }

            if (this.errors == 0) {
                axios.post(url.ApiUrl + "/api/Authentication/Register",
                    {
                        FullName: this.FullName,
                        Email: this.Email,
                        phonenumber: this.PhoneNumber,
                        password: this.Password
                    }).then((res) => {
                        if (res.data.msg == "User Created") {
                            this.$router.push({ name: 'Login' })
                        }
                    }).catch((err) => {
                        let error = err.response.data.err;
                        if (error == "Email already exists") {
                            $("#Email").addClass("error__class");
                            $(".Email").text(this.$t("RegisterPage.EmailAlreadyExists"));
                        }

                        if (error == "Number already exists") {
                            $("#PhoneNumber").addClass("error__class");
                            $(".PhoneNumber").text(this.$t("RegisterPage.PhoneAlreadyExists"));
                        }
                    })
            }
        }
    }
});
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    justify-content: space-evenly;
    height: 970px;
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
    height: 970px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    overflow: hidden;
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

@media screen and (max-width: 1380px) {
    .left {
        display: none;
    }
}
</style>