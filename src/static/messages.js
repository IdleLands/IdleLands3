
export const MESSAGES = {
  GENERIC: { notify: 'Generic error message. How did you get this?' },

  NO_PLAYER:          { type: 'error',    title: 'Login Error',    notify: 'Player does not exist.' },
  INVALID_TOKEN:      { type: 'error',    title: 'Login Error',    notify: 'Invalid auth token.' },
  INVALID_NAME:       { type: 'error',    title: 'Register Error', notify: 'Invalid character name. It must be between 2 and 20 characters.' },
  PLAYER_EXISTS:      { type: 'error',    title: 'Register Error', notify: 'A player with that name already exists.' },
  ALREADY_LOGGED_IN:  { type: 'error',    title: 'Login Error',    notify: 'You are already logged in elsewhere!' },
  LOGIN_SUCCESS:      { type: 'success',  title: 'Login',          notify: 'Login successful. Welcome back!' }
};