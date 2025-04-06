<template>
    <div>
        <AuthHeader />

        <main class="main">
            <!--======= Sidebar =======-->
            <Sidebar />
            <!--======= Sidebar =======-->

            <!--======= Management =======-->
            <section class="Manage">
                <h1 class="section__title">{{ $t("Management.title") }}</h1>

                <!--======= Displaying Types =======-->
                <div class="mTypes">
                    <h1 class="section__title">{{ $t("Management.Types") }} <button class="add__button"
                            v-on:click="showAdd('type')">{{
                                $t("Management.Add") }} <i class="fa-solid fa-plus"></i> </button>
                    </h1>
                    <div class="Types">
                        <div class="type" v-for="type in Types" v-bind:key="type.ID">

                            <span v-if="$i18n.locale == 'en'">{{ type.NameEN }}</span>
                            <span v-if="$i18n.locale == 'ar'">{{ type.NameAR }}</span>

                            <button class="edit__button" v-on:click="showEdit('type', type)"><i
                                    class="fa-regular fa-pen-to-square"></i></button>
                            <button class="trash__button" v-on:click="deleteST('Types', type.ID)"><i
                                    class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
                <!--======= Displaying Types =======-->

                <!--======= Displaying Status =======-->
                <div class="mStatus">
                    <h1 class="section__title">{{ $t("Management.Status") }} <button class="add__button"
                            v-on:click="showAdd('Status')">{{
                                $t("Management.Add") }} <i class="fa-solid fa-plus"></i> </button></h1>
                    <div class="Status">
                        <div class="status" v-for="status in Status" v-bind:key="status.ID">
                            <span v-if="$i18n.locale == 'en'">{{ status.NameEN }}</span>
                            <span v-if="$i18n.locale == 'ar'">{{ status.NameAR }}</span>
                            <button class="edit__button" v-on:click="showEdit('Status', status)"><i
                                    class="fa-regular fa-pen-to-square"></i></button>
                            <button class="trash__button" v-on:click="deleteST('Status', status.ID)"><i
                                    class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
                <!--======= Displaying Status =======-->


            </section>
            <!--======= Management =======-->

            <!--======= Popup =======-->
            <div class="popup" v-if="showPopup">
                <div class="dispage">
                    <div class="popup__wrapper">
                        <!--======= popup controls =======-->
                        <div class="exit">
                            <button class="exit__button" v-on:click="showAdd('close')">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <!--======= popup controls =======-->

                        <!--======= Manage Type =======-->
                        <form @submit.prevent="manageType(TypeOperation)" method="post" class="popup__form"
                            v-if="showTypeManagement">
                            <!--======= form title =======-->
                            <h1 class="form__title" v-if="TypeOperation == 'Add'">{{ $t("Management.Add") }}</h1>
                            <h1 class="form__title" v-if="TypeOperation == 'Edit'">{{ $t("Management.Edit") }}</h1>
                            <!--======= form title =======-->

                            <!--======= Type Name EN =======-->
                            <div class="input">
                                <input type="text" autocomplete="off" v-model="TypeNameEN" class="text__input"
                                    id="TypeNameEN" :placeholder="$t('Management.TypeNameEN')" />
                                <br>
                                <label for="TypeNameEN" class="err TypeNameEN"></label>
                            </div>
                            <!--======= Type Name EN =======-->

                            <!--======= Type Name AR =======-->
                            <div class="input">
                                <input type="text" autocomplete="off" v-model="TypeNameAR" class="text__input"
                                    id="TypeNameAR" :placeholder="$t('Management.TypeNameAR')" />
                                <br>
                                <label for="TypeNameAR" class="err TypeNameAR"></label>
                            </div>
                            <!--======= Type Name AR =======-->

                            <!--======= Submit Button =======-->
                            <div class="input">
                                <button class="form__button">
                                    <span class="form__title" v-if="TypeOperation == 'Add'">{{ $t("Management.Add")
                                        }}</span>
                                    <span class="form__title" v-if="TypeOperation == 'Edit'">{{ $t("Management.Edit")
                                        }}</span>
                                </button>
                            </div>
                            <!--======= Submit Button =======-->
                        </form>
                        <!--======= Manage Type =======-->

                        <!--======= Manage Status =======-->
                        <form @submit.prevent="manageStatus(TypeOperation)" method="post" class="popup__form"
                            v-if="showStatusManagement">
                            <!--======= form title =======-->
                            <h1 class="form__title" v-if="TypeOperation == 'Add'">{{ $t("Management.Add") }}</h1>
                            <h1 class="form__title" v-if="TypeOperation == 'Edit'">{{ $t("Management.Edit") }}</h1>
                            <!--======= form title =======-->

                            <!--======= Status Name EN =======-->
                            <div class="input">
                                <input type="text" autocomplete="off" v-model="StatusNameEN" class="text__input"
                                    id="StatusNameEN" :placeholder="$t('Management.StatusNameEN')" />
                                <br>
                                <label for="StatusNameEN" class="err StatusNameEN"></label>
                            </div>
                            <!--======= Status Name EN =======-->

                            <!--======= Status Name EN =======-->
                            <div class="input">
                                <input type="text" autocomplete="off" v-model="StatusNameAR" class="text__input"
                                    id="StatusNameAR" :placeholder="$t('Management.StatusNameAR')" />
                                <br>
                                <label for="StatusNameAR" class="err StatusNameAR"></label>
                            </div>
                            <!--======= Status Name EN =======-->

                            <!--======= Submit Button =======-->
                            <div class="input">
                                <button class="form__button">
                                    <span class="form__title" v-if="TypeOperation == 'Add'">{{ $t("Management.Add")
                                        }}</span>
                                    <span class="form__title" v-if="TypeOperation == 'Edit'">{{ $t("Management.Edit")
                                        }}</span>
                                </button>
                            </div>
                            <!--======= Submit Button =======-->
                        </form>
                        <!--======= Manage Status =======-->
                    </div>
                </div>
            </div>
            <!--======= Popup =======-->
        </main>
    </div>
