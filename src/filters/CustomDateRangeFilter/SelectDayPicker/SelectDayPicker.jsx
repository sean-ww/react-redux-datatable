import React from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';

const currentYear = new Date().getFullYear();
const currentDate = new Date();

const YearMonthForm = ({ date, fromMonth, toMonth, localeUtils, onChange }) => {
    const months = localeUtils.getMonths();

    const years = [];
    for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
        years.push(i);
    }

    const handleChange = function handleChange(e) {
        const { year, month } = e.target.form;
        onChange(new Date(year.value, month.value));
    };

    return (
        <form className="DayPicker-Caption">
            <select
              name="month"
              onChange={handleChange}
              value={date.getMonth()}
            >
                {months.map((month, i) => (
                    <option key={month} value={i}>
                        {month}
                    </option>
                ))}
            </select>
            <select
              name="year"
              onChange={handleChange}
              value={date.getFullYear()}
            >
                {years.map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </form>
    );
};

YearMonthForm.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    fromMonth: PropTypes.instanceOf(Date).isRequired,
    toMonth: PropTypes.instanceOf(Date).isRequired,
    localeUtils: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export class SelectDayPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fromMonth: new Date(currentYear - 5, 0),
            toMonth: new Date(currentYear + 5, 11),
            month: currentDate,
        };
    }

    handleYearMonthChange = (month) => {
        const updatedYear = month.getFullYear();
        this.setState({
            month,
            fromMonth: new Date(updatedYear - 5, 0),
            toMonth: new Date(updatedYear + 5, 11),
        });
    }

    render() {
        const { handleDayClick, from, to } = this.props;
        const { fromMonth, toMonth, month } = this.state;
        return (
            <div className="YearNavigation">
                <DayPicker
                  onDayClick={handleDayClick}
                  selectedDays={[from, { from, to }]}
                  month={month}
                  fromMonth={fromMonth}
                  toMonth={toMonth}
                  captionElement={({ date, localeUtils }) => (
                      <YearMonthForm
                        date={date}
                        fromMonth={fromMonth}
                        toMonth={toMonth}
                        localeUtils={localeUtils}
                        onChange={this.handleYearMonthChange}
                      />
                    )}
                />
            </div>
        );
    }
}

SelectDayPicker.propTypes = {
    handleDayClick: PropTypes.func.isRequired,
    from: PropTypes.instanceOf(Date).isRequired,
    to: PropTypes.instanceOf(Date).isRequired,
};

export default SelectDayPicker;
