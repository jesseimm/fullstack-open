import React from 'react';

class Togglable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  toggleVisibility() {
    this.setState(prevState => ({ visible: !prevState.visible }));
  }

  render() {
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' };
    const showWhenVisible = { display: this.state.visible ? '' : 'none' };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button type="button" onClick={this.toggleVisibility}>{this.props.buttonLabel}</button>
        </div>
        <div style={showWhenVisible}>
          {this.props.children}
          <button type="button" onClick={this.toggleVisibility}>cancel</button>
        </div>
      </div>
    );
  }
}

export default Togglable;