</template>

<script lang="js">

import Vue from 'vue';
import AuthHeader from '@/components/AuthHeader.vue';
import Sidebar from '@/components/SidebarComponent.vue';
import axios from 'axios';
import url from '@/ApiUrl';
import jquery from 'jquery';
let $ = jquery;

export default Vue.extend({
    name: "DashboardView",
    components: {
        AuthHeader,
        Sidebar
    },
    data() {
        return {
            Types: [],
            Status: [],
            showPopup: false,
            TypeOperation: "",
            showTypeManagement: false,
            showStatusManagement: false,
            // Forms Input (Type)
            TypeID: 0,
            TypeNameEN: "",
            TypeNameAR: "",

            // Forms Input (Status)
            StatusID: 0,
            StatusNameEN: "",
            StatusNameAR: "",

            // errors
            errors: 0
        }
    },
    async mounted() {
        await this.$store.dispatch("Verify");
        await this.$store.dispatch("Types");
        await this.$store.dispatch("Status");

        this.Types = this.$store.getters.getTypes;
        this.Status = this.$store.getters.getStatus;

    },
    methods: {
        showAdd(type) {
            if (type == "type") {
                if (this.showTypeManagement) {
                    this.showPopup = false;
                    this.showTypeManagement = false;
                } else {
                    this.TypeOperation = "Add";
                    this.showPopup = true;
                    this.showTypeManagement = true;
                }
            } else if (type == "Status") {
                if (this.showStatusManagement) {
                    this.showPopup = false;
                    this.showStatusManagement = false;
                } else {
                    this.TypeOperation = "Add";
                    this.showPopup = true;
                    this.showStatusManagement = true;
                }
            } else if (type == "close") {
                this.showPopup = false;
                this.showTypeManagement = false;
                this.showStatusManagement = false;
            }
        },
        showEdit(type, data) {
            if (type == "type") {
                if (this.showTypeManagement) {
                    this.showPopup = false;
                    this.showTypeManagement = false;
                } else {
                    this.TypeOperation = "Edit";
                    this.TypeID = data.ID;
                    this.TypeNameEN = data.NameEN;
                    this.TypeNameAR = data.NameAR;
                    this.showPopup = true;
                    this.showTypeManagement = true;
                }
            } else if (type == "Status") {
                if (this.showStatusManagement) {
                    this.showPopup = false;
                    this.showStatusManagement = false;
                } else {
                    this.TypeOperation = "Edit";
                    this.StatusID = data.ID;
                    this.StatusNameEN = data.NameEN;
                    this.StatusNameAR = data.NameAR;
                    this.showPopup = true;
                    this.showStatusManagement = true;
                }
            }
        },
        async manageType(TypeOperation) {
            this.errors = 0;

            $("#TypeNameEN").on("focus", function () {
                $(".TypeNameEN").text("");
                $(this).removeClass("error__class");
            });

            $("#TypeNameEN").blur(function () {
                $(this).removeClass("error__class");
            });


            $("#TypeNameAR").on("focus", function () {
                $(".TypeNameAR").text("");
                $(this).removeClass("error__class");
            });

            $("#TypeNameAR").blur(function () {
                $(this).removeClass("error__class");
            });


            if (this.TypeNameEN.trim().length == 0) {
                this.TypeNameEN = "";
                $("#TypeNameEN").addClass("error__class");
                $(".TypeNameEN").text(this.$t("Management.MissingInput"));
                this.errors++;
            }

            if (this.TypeNameAR.trim().length == 0) {
                this.TypeNameAR = "";
                $("#TypeNameAR").addClass("error__class");
                $(".TypeNameAR").text(this.$t("Management.MissingInput"));
                this.errors++;
            }

            if (this.errors == 0) {
                let endpoint = TypeOperation == 'Add' ? "/api/Types/Add" : `/api/Types/Update/${this.TypeID}`;
                let result;

                if (TypeOperation == 'Add') {
                    result = await axios.post(url.ApiUrl + endpoint, { NameEN: this.TypeNameEN, NameAR: this.TypeNameAR }, { headers: { Authorization: localStorage.getItem("token") } });
                }

                if (TypeOperation == 'Edit') {
                    result = await axios.patch(url.ApiUrl + endpoint, { NameEN: this.TypeNameEN, NameAR: this.TypeNameAR }, { headers: { Authorization: localStorage.getItem("token") } });
                }

                if (result.status == 201 || result.status == 200) {
                    this.TypeNameEN = "";
                    this.TypeNameAR = "";
                    this.showPopup = false;
                    this.showTypeManagement = false;

                    await this.$store.dispatch("Types");
                    this.Types = this.$store.getters.getTypes;
                }
            }
        },
        async manageStatus(TypeOperation) {
            this.errors = 0;

            $("#StatusNameEN").on("focus", function () {
                $(".StatusNameEN").text("");
                $(this).removeClass("error__class");
            });

            $("#StatusNameEN").blur(function () {
                $(this).removeClass("error__class");
            });


            $("#StatusNameAR").on("focus", function () {
                $(".StatusNameAR").text("");
                $(this).removeClass("error__class");
            });

            $("#StatusNameAR").blur(function () {
                $(this).removeClass("error__class");
            });


            if (this.StatusNameEN.trim().length == 0) {
                this.StatusNameEN = "";
                $("#StatusNameEN").addClass("error__class");
                $(".StatusNameEN").text(this.$t("Management.MissingInput"));
                this.errors++;
            }

            if (this.StatusNameAR.trim().length == 0) {
                this.StatusNameAR = "";
                $("#StatusNameAR").addClass("error__class");
                $(".StatusNameAR").text(this.$t("Management.MissingInput"));
                this.errors++;
            }

            if (this.errors == 0) {
                let endpoint = TypeOperation == 'Add' ? "/api/Status/Add" : `/api/Status/Update/${this.StatusID}`;
                let result;

                if (TypeOperation == 'Add') {
                    result = await axios.post(url.ApiUrl + endpoint, { NameEN: this.StatusNameEN, NameAR: this.StatusNameAR }, { headers: { Authorization: localStorage.getItem("token") } });
                }

                if (TypeOperation == 'Edit') {
                    result = await axios.patch(url.ApiUrl + endpoint, { NameEN: this.StatusNameEN, NameAR: this.StatusNameAR }, { headers: { Authorization: localStorage.getItem("token") } });
                }

                if (result.status == 201 || result.status == 200) {
                    this.StatusNameEN = "";
                    this.StatusNameAR = "";
                    this.showPopup = false;
                    this.showStatusManagement = false;

                    await this.$store.dispatch("Status");
                    this.Status = this.$store.getters.getStatus;
                }
            }
        },
        async deleteST(typeOrStatus, ID) {
            await axios.delete(url.ApiUrl + `/api/${typeOrStatus}/Delete/${ID}`, { headers: { Authorization: localStorage.getItem("token") } }).then((res) => {
                if (res.status == 200) {
                    if (typeOrStatus == "Types") {
                        for (let i = 0; i < this.Types.length; i++) {
                            if (this.Types[i].ID == ID) {
                                this.Types.splice(i, 1);
                            }
                        }
                    } else if (typeOrStatus == "Status") {
                        for (let i = 0; i < this.Status.length; i++) {
                            if (this.Status[i].ID == ID) {
                                this.Status.splice(i, 1);
                            }
                        }
                    }
                }
            });
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

.add__button {
    min-width: 120px;
    height: 40px;
    background-color: var(--PRIMARY-COLOR);
    color: #fff;
    border-radius: 5px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 300ms ease-in-out;

    &:hover {
        background-color: var(--HOVER-COLOR);
        cursor: pointer;
    }
}

.mTypes,
.mStatus {
    margin-top: 2rem;
}

.Types,
.Status {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
}

.type,
.status {
    margin-top: 2.5rem;
    width: 250px;
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
        top: -40px;
        left: 70%;
        visibility: hidden;
        opacity: 0;
        width: 30px;
        height: 30px;
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
        left: 90%;
    }

    &:hover {

        .edit__button,
        .trash__button {
            visibility: visible;
            opacity: 1;
        }
    }
}


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
    padding: 1rem;
}

.text__input {
    width: 360px;
    height: 40px;
    padding: 0 1rem;
    border: 2px solid grey;
    border-radius: 5px;
    background-color: #eee;
    transition: all 300ms ease-in-out;
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

.error__class {
    border: 2px solid var(--ERROR-COLOR);
}

.err {
    display: flex;
    color: var(--ERROR-COLOR);
}
</style>