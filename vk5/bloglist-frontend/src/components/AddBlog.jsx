import React from 'react';
import blogService from '../services/blogs';


class AddBlog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      author: '',
      url: '',
    };
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.create = this.create.bind(this);
  }

  handleFieldChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  create(event) {
    event.preventDefault();
    const newObject = this.state;
    blogService.create(newObject, this.props.informUser);
    this.setState({
      title: '',
      author: '',
      url: '',
    });
  }

  render() {
    const { title, author, url } = this.state;

    return (
      <div>
        <form onSubmit={this.create}>
          <div>
        Title
            <input
              type="text"
              name="title"
              value={title}
              onChange={this.handleFieldChange}
            />
          </div>
          <div>
        Author
            <input
              type="text"
              name="author"
              value={author}
              onChange={this.handleFieldChange}
            />
          </div>
          <div>
        Url
            <input
              type="text"
              name="url"
              value={url}
              onChange={this.handleFieldChange}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    );
  }
}

export default AddBlog;
