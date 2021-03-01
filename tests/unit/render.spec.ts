import { createLocalVue, mount } from "@vue/test-utils";
import App from "@/App.vue";
import { BContainer } from "bootstrap-vue";
const localVue = createLocalVue();

localVue.component("b-container", BContainer);

describe("App.vue", () => {
  it("renders the application", () => {
    const title = "Item Quality Evaluator";
    const wrapper = mount(App, {
      stubs: ["router-view"],
      components: {
        BContainer
      }
    });
    expect(wrapper.text()).toMatch(title);
  });
});
