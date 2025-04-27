<template>
    <div class="page">
        <AuthHeader />
        <main class="main">
            <Sidebar />
            <section class="ManageAgents" id="Manage">
                <!--======= Manage Tickets Title =======-->
                <h1 class="section__title">{{ $t("Agents.title") }} <button class="addBtn"
                        v-on:click='showAdd("Add")'>{{
                            $t("Agents.Add") }}
                    </button></h1>

                <!--======= Agents =======-->
                <div class="mAgents">
                    <div class="Agents">
                        <div class="agent" v-for="agent in Agents" v-bind:key="agent.id">
                            <span>{{ agent.FullName }} | Role : {{ agent.Role }} </span>
                            <button class="edit__button" v-on:click="showEdit(agent)">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>

                            <button class="trash__button" v-on:click="deActivate(agent.id, agent.Activation)">

                                <i class="fa-solid fa-user-lock" v-if="agent.Activation"></i>
                                <i class="fa-solid fa-user-check" v-else></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div class="popup" v-if="showPopup">
                <div class="dispage">
                    <div class="popup__wrapper">
                        <!--======= popup controls =======-->
                        <div class="exit">
                            <button class="exit__button" v-on:click="showAdd('Close')">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <!--======= popup controls =======-->
                        <form @submit.prevent="manageAgents(TypeOperation)" method="post" class="popup__form">
                            <!--======= form title =======-->

                            <h2 class="form__title" v-if="TypeOperation == 'Add'">{{ $t("Agents.Add2") }}</h2>
                            <h2 class="form__title" v-if="TypeOperation == 'Edit'">{{ $t("Agents.Edit") }}</h2>

                            <!--======= FullName =======-->
                            <div class="input">
                                <input type="text" autocomplete="off" v-model="FullName" class="text__input"
                                    name="FullName" id="FullName" :placeholder="$t('Agents.AgentFullName')"
                                    v-on:input="change('FullName')" />
                                <br>
                                <label for="FullName" class="err FullName"></label>
                            </div>


                            <!--======= Email =======-->
                            <div class="input">
                                <input type="text" autocomplete="off" v-model="Email" class="text__input" name="Email"
                                    id="Email" :placeholder="$t('Agents.AgentEmail')" v-on:input="change('Email')" />
                                <br>
                                <label for="Email" class="err Email"></label>
                            </div>


                            <!--======= Password =======-->
                            <div class="input">
                                <input type="password" autocomplete="off" v-model="Password" class="text__input"
                                    name="Password" id="Password" :placeholder="$t('Agents.AgentPassword')"
                                    v-on:input="change('Password')" />
                                <br>
                                <label for="Password" class="err Password"></label>
                            </div>

                            <!--======= PhoneNumber =======-->
                            <div class="input">
                                <input type="text" autocomplete="off" v-model="PhoneNumber" class="text__input"
                                    name="PhoneNumber" id="PhoneNumber" :placeholder="$t('Agents.AgentPhoneNumber')"
                                    v-on:input="change('PhoneNumber')" />
                                <br>
                                <label for="PhoneNumber" class="err PhoneNumber"></label>
                            </div>


                            <!--======= Role =======-->
                            <div class="input">
                                <div class="dropdown__wrapper">
                                    <div class="showRoles" v-on:click="openDropdown()">
                                        {{ $t("Agents.SelectRole") }} : {{ Role }}
                                    </div>
                                    <div class="roles_list" v-if="dropdown">
                                        <div class="role" v-on:click="selectRole('Admin')">
                                            <span>Admin</span>
                                        </div>
                                        <div class="role" v-on:click="selectRole('Agent')">
                                            <span>Agent</span>
                                        </div>
                                    </div>
                                </div>
                                <label class="input__error types"></label>
                            </div>

                            <!--======= Activate =======-->
                            <div class="input">
                                <div class="act" v-on:click="activate()">
                                    <i class="fa-solid fa-check"></i>
                                </div>
                            </div>

                            <!--======= Submit Button =======-->
                            <div class="input">
                                <button class="form__button" v-if="TypeOperation == 'Add'">
                                    <span class="form__title">{{ $t("Agents.Add2")
                                    }}</span>
                                </button>
                                <button class="form__button" v-if="TypeOperation == 'Edit'">
                                    <span class="form__title">{{ $t("Agents.Edit")
                                    }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


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
import jquery from 'jquery';
import axios from 'axios';
import url from '@/ApiUrl';
let $ = jquery;
export default Vue.extend({
    name: "AgentsView",
    components: {
        AuthHeader,
        Sidebar
    },
    data() {
        return {
            showPopup: false,
            TypeOperation: "",
            showAgentManagement: false,
            ID: 0,
            FullName: "",
            Email: "",
            Password: "",
            PhoneNumber: "",
            Role: "",
            Activation: false,
            errors: 0,
            Agents: [],
            dropdown: false,
            success: false,
            MessageTitle: "",
            MessageDescription: "",
            body: {}
        }
    },
    async mounted() {
        await this.$store.dispatch("Verify");

        this.loadAgents();
    },
    methods: {
        change(key) {
            if (key == "FullName") {
                this.body[key] = this.FullName;
            } else if (key == "Email") {
                this.body[key] = this.Email;
            } else if (key == "PhoneNumber") {
                this.body[key] = this.PhoneNumber;
            } else if (key == "Password") {
                this.body[key] = this.Password;
            }
        },
        async loadAgents() {
            await axios.get(url.ApiUrl + "/api/Agents/Get", { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
                this.Agents = res.data;
            })
        },
        openDropdown() {
            if (this.dropdown == false) {
                this.dropdown = true;
            } else {
                this.dropdown = false;
            }
        },
        showAdd(type) {
            if (type == "Add") {
                if (this.showAgentManagement) {
                    this.showPopup = false;
                    this.showAgentManagement = false;
                } else {
                    this.TypeOperation = "Add";
                    this.showPopup = true;
                    this.showAgentManagement = true;
                }
            } else if (type == "Close") {
                this.showPopup = false;
                this.TypeOperation = "";
                this.showAgentManagement = false;
                this.FullName = "";
                this.Email = "";
                this.Password = "";
                this.PhoneNumber = "";
                this.Activation = "";
                this.Role = "";
            }
        },
        showEdit(data) {
            if (this.showAgentManagement) {
                this.showPopup = false;
                this.showAgentManagement = false;
            } else {
                this.TypeOperation = "Edit";
                this.showPopup = true;
                this.showAgentManagement = true;
                this.ID = data.id
                this.FullName = data.FullName;
                this.Email = data.Email;
                this.PhoneNumber = data.PhoneNumber;
                this.Activation = data.Activation;
                this.Role = data.Role;
                setTimeout(() => {
                    if (this.Activation) {
                        $(".act").addClass("back");
                    }
                }, 100);
            }
        },
        activate() {
            if (this.Activation) {
                $(".act").removeClass("back");
                this.Activation = false;
            } else {
                $(".act").addClass("back");
                this.Activation = true;
            }
            this.body["Activation"] = this.Activation;
        },
        selectRole(Role) {
            this.Role = Role;
            this.body["Role"] = this.Role;
            this.openDropdown();
        },
        clearInputs() {
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

            $("#Password").on("focus", function () {
                $(".Password").text("");
                $(this).removeClass("error__class");
            });

            $("#Password").blur(function () {
                $(this).removeClass("error__class");
            });

            $("#PhoneNumber").on("focus", function () {
                $(".PhoneNumber").text("");
                $(this).removeClass("error__class");
            });

            $("#PhoneNumber").blur(function () {
                $(this).removeClass("error__class");
            });

            $(".showRoles").click(function () {
                $(".showRoles").removeClass("error__class");
            });

        },
        async addAgent() {
            this.clearInputs();

            if (this.FullName.trim().length == 0) {
                this.FullName = "";
                $("#FullName").addClass("error__class");
                $(".FullName").text(this.$t("Agents.MissingInput"));
                this.errors++;
            }

            if (this.Email.trim().length == 0) {
                this.Email = "";
                $("#Email").addClass("error__class");
                $(".Email").text(this.$t("Agents.MissingInput"));
                this.errors++;
            }

            if (this.Password.trim().length == 0) {
                this.Password = "";
                $("#Password").addClass("error__class");
                $(".Password").text(this.$t("Agents.MissingInput"));
                this.errors++;
            }

            if (this.PhoneNumber.trim().length == 0) {
                this.PhoneNumber = "";
                $("#PhoneNumber").addClass("error__class");
                $(".PhoneNumber").text(this.$t("Agents.MissingInput"));
                this.errors++;
            }

            if (this.Role.trim().length == 0) {
                this.Role = "";
                $(".showRoles").addClass("error__class");
                this.errors++;
            }

            if (this.errors == 0) {
                await axios.post(url.ApiUrl + "/api/Agents/Add",
                    { FullName: this.FullName, Email: this.Email, Password: this.Password, PhoneNumber: this.PhoneNumber, Activation: this.Activation, Role: this.Role },
                    {
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    }).then((res) => {
                        if (res.status == 201) {
                            this.showAdd("Close");

                            this.success = true;
                            this.MessageTitle = this.$i18n.t("Agents.Success");
                            this.MessageDescription = this.$i18n.t("Agents.Description");

                            setTimeout(() => {
                                this.success = false;
                                this.MessageTitle = "";
                                this.MessageDescription = "";
                            }, 3000);

                            this.loadAgents();
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


        },
        async editAgent() {

            let errors = 0;

            this.body["id"] = this.ID;

            this.clearInputs();

            if (this.FullName.trim().length == 0) {
                this.FullName = "";
                $("#FullName").addClass("error__class");
                $(".FullName").text(this.$t("Agents.MissingInput"));
                this.errors++;
            }

            if (this.Email.trim().length == 0) {
                this.Email = "";
                $("#Email").addClass("error__class");
                $(".Email").text(this.$t("Agents.MissingInput"));
                this.errors++;
            }

            if (this.body.Password != undefined) {
                if (this.Password.trim().length == 0) {
                    this.Password = "";
                    $("#Password").addClass("error__class");
                    $(".Password").text(this.$t("Agents.MissingInput"));
                    this.errors++;
                }
            }

            if (this.PhoneNumber.trim().length == 0) {
                this.PhoneNumber = "";
                $("#PhoneNumber").addClass("error__class");
                $(".PhoneNumber").text(this.$t("Agents.MissingInput"));
                this.errors++;
            }

            if (this.Role.trim().length == 0) {
                this.Role = "";
                $(".showRoles").addClass("error__class");
                this.errors++;
            }

            let isAnythingChanged = true;

            if ((Object.keys(this.body).length === 0 && this.body.constructor === Object) || Object.keys(this.body).length === 1) {
                isAnythingChanged = false;
            }


            if (errors == 0 && isAnythingChanged) {
                await axios.patch(url.ApiUrl + "/api/Agents/Update", this.body, { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
                    this.showAdd("Close");

                    this.success = true;
                    this.MessageTitle = this.$i18n.t("Agents.Success");
                    this.MessageDescription = this.$i18n.t("Agents.AgentUpdated");

                    setTimeout(() => {
                        this.success = false;
                        this.MessageTitle = "";
                        this.MessageDescription = "";
                    }, 3000);

                    this.loadAgents();
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

        },
        manageAgents(operation) {
            if (operation == "Add") {
                this.addAgent();
            } else if (operation == "Edit") {
                this.editAgent();
            }
        },
        async deActivate(id, activation) {
            await axios.patch(url.ApiUrl + "/api/Agents/Deactivate", {id: id, Activation: activation}, {headers: {Authorization: localStorage.getItem("token")}}).then((res) => {
                if(res.status == 200) {
                    this.success = true;
                    this.MessageTitle = this.$i18n.t("Agents.Success");
                    this.MessageDescription = this.$i18n.t("Agents.AgentUpdated");

                    setTimeout(() => {
                        this.success = false;
                        this.MessageTitle = "";
                        this.MessageDescription = "";
                    }, 3000);

                    this.loadAgents();
                }
            })
        }
    }
});
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
}

.main {
    display: flex;
}

.ManageAgents {
    margin: 3rem 3rem 0rem 3rem;
    width: 100%;
}

.section__title {
    color: var(--FONT-COLOR);
    margin-bottom: 2rem;
}

.addBtn {
    width: 120px;
    height: 45px;
    background-color: var(--PRIMARY-COLOR);
    border-radius: 5px;
    color: #fff;
    margin: 0 1rem;
    font-size: 1rem;
    transition: all 300ms ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: var(--HOVER-COLOR);
    }
}

/****************** Popup Style ******************/
.popup {
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
}

.popup__wrapper {
    width: 500px;
    min-height: 400px;
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

.form__title {
    font-weight: bold;
    color: #eee;
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

.input {
    width: 376px;
    padding: 0.7rem;
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
    transition: all 300ms ease-in-out;
}



.text__input:focus,
.textarea__input:focus {
    border: 1px solid var(--PRIMARY-COLOR);
}

.form__button {
    width: 360px;
    height: 40px;
    background-color: var(--PRIMARY-COLOR);
    transition: all 300ms ease-in-out;
    border-radius: 5px;
    color: #fff;

    &:hover {
        cursor: pointer;
        background-color: var(--HOVER-COLOR);
    }
}



.err {
    display: flex;
    color: var(--ERROR-COLOR);
}

/****************** Popup Style ******************/

.mAgents {
    margin-top: 2rem;
}

.Agents {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
}

.agent {
    margin-top: 2.5rem;
    min-width: 250px;
    height: 80px;
    background-color: var(--BG2-COLOR);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    box-shadow: 0px 0px 15px 10px rgba(0, 0, 0, 0.266);
    padding: 1rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    transition: all 300ms ease-in-out;
    border-bottom: 3px solid var(--PRIMARY-COLOR);

    span {
        font-weight: bold;
        color: #fff;
    }

    .edit__button,
    .trash__button {
        position: absolute;
        top: -50px;
        left: 65%;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--PRIMARY-COLOR);
        color: #fff;
        transition: all 300ms ease-in-out;

        &:hover {
            cursor: pointer;
            background-color: var(--HOVER-COLOR);
        }
    }

    .trash__button {
        left: 85%;
    }
}

.showRoles {
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
    transition: all 300ms ease-in-out;

    &:hover {
        cursor: pointer;
    }
}

.remove_bottom_border {
    border-bottom: none;
}

.roles_list {
    border: 1.5px solid rgba(180, 180, 180, 0.507);
    width: 360px;
    height: 90px;
    overflow: auto;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: transparent;
}

.role {
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

.role:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.act {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 360px;
    height: 45px;
    padding: 0 10px;
    border: 1px solid grey;
    border-radius: 5px;
    color: var(--FONT-COLOR);
    margin-top: 0.8rem;
    font-weight: bold;
    font-size: 0.85rem;
    transition: all 300ms ease-in-out;
}

.act:hover {
    cursor: pointer;
}

.back {
    border: 1px solid var(--PRIMARY-COLOR);
    background-color: var(--PRIMARY-COLOR);
}

.error__class {
    border: 2px solid var(--ERROR-COLOR);
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