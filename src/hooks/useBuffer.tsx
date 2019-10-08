import React from 'react';

export default (callback: Function, buffer: number) => {
  const calledRef = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<number>(null);

  function cancelTrigger() {
    window.clearTimeout(timeoutRef.current);
  }

  function trigger() {
    if (!calledRef.current) {
      callback();
      calledRef.current = true;

      cancelTrigger();
      timeoutRef.current = window.setTimeout(() => {
        calledRef.current = false;
      }, buffer);
    } else {
      cancelTrigger();
      timeoutRef.current = window.setTimeout(() => {
        calledRef.current = false;
        trigger();
      }, buffer);
    }
  }

  return [trigger, cancelTrigger];
};
