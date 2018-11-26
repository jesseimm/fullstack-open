import axios from 'axios';

const baseUrl = '/api/blogs';

let token = null;
let config = null;

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const create = async (newObject) => {
  const response = await axios
    .post(baseUrl, newObject, config);

  return response.data;
};

const update = async (blog) => {
  const {
    user, likes, author, title, url,
  } = blog;
  const newBlog = {
    user, likes, author, title, url,
  };

  const response = await axios
    .put(`${baseUrl}/${blog._id} `, newBlog, config);

  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config);

  return response.data;
};

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  config = { headers: { Authorization: token } };
};

export default {
  getAll, create, update, setToken, remove,
};
