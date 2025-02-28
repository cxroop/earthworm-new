import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCourseStore } from "../course";
import { fetchCourse, fetchCompleteCourse } from "~/api/course";
import { type Course } from "../course";

vi.mock("~/api/course");

const firstCourse: Course = {
  id: 1,
  title: "第一课",
  statements: [
    { id: 1, english: "I", chinese: "我", soundmark: "/aɪ/" },
    {
      id: 2,
      chinese: "喜欢",
      english: "like",
      soundmark: "/laɪk/",
    },
  ],
};

const secondCourse: Course = {
  id: 2,
  title: "第二课",
  statements: [
    { id: 1, english: "like", chinese: "喜欢", soundmark: "/laɪk/" },
  ],
};

vi.mocked(fetchCourse).mockImplementation(async (courseId) => {
  if (courseId === 2) return secondCourse;
  return firstCourse;
});
vi.mocked(fetchCompleteCourse).mockImplementation(async () => firstCourse);

describe("course", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const store = useCourseStore();
    store.cleanProgress();
  });

  it("initializes with a course", async () => {
    const store = useCourseStore();

    await store.setup(1);

    expect(store.currentCourse).toEqual(firstCourse);
    expect(store.statementIndex).toBe(0);
  });

  it("navigates to the next statement", async () => {
    const store = useCourseStore();
    await store.setup(1);

    store.toNextStatement();

    expect(store.statementIndex).toBe(1);
  });

  it("resets statementIndex on doAgain", async () => {
    const store = useCourseStore();
    await store.setup(1);
    store.toNextStatement();

    store.doAgain();

    expect(store.statementIndex).toBe(0);
  });

  it("checks if all statements are done", async () => {
    const store = useCourseStore();
    await store.setup(1);

    expect(store.isAllDone()).toBe(false);
    //在 firstCourse 中只有 2 个 statement
    //所以执行后 就应该是完成的状态
    store.toNextStatement();
    expect(store.isAllDone()).toBe(true);
  });

  it("checks if the answer is correct", async () => {
    const store = useCourseStore();
    await store.setup(firstCourse.id);

    expect(store.checkCorrect("I")).toBe(true);
    expect(store.checkCorrect("i")).toBe(true);
    expect(store.checkCorrect("like")).toBe(false);
  });

  it("the length of the word should be one", async () => {
    const store = useCourseStore();
    await store.setup(firstCourse.id);

    expect(store.wordCount).toBe(1);
  });

  it("the count of first course question should be two", async () => {
    const store = useCourseStore();
    await store.setup(firstCourse.id);

    expect(store.totalQuestionsCount).toBe(2);
  });

  describe("course progress", () => {
    it("should be restored when there is a progress record", async () => {
      const store = useCourseStore();
      await store.setup(firstCourse.id);
      store.toNextStatement();

      // 重置
      await store.setup(firstCourse.id);

      expect(store.statementIndex).toBe(1);
    });

    it("resets on completeCourse", async () => {
      const store = useCourseStore();
      await store.setup(firstCourse.id); // 假设初始化课程并完成一些进度
      store.toNextStatement();

      await store.completeCourse(1);

      await store.setup(firstCourse.id); // 在重新加载

      expect(store.statementIndex).toBe(0); // 验证 statementIndex 是否重置
    });

    it("saves and restores progress independently for multiple courses", async () => {
      const store = useCourseStore();
      await store.setup(firstCourse.id); // 初始化第一个课程
      store.toNextStatement(); // 更新进度

      await store.setup(secondCourse.id); // 切换到第二个课程
      expect(store.statementIndex).toBe(0); // 验证新课程的初始进度

      store.toNextStatement(); // 更新第二个课程的进度
      await store.setup(firstCourse.id); // 再次切换回第一个课程
      expect(store.statementIndex).toBe(1); // 验证第一个课程的进度被正确恢复

      await store.setup(secondCourse.id); // 切换到第二个课程
      expect(store.statementIndex).toBe(1); // 验证第二个课程的进度也被正确恢复
    });
  });
});
