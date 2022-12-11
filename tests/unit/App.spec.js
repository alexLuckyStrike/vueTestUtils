import App from "@/App.vue";
import CounterInput from "@/components/CounterInput.vue";
import { shallowMount } from "@vue/test-utils";
import { nextTick } from "vue";

const CounterInputStub = {
  template: '<div><slot></slot><slot name="warning"></slot></div>',
  props: CounterInput.props,
  model: CounterInput.model,
  // Vue3
  emits: CounterInput.emits,
  $_vueTestUtils_original: CounterInput,
};

describe("Counter", () => {
  let wrapper;

  // const findPlusButton = () =>
  //   wrapper.findAll("button").wrappers.find((w) => w.text() === "+");

  // const findMinusButton = () =>
  //   wrapper.findAll("button").wrappers.find((w) => w.text() === "-");

  // find...=> wrapper | undefined;
  // Empty wrapper .exist() => false;

  const findButtonByText = (text) =>
    wrapper.findAll("button").wrappers.find((w) => w.text() === text);

  const createComponent = (props) => {
    wrapper = shallowMount(App, {
      propsData: props,
      stubs: {
        // CounterInput:true // При использовании mount (чтобы компонент не отображался)
        // CounterInput:false // При использовании shallowMount(чтобы отображался настоящий shallowMount)
        CounterInput: CounterInputStub,
      },
    });
  };

  // afterEach(() => {
  //   wrapper.destroy();
  // });

  it("shows 0 when initialized", () => {
    // Arrange
    createComponent();

    // Assert
    expect(wrapper.text()).toContain("0");
  });

  // тест в форме таблицы
  it.each`
    buttonText | change                 | expectedResult
    ${"+"}     | ${"increments by one"} | ${"1"}
    ${"-"}     | ${"decrements by one"} | ${"-1"}
  `(
    "$change when $buttonText button + is clicked",
    async ({ buttonText, expectedResult }) => {
      createComponent();
      await findButtonByText(buttonText).trigger("click");
      expect(wrapper.text()).toContain(expectedResult);
    }
  );

  const BACK_TO_0_TEXT = "Back to 0";
  it("shows reset button when counter is below zero", async () => {
    // Arrange
    createComponent();
    await findButtonByText("-").trigger("click");
    expect(wrapper.text()).toContain("-1");
    await wrapper.vm.$nextTick();

    expect(findButtonByText(BACK_TO_0_TEXT).exists()).toBe(true);
  });

  it("does not shows reset button when counter is above zero", async () => {
    createComponent();

    // негативная проверка
    expect(findButtonByText(BACK_TO_0_TEXT)).toBe(undefined);
  });

  // более простые тесты
  // it("increments by one when button is clicked", async () => {
  //   createComponent();
  //   await findMinusButton().trigger("click");
  //   expect(wrapper.text()).toContain("-1");
  // });

  // it("decrements by one when button is clicked", async () => {
  //   createComponent();
  //   await findPlusButton().trigger("click");
  //   expect(wrapper.text()).toContain("1");
  // });

  it("increases by one when plus key is pressed", async () => {
    createComponent();
    const event = new KeyboardEvent("keyup", {
      key: "+",
    });
    document.dispatchEvent(event);
    await nextTick();
    expect(wrapper.text()).toContain("+");
  });

  it("removes attached event listener when destroyed", async () => {
    // const originalAddEventListener = document.addEventListener;
    // document.addEventListener = jest.fn().mockImplementation((...args) => {
    //   return originalAddEventListener.call(document, ...args);
    // });

    jest.spyOn(document, "addEventListener");
    jest.spyOn(document, "removeEventListener");

    // Arrange
    createComponent();
    const [, keyUpListener] = document.addEventListener.mock.calls.find(
      ([key]) => key === "keyup"
    );
    expect(document.removeEventListener).not.toHaveBeenCalledWith(
      "keyup",
      keyUpListener
    );
    // Act
    wrapper.destroy();

    // Assert
    expect(document.removeEventListener).toHaveBeenCalledWith(
      "keyup",
      keyUpListener
    );
  });

  it("Correctly initializes when initValue is passed", () => {
    const INITIAL_VALUE = 5;
    createComponent({ initialValue: INITIAL_VALUE });
    console.log(wrapper.html());
    expect(wrapper.text()).toContain(`${INITIAL_VALUE}`);
  });

  it("Correctly resets when initValue is changed", async () => {
    const INITIAL_VALUE = 5;
    const NEW_INITIAL_VALUE = 10;

    createComponent({ initialValue: INITIAL_VALUE });

    await findButtonByText("-").trigger("click");
    await wrapper.setProps({ initialValue: NEW_INITIAL_VALUE });

    expect(wrapper.text()).toContain(`${NEW_INITIAL_VALUE}`);
  });

  it("Correctly resets both counter when initialValue is changed", async () => {
    const INITIAL_VALUE = 5;
    const NEW_INITIAL_VALUE = 10;
    createComponent({ initialValue: INITIAL_VALUE });
    await findButtonByText("-").trigger("click");
    await findButtonByText("dec2").trigger("click");
    expect(wrapper.text()).toContain(`${INITIAL_VALUE - 1} / -1`);
    await wrapper.setProps({ initialValue: NEW_INITIAL_VALUE });
    await nextTick();
    expect(wrapper.text()).toContain(`${NEW_INITIAL_VALUE} / 0`);
  });

  it("passes current value to CounterInput", () => {
    const INITIAL_VALUE = 30;
    createComponent({ initialValue: INITIAL_VALUE });

    console.log("getProps:", wrapper.findComponent(CounterInput).props());
    expect(wrapper.findComponent(CounterInputStub).props().value).toBe(
      INITIAL_VALUE
    );
  });
  it("updates current value when CounterInput provides new one", async () => {
    const INITIAL_VALUE = 30;
    const NEW_INITIAL_VALUE = 40;
    createComponent({ initialValue: INITIAL_VALUE });
    console.log("getProps:", wrapper.findComponent(CounterInput).props());
    wrapper
      .findComponent(CounterInput)
      .vm.$emit(CounterInput.model?.event ?? "input", NEW_INITIAL_VALUE);
    await nextTick();
    expect(wrapper.text()).toContain(`${NEW_INITIAL_VALUE} / 0`);
  });

  it("passes second value to CounterInput", async () => {
    createComponent();
    await findButtonByText("inc2").trigger("click");
    expect(wrapper.findComponent(CounterInput).text()).toContain("1");
  });

  it("passes BETA to warning CounterInput", async () => {
    createComponent();
    expect(wrapper.findComponent(CounterInput).text()).toContain("BETA");
  });
});
