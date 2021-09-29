import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';

import NotePad from './NotePad';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={NotePad} />
      </Switch>
    </Router>
  );
}
