<template>
  <nav class="h-20 flex items-center justify-between shrink-0">
    <NuxtLink to="/">
      <div class="logo flex items-center">
        <img width="48" height="48" class="rounded-md overflow-hidden mr-6" src="/logo.png" alt="earth-worm-logo" />
        <h1 class="text-2xl leading-none font-black leading-normal text-wrap text-fuchsia-400">
          Earthworm
        </h1>
      </div>
    </NuxtLink>
    <div class="flex items-center">
      <button v-if="!userStore.user && route.name !== 'Auth-Login'" class="btn btn-sm btn-ghost mx-1 h-8 px-2"
        @click="handleLogin">
        Log in
      </button>
      <button v-else-if="!userStore.user && route.name !== 'Auth-Signup'" class="btn btn-sm btn-ghost mx-1 h-8 px-2"
        @click="handleSignup">
        Sign up
      </button>
      <div v-else class="dropdown dropdown-end">
        <button tabindex="0" class="btn btn-sm btn-ghost rounded-md mx-1 w-8 h-8 p-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </button>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
          <li><a>User info</a></li>
          <li @click="handleLogout"><a>Log out</a></li>
          <!-- <li><a>Item 2</a></li> -->
        </ul>
      </div>
      <button class="btn btn-sm btn-ghost rounded-md mx-1 w-8 h-8 p-0" @click="toggleDarkMode">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import { navigateTo } from "nuxt/app";
import { useRoute } from "vue-router";
import { useDarkMode } from "~/composables/darkMode";
import { useUserStore } from "~/store/user";
import { cleanToken } from "~/utils/token";
const route = useRoute();

const userStore = useUserStore();

const { setDarkMode, toggleDarkMode } = useDarkMode()

const handleLogin = () => {
  navigateTo("/auth/login");
};

const handleSignup = () => {
  navigateTo("/auth/signup");
};

const message = useMessage();
const handleLogout = () => {
  userStore.logoutUser();
  cleanToken();
  message.success("logout success", {
    duration: 500,
    onLeave() {
      navigateTo("/");
    },
  });
};

</script>
<style></style>