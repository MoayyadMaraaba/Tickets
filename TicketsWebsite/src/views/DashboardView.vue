<template>
    <div class="page">
        <AuthHeader />

        <main class="main">
            <!--======= Sidebar =======-->
            <Sidebar />

            <!--======= Manage Tickets =======-->
            <section class="ManageTickets" id="Manage">
                <!--======= Manage Tickets Title =======-->
                <h1 class="section__title">{{ $t("Dashboard.title") }}</h1>

                <!--======= Filters =======-->
                <div class="filters">
                    <div class="search">
                        <!--======= Search form =======-->
                        <input type="text" class="text__input" id="search" v-model="query" name="query"
                            :placeholder="$t('Dashboard.Search')">

                        <button class="search__button" v-on:click="filter()">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>

                    <div class="dropdown">
                        <!--======= Sort by types =======-->
                        <div class="sort__button">
                            <span v-if="$i18n.locale == 'en'">
                                {{ $t("Dashboard.Type") }} : {{ selectedType.NameEN }}
                            </span>
                            <span v-if="$i18n.locale == 'ar'">
                                {{ $t("Dashboard.Type") }} : {{ selectedType.NameAR }}
                            </span>
                            <ul class="sort__list">
                                <li v-for="type in Types" v-bind:key="type.ID" v-on:click="selectType(type)">
                                    <span v-if="$i18n.locale == 'en'">
                                        {{ type.NameEN }}
                                    </span>
                                    <span v-if="$i18n.locale == 'ar'">
                                        {{ type.NameAR }}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <!--======= Sort by Status =======-->
                        <div class="sort__button">
                            <span v-if="$i18n.locale == 'en'">
                                {{ $t("Dashboard.Status") }} : {{ selectedStatus.NameEN }}
                            </span>
                            <span v-if="$i18n.locale == 'ar'">
                                {{ $t("Dashboard.Status") }} : {{ selectedStatus.NameAR }}
                            </span>
                            <ul class="sort__list">
                                <li v-for="status in Status" v-bind:key="status.ID" v-on:click="selectStatus(status)">
                                    <span v-if="$i18n.locale == 'en'">
                                        {{ status.NameEN }}
                                    </span>
                                    <span v-if="$i18n.locale == 'ar'">
                                        {{ status.NameAR }}
                                    </span>
                                </li>
                                <li v-on:click="getClosed()">Closed</li>
                            </ul>
                        </div>

                        <!--======= Sort by Priority =======-->
                        <div class="sort__button">
                            <span>
                                {{ $t("Dashboard.Priority") }} : {{ selectedPriority }}
                            </span>
                            <ul class="sort__list">
                                <li v-on:click="selectPriority('High')"><span>High</span></li>
                                <li v-on:click="selectPriority('Normal')"><span>Normal</span></li>
                                <li v-on:click="selectPriority('Low')"><span>Low</span></li>
                            </ul>
                        </div>

                        <!--======= Sort by Date =======-->
                        <div class="sort__button">
                            {{ $t("Dashboard.Date") }} : {{ this.date }}
                            <ul class="sort__list">
                                <li v-on:click="sortDate('Newest')"><span>{{ $t("Dashboard.Newest") }}</span></li>
                                <li v-on:click="sortDate('Oldest')"><span>{{ $t("Dashboard.oldest") }}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!--======= Filters =======-->

                <!--======= Tickets =======-->
                <div class="tickets">
                    <div class="table__head">
                        <div class="Subject"><i class="fa-solid fa-tag"></i> {{ $t("Dashboard.TicketsTable.Subject") }}
                        </div>
                        <div class="Status"><i class="fa-solid fa-spinner"></i> {{ $t("Dashboard.TicketsTable.Status")
                            }}
                        </div>
                        <div class="Type"><i class="fa-regular fa-bookmark"></i> {{ $t("Dashboard.TicketsTable.Type") }}
                        </div>
                        <div class="Agent"><i class="fa-regular fa-user"></i> {{ $t("Dashboard.TicketsTable.Agent") }}
                        </div>
                        <div class="Priority"><i class="fa-regular fa-flag"></i> {{
                            $t("Dashboard.TicketsTable.Priority") }}
                        </div>
                        <div class="Date"><i class="fa-regular fa-calendar-days"></i> {{
                            $t("Dashboard.TicketsTable.Date")
                        }}</div>
                        <div class="Manage">
                            <i class="fa-regular fa-eye"></i> {{ $t("Dashboard.TicketsTable.Manage") }}
                        </div>
                    </div>
                    <div class="table__body">
                        <div v-if="!isLoading" class="cont">
                            <div v-if="Tickets.length != 0">
                                <div class="table__row" v-for="ticket in Tickets" v-bind:key="ticket.TicketID"
                                    :id="`ticket__${ticket.TicketID}`">
                                    <!--======= Ticket Subject =======-->
                                    <div class="Subject">{{ ticket.Subject }}</div>
                                    <!--======= Ticket Subject =======-->

                                    <!--======= Ticket Status =======-->
                                    <div :class="isAgent || isAdmin ? 'Status hoverClass' : 'Status'">
                                        <div class="content">
                                            <span v-if="$i18n.locale == 'en'">{{ ticket.StatusNameEN }}</span>
                                            <span v-if="$i18n.locale == 'ar'">{{ ticket.StatusNameAR }}</span>
                                        </div>
                                        <div class="status__dropdown" v-if="isAgent || isAdmin">
                                            <div class="dropdowm__item" v-for="stat in Status" v-bind:key="stat.ID"
                                                v-on:click="manage(ticket.TicketID, stat.ID, 'Status', stat)">
                                                <span v-if="$i18n.locale == 'en'">{{ stat.NameEN }}</span>
                                                <span v-if="$i18n.locale == 'ar'">{{ stat.NameAR }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!--======= Ticket Status =======-->

                                    <!--======= Ticket Type =======-->
                                    <div :class="isAgent || isAdmin ? 'Type hoverClass' : 'Type'">
                                        <div class="content">
                                            <span v-if="$i18n.locale == 'en'"> {{ ticket.TypeNameEN }}</span>
                                            <span v-if="$i18n.locale == 'ar'">{{ ticket.TypeNameAR }}</span>
                                        </div>
                                        <div class="type__dropdown">
                                            <div class="dropdowm__item" v-for="type in Types" v-bind:key="type.ID"
                                                v-on:click="manage(ticket.TicketID, type.ID, 'Type', type)">
                                                <span v-if="$i18n.locale == 'en'">{{ type.NameEN }}</span>
                                                <span v-if="$i18n.locale == 'ar'">{{ type.NameAR }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!--======= Ticket Type =======-->

                                    <!--======= Ticket Agent =======-->
                                    <div :class="isAgent || isAdmin ? 'Agent hoverClass' : 'Agent'">
                                        <div class="content" v-if="ticket.AgentFullName == null">
                                            {{ $t("Dashboard.TicketsTable.NoAgent") }}
                                        </div>
                                        <div class="content" v-else>
                                            {{ ticket.AgentFullName }}
                                            <button class="remove__agent"
                                                v-on:click="manage(ticket.TicketID, 0, 'Agent', null)"
                                                v-if="isAgent || isAdmin">X</button>
                                        </div>
                                        <div class="agent__dropdown">
                                            <div class="dropdowm__item" v-for="agent in Agents" v-bind:key="agent.id"
                                                v-on:click="manage(ticket.TicketID, agent.id, 'Agent', agent)">
                                                <span>{{ agent.FullName }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!--======= Ticket Agent =======-->


                                    <!--======= Ticket Priority =======-->
                                    <div :class="isAgent || isAdmin ? 'Priority hoverClass' : 'Priority'">
                                        <div class="content">
                                            {{ ticket.Priority }}
                                        </div>
                                        <div class="priority__dropdown">
                                            <div class="dropdowm__item high"
                                                v-on:click="manage(ticket.TicketID, 'High', 'Priority', 'High')">High
                                            </div>
                                            <div class="dropdowm__item normal"
                                                v-on:click="manage(ticket.TicketID, 'Normal', 'Priority', 'Normal')">
                                                Normal
                                            </div>
                                            <div class="dropdowm__item low"
                                                v-on:click="manage(ticket.TicketID, 'Low', 'Priority', 'Low')">Low</div>
                                        </div>
                                    </div>
                                    <!--======= Ticket Priority =======-->

                                    <!--======= Ticket Date =======-->
                                    <div class="Date">{{ ticket.Date.split("T")[0] }}</div>
                                    <!--======= Ticket Date =======-->

                                    <!--======= Manage =======-->
                                    <div class="Manage">
                                        <button class="manage__button" v-on:click="viewTicket(ticket.TicketID)">
                                            <i class="fa-regular fa-eye"></i>
                                        </button>
                                    </div>
                                    <!--======= Manage =======-->
                                </div>
                            </div>
                            <div class="noTickets" v-else>
                                <h3>No Tickets yet.</h3>
                            </div>
                        </div>
                        <div class="loader" v-if="isLoading"></div>
                    </div>
                </div>
                <!--======= Tickets =======-->
            </section>
            <!--======= Manage Tickets =======-->
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
    name: "DashboardView",
    data() {
        return {
            Tickets: [],
            Types: [],
            Status: [],
            Agents: [],
            query: "",
            selectedType: {},
            selectedStatus: {},
            selectedPriority: "",
            date: "",
            TicketID: "",
            Closed: 0,
            isUser: false,
            isAgent: false,
            isAdmin: false,
            isLoading: true
        }
    },
    components: {
        AuthHeader,
        Sidebar
    },
    async mounted() {

        let isUser = false;
        const isAgent = this.$store.getters.isAgentLoggedIn;
        const isAdmin = this.$store.getters.isAdminLoggedIn;

        if (!isAgent && !isAdmin && this.$store.getters.isLoggedIn) {
            isUser = true;
        }

        this.isUser = isUser;
        this.isAgent = isAgent;
        this.isAdmin = isAdmin;

        await this.$store.dispatch("Verify");
        await this.$store.dispatch("Tickets");
        await this.$store.dispatch("Types");
        await this.$store.dispatch("Status");

        this.Tickets = this.$store.getters.getTickets;

        this.Types = this.$store.getters.getTypes;
        this.Status = this.$store.getters.getStatus;
        this.isLoading = false;

        if (this.isAgent || this.isAdmin) {
            await this.$store.dispatch("Agents");
            this.Agents = this.$store.getters.getAgents;
        }

    },
    methods: {
        selectType(Type) {
            if (this.selectedType.ID == Type.ID) {
                this.selectedType = {};
            } else {
                this.selectedType = Type;
            }
        },
        selectStatus(Status) {
            if (this.selectedStatus.ID == Status.ID) {
                this.selectedStatus = {};
            } else {
                this.selectedStatus = Status;
            }

        },
        selectPriority(Priority) {
            if (this.selectedPriority == Priority) {
                this.selectedPriority = "";
            } else {
                this.selectedPriority = Priority;
            }
        },
        sortDate(Data) {
            if (this.date == Data) {
                this.date = "";
            } else {
                this.date = Data;
            }
        },
        viewTicket(ID) {
            this.$router.push(`Ticket/${ID}`)
        },
        getClosed() {
            this.Closed = 1;
            this.filter();
            this.Closed = 0;
        },
        manage(ticketID, ID, operation, obj) {
            let body;

            let u;

            if (operation == "Type") {
                body = { type: "Type", typeID: ID, TicketID: ticketID };
                u = `${url.ApiUrl}/api/Tickets/Update`;
            } else if (operation == "Status") {
                body = { type: "Status", statusID: ID, TicketID: ticketID };
                u = `${url.ApiUrl}/api/Tickets/Update`;
            } else if (operation == "Agent") {
                body = { TicketID: ticketID, AgentID: ID };
                u = `${url.ApiUrl}/api/Tickets/Assign`;
            } else if (operation == "Priority") {
                body = { type: "Priority", Priority: ID, TicketID: ticketID };
                u = `${url.ApiUrl}/api/Tickets/Update`;
            }

            axios.patch(u, body, { headers: { authorization: localStorage.getItem("token") } }).then((res) => {
                if (res.status == 200) {
                    if (operation == "Status" || operation == "Type") {
                        $(`#ticket__${ticketID} .${operation} .content`).text(this.$i18n.locale == 'en' ? obj.NameEN : obj.NameAR);
                    }

                    if (operation == "Priority") {
                        $(`#ticket__${ticketID} .${operation} .content`).text(obj);
                    }

                    if (operation == "Agent") {
                        if (obj != null) {
                            $(`#ticket__${ticketID} .${operation} .content`).html(`${obj.FullName}`);
                        } else {
                            $(`#ticket__${ticketID} .${operation} .content`).text(this.$i18n.t("Dashboard.TicketsTable.NoAgent"));
                        }
                    }
                }
            });
        },
        filter() {
            axios.post(url.ApiUrl + "/api/Tickets/Filter",
                {
                    searchQuery: this.query,
                    Type: this.selectedType.ID,
                    Status: this.selectedStatus.ID,
                    Priority: this.selectedPriority,
                    Date: this.date,
                    Closed: this.Closed
                },
                {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then((res) => {
                    this.Tickets = res.data;
                });
        },
    },

})
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
}


.main {
    display: flex;
}

.ManageTickets {
    margin: 3rem 3rem 0rem 3rem;
    width: 100%;
}

.section__title {
    color: var(--FONT-COLOR);
    margin-bottom: 2rem;
}

.tickets {
    font-size: var(--FONT-SIZE);
    font-weight: bold;
    color: #eee;
    background-color: var(--BG2-COLOR);
    border-radius: 10px;
    height: 500px;
    width: 100%;
}

.table__body {
    height: 420px;
    overflow-y: auto;
}

.table__body::-webkit-scrollbar {
    width: 5px;
}

.table__body::-webkit-scrollbar-track {
    background: #bbb;
}

.table__body::-webkit-scrollbar-thumb {
    background-color: var(--PRIMARY-COLOR);

}

.table__row,
.table__head {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 80px;
    border-bottom: 1px solid grey;

    div {
        display: flex;
        justify-content: center;
        align-items: center;

        i {
            padding: 1rem;
        }
    }
}

.table__head {
    color: grey;
}

.table__row:last-child {
    border: none;
}

.Status,
.Type,
.Agent,
.Priority {
    position: relative;
    transition: all 300ms ease-in-out;
}

.Status .status__dropdown,
.Type .type__dropdown,
.Agent .agent__dropdown,
.Priority .priority__dropdown {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 3500;
    display: none;
}

.hoverClass:hover {
    background-color: #ababab;
    cursor: pointer;

    .status__dropdown,
    .type__dropdown,
    .agent__dropdown,
    .priority__dropdown {
        display: flex;
    }
}

.type__dropdown .dropdowm__item,
.status__dropdown .dropdowm__item,
.agent__dropdown .dropdowm__item,
.priority__dropdown .dropdowm__item {
    width: 100%;
    padding: 1rem;
    color: #FFF;
    transition: background 300ms ease-in-out;
    background-color: #444444;

    &:hover {
        background-color: var(--PRIMARY-COLOR);
    }
}


.dropdowm__item:last-child {
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
}


.remove__agent {
    color: #444444;
    transition: all 300ms ease-in-out;
    width: 40px;
    height: 40px;

    &:hover {
        cursor: pointer;
        color: var(--ERROR-COLOR);
    }
}

.manage__button {
    width: 40px;
    height: 40px;
    background-color: var(--PRIMARY-COLOR);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 0.9rem;
    border-radius: 5px;
    transition: all 300ms ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: var(--HOVER-COLOR);
    }
}

/**************** Filters ****************/
.filters {
    display: flex;
    margin-bottom: 2.5rem;
    flex-direction: column;
    gap: 2rem;
    flex-wrap: wrap;
}

/****** Search Form ******/
.search {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.text__input {
    width: 250px;
    height: 40px;
    border: 1px solid grey;
    border-radius: 5px;
    background-color: #eee;
    padding: 0 1rem;
}

.text__input::placeholder {
    color: #444444;
}

.search__button {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    background-color: var(--PRIMARY-COLOR);
    color: #fff;
    transition: all 300ms ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: var(--HOVER-COLOR);
    }
}

/****** Search Form ******/

.dropdown {
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
}

/****** Sorting ******/
.sort__button {
    min-width: 120px;
    padding: 1rem;
    height: 50px;
    background-color: var(--PRIMARY-COLOR);
    border-radius: 5px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    transition: all 50ms ease-in-out;
}

.sort__list {
    list-style-type: none;
    position: absolute;
    top: 50px;
    background-color: var(--PRIMARY-COLOR);
    width: 100%;
    visibility: hidden;
    opacity: 0;
    transition: all 400ms ease-in-out;
    z-index: 3500;
}

.sort__list li {
    transition: all 300ms ease-in-out;
    padding: 1rem;
}

.sort__button:hover {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;

    .sort__list {
        visibility: visible;
        opacity: 1;
    }
}

.sort__list {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.sort__list li:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.sort__list li:hover {
    cursor: pointer;
    background-color: var(--HOVER-COLOR);
}

/****** Sorting ******/

/**************** Filters ****************/
.cont {
    display: contents;
}
.noTickets {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.loader {
    width: 15px;
    aspect-ratio: 1;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.loader::before,
.loader::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--PRIMARY-COLOR);
}

.loader::before {
    box-shadow: -25px 0;
    animation: l8-1 1s infinite linear;
}

.loader::after {
    transform: rotate(0deg) translateX(25px);
    animation: l8-2 1s infinite linear;
}

@keyframes l8-1 {
    100% {
        transform: translateX(25px)
    }
}

@keyframes l8-2 {
    100% {
        transform: rotate(-180deg) translateX(25px)
    }
}
</style>