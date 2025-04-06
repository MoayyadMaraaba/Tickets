<template>
    <div class="page">
        <AuthHeader />

        <main>
            <h2 class="page__title">{{ $t("CreateTicket.Title") }}</h2>
            <div class="form">
                <!--=============== Ticket Information ===============-->
                <div class="ticket__info">
                    <h2 class="section__title">{{ $t("CreateTicket.TicketInfo") }}</h2>
                    <!--=============== Subject ===============-->
                    <div class="input">
                        <h3 class="input__title">{{ $t("CreateTicket.Subject") }}</h3>
                        <input type="text" name="Subject" class="text__input" :placeholder="$t('CreateTicket.Subject')"
                            id="Subject" v-model="Subject">
                        <label for="Subject" class="input__error Subject"></label>
                    </div>

                    <!--=============== Message ===============-->
                    <div class="input">
                        <h3 class="input__title">{{ $t("CreateTicket.Message") }}</h3>
                        <textarea id="Message" class="textarea__input" v-model="Message"
                            :placeholder="$t('CreateTicket.Message')"></textarea>
                        <label for="Message" class="input__error Message"></label>
                    </div>

                    <!--=============== Types ===============-->
                    <div class="input">
                        <h3 class="input__title">{{ $t("CreateTicket.Type") }}</h3>
                        <div class="dropdown__wrapper">
                            <div class="showTypes" v-on:click="openDropdown()">
                                {{ $t("CreateTicket.SelectType") }} :
                                <span v-if="$i18n.locale == 'ar'">
                                    {{ type.NameAR }}
                                </span>
                                <span v-if="$i18n.locale == 'en'">
                                    {{ type.NameEN }}
                                </span>
                            </div>
                            <div class="types_list" v-if="dropdown">
                                <div class="type" v-for="type in types" v-bind:key="type.ID"
                                    v-on:click="selectType(type)">
                                    <span v-if="$i18n.locale == 'en'">
                                        {{ type.NameEN }}
                                    </span>
                                    <span v-if="$i18n.locale == 'ar'">
                                        {{ type.NameAR }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <label class="input__error types"></label>
                    </div>

                    <div class="input">
                        <button class="submit__button" type="submit" v-on:click="SendTicket()">{{
                            $t("CreateTicket.Submit") }}</button>
                    </div>
                </div>
                <!--=============== Ticket Information ===============-->

                <!--=============== Documents ===============-->
                <div class="ticket__documents">
                    <h2 class="section__title">{{ $t("CreateTicket.Attachments") }}</h2>

                    <!--=============== File Input ===============-->
                    <div class="input">
                        <input type="file" id="attachments" class="disable" name="Attachment" multiple ref="file"
                            @change="onFileSelected">
                        <label for="attachments" class="file__input"><i class="fa-solid fa-plus"></i> {{
                            $t("CreateTicket.AddAttachments") }}</label>
                    </div>

                    <!--=============== Display Files ===============-->
                    <div class="input">
                        <div class="files">
                            <div class="file" v-for="file in Attachment" v-bind:key="file.name">
                                <div class="icon">
                                    <button class="remove__button" v-on:click="removeFile(file.name)"><i
                                            class="fa-solid fa-trash"></i></button>
                                    <i class="fa-regular fa-image"></i>
                                </div>
                                <div class="filename">
                                    {{ file.name }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--=============== Uploading Progress ===============-->
                    <div class="input" v-if="showProgress">
                        <h3 class="progress__title">{{ $t("CreateTicket.Uploading") }} : {{ uploadPercentage }}%</h3>
                        <div class="progress">
                            <div class="line" :style="`width: ${uploadPercentage}%`"></div>
                        </div>
                    </div>

                    <div class="input">
                        <span class="input__error file__error"></span>
                    </div>
                </div>
                <!--=============== Documents ===============-->
            </div>
        </main>

        <FooterComponent />
    </div>
</template>

<script lang="js">
import Vue from 'vue';
import AuthHeader from '@/components/AuthHeader.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import axios from 'axios';
import url from '@/ApiUrl';
import jquery from "jquery";
let $ = jquery;

export default Vue.extend({
    name: "CreateTicket",
    components: {
        AuthHeader,
        FooterComponent
    },
    data() {
        return {
            Subject: "",
            Message: "",
            dropdown: false,
            types: [],
            type: {},
            errors: 0,
            Attachment: [],
            uploadPercentage: 0,
            showProgress: false
        }
    },
    async mounted() {
        await this.$store.dispatch("Verify");
        await this.$store.dispatch("Types");

        this.types = this.$store.getters.getTypes;

        /************* Subject Input *************/
        $("#Subject").on("focus", function () {
            $(".Subject").text("");
            $(this).removeClass("error__class");
        });

        $("#Subject").blur(function () {
            $(this).removeClass("error__class");
        });
        /************* Subject Input *************/


        /************* Message Input *************/
        $("#Message").on("focus", function () {
            $(".Message").text("");
            $(this).removeClass("error__class");
        });

        $("#Message").blur(function () {
            $(this).removeClass("error__class");
        });
        /************* Message Input *************/
    },
    methods: {
        onFileSelected() {
            $(".file__error").text("");

            this.Attachment = [...this.$refs.file.files];

            let allowed = ["image/jpeg", "image/jpg", "image/png"];
            for (let i = 0; i < this.Attachment.length; i++) {
                // Check if type is allowed
                if (!allowed.includes(this.Attachment[i].type)) {
                    $(".file__error").text(`${this.$t('CreateTicket.File')} ${this.Attachment[i].name} ${this.$t('CreateTicket.FileTypeNotAllowed')}`)
                    this.Attachment.splice(i, 1);
                    continue;
                }

                // Check if size is allowed
                if (this.Attachment[i].size > 30000000) {
                    $(".file__error").text(`${this.$t('CreateTicket.File')} ${this.Attachment[i].name} ${this.$t('CreateTicket.FileTooLarge')}`)
                    this.Attachment.splice(i, 1);
                }
            }
        },
        removeFile(name) {
            for (let i = 0; i < this.Attachment.length; i++) {
                if (this.Attachment[i].name == name) {
                    this.Attachment.splice(i, 1);
                }
            }
        },
        openDropdown() {
            if (this.dropdown == false) {
                this.dropdown = true;
            } else {
                this.dropdown = false;
            }
        },
        selectType(type) {
            this.type = type;
            this.dropdown = false;
            $(".showTypes").removeClass("error__class");
            $(".types").text("");
        },
        async SendTicket() {
            this.errors = 0;

            if (this.Subject.trim().length == 0) {
                this.Subject = "";
                $("#Subject").addClass("error__class");
                $(".Subject").text(this.$t("CreateTicket.MissingSubject"));
                this.errors++;
            }

            if (this.Message.trim().length == 0) {
                this.Message = "";
                $("#Message").addClass("error__class");
                $(".Message").text(this.$t("CreateTicket.MissingMessage"));
                this.errors++;
            }

            if (Object.keys(this.type).length === 0 && this.type.constructor === Object) {
                $(".showTypes").addClass("error__class");
                $(".types").text(this.$t("CreateTicket.MissingType"));
                this.errors++;
            }

            if (this.errors == 0) {

                const fd = new FormData();

                fd.append("Subject", this.Subject);
                fd.append("Status", 0);
                fd.append("Type", this.type.ID);
                fd.append("AgentID", 0);
                fd.append("Priority", "Low");
                fd.append("Closed", 0);
                fd.append("message", this.Message);

                for (let i = 0; i < this.Attachment.length; i++) {
                    fd.append("Attachment", this.Attachment[i]);
                }

                this.showProgress = true;

                await axios.post(url.ApiUrl + "/api/Tickets/Create", fd,
                    {
                        headers: { authorization: localStorage.getItem("token") }, onUploadProgress: function (progressEvent) {
                            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
                        }.bind(this)
                    })
                    .then((res) => {
                        if (res.status == 201) {
                            this.$router.push({ name: "Dashboard" });
                        }
                    });
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
}

main {
    min-height: calc(100vh - 80px);
    padding: 2rem;
}

.page__title {
    margin: 0 3rem;
    color: var(--FONT-COLOR);
}

.section__title {
    padding: 2rem 0 0 0;
    color: var(--FONT-COLOR);
}

.form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 3rem;
}

.ticket__info {
    width: 360px;
}

.input {
    padding: 2rem 0 0 0;
}

.input__title {
    color: var(--FONT-COLOR);
}

.text__input {
    width: 360px;
    height: 45px;
    padding: 0 10px;
    border: 1px solid grey;
    border-radius: 5px;
    color: var(--FONT-COLOR);
    margin-top: 0.8rem;
    font-weight: bold;
    font-size: 0.85rem;
    transition: border 300ms ease-in-out;
}



.text__input:focus,
.textarea__input:focus {
    border: 1px solid var(--PRIMARY-COLOR);
}

.input__error {
    margin-top: 0.8rem;
    display: block;
    color: var(--ERROR-COLOR);
    font-weight: bold;
}

.textarea__input {
    margin-top: 0.8rem;
    border-radius: 5px;
    min-width: 360px;
    min-height: 45px;
    max-width: 550px;
    outline: none;
    padding: 10px;
    font-weight: bold;
    font-size: 1rem;
    background-color: transparent;
    color: var(--FONT-COLOR);
    transition: border 300ms ease-in-out;
}

.showTypes {
    width: 360px;
    height: 45px;
    display: flex;
    align-items: center;
    border: 1.5px solid rgba(180, 180, 180, 0.507);
    padding-left: 10px;
    padding-right: 10px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: transparent;
    color: grey;
    font-weight: bold;
    margin-top: 0.8rem;

    &:hover {
        cursor: pointer;
    }
}

.remove_bottom_border {
    border-bottom: none;
}

.types_list {
    border: 1.5px solid rgba(180, 180, 180, 0.507);
    width: 360px;
    height: 90px;
    overflow: auto;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: transparent;
}

.type {
    display: flex;
    align-items: center;
    height: 45px;
    padding-left: 10px;
    padding-right: 10px;
    color: grey;
    transition: all 300ms ease-in-out;
    font-weight: bold;

    &:hover {
        cursor: pointer;
        color: #eeeeee;
        background-color: var(--PRIMARY-COLOR);
    }
}

.type:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.submit__button {
    width: 360px;
    height: 45px;
    background-color: var(--PRIMARY-COLOR);
    color: #fff;
    border-radius: 5px;
    transition: background 300ms ease-in-out;
    font-size: 1rem;
    font-weight: 600;

    &:hover {
        cursor: pointer;
        background-color: var(--HOVER-COLOR);
    }
}

.ticket__documents {
    width: 360px;
}

.disable {
    display: none;
}

.file__input {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 360px;
    height: 70px;
    border: 2px dashed var(--PRIMARY-COLOR);
    transition: all 300ms ease-in-out;
    color: var(--FONT-COLOR);
    font-weight: bold;

    i {
        margin: 0 0.8rem;
    }

    &:hover {
        cursor: pointer;
    }
}

.progress {
    background-color: grey;
    width: 360px;
    height: 5px;
}

.progress__title {
    color: var(--FONT-COLOR);
    margin-bottom: 0.7rem;
}

.line {
    height: 5px;
    background-color: var(--PRIMARY-COLOR);
    transition: all 300ms ease-in-out;
}

.error__class {
    border: 2px solid var(--ERROR-COLOR);
}

.files {
    display: grid;
    grid-template-columns: 80px 80px 80px;
    gap: 1rem;
}

.file {
    transition: all 300ms ease-in-out;
}

.filename {
    opacity: 0;
    visibility: hidden;
    margin: 0.7rem 0 0 0;
    color: var(--FONT-COLOR);
    background-color: #272727cb;
    transition: all 300ms ease-in-out;
    width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0.5rem;
    border-radius: 10px;
}

.icon {
    border-radius: 5px;
    height: 80px;
    border: 1px solid grey;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: var(--FONT-COLOR);
    transition: all 300ms ease-in-out;

    i {
        font-size: 1.2rem;
    }

}

.remove__button {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    color: #fff;
    top: 8%;
    left: 75%;
    transition: color 300ms ease-in-out;

    i {
        font-size: 0.9rem;
    }

    &:hover {
        cursor: pointer;
        color: var(--ERROR-COLOR);
    }
}

.file:hover {

    .filename,
    .remove__button {
        visibility: visible;
        opacity: 1;
    }
}
</style>