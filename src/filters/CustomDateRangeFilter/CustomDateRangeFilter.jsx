import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DateUtils } from 'react-day-picker';
import getPosition from './getPosition';
import DateField from './DateRangeInputField';

class CustomDateFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showPicker: false,
            topPosition: 0,
            leftPosition: -1000,
            from: null,
            to: null,
            displayValue: '',
        };
    }

    componentWillMount() {
        if (this.props.defaultValue && this.props.defaultValue.from) {
            this.setState({ from: this.props.defaultValue.from });
            if (this.props.defaultValue.to) this.setState({ to: this.props.defaultValue.to });
            this.setDisplayValue(this.props.defaultValue.from, this.props.defaultValue.to);
        }
    }

    componentWillUnmount() {
        this.removeEvents();
    }

    setDisplayValue = (fromDate, toDate) => {
        let displayValue = '';
        if (moment.isDate(fromDate)) {
            if (moment.isDate(toDate)) {
                displayValue = `
                ${moment(fromDate).format('DD/MM/YYYY')}
                ${' - '}
                ${moment(toDate).format('DD/MM/YYYY')}
                `;
            } else displayValue = moment(fromDate).format('DD/MM/YYYY');
        }
        this.setState({
            displayValue,
        });
    };

    customCleanFiltered = () => {
        this.setState({
            from: null,
            to: null,
            displayValue: '',
        });
        this.props.filterHandler(); // clear filter
    };

    filter = () => {
        if (moment.isDate(this.state.from)) {
            const fromValue = moment(this.state.from).format('YYYY-MM-DD');
            let toValue;
            if (moment.isDate(this.state.to)) {
                this.setDisplayValue(this.state.from, this.state.to);
                toValue = moment(this.state.to)
                    .hours(23).minutes(59).seconds(59)
                    .format('YYYY-MM-DD HH:mm:ss');
            } else {
                this.setDisplayValue(this.state.from, this.state.from);
                toValue = moment(this.state.from)
                    .hours(23).minutes(59).seconds(59)
                    .format('YYYY-MM-DD HH:mm:ss');
            }
            this.props.filterHandler({
                values: {
                    from: fromValue,
                    to: toValue,
                },
                type: 'between',
            });
        } else {
            this.setState({
                displayValue: '',
            });
            this.props.filterHandler(); // clear filter
        }
        this.windowClick();
    };

    handleDayClick = (day) => {
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
    }

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
        const bottomOfScreen = Math.max(
            document.documentElement.offsetHeight,
            window.innerHeight,
        );

        const leftAdjustmentPadding = 2;
        const leftAdjustment = Math.max((rightOfElement + leftAdjustmentPadding) - rightOfScreen, 0);
        const topAdjustmentPadding = 3;
        const topAdjustment = Math.max((bottomOfElement + topAdjustmentPadding) - bottomOfScreen, -22);

        this.setState({
            topPosition: parentPosition.y - topAdjustment,
            leftPosition: parentPosition.x - leftAdjustment,
        });
    };

    togglePicker = () => {
        this.removeEvents();

        const nextShowState = !this.state.showPicker;
        this.setState({
            showPicker: nextShowState,
            topPosition: 0,
            leftPosition: -1000,
        });
        if (nextShowState) {
            this.positionPicker(nextShowState);
            this.addEvents();
        }
    };

    render() {
        const { columnKey } = this.props;
        const { topPosition, leftPosition, from, to, displayValue } = this.state;

        // Render the Calendar
        return (
            <div id={`${columnKey}-date-filter`} class="custom-date-filter filter">
                <span onClick={this.togglePicker} class="filter-value">
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
                        <DateField
                          handleDayClick={this.handleDayClick}
                          from={from}
                          to={to}
                        />
                    </div>

                    <div style={{ clear: 'both' }}>
                        <div
                          id="cidCourseListFilterOkButton"
                          class="okButton filterButton"
                          onClick={this.filter}
                        >
                            OK
                        </div>
                        { from &&
                        <div
                          id="cidCourseListFilterClearFilterButton"
                          class="clearFilterButton"
                          onClick={this.handleResetClick}
                        >
                            Clear Filter
                        </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

CustomDateFilter.propTypes = {
    filterHandler: PropTypes.func.isRequired,
    columnKey: PropTypes.string.isRequired,
    defaultValue: PropTypes.object.isRequired,
};

CustomDateFilter.defaultProps = {
    defaultValue: null,
};

export default CustomDateFilter;
