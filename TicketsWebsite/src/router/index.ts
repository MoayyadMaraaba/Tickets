import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import DashbaordView from '@/views/DashboardView.vue';
import CreateTicket from '@/views/CreateTicket.vue';
import ProfileView from "@/views/ProfileView.vue";
import LogoutView from '@/views/LogoutView.vue';
import ManagementView from '@/views/ManagementView.vue';
import TicketView from '@/views/TicketView.vue';
import AgentsView from '@/views/AgentsView.vue';
import RegisterView from '@/views/RegisterView.vue';

import store from '@/store';
import i18n from "../i18n";

Vue.use(VueRouter)


const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: `/${i18n.locale}`
  },
  {
    path: "/:lang",
    component: {
      render(c: any) {
        return c("router-view");
      },
    },
    children: [
      {
        path: "",
        component: HomeView,
        meta: {
          Roles: ['Visitor', 'User', 'Agent', 'Admin']
        }
      },
      {
        path: 'home',
        name: 'home',
        component: HomeView,
        meta: {
          Roles: ['Visitor', 'User', 'Agent', 'Admin']
        }
      },
      {
        path: 'Login',
        name: 'Login',
        component: LoginView,
        meta: {
          Roles: ['Visitor']
        }
      },
      {
        path: 'Register',
        name: 'Register',
        component: RegisterView,
        meta: {
          Roles: ['Visitor']
        }
      },
      {
        path: 'Dashboard',
        name: 'Dashboard',
        component: DashbaordView,
        meta: {
          Roles: ['User', 'Agent', 'Admin']
        }
      },
      {
        path: 'CreateTicket',
        name: 'CreateTicket',
        component: CreateTicket,
        meta: {
          Roles: ['User', 'Agent', 'Admin']
        }
      },
      {
        path: 'Logout',
        name: 'Logout',
        component: LogoutView,
        meta: {
          Roles: ['User', 'Agent', 'Admin']
        }
      },
      {
        path: 'Profile',
        name: 'Profile',
        component: ProfileView,
        meta: {
          Roles: ['User', 'Agent', 'Admin']
        }
      },
      {
        path: 'Management',
        name: 'Management',
        component: ManagementView,
        meta: {
          Roles: ['User', 'Agent', 'Admin']
        }
      },
      {
        path: 'Ticket/:id',
        name: 'Ticket',
        component: TicketView,
        meta: {
          Roles: ['User', 'Agent', 'Admin']
        }
      },
      {
        path: 'Agents',
        name: 'Agents',
        component: AgentsView,
        meta: {
          Roles: ['Admin']
        }
      },
    ]
  },
  {
    path: "*",
    redirect: `/${i18n.locale}`,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

let isUser = false;
const isAgent = store.getters.isAgentLoggedIn;
const isAdmin = store.getters.isAdminLoggedIn;

if (!isAgent && !isAdmin && store.getters.isLoggedIn) {
  isUser = true;
}

let CurrentRole = "";

if (isUser) {
  CurrentRole = "User";
} else if (isAgent) {
  CurrentRole = "Agent";
} else if (isAdmin) {
  CurrentRole = "Admin";
} else {
  CurrentRole = "Visitor";
}

router.beforeEach((to, from, next) => {
  if (from.path == "/") {
    next();
  } else {
    if (to.meta != undefined) {
      if (to.meta.Roles.includes(CurrentRole)) {
        next();
      } else {
        if (isUser || isAgent || isAdmin) {
          next(`/${i18n.locale}/Dashboard`);
        } else {
          next(`/${i18n.locale}/Login`);
        }
      }
    }
  }
})

export default router
