import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import moment from 'moment';
import DateRangeInputField from './DateRangeInputField';

describe('<DateRangeInputField>', () => {
  let Component;
  beforeEach(() => {
    Component = shallow(
      <DateRangeInputField
        handleDayClick={() => {}}
        from={null}
        to={null}
      />,
    );
  });

  it('should display Please select the first day', () => {
    expect(Component.find('.dateRangeText').first().text())
      .to.equal('Please select the first day.');
  });

  describe('Select the first day', () => {
    beforeEach(() => {
      const from = moment('20111031').toDate();
      Component.setProps({ from });
    });

    it('should display Please select the last day', () => {
      expect(Component.find('.dateRangeText').first().text())
        .to.equal('Please select the last day.');
    });

    describe('Select the last day after the first', () => {
      beforeEach(() => {
        const to = moment('20120620').toDate();
        Component.setProps({ to });
      });

      it('should display the date range selected', () => {
        expect(Component.find('.dateRangeText').first().text())
          .to.equal('You chose from 31/10/2011 to 20/06/2012.');
      });
    });

    describe('Select the last day before the first', () => {
      beforeEach(() => {
        const to = moment('20100620').toDate();
        Component.setProps({ to });
      });

      it('should display the date range selected', () => {
        expect(Component.find('.dateRangeText').first().text())
          .to.equal('You chose from 20/06/2010 to 31/10/2011.');
      });
    });

    describe('Select the last day equal to the first', () => {
      beforeEach(() => {
        const to = moment('20111031').toDate();
        Component.setProps({ to });
      });

      it('should display the date range selected', () => {
        expect(Component.find('.dateRangeText').first().text())
          .to.equal('You chose from 31/10/2011 to 31/10/2011.');
      });
    });
  });
});
