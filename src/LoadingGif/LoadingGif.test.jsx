import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LoadingGif from './LoadingGif';

describe('<LoadingGif>', () => {
  let Component;
  beforeEach(() => {
    Component = shallow(<LoadingGif />);
  });

  it('should display a rolling spinner', () => {
    expect(Component.find('.rollingSpinner').first()).to.have.length(1);
  });
});
