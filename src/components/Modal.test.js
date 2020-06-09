import { shallowMount } from '@vue/test-utils';
import Modal from './Modal.vue';

describe('modal', () => {
  it('renders its default slot', () => {
    expect.assertions(1);
    const wrapper = shallowMount(Modal, {
      slots: {
        default: 'This modal is being tested',
      },
    });
    expect(wrapper.text()).toMatch('This modal');
  });
});
