import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from './SelectDayPicker/SelectDayPicker';

/**
 * Date range input field - This is a date range picker component.
 *
 * @param {function} handleDayClick - A function to handle day clicks.
 * @param {Date] from - The from date (start of the range).
 * @param {Date} to - The to date (end of the range).
 *
 * @returns {jsx} The date range input component.
 */
const DateRangeInputField = ({ handleDayClick, from, to }) => (
    <div style={{ display: 'inline-block' }}>
        {!from && !to &&
            <div class="dateRangeText">
                Please select the <strong>first day</strong>.
            </div>
        }

        {from && !to &&
            <div class="dateRangeText">
                Please select the <strong>last day</strong>.
            </div>
        }

        {from && to &&
            <div class="dateRangeText">
                You chose from
                {' '}
                {moment(from) <= moment(to) &&
                    `${moment(from).format('DD/MM/YYYY')} to `
                }
                {
                    moment(to).format('DD/MM/YYYY')
                }
                {moment(from) > moment(to) &&
                    ` to ${moment(from).format('DD/MM/YYYY')}`
                }
                .
            </div>
        }

        <DatePicker
          handleDayClick={handleDayClick}
          from={from}
          to={to}
        />
    </div>
);

DateRangeInputField.propTypes = {
    handleDayClick: PropTypes.func.isRequired,
    from: PropTypes.instanceOf(Date).isRequired,
    to: PropTypes.instanceOf(Date).isRequired,
};

export default DateRangeInputField;
