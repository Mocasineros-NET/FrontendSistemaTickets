import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { List } from './List';
import { AddEdit } from './AddEdit';
import { View } from './View';

export { Tickets };

function Tickets({ match }) {
  const { path } = match;

  return (
    <div className="p-4">
      <div className="container w-screen m-auto">
        <Switch>
          <Route exact path={path} component={List} />
          <Route path={`${path}/add`} component={AddEdit} />
          <Route path={`${path}/edit/:id`} component={AddEdit} />
          <Route path={`${path}/:id`} component={View} />
        </Switch>
      </div>
    </div>
  );
}