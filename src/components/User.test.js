import { shallowMount } from '@vue/test-utils';
import User from './User.vue';

describe('modal', () => {
  it('renders a name', () => {
    expect.assertions(1);
    const wrapper = shallowMount(User, {
      propsData: {
        user: {
          fullName: 'Andrii Melnyk',
        },
      },
    });
    expect(wrapper.text()).toMatch('Andrii Melnyk');
  });
});
