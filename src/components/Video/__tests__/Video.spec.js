import { mount } from '@vue/test-utils';
import Video from '../';

describe('Video tests', () => {
  it('renders props.msg when passed', () => {
    const wrapper = mount(Video);
    const videoContainer = wrapper.find({ ref: 'videoContainer' });
    expect(videoContainer.exists()).toBe(true);
  });
});
