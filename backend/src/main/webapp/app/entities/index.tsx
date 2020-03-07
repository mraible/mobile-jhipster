import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import BloodPressure from './blood-pressure';
import Weight from './weight';
import Points from './points';
import Preferences from './preferences';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}blood-pressure`} component={BloodPressure} />
      <ErrorBoundaryRoute path={`${match.url}weight`} component={Weight} />
      <ErrorBoundaryRoute path={`${match.url}points`} component={Points} />
      <ErrorBoundaryRoute path={`${match.url}preferences`} component={Preferences} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
