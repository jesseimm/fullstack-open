import React from 'react';

class ShowFull extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({ visible: !prevState.visible }));
  }

  render() {
    if (!this.state.visible) {
      return (
        <div onClick={this.toggle} role="button">
          {this.props.preview}
        </div>
      );
    }

    return (
      <div onClick={this.toggle} role="button">
        {this.props.children}
      </div>
    );
  }
}

export default ShowFull;
