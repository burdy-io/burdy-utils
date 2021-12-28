import { subscribeToPreview, updatePreview } from '../preview';
import faker from 'faker';


describe('preview', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('subscribes to window', () => {
    window.addEventListener = jest.fn();

    const subscription = subscribeToPreview({});

    expect(subscription).toBeDefined();
    expect(window.addEventListener).toHaveBeenCalled();
  });

  it('unsubscribes from window', () => {
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();

    const subscription = subscribeToPreview({});

    expect(subscription).toBeDefined();
    expect(window.addEventListener).toHaveBeenCalled();
    expect(window.removeEventListener).not.toHaveBeenCalled();

    subscription!.unsubscribe();
    expect(window.removeEventListener).toHaveBeenCalled();
  });

  it('updates the preview', () => {
    window.parent.postMessage = jest.fn();
    const slug = faker.random.word();

    updatePreview({
      slug
    } as any);

    expect(window.parent.postMessage).toHaveBeenCalled();
    expect(window.parent.postMessage).toHaveBeenCalledWith({
      page: { slug },
      source: 'burdy-data-change'
    }, '*');
  });
});
