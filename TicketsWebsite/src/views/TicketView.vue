<template>
    <div class="p">
        <!--======= Header =======-->
        <AuthHeader />
        <!--======= Header =======-->

        <main class="main">
            <div class="container">
                <div class="ticket__control">
                    <div class="control__header">
                        <h2>{{ $t("Ticket.TicketInformation") }}</h2>
                    </div>

                    <div class="status">
                        <h3 v-if="$i18n.locale == 'en'"><i class="fa-solid fa-spinner"></i> {{ $t("Ticket.Status") }} :
                            {{
                                Ticket.StatusNameEN }}</h3>
                        <h3 v-if="$i18n.locale == 'ar'"><i class="fa-solid fa-spinner"></i> {{ $t("Ticket.Status") }} :
                            {{
                                Ticket.StatusNameAR }}</h3>
                    </div>

                    <div class="types">
                        <h3 v-if="$i18n.locale == 'en'"><i class="fa-regular fa-bookmark"></i> {{ $t("Ticket.Types") }}
                            : {{
                                Ticket.TypeNameEN }}</h3>
                        <h3 v-if="$i18n.locale == 'ar'"><i class="fa-regular fa-bookmark"></i> {{ $t("Ticket.Types") }}
                            : {{
                                Ticket.TypeNameAR }}</h3>
                    </div>

                    <div class="priority">
                        <h3 v-if="$i18n.locale == 'en'"><i class="fa-regular fa-flag"></i> {{ $t("Ticket.Priority") }} :
                            {{ Ticket.Priority
                            }}</h3>
                        <h3 v-if="$i18n.locale == 'ar'"><i class="fa-regular fa-flag"></i> {{ $t("Ticket.Priority") }} :
                            {{ Ticket.Priority
                            }}</h3>
                    </div>
                </div>
                <div class="chat">
                    <div class="chat__header">
                        <h2>{{ $t("Ticket.Ticket") }} : {{ Ticket.Subject }}
                            {{ $t("Ticket.Types") }} : <span v-if="$i18n.locale == 'en'">{{ Ticket.TypeNameEN }}</span>
                            <span v-if="$i18n.locale == 'ar'">{{ Ticket.TypeNameAR }}</span>
                        </h2>
                        <h2>{{ $t("Ticket.Agent") }} : {{ Ticket.AgentFullName }}</h2>
                    </div>
                    <div class="chat__body">
                        <div class="messages">
                            <div v-for="message in Messages" v-bind:key="message.ID"
                                :class="message.MessageUserID == UserID ? 'row r' : 'row c'">
                                <div :class="message.MessageUserID == UserID ? 'message response' : 'message client'">
                                    {{ message.Message }}

                                    <div class="images">
                                        <div class="image" v-for="image in JSON.parse(message.Attachments)"
                                            v-bind:key="image" v-on:click="openViewer(image)">
                                            <img :src="`${url}/uploads/${image}`" width="40" height="40">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="send">
                        <div class="send__form" v-if="!Ticket.Closed">
                            <input type="text" class="text__input" :placeholder="$t('Ticket.Message')" id="Message"
                                v-model="Message">

                            <input type="file" id="attachments" @change="onFileSelected" name="Attachment" multiple
                                ref="file">
                            <label for="attachments" class="attachments__input">
                                <i class="fa-solid fa-paperclip"></i>
                            </label>

                            <button class="send__button" type="submit" v-on:click="sendMessage()">
                                <i class="fa-regular fa-paper-plane"></i>
                            </button>
                        </div>

                        <div v-if="Ticket.Closed" class="send__form">
                            <h3 class="closed">{{ $t("Ticket.Closed") }}</h3>
                        </div>

                        <button class="send__button" type="submit" v-on:click="closeTicket(Ticket.Closed)" v-if="isAgent || isAdmin">
                            <i class="fa-solid fa-lock-open" v-if="Ticket.Closed"></i>
                            <i class="fa-solid fa-lock" v-if="!Ticket.Closed"></i>
                        </button>
                    </div>
                </div>
                <div class="information">
                    <div class="user">
                        <img src="../assets/user.png" class="user__image">

                        <h2 class="user__FullName">{{ Ticket.UserFullName }}</h2>
                    </div>
                    <div class="controls">
                        <div>
                            <button class="control__button media" v-on:click="switchControls()">Media</button>
                        </div>
                        <!-- <div>
                            <button class="control__button tickets" v-on:click="switchControls()">Tickets</button>
                        </div> -->
                    </div>
                    <div class="media__files">
                        <div class="file" v-for="name in Media" v-bind:key="name.ID"
                            v-on:click="openViewer(name.DocumentName)">
                            <img :src="`${url}/uploads/${name.DocumentName}`">
                        </div>
                    </div>
                </div>
            </div>

            <!--======= Popup =======-->
            <div class="popup" v-if="showPopup">
                <div class="dispage">
                    <div class="popup__wrapper">
                        <!--======= popup controls =======-->
                        <div class="exit">
                            <button class="exit__button" v-on:click="closePopup()">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <!--======= popup controls =======-->
                        <div class="file__error">

                        </div>
                    </div>
                </div>
            </div>
            <!--======= Popup =======-->


            <!--======= Image Viewer =======-->
            <div class="viewer" v-if="viewer">
                <div class="dispage">
                    <div class="viewer__controls">
                        <button v-on:click="closeViewer()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="viewer__wrapper" v-on:click="closeViewer()">
                        <!-- <div class="viewer__button" v-if="$i18n.locale == 'en'" v-on:click="moveLeft()">
                            <button><i class="fa-solid fa-chevron-left"></i></button>
                        </div>
                        <div class="viewer__button" v-if="$i18n.locale == 'ar'" v-on:click="moveRight()">
                            <button><i class="fa-solid fa-chevron-right"></i></button>
                        </div> -->

                        <div class="viewer__content">
                            <img :src="`${url}/uploads/${name}`">
                        </div>

                        <!-- <div class="viewer__button" v-if="$i18n.locale == 'en'" v-on:click="moveRight()">
                            <button><i class="fa-solid fa-chevron-right"></i></button>
                        </div>

                        <div class="viewer__button" v-if="$i18n.locale == 'ar'" v-on:click="moveLeft()">
                            <button><i class="fa-solid fa-chevron-left"></i></button>
                        </div> -->
                    </div>
                </div>
            </div>
            <!--======= Image Viewer =======-->
        </main>
    </div>
