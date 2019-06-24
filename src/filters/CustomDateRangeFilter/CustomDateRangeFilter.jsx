/* eslint jsx-a11y/no-static-element-interactions: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DateUtils } from 'react-day-picker';
import getPosition from './getPosition';
import DateField from './DateRangeInputField';

import { DISPLAY_DATE_FORMAT, ISO_8601_DATE_FORMAT, ISO_8601_DATETIME_FORMAT } from '../../constants';

const propTypes = {
  columnKey: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
  defaultValue: PropTypes.object,
  getFilter: PropTypes.func,
};

const defaultProps = {
  defaultValue: {},
  getFilter: null,
};

class CustomDateFilter extends React.Component {
  state = {
    showPicker: false,
    topPosition: 0,
    leftPosition: -1000,
    from: null,
    to: null,
    displayValue: '',
  };

  componentWillMount() {
    if (this.props.defaultValue && this.props.defaultValue.from) {
      this.setState({ from: this.props.defaultValue.from });
      if (this.props.defaultValue.to) this.setState({ to: this.props.defaultValue.to });
      this.setDisplayValue(this.props.defaultValue.from, this.props.defaultValue.to);
    }
  }

  componentDidMount() {
    // export onFilter function to allow users to access
    if (this.props.getFilter) {
      this.props.getFilter(() => {
        this.clearFilters();
      });
    }

    this.filter();
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  setDisplayValue = (fromDate, toDate) => {
    let displayValue = '';
    if (moment.isDate(fromDate)) {
      if (moment.isDate(toDate)) {
        displayValue = `
              ${moment(fromDate).format(DISPLAY_DATE_FORMAT)}
              ${' - '}
              ${moment(toDate).format(DISPLAY_DATE_FORMAT)}
              `;
      } else displayValue = moment(fromDate).format(DISPLAY_DATE_FORMAT);
    }
    this.setState({
      displayValue,
    });
  };

  updateFilters = (fromDate, toDate) => {
    const fromValue = moment(fromDate).format(ISO_8601_DATE_FORMAT);
    let toValue;
    if (moment.isDate(toDate)) {
      this.setDisplayValue(fromDate, toDate);
      toValue = moment(toDate)
        .hours(23)
        .minutes(59)
        .seconds(59)
        .format(ISO_8601_DATETIME_FORMAT);
    } else {
      this.setDisplayValue(fromDate, fromDate);
      toValue = moment(fromDate)
        .hours(23)
        .minutes(59)
        .seconds(59)
        .format(ISO_8601_DATETIME_FORMAT);
    }
    this.props.onFilter({
      from: fromValue,
      to: toValue,
    });
  };

  clearFilters = () => {
    this.setState({
      from: null,
      to: null,
      displayValue: '',
    });
    this.props.onFilter();
  };

  filter = () => {
    if (moment.isDate(this.state.from)) {
      this.updateFilters(this.state.from, this.state.to);
    } else {
      this.clearFilters();
    }
    this.windowClick();
  };

  handleDayClick = day => {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  };

  handleResetClick = () => {
    this.setState({
      from: null,
      to: null,
    });
  };

  addEvents = () => {
    window.addEventListener('click', this.windowClick, false);
    window.addEventListener('scroll', this.positionPicker, false);
    window.addEventListener('resize', this.positionPicker, false);
  };

  removeEvents = () => {
    window.removeEventListener('click', this.windowClick);
    window.removeEventListener('scroll', this.positionPicker);
    window.removeEventListener('resize', this.positionPicker);
  };

  windowClick = () => {
    this.setState({
      showPicker: false,
      topPosition: 0,
      leftPosition: -1000,
    });
    this.removeEvents();
  };

  positionPicker = () => {
    const parentPosition = getPosition(document.getElementById(`${this.props.columnKey}-date-filter`));
    const elemWidth = document.getElementById(`${this.props.columnKey}-date-filter-container`).offsetWidth;
    const elemHeight = document.getElementById(`${this.props.columnKey}-date-filter-container`).offsetHeight;
    const rightOfElement = parentPosition.x + elemWidth;
    const bottomOfElement = parentPosition.y + elemHeight;

    const rightOfScreen = document.documentElement.offsetWidth;
    const bottomOfScreen = Math.max(document.documentElement.offsetHeight, window.innerHeight);

    const leftAdjustmentPadding = 2;
    const leftAdjustment = Math.max(rightOfElement + leftAdjustmentPadding - rightOfScreen, 0);
    const topAdjustmentPadding = 3;
    const topAdjustment = Math.max(bottomOfElement + topAdjustmentPadding - bottomOfScreen, -22);

    this.setState({
      topPosition: parentPosition.y - topAdjustment,
      leftPosition: parentPosition.x - leftAdjustment,
    });
  };

  togglePicker = () => {
    const { showPicker } = this.state;
    this.removeEvents();
    this.setState(prevState => ({
      showPicker: !prevState.showPicker,
      topPosition: 0,
      leftPosition: -1000,
    }));
    if (!showPicker) {
      this.positionPicker(!showPicker);
      this.addEvents();
    }
  };

  render() {
    const { columnKey } = this.props;
    const { topPosition, leftPosition, from, to, displayValue } = this.state;

    // Render the Calendar
    return (
      <div
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
        id={`${columnKey}-date-filter`}
        class="custom-date-filter filter"
      >
        <span onClick={this.togglePicker} onKeyDown={this.togglePicker} class="filter-value">
          {displayValue}
        </span>
        <div
          class="dropContainer dropHide"
          id={`${columnKey}-date-filter-container`}
          style={{
            position: 'fixed',
            zIndex: 19,
            top: topPosition,
            left: leftPosition,
          }}
        >
          <div class="fromToDate">
            <DateField handleDayClick={this.handleDayClick} from={from} to={to} />
          </div>

          <div style={{ clear: 'both' }}>
            <div
              id="cidCourseListFilterOkButton"
              class="okButton filterButton"
              onClick={this.filter}
              onKeyDown={this.filter}
            >
              OK
            </div>
            {from && (
              <div
                id="cidCourseListFilterClearFilterButton"
                class="clearFilterButton"
                onClick={this.handleResetClick}
                onKeyDown={this.handleResetClick}
              >
                Clear Filter
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

CustomDateFilter.propTypes = propTypes;
CustomDateFilter.defaultProps = defaultProps;

export default CustomDateFilter;
