<template>
  <div class="h-full pt-20">
    <div class="h-[40vh] flex flex-col justify-center">
      <template v-if="isQuestion()">
        <Question></Question>
      </template>
      <template v-else-if="isAnswer()">
        <Answer></Answer>
      </template>
    </div>
  </div>
  <Tips></Tips>
  <Summary></Summary>
  <AuthRequired></AuthRequired>
</template>

<script setup lang="ts">
import Question from "./Question.vue";
import Answer from "./Answer.vue";
import Summary from "./Summary.vue";
import Tips from "./Tips.vue";
import AuthRequired from './AuthRequired.vue';
import { useGameMode } from "~/composables/main/game";
import { useCourseStore } from '~/store/course';

const { isAnswer, isQuestion } = useGameMode();
const courseStore = useCourseStore();
</script>
