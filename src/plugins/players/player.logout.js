
export const socket = (socket) => {

  const logout = async (player) => {
    if(!socket.getAuthToken()) return;
    console.log(player);
  };

  socket.on('disconnect', logout);
  socket.on('plugin:player:login', logout);
};