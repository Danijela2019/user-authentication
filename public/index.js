const clearInputFields = (input1, input2) => {
  document.getElementById(input1) ? (document.getElementById(input1).value = '') : null;
  document.getElementById(input2).value = '';
};

const sendMessageToUser = (input) => {
  document.getElementById('messageText').innerHTML = `<h3>${input}</h3>`;
};

const sendUserDataToServer = async (event, input1Id, input2Id, path) => {
  event.preventDefault();
  const userName = document.getElementById(input1Id)
    ? document.getElementById(input1Id).value
    : null;
  const password = document.getElementById(input2Id).value;
  clearInputFields(input1Id, input2Id);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: userName
      ? JSON.stringify({ userName, password })
      : JSON.stringify({
          newPassword: password,
          token: localStorage.getItem('token'),
        }),
  };
  const resault = await fetch(path, options)
    .then((res) => res.json())
    .catch((err) => sendMessageToUser(err));
  handleResponseData(resault, path);
};

const handleResponseData = (data, path) => {
  if (data.error) {
    sendMessageToUser(data.error);
  }
  if (data.status === 'ok') {
    switch (path) {
      case '/api/register':
        sendMessageToUser(data.message);
        break;
      case '/api/login':
        localStorage.setItem('token', data.data);
        sendMessageToUser(data.message);
        break;
      case '/api/change-password':
        sendMessageToUser(data.message);
        break;
      default:
        sendMessageToUser('Something went wrong 🙁');
    }
  }
};

const clearForm = (event, formId) => {
  event.preventDefault();
  document.getElementById(formId).reset();
  document.getElementById('messageText').innerHTML = ``;
};
