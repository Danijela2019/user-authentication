const checkPassword = (password, response) => {
  if (!password || typeof password !== 'string') {
    return response.status(422).json({ error: 'Invalid password format' });
  }
  if (password.length < 5) {
    return response.status(422).json({ error: 'Pasword lenght must be at least 6 characters' });
  }
};

const checkUserName = (name, response) => {
  if (!name || typeof name !== 'string' || name.length === 0) {
    return response.status(422).json({ error: 'Invalid user name or name filed is empty' });
  }
};

module.exports = {
  checkPassword,
  checkUserName,
};
