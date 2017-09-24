import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom';

function render(Component) {
  ReactDOM.render(
    <MuiThemeProvider>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </MuiThemeProvider>
  , document.getElementById('root'));
}

if (module.hot) {
  module.hot.accept('./App', () => {
    render(require('./App').default);
  });
}

render(App);

registerServiceWorker();