</template>

<script lang="js">
import Vue from "vue";
import AuthHeader from "@/components/AuthHeader.vue";
import axios from "axios";
import url from "@/ApiUrl";
import jquery from 'jquery';
let $ = jquery;

export default Vue.extend({
    name: "TicketView",
    components: {
        AuthHeader
    },
    data() {
        return {
            Ticket: {},
            Messages: [],
            mediaSelected: true,
            TicketsSelected: false,
            tickets: [],
            Attachment: [],
            UserID: "",
            Message: "",
            url: url.ApiUrl,
            showPopup: false,
            viewer: false,
            name: "",
            Media: [],
            isUser: false,
            isAgent: false,
            isAdmin: false,
        }
    },
    async mounted() {
        await this.$store.dispatch("Verify");

        
        let isUser = false;
        const isAgent = this.$store.getters.isAgentLoggedIn;
        const isAdmin = this.$store.getters.isAdminLoggedIn;

        if (!isAgent && !isAdmin && this.$store.getters.isLoggedIn) {
            isUser = true;
        }
        
        this.isUser = isUser;
        this.isAgent = isAgent;
        this.isAdmin = isAdmin;

        await axios.get(url.ApiUrl + `/api/Tickets/Get/${this.$route.params.id}`, { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
            this.Ticket = res.data[0];
        });

        await axios.get(url.ApiUrl + `/api/Messages/Get/${this.$route.params.id}`, { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
            this.Messages = res.data;
        });

        await axios.get(url.ApiUrl + "/api/Users/Get", { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
            this.UserID = res.data.ID;
        });

        await axios.get(url.ApiUrl + `/api/Messages/Get/Attachments/${this.$route.params.id}`, { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
            this.Media = res.data;
        });


        $(".media").addClass("selected__button");
    },
    methods: {
        onFileSelected() {
            $(".file__error").text("");

            this.Attachment = [...this.$refs.file.files];

            let allowed = ["image/jpeg", "image/jpg", "image/png"];
            for (let i = 0; i < this.Attachment.length; i++) {
                // Check if type is allowed
                if (!allowed.includes(this.Attachment[i].type)) {
                    this.showPopup = true;
                    setTimeout(() => {
                        $(".file__error").text(`${this.$t('CreateTicket.File')} ${this.Attachment[i].name} ${this.$t('CreateTicket.FileTypeNotAllowed')}`)
                        this.Attachment.splice(i, 1);
                    }, 400);
                    continue;
                }

                // Check if size is allowed
                if (this.Attachment[i].size > 30000000) {
                    this.showPopup = true;
                    $(".file__error").text(`${this.$t('CreateTicket.File')} ${this.Attachment[i].name} ${this.$t('CreateTicket.FileTooLarge')}`)
                    this.Attachment.splice(i, 1);
                }
            }
        },
        closePopup() {
            $(".file__error").text("");
            this.showPopup = false;
        },
        switchControls() {
            if (this.mediaSelected) {
                // Media
                this.mediaSelected = false;
                $(".media").removeClass("selected__button")
            } else {
                // Media
                this.mediaSelected = true;
                $(".media").addClass("selected__button")
            }

            if (this.TicketsSelected) {
                // Tickets
                this.TicketsSelected = false;
                $(".tickets").removeClass("selected__button")
            } else {
                // Tickets
                this.TicketsSelected = true;
                $(".tickets").addClass("selected__button")
            }
        },
        async sendMessage() {
            if (this.Message.trim().length != 0) {
                const fd = new FormData();

                fd.append("Message", this.Message);
                for (let i = 0; i < this.Attachment.length; i++) {
                    fd.append("Attachment", this.Attachment[i]);
                }

                await axios.post(url.ApiUrl + `/api/Messages/Add/${this.$route.params.id}`, fd, { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
                    this.Messages.push(res.data.Message[0]);

                    let arr = JSON.parse(res.data.Message[0].Attachments);

                    for (let i = 0; i < arr.length; i++) {
                        $(".media__files").append(`<div class="file">
                            <img src="${this.url}/uploads/${arr[i]}" width="80" height="80">
                    </div>`)
                    }

                });
            } else {
                this.Message = "";
            }
        },
        async closeTicket(Closed) {
            await axios.patch(url.ApiUrl + "/api/Tickets/Close", { ticketID: this.$route.params.id, Closed: Closed }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            }).then((res) => {
                if(res.status == 200) {
                    this.Ticket.Closed = !Closed;
                }
            })
        },
        openViewer(name) {
            this.name = name;
            this.viewer = true;
        },
        closeViewer() {
            this.name = "";
            this.viewer = false;
        },
        moveLeft() {
            console.log("Left");
        },
        moveRight() {
            console.log("Right");
        }
    },
});
</script>

