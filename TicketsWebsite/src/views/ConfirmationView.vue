<template>
    <div class="page">
        <div class="cont">
            <h1 class="form__title">Reset Password</h1>
            <div class="form">
                <div class="input">
                    <input type="password" class="text__input" placeholder="New Password" id="NewPassword"
                        v-model="NewPassword" />
                    <br>
                    <label for="NewPassword" class="input__error NewPassword"></label>
                </div>
                <div class="input">
                    <input type="password" class="text__input" placeholder="Confirm Password" id="ConfirmPassword"
                        v-model="ConfirmPassword">
                    <label for="ConfirmPassword" class="input__error ConfirmPassword"></label>

                </div>
                <div class="input">
                    <button class="submit__btn" v-on:click="resetPassword()">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import url from '@/ApiUrl';
import axios from 'axios';
import Vue from 'vue';
import jquery from "jquery";
let $ = jquery;

export default Vue.extend({
    name: "ConfirmationView",
    data() {
        return {
            NewPassword: "",
            ConfirmPassword: "",
        }
    },
    async mounted() {
        await axios.get(url.ApiUrl + "/api/Authentication/Confirmation/" + this.$route.params.id).then((res) => {
            console.log(res);
        }).catch((err) => {
            if (err.response.status == 400) {
                this.$router.push({ name: "Login" });
            }
        })
    },
    methods: {
        async resetPassword() {
            let errors = 0;
            if (this.NewPassword.trim().length == 0) {
                $("#NewPassword").css("borderBottom", "2px solid var(--ERROR-COLOR)");
                $(".NewPassword").text("Please Enter this field");
                errors++;
            }
            if (this.ConfirmPassword.trim().length == 0) {
                $("#ConfirmPassword").css("borderBottom", "2px solid var(--ERROR-COLOR)");
                $(".ConfirmPassword").text("Please Enter this field");
                errors++;
            }

            if (this.NewPassword != this.ConfirmPassword) {
                $("#ConfirmPassword").css("borderBottom", "2px solid var(--ERROR-COLOR)");
                $(".ConfirmPassword").text("Passwords don't match");
                errors++;
            }

            if (errors == 0) {
                console.log("H");
                await axios.post(url.ApiUrl + "/api/Users/Reset", { NewPassword: this.NewPassword }, { headers: { authorization: this.$route.params.id } }).then((res) => {
                    if (res.status == 200) {
                        this.$router.push({ name: "Login" });
                    }
                })
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cont {
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #1d1d1d;
    width: 400px;
    min-height: 240px;
    border-radius: 15px;
    padding: 2rem;
}

.form__title {
    text-align: center;
    color: #eee;
}

.form {
    width: 365px;
}

.input {
    padding-top: 1rem;
}

.text__input {
    width: 365px;
    height: 40px;
    border-bottom: 2px solid var(--PRIMARY-COLOR);
    margin-top: 1rem;
    color: #eee;
}

.input__error {
    display: block;
    padding-top: 0.5rem;
    font-weight: bold;
    color: var(--ERROR-COLOR);
}

.submit__btn {
    width: 365px;
    height: 40px;
    margin-top: 1rem;
    background-color: var(--PRIMARY-COLOR);
    border-radius: 5px;
    color: #eee;
    font-weight: bold;

    &:hover {
        background-color: var(--HOVER-COLOR);
    }
}
</style>