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
import { getEntity, updateEntity, createEntity, reset } from './points.reducer';
import { IPoints } from 'app/shared/model/points.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPointsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PointsUpdate = (props: IPointsUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { pointsEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/points' + props.location.search);
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
        ...pointsEntity,
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
          <h2 id="healthPointsApp.points.home.createOrEditLabel" data-cy="PointsCreateUpdateHeading">
            <Translate contentKey="healthPointsApp.points.home.createOrEditLabel">Create or edit a Points</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : pointsEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="points-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="points-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="dateLabel" for="points-date">
                  <Translate contentKey="healthPointsApp.points.date">Date</Translate>
                </Label>
                <AvField
                  id="points-date"
                  data-cy="date"
                  type="date"
                  className="form-control"
                  name="date"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="exerciseLabel" for="points-exercise">
                  <Translate contentKey="healthPointsApp.points.exercise">Exercise</Translate>
                </Label>
                <AvField id="points-exercise" data-cy="exercise" type="string" className="form-control" name="exercise" />
              </AvGroup>
              <AvGroup>
                <Label id="mealsLabel" for="points-meals">
                  <Translate contentKey="healthPointsApp.points.meals">Meals</Translate>
                </Label>
                <AvField id="points-meals" data-cy="meals" type="string" className="form-control" name="meals" />
              </AvGroup>
              <AvGroup>
                <Label id="alcoholLabel" for="points-alcohol">
                  <Translate contentKey="healthPointsApp.points.alcohol">Alcohol</Translate>
                </Label>
                <AvField id="points-alcohol" data-cy="alcohol" type="string" className="form-control" name="alcohol" />
              </AvGroup>
              <AvGroup>
                <Label id="notesLabel" for="points-notes">
                  <Translate contentKey="healthPointsApp.points.notes">Notes</Translate>
                </Label>
                <AvField
                  id="points-notes"
                  data-cy="notes"
                  type="text"
                  name="notes"
                  validate={{
                    maxLength: { value: 140, errorMessage: translate('entity.validation.maxlength', { max: 140 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="points-user">
                  <Translate contentKey="healthPointsApp.points.user">User</Translate>
                </Label>
                <AvInput id="points-user" data-cy="user" type="select" className="form-control" name="userId">
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
              <Button tag={Link} id="cancel-save" to="/points" replace color="info">
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
  pointsEntity: storeState.points.entity,
  loading: storeState.points.loading,
  updating: storeState.points.updating,
  updateSuccess: storeState.points.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(PointsUpdate);