<style lang="scss" scoped>
.container {
    display: grid;
    grid-template-columns: minmax(20%, 300px) auto minmax(20%, 300px);
    height: calc(100vh - 80px);
}

.ticket__control {
    border-right: 1px solid grey;
}

.status,
.types,
.priority {
    h3 {
        padding: 1.5rem 1.5rem 1.5rem 1.5rem;
        color: var(--FONT-COLOR);

        i {
            color: var(--PRIMARY-COLOR);
            margin: 0 1rem;
        }
    }
}

.chat__header,
.control__header {
    height: 7vh;
    border-bottom: 1px solid grey;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        font-size: var(--FONT-SIZE);
        color: var(--FONT-COLOR);
        margin: 0 1rem;
    }
}

.chat {
    height: calc(100vh - 80px);
}

.chat__body {
    height: calc(100% - 15vh);
    overflow-y: auto;
}

.chat__body::-webkit-scrollbar {
    width: 5px;
}

.chat__body::-webkit-scrollbar-track {
    background: #bbb;
}

.chat__body::-webkit-scrollbar-thumb {
    background-color: var(--PRIMARY-COLOR);

}

.row {
    display: flex;
    flex-direction: column;
}

.message {
    width: 40%;
    min-height: 100px;
    padding: 1rem;
    margin: 1rem;
    border-radius: 15px;
    background-color: var(--PRIMARY-COLOR);
    color: #eee;
}

