import React from 'react';
import ReactDOM from 'react-dom';
import App from '../main';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<React />, div);
});