<template>
    <div>
        <AuthHeader />
        <main class="main">
            <Sidebar />
            <section class="Manage">
                <h1 class="section__title">{{ $t("ProfilePage.title") }}</h1>

                <button class="updatePassword" v-on:click="showPassword()">{{ $t("ProfilePage.UpdatePassword")
                    }}</button>
                <div class="user__information">
                    <!--========= FullName Input =========-->
                    <div class="input">
                        <label for="FullName" class="input__title">{{ $t("RegisterPage.FullName") }}</label>
                        <br>
                        <input type="text" class="text__input" :placeholder="$t('RegisterPage.FullName')" id="FullName"
                            v-model="FullName" v-on:input="change('FullName')" />
                        <br>
                        <label for="FullName" class="input__error FullName"></label>
                    </div>

                    <!--========= Email Input =========-->
                    <div class="input">
                        <label for="Email" class="input__title">{{ $t("RegisterPage.Email") }}</label>
                        <br>
                        <input type="text" class="text__input" :placeholder="$t('RegisterPage.Email')" id="Email"
                            v-model="Email" v-on:input="change('Email')" />
                        <br>
                        <label for="Email" class="input__error Email"></label>
                    </div>

                    <!--========= PhoneNumber Input =========-->
                    <div class="input">
                        <label for="PhoneNumber" class="input__title">{{ $t("RegisterPage.PhoneNumber") }}</label>
                        <br>
                        <input type="text" class="text__input" :placeholder="$t('RegisterPage.PhoneNumber')"
                            id="PhoneNumber" v-model="PhoneNumber" v-on:input="change('PhoneNumber')" />
                        <br>
                        <label for="PhoneNumber" class="input__error PhoneNumber"></label>
                    </div>

                    <div class="input">
                        <button class="submit__button" v-on:click="UpdateInformation()">{{ $t("ProfilePage.Save")
                        }}</button>
                    </div>
                </div>

                <button class="updateInformation" v-on:click="showInformation()">{{ $t("ProfilePage.UpdateInformation")
                }}</button>
                <div class="user__password">
                    <!--========= Current Password Input =========-->
                    <div class="input">
                        <label for="CurrentPassword" class="input__title">{{ $t("ProfilePage.CurrentPassword")
                            }}</label>
                        <br>
                        <input type="password" class="text__input" :placeholder="$t('ProfilePage.CurrentPassword')"
                            id="CurrentPassword" v-model="CurrentPassword" />
                        <br>
                        <label for="CurrentPassword" class="input__error CurrentPassword"></label>
                    </div>

                    <!--========= New Password Input =========-->
                    <div class="input">
                        <label for="NewPassword" class="input__title">{{ $t("ProfilePage.NewPassword") }}</label>
                        <br>
                        <input type="password" class="text__input" :placeholder="$t('ProfilePage.NewPassword')"
                            id="NewPassword" v-model="NewPassword" />
                        <br>
                        <label for="NewPassword" class="input__error NewPassword"></label>
                    </div>

                    <!--========= Confirm Password Input =========-->
                    <div class="input">
                        <label for="ConfirmPassword" class="input__title">{{ $t('ProfilePage.ConfirmPassword')
                            }}</label>
                        <br>
                        <input type="password" class="text__input" :placeholder="$t('ProfilePage.ConfirmPassword')"
                            id="ConfirmPassword" v-model="ConfirmPassword" />
                        <br>
                        <label for="ConfirmPassword" class="input__error ConfirmPassword"></label>
                    </div>

                    <div class="input">
                        <button class="submit__button" v-on:click="updatePassword()">{{ $t("ProfilePage.Update")
                        }}</button>
                    </div>
                </div>
            </section>
            <div class="te" v-if="success">
                <div class="messageBox">
                    <div class="message__icon">
                        <img src="../assets/check.svg" width="30" height="30">
                    </div>
                    <div class="message__info">
                        <div class="message__title">
                            <h3>{{ MessageTitle }}</h3>
                        </div>
                        <div class="message__content">
                            <span>{{ MessageDescription }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import Vue from 'vue';
import AuthHeader from '@/components/AuthHeader.vue';
import Sidebar from '@/components/SidebarComponent.vue';
import axios from 'axios';
import url from '@/ApiUrl';
import jquery from 'jquery';
let $ = jquery;

export default Vue.extend({
    name: "ProfileView",
    components: {
        AuthHeader,
        Sidebar
    },
    data() {
        return {
            FullName: "",
            Email: "",
            PhoneNumber: "",
            CurrentPassword: "",
            NewPassword: "",
            ConfirmPassword: "",
            success: false,
            MessageTitle: "",
            MessageDescription: "",
            body: {}
        }
    },
    async mounted() {
        await this.$store.dispatch("Verify");
        await axios.get(url.ApiUrl + "/api/Users/Get/Info", { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
            this.FullName = res.data.FullName;
            this.Email = res.data.Email;
            this.PhoneNumber = res.data.PhoneNumber;
        });

        $("#FullName").on("focus", function () {
            $(this).removeClass("error__class");
            $(".FullName").text("");
        });

        $("#FullName").blur(function () {
            $(this).removeClass("error__class");
        });

        $("#Email").on("focus", function () {
            $(this).removeClass("error__class");
            $(".Email").text("");
        });

        $("#Email").blur(function () {
            $(this).removeClass("error__class");
        });


        $("#PhoneNumber").on("focus", function () {
            $(this).removeClass("error__class");
            $(".PhoneNumber").text("");
        });

        $("#PhoneNumber").blur(function () {
            $(this).removeClass("error__class");
        });

        $("#CurrentPassword").on("focus", function () {
            $(this).removeClass("error__class");
            $(".CurrentPassword").text("");
        });

        $("#CurrentPassword").blur(function () {
            $(this).removeClass("error__class");
        });


        $("#NewPassword").on("focus", function () {
            $(this).removeClass("error__class");
            $(".NewPassword").text("");
        });

        $("#NewPassword").blur(function () {
            $(this).removeClass("error__class");
        });

        $("#ConfirmPassword").on("focus", function () {
            $(this).removeClass("error__class");
            $(".ConfirmPassword").text("");
        });

        $("#ConfirmPassword").blur(function () {
            $(this).removeClass("error__class");
        });
    },
    methods: {
        change(key) {
            if (key == "FullName") {
                this.body[key] = this.FullName;
            } else if (key == "Email") {
                this.body[key] = this.Email;
            } else if (key == "PhoneNumber") {
                this.body[key] = this.PhoneNumber;
            }
        },
        async UpdateInformation() {
            let errors = 0;

            if (this.FullName.trim().length == 0) {
                $("#FullName").addClass("error__class");
                $(".FullName").text(this.$i18n.t("ProfilePage.MissingInput"));
                errors++;
            }

            if (this.Email.trim().length == 0) {
                $("#Email").addClass("error__class");
                $(".Email").text(this.$i18n.t("ProfilePage.MissingInput"));
                errors++;
            }

            if (this.PhoneNumber.trim().length == 0) {
                $("#PhoneNumber").addClass("error__class");
                $(".PhoneNumber").text(this.$i18n.t("ProfilePage.MissingInput"));
                errors++;
            }

            let isAnythingChanged = true;

            if (Object.keys(this.body).length === 0 && this.body.constructor === Object) {
                isAnythingChanged = false;
            }

            if (errors == 0 && isAnythingChanged) {
                await axios.patch(url.ApiUrl + "/api/Users/Update", this.body, { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
                    if (res.status == 200) {
                        location.reload();
                    }
                }).catch((err) => {
                    if (err.response.data.err == "Email already exists") {
                        $("#Email").addClass("error__class");
                        $(".Email").text(this.$i18n.t("ProfilePage.EmailAlreadyExists"));
                    }
                    if (err.response.data.err == "Phone already exists") {
                        $("#PhoneNumber").addClass("error__class");
                        $(".PhoneNumber").text(this.$i18n.t("ProfilePage.PhoneAlreadyExists"));
                    }
                })
            }
        },
        async updatePassword() {
            let errors = 0;

            if (this.CurrentPassword.trim().length == 0) {
                $("#CurrentPassword").addClass("error__class");
                $(".CurrentPassword").text(this.$i18n.t("ProfilePage.MissingInput"));
                errors++;
            }

            if (this.NewPassword.trim().length == 0) {
                $("#NewPassword").addClass("error__class");
                $(".NewPassword").text(this.$i18n.t("ProfilePage.MissingInput"));
                errors++;
            }

            if (this.ConfirmPassword.trim().length == 0) {
                $("#ConfirmPassword").addClass("error__class");
                $(".ConfirmPassword").text(this.$i18n.t("ProfilePage.MissingInput"));
                errors++;
            }

            if (this.NewPassword != this.ConfirmPassword) {
                $("#NewPassword").addClass("error__class");
                $(".NewPassword").text(this.$i18n.t("ProfilePage.Dont"));
                errors++;
            }

            if (errors == 0) {
                await axios.patch(url.ApiUrl + "/api/Users/Update/Password",
                    { CurrentPassword: this.CurrentPassword, NewPassword: this.NewPassword, ConfirmPassword: this.ConfirmPassword },
                    { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
                        if (res.status == 200) {
                            if (res.data.msg == "Password Updated") {
                                this.success = true;
                                this.MessageTitle = this.$i18n.t("ProfilePage.ProfileUpdated");
                                this.MessageDescription = this.$i18n.t("ProfilePage.PasswordUpdated");

                                setTimeout(() => {
                                    this.success = false;
                                    this.MessageTitle = "";
                                    this.MessageDescription = "";
                                }, 1200);
                            }
                        }
                    }).catch((err) => {
                        if (err.response.data.err == "Wrong Password") {
                            $("#CurrentPassword").addClass("error__class");
                            $(".CurrentPassword").text(this.$i18n.t("ProfilePage.Wrong"));
                        }
                    })
            }
        },
        showPassword() {
            $(".updatePassword, .user__information").fadeOut(200);
            setTimeout(() => {
                $(".updateInformation,.user__password").fadeIn(200);
            }, 205);
        },
        showInformation() {
            $(".updateInformation,.user__password").fadeOut(200);
            setTimeout(() => {
                $(".updatePassword,.user__information").fadeIn(200);
            }, 205);
        }
    }
})
</script>

<style lang="scss" scoped>
.main {
    display: flex;
}

.Manage {
    margin: 3rem 3rem 0rem 3rem;
    width: 100%;
}

.section__title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: var(--FONT-COLOR);
    gap: 1rem;
}

.input {
    margin: 0.5rem;
    margin-top: 2rem;
    margin-left: 0;
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

.updatePassword,
.updateInformation {
    color: var(--PRIMARY-COLOR);
    text-decoration: underline;
    font-weight: 500;
}

.updateInformation,
.user__password {
    display: none;
}

.te {
    position: fixed;
    top: 80vh;
    width: 365px;
    left: calc(80px + 3rem);
}

.messageBox {
    width: 100%;
    height: 100px;
    background-color: #1D1D1D;
    border-left: 5px solid #09c909;
    display: flex;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    box-shadow: 0px 0px 15px 10px rgba(0, 0, 0, 0.3);
}

.message__icon {
    width: 100px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.message__info {
    width: 260px;
    height: 100%;
    padding: 1rem;
    padding-left: 0;
    font-weight: bold;
    color: #eee;
}

.message__content {
    color: #bbb;
}
</style>