.c {
    align-items: flex-start;
}

.client {
    background-color: grey;
}

.r {
    align-items: flex-end;
}

.response {
    background-color: var(--PRIMARY-COLOR);
}

.images {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
}

.image {
    img {
        border-radius: 5px;
    }

    &:hover {
        cursor: pointer;
    }
}

.send {
    height: 8vh;
    display: flex;
    align-items: center;
    padding: 1rem;
}

.send__form {
    display: flex;
    justify-content: center;
    gap: 1.2rem;
    width: 100%;
}

.text__input {
    width: 80%;
    height: 50px;
    border: 1px solid grey;
    border-radius: 10px;
    padding: 0 1rem;
    color: var(--FONT-COLOR);
}

#attachments {
    display: none;
}

.attachments__input {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 48px;
    color: var(--PRIMARY-COLOR);
    border: 2px dashed var(--PRIMARY-COLOR);
    border-radius: 15px;
}




.send__button {
    width: 50px;
    height: 50px;
    background-color: var(--PRIMARY-COLOR);
    border-radius: 15px;
    color: #fff;
    transition: all 300ms ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: var(--HOVER-COLOR);
    }
}

.information {
    border-left: 1px solid grey;
}

.user {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 30vh;
}

.user__image {
    width: 70px;
    height: 70px;
}

.user__FullName {
    color: var(--FONT-COLOR);
    text-align: center;
    padding: 1rem;
}

.controls {
    display: flex;
    gap: 2rem;
    justify-content: center;
    height: 30px;
}

.control__button {
    color: var(--FONT-COLOR);
    font-weight: bold;
    font-size: 1rem;
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-position: under;
    transition: all 300ms ease-in-out;
}

.selected__button {
    color: var(--PRIMARY-COLOR);
}

.media__files {
    margin: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.2rem;
    height: 50vh;
    overflow-y: auto;
}

.media__files::-webkit-scrollbar {
    width: 5px;
}

.media__files::-webkit-scrollbar-track {
    background: #bbb;
}

.media__files::-webkit-scrollbar-thumb {
    background-color: var(--PRIMARY-COLOR);

}

.file {
    width: 80px;
    height: 80px;

    img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }

    &:hover {
        cursor: pointer;
    }
}

.popup,
.viewer {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 100%;
    z-index: 5000;
    transform: translate(-50%, -50%);
}

.dispage {
    width: 100%;
    height: 100vh;
    background-color: #1f283398;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.popup__wrapper {
    width: 500px;
    min-height: 200px;
    background-color: #1f2833;
    border-radius: 10px;
}

.popup__form {
    margin-top: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.exit {
    text-align: right;
    width: 100%;
    height: 50px;
}

.exit__button {
    margin: 1rem;
    background: none;
    border: none;
    outline: none;
    width: 30px;
    height: 30px;
    color: #eeeeee;
    font-size: 24px;
    transition: all 300ms ease-in-out;
}

.exit__button:hover {
    cursor: pointer;
    color: var(--PRIMARY-COLOR);
}

.file__error {
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--ERROR-COLOR);
    font-weight: bold;
}

.viewer__wrapper {
    width: 100%;
    height: 95vh;
    display: flex;
    justify-content: center;
}

.viewer__controls {
    width: 100%;
    color: #fff;
    display: flex;
    justify-content: flex-end;
    padding: 0 2rem;

    button {
        color: #fff;

        i {
            font-size: 1.5rem;
        }

        transition: all 300ms ease-in-out;

        &:hover {
            color: var(--ERROR-COLOR);
            cursor: pointer;
        }
    }
}

.viewer__content {
    width: 90%;
    height: 95vh;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        display: block;
        border-radius: 5px;
        max-width: 100%;
        max-height: 100%;
    }
}

.viewer__button {
    width: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.closed {
    color: #bbb;
}


</style>