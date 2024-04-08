export async function groupAnimate(animations) {
  const waiters = new Array(animations.length).fill(0).reduce((acc) => {
    const waiter: any = {};
    waiter.promise = new Promise((...args) => [waiter.resolve, waiter.reject] = args);
    acc.push(waiter);
    return acc;
  }, []);
  animations.forEach(({ el, keyframes, options }, index) => {
    const animation = el.animate(keyframes, options);
    animation.addEventListener('finish', function handler() {
      waiters[index].resolve();
      animation.removeEventListener('finish', handler);
    });
  });
  await Promise.all(waiters.map(({ promise }) => promise));
}
