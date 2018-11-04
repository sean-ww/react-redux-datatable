import cs from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  active: PropTypes.bool.isRequired,
  title: PropTypes.string,
};

const defaultProps = {
  title: '',
};

class PageButton extends Component {
  handleClick = event => {
    event.preventDefault();
    this.props.onPageChange(this.props.page);
  };

  render() {
    const { page, title, active } = this.props;
    const classes = cs({
      active,
      'page-item': true,
    });

    return (
      <li class={classes} title={title}>
        <button type="button" onClick={this.handleClick} class="page-link">
          {page}
        </button>
      </li>
    );
  }
}

PageButton.propTypes = propTypes;
PageButton.defaultProps = defaultProps;

export default PageButton;
