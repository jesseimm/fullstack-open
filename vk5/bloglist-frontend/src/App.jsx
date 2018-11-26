import React from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import AddBlog from './components/AddBlog';
import Togglable from './components/Togglable';
import ShowFull from './components/ShowFull';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: [],
      username: '',
      password: '',
      user: null,
      message: null,
      messageType: null,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.informUser = this.informUser.bind(this);
  }

  componentDidMount() {
    blogService.getAll().then(blogs => this.setState({ blogs }));

    const loggedUser = window.localStorage.getItem('loggedUser');
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      this.setState({ user });
      blogService.setToken(user.token);
    }
  }

  handleFieldChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async login(event) {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password,
      }, this.informUser);

      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      blogService.setToken(user.token);
      this.informUser('Succesfully logged in', 'success');
      this.setState({
        username: '', password: '', user, loginVisible: false,
      });
    } catch (exception) {
      this.informUser('Failed to login', 's');
    }
  }

  logout(event) {
    event.preventDefault();
    window.localStorage.removeItem('loggedUser');
    blogService.setToken(null);
    this.setState({ user: null });
  }

  informUser(message, messageType) {
    this.setState({ message, messageType });
    setTimeout(() => {
      this.setState({ message: null, messageType: null });
    }, 5000);
  }

  render() {
    const {
      username, password, message, messageType, user,
    } = this.state;

    return (
      <div>
        <Notification message={message} type={messageType} />
        <UserInfo
          user={user}
          logout={this.logout}
        />
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleFieldChange={this.handleFieldChange}
            login={this.login}
          />
        </Togglable>
        <Togglable buttonLabel="add blog">
          <AddBlog
            informUser={this.informUser}
          />
        </Togglable>
        <h2>blogs</h2>
        <Blogs>
          {this.state.blogs.sort((a, b) => (a.likes >= b.likes ? -1 : 1))}
        </Blogs>
      </div>
    );
  }
}

const Blogs = ({ children }) => {
  const blogs = children.map(blog => (
    <ShowFull
      preview={blog.title}
      key={blog._id}
    >
      <Blog blog={blog} />
    </ShowFull>
  ));

  return (
    <div>
      {blogs}
    </div>
  );
};

const UserInfo = ({ user, logout }) => {
  if (!user) return '';
  return (
    <p>
      {user.name} logged in
      <button type="button" onClick={logout}>Logout</button>
    </p>
  );
};

const LoginForm = ({
  username, password, handleFieldChange, login,
}) => (
  <div>
    <h2>Kirjaudu sovellukseen</h2>
    <form onSubmit={login}>
      <div>
      Käyttäjänimi
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleFieldChange}
        />
      </div>
      <div>
      Salasana
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleFieldChange}
        />
      </div>
      <button type="submit">kirjaudu</button>
    </form>
  </div>
);

const Notification = ({ message, type }) => {
  const color = type === 'error' ? 'red' : 'green';
  return (
    <div style={{ color }}>
      {message}
    </div>
  );
};

export default App;
