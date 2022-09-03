import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route, Redirect, routerRedux} from 'dva/router';
import dynamic from 'dva/dynamic';
import App from './routes/app';

const {ConnectedRouter} = routerRedux

const Routers = function ({history, app}) {

    const routes = [
        {
            path: '/',
            component: () => import('./routes/login'),
        },
        {
            path: '/app',
            component: () => import('./routes/login'),
        },
        {
            path: '/app/campus',
            component: () => import('./routes/login'),
        },
        {
            path: '/app/campus/login',
            component: () => import('./routes/login'),
        },
        {
            path: '/app/campus/loginTwo',
            component: () => import('./routes/loginTwo'),
        }
    ]

    return (
        <ConnectedRouter history={history}>
            <App>
                <Switch>
                    <Route exact path="/" render={() => (<Redirect to="/app/campus/login"/>)}/>
                    {
                        routes.map(({path, ...dynamics}, key) => (
                            <Route key={key}
                                   exact
                                   path={path}
                                   component={dynamic({
                                       app,
                                       ...dynamics,
                                   })}
                            />
                        ))
                    }
                    {/*<Route component={error} />*/}
                </Switch>
            </App>
        </ConnectedRouter>
    )
}

Routers.propTypes = {
    history: PropTypes.object,
    app: PropTypes.object,
}

export default Routers;
