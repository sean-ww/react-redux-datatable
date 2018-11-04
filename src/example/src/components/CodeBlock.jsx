import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.string,
};

const defaultProps = {
  children: '',
};

class CodeBlock extends React.Component {
  componentDidMount() {
    // run the PR.prettyPrint() function once your page has finished loading
    if (typeof PR !== 'undefined') PR.prettyPrint(); // eslint-disable-line no-undef
  }

  render() {
    return (
      <div className="highlight-text-html-basic">
        <pre className="prettyprint lang-js">{this.props.children}</pre>
      </div>
    );
  }
}

CodeBlock.propTypes = propTypes;
CodeBlock.defaultProps = defaultProps;

export default CodeBlock;
