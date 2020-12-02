import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import store from './store';
import history from '@/utils/history';

import Counter from '@/components/Counter';
import Post from '@/components/Post';
import Todos from '@/components/Todos';

// React.createElement('div', props, 'hello');
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ul>
        <li><Link to="/counter">counter</Link></li>
        <li><Link to="/todos">todos</Link></li>
        <li><Link to={{ pathname: '/post/1', state: { title: '特打高尔夫' } }}>post</Link></li>
        <Route path="/counter" component={Counter} />
        <Route path="/todos" component={Todos} />
        <Route path="/post/:id" component={Post} />
      </ul>
    </ConnectedRouter>
  </Provider>, document.getElementById('root'));
