import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/shared/reducers/user-management';
import { getEntity, updateEntity, createEntity, reset } from './preferences.reducer';
import { IPreferences } from 'app/shared/model/preferences.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPreferencesUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PreferencesUpdate = (props: IPreferencesUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { preferencesEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/preferences');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...preferencesEntity,
        ...values,
        user: users.find(it => it.id.toString() === values.userId.toString()),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="healthPointsApp.preferences.home.createOrEditLabel" data-cy="PreferencesCreateUpdateHeading">
            <Translate contentKey="healthPointsApp.preferences.home.createOrEditLabel">Create or edit a Preferences</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : preferencesEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="preferences-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="preferences-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="weeklyGoalLabel" for="preferences-weeklyGoal">
                  <Translate contentKey="healthPointsApp.preferences.weeklyGoal">Weekly Goal</Translate>
                </Label>
                <AvField
                  id="preferences-weeklyGoal"
                  data-cy="weeklyGoal"
                  type="string"
                  className="form-control"
                  name="weeklyGoal"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    min: { value: 10, errorMessage: translate('entity.validation.min', { min: 10 }) },
                    max: { value: 21, errorMessage: translate('entity.validation.max', { max: 21 }) },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="weightUnitsLabel" for="preferences-weightUnits">
                  <Translate contentKey="healthPointsApp.preferences.weightUnits">Weight Units</Translate>
                </Label>
                <AvInput
                  id="preferences-weightUnits"
                  data-cy="weightUnits"
                  type="select"
                  className="form-control"
                  name="weightUnits"
                  value={(!isNew && preferencesEntity.weightUnits) || 'KG'}
                >
                  <option value="KG">{translate('healthPointsApp.Units.KG')}</option>
                  <option value="LB">{translate('healthPointsApp.Units.LB')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="preferences-user">
                  <Translate contentKey="healthPointsApp.preferences.user">User</Translate>
                </Label>
                <AvInput id="preferences-user" data-cy="user" type="select" className="form-control" name="userId">
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.login}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/preferences" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  preferencesEntity: storeState.preferences.entity,
  loading: storeState.preferences.loading,
  updating: storeState.preferences.updating,
  updateSuccess: storeState.preferences.updateSuccess,
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesUpdate);
