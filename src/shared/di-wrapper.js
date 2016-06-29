
import { default as actualConstitute } from 'constitute';

let container = null;

export const constitute = (Class) => {
  if(!container) {
    return actualConstitute(Class);
  }

  return container.constitute(Class);
};

// used for intercepting constitutes during tests, otherwise regular constitute is used.
export const setConstituteContainer = (newContainer) => {
  container = newContainer;
};