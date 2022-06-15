import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { authAtom } from './_state';
import { Nav, Alert, PrivateRoute } from './_components';
import { history } from './_helpers';
import { Home } from './Home';
import { Users } from './Users';
import { Account } from './Account';
import { Tickets } from "./Tickets";
import { Articles } from "./Articles";

export { App };

function App() {
    const auth = useRecoilValue(authAtom);

    return (
        <div className={'app-container' + (auth ? ' bg-white' : ' bg-gradient-to-r from-slate-600 to-slate-800')}>
            <Router history={history}>
                <Nav />
                <Alert />
                <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute path="/users" component={Users} />
                    <PrivateRoute path="/tickets" component={Tickets} />
                    <PrivateRoute path="/articles" component={Articles} />
                    <Route path="/account" component={Account} />
                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}
