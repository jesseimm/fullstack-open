import axios from 'axios';

const baseUrl = '/api/blogs';

let token = null;


const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const create = async (newObject, informUser) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const response = await axios
      .post(baseUrl, newObject, config);

    informUser(`Adding new blog named titled ${newObject.title} succeeded`, 'success');
    return response.data;
  } catch (err) {
    informUser('Adding new blog failed', 'error');
  }
};

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

export default { getAll, create, setToken };
