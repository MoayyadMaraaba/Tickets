<template>
    <div class="page">
        <div class="cont" v-if="!success">
            <h1 class="form__title">Forget Password ?</h1>
            <div class="form">
                <input type="text" name="email" v-model="email" placeholder="Please Enter an email" class="text__input">
                <button class="submit__btn" v-on:click="sendEmail()">
                    Send
                </button>
            </div>
        </div>
        <div class="cont" v-if="success">
            <h1 class="form__title">Check Your email.</h1>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import url from '@/ApiUrl';

export default Vue.extend({
    name: 'ForgetView',
    data() {
        return {
            email: "",
            success: false
        }
    },
    methods: {
        async sendEmail() {
            if(this.email.trim().length != 0) {
              await axios.post(url.ApiUrl + "/api/Authentication/Forget", {Email:this.email}).then((res) => {
                if(res.status == 200) {
                    this.success = true;
                }
              }).catch((err) => {
                console.log(err);
              })
            }
        }
    }
});
</script>

<style scoped lang="scss">
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
    height: 240px;
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

.text__input {
    width: 365px;
    height: 40px;
    border-bottom: 2px solid var(--PRIMARY-COLOR);
    margin-top: 1rem;
    color: #eee;
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