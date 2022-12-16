import React from 'react';

export default (callback: (force?: boolean) => boolean, buffer: number) => {
  const calledRef = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<number>(null);

  function cancelTrigger() {
    window.clearTimeout(timeoutRef.current);
  }

  function trigger(force?: boolean) {
    cancelTrigger();

    if (!calledRef.current || force === true) {
      if (callback(force) === false) {
        // Not delay since callback cancelled self
        return;
      }

      calledRef.current = true;
      timeoutRef.current = window.setTimeout(() => {
        calledRef.current = false;
      }, buffer);
    } else {
      timeoutRef.current = window.setTimeout(() => {
        calledRef.current = false;
        trigger();
      }, buffer);
    }
  }

  return [
    trigger,
    () => {
      calledRef.current = false;
      cancelTrigger();
    },
  ];
};
