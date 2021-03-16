import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './preferences.reducer';
import { IPreferences } from 'app/shared/model/preferences.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPreferencesProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Preferences = (props: IPreferencesProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { preferencesList, match, loading } = props;
  return (
    <div>
      <h2 id="preferences-heading" data-cy="PreferencesHeading">
        <Translate contentKey="healthPointsApp.preferences.home.title">Preferences</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="healthPointsApp.preferences.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="healthPointsApp.preferences.home.createLabel">Create new Preferences</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {preferencesList && preferencesList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="healthPointsApp.preferences.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="healthPointsApp.preferences.weeklyGoal">Weekly Goal</Translate>
                </th>
                <th>
                  <Translate contentKey="healthPointsApp.preferences.weightUnits">Weight Units</Translate>
                </th>
                <th>
                  <Translate contentKey="healthPointsApp.preferences.user">User</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {preferencesList.map((preferences, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${preferences.id}`} color="link" size="sm">
                      {preferences.id}
                    </Button>
                  </td>
                  <td>{preferences.id}</td>
                  <td>{preferences.weeklyGoal}</td>
                  <td>
                    <Translate contentKey={`healthPointsApp.Units.${preferences.weightUnits}`} />
                  </td>
                  <td>{preferences.user ? preferences.user.login : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${preferences.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${preferences.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${preferences.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="healthPointsApp.preferences.home.notFound">No Preferences found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ preferences }: IRootState) => ({
  preferencesList: preferences.entities,
  loading: preferences.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
