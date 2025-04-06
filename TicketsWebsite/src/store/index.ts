import url from '@/ApiUrl';
import axios from 'axios';
import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || null,
    isUser: localStorage.getItem("ADGIJGIEMGASDG") || null,
    isAgent: localStorage.getItem("MGDI(S*ht3n2g") || null,
    isAdmin: localStorage.getItem("#SGEGs1531trh") || null,
    Types: [],
    Tickets: [],
    Status: [],
    Agents: []
  },
  getters: {
    isLoggedIn(state) {
      return state.isUser !== null;
    },
    isAgentLoggedIn(state) {
      return state.isAgent !== null;
    },
    isAdminLoggedIn(state) {
      return state.isAdmin !== null;
    },
    getTypes(state) {
      return state.Types;
    },
    getTickets(state) {
      return state.Tickets;
    },
    getStatus(state) {
      return state.Status;
    },
    getAgents(state) {
      return state.Agents;
    }
  },
  mutations: {
    user(state, isUser) {
      state.isUser = isUser;
    },
    agent(state, isAgent) {
      state.isAgent = isAgent;
    },
    admin(state, isAdmin) {
      state.isAdmin = isAdmin;
    },
    types(state, types) {
      state.Types = types;
    },
    tickets(state, tickets) {
      state.Tickets = tickets;
    },
    status(state, status) {
      state.Status = status;
    },
    agents(state, agents) {
      state.Agents = agents;
    }
  },
  actions: {
    Login(context, data) {
      return new Promise((resolve, reject) => {
        axios.post(url.ApiUrl + "/api/Authentication/Login", { Email: data.Email, Password: data.Password }).then((res) => {

          if (res.status == 200) {
            const token = res.data.token;
            localStorage.setItem("token", token);

            if (res.data.role == "Admin") {
              localStorage.setItem("#SGEGs1531trh", "true");
              context.commit("admin", "true");
            } else if (res.data.role == "Agent") {
              localStorage.setItem("MGDI(S*ht3n2g", "true");
              context.commit("agent", "true");
            } else if (res.data.role == "User") {
              localStorage.setItem("ADGIJGIEMGASDG", "true");
              context.commit("user", "true");
            }

          }

          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      })
    },
    Types(context) {
      return new Promise((resolve, reject) => {
        axios.get(url.ApiUrl + "/api/Types/Get").then((res) => {
          const data = res.data;
          context.commit("types", data);
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      })
    },
    Tickets(context) {
      return new Promise((resolve, reject) => {
        axios.get(url.ApiUrl + "/api/Tickets/Get", { headers: { authorization: localStorage.getItem("token") } }).then((res) => {
          context.commit("tickets", res.data);
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      })
    },
    Status(context) {
      return new Promise((resolve, reject) => {
        axios.get(url.ApiUrl + "/api/Status/Get").then((res) => {
          context.commit("status", res.data);
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      })
    },
    Agents(context) {
      return new Promise((resolve, reject) => {
        axios.get(url.ApiUrl + "/api/Agents/Get", { headers: { authorization: localStorage.getItem("token") } }).then((res) => {
          context.commit("agents", res.data);
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      })
    },
    Verify(context) {
      return new Promise((resolve, reject) => {
        axios.get(url.ApiUrl + "/api/Authentication/Verify", {headers: {Authorization: localStorage.getItem("token")}}).then((res) => {
          resolve(res);
        }).catch((err) => {
          if(err.response.status == 401) {
            localStorage.clear();
            router.push({name: "home"});
            location.reload();
          }
          reject(err);
        })
      })
    }

  },
  modules: {
  }
})
