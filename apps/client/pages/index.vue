<template>
  <div class="container w-full">
    <template v-if="isLoading">
      <Loading></Loading>
    </template>
    <template v-else>
      <section class="flex md:flex-row md:justify-between justify-center flex-col py-8">
        <div class="w-1/2 mx-4">
          <div class="mb-12 leading-loose text-3xl opacity-80 items-center">
            <div class="">Why aren’t you good at English?</div>
            <div class="align-middle">
              It’s because you haven’t used
              <span class="text-fuchsia-400 font-bold">EARTHWORM</span> yet! 🤪
              <i class="animate-wink inline w-1 h-8 dark:bg-white bg-slate-900 mx-2 text-2xl p-[2px]"></i>
            </div>
          </div>
          <a class="mr-4" target="_blank" href="https://github.com/cuixueshe/earthworm">
            <button class="btn w-48 indicator">
              <span class="indicator-item">🌟</span>
              Star us on GitHub
            </button>
          </a>
          <button @click="handleKeydown"
            class="btn btn-outline w-48 hover:text-fuchsia-400 hover:border-fuchsia-400 hover:bg-fuchsia-100 text-fuchsia-300 border-fuchsia-300">
            Go and get it <kbd class="kbd"> ↵ </kbd>
          </button>
        </div>
        <div class="w-1/2 flex items-center justify-center group select-none cursor-pointer rounded-xl relative m-4">
          <div class="absolute flex h-full w-full card">
            <div class="bg-dot rounded-[64px]"></div>
            <div
              class="absolute left-0 right-0 top-0 text-[220px] text-center group-hover:-skew-y-12 group-hover:rotate-12 transition-all">
              📖
            </div>
            <div
              class="absolute left-48 right-0 top-24 text-[80px] -ml-28 text-center color-gray group-hover:-skew-y-12 group-hover:rotate-[30deg] group-hover:-ml-32 group-hover:-mt-6 transition-all">
              🪱
            </div>
          </div>
        </div>
      </section>
      <section class="flex flex-col py-8">
        <h2 class="text-4xl text-center">What is Earthworm?</h2>
        <p class="text-center">
          an open-source, collaborative, user-friendly English learning tool.
        </p>
        <div class="flex">
          <div
            class="rounded-3xl my-8 mx-2 border dark:border-slate-600 bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 transition duration-300 dark:from-neutral-600/90 dark:to-neutral-450/90 w-1/2 hover:shadow-2xl">
            <div class="h-[330px] flex p-4">使用介绍 就是还没来得及写 -_-</div>
          </div>
          <div
            class="rounded-3xl my-8 mx-2 border dark:border-slate-600 bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 transition duration-300 dark:from-neutral-600/90 dark:to-neutral-450/90 w-1/2 hover:shadow-xl">
            <div class="h-[330px] flex p-4">这里是 earthworm 背后的学习原理 写的好不好?</div>
          </div>
        </div>
        <div class="w-1/2"></div>
        <div class="w-1/2"></div>
      </section>
      <section class="flex flex-col py-8">
        <h2 class="text-4xl text-center">Why Earthworm?</h2>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import Loading from '~/components/Loading.vue'
import { ref } from 'vue';
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useActiveCourseId } from '~/store/course';
import { startGame } from "~/composables/main/game";
import { registerShortcut, cancelShortcut } from "~/utils/keyboardShortcuts";

const isLoading = ref(false)
const { handleKeydown } = useShortcutToGame();

function useShortcutToGame() {
  const router = useRouter();

  async function handleKeydown() {
    const { updateCourseId, getCourseId } = useActiveCourseId();
    let courseId = getCourseId()
    if (!courseId) {
      // 显示 Loading
      isLoading.value = true
      // 更新缓存的课程 id
      let res = await startGame();
      courseId = res.courseId
      updateCourseId(courseId)
      // 关闭 Loading
      isLoading.value = false
    }
    router.push(`/main/${courseId}`);
  }
  onMounted(() => {
    registerShortcut("enter", handleKeydown);
  });

  onUnmounted(() => {
    cancelShortcut("enter", handleKeydown);
  });

  return {
    handleKeydown,
  };
}
</script>

<style>
.bg-dot {
  aspect-ratio: 1;
  position: relative;
  background: #fff;
  filter: contrast(50) invert(0);
  mix-blend-mode: multiply;
  isolation: isolate;
  opacity: 0.4;
  overflow: hidden;
}

.dark .bg-dot {
  opacity: 1;
}

.bg-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at center,
      #a800b2 0.06rem,
      transparent 0.65rem);
  background-size: var(--bgSize, 1rem) var(--bgSize, 1rem);
  background-repeat: round;
  background-position:
    0 0,
    var(--bgPosition) var(--bgPosition);
  mask-image: linear-gradient(rgb(0 0 0), rgb(0 0 0 / 0.5));
}
</style>
