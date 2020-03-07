import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getUsers } from 'app/shared/reducers/user-management';
import { createEntity, getEntity, reset, updateEntity } from './points.reducer';

export interface IPointsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const PointsUpdate = (props: IPointsUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const {pointsEntity, users, loading, updating} = props;

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
        ...values
      };
      entity.user = users[values.user];

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
          <h2 id="healthPointsApp.points.home.createOrEditLabel">
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
                  <AvInput id="points-id" type="text" className="form-control" name="id" required readOnly/>
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="dateLabel" for="points-date">
                  <Translate contentKey="healthPointsApp.points.date">Date</Translate>
                </Label>
                <AvField
                  id="points-date"
                  type="date"
                  className="form-control"
                  name="date"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')}
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <AvInput id="points-exercise" type="checkbox"
                         name="exercise" trueValue={1} falseValue={0}/>
                <Label check id="exerciseLabel" for="points-exercise">
                  <Translate contentKey="healthPointsApp.points.exercise">Exercise</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <AvInput id="points-meals" type="checkbox"
                         name="meals" trueValue={1} falseValue={0}/>
                <Label check id="mealsLabel" for="points-meals">
                  <Translate contentKey="healthPointsApp.points.meals">Meals</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <AvInput id="points-alcohol" type="checkbox"
                         name="alcohol" trueValue={1} falseValue={0}/>
                <Label check id="alcoholLabel" for="points-alcohol">
                  <Translate contentKey="healthPointsApp.points.alcohol">Alcohol</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="notesLabel" for="points-notes">
                  <Translate contentKey="healthPointsApp.points.notes">Notes</Translate>
                </Label>
                <AvField
                  id="points-notes"
                  type="text"
                  name="notes"
                  validate={{
                    maxLength: {value: 140, errorMessage: translate('entity.validation.maxlength', {max: 140})}
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="points-user">
                  <Translate contentKey="healthPointsApp.points.user">User</Translate>
                </Label>
                <AvInput id="points-user" type="select" className="form-control" name="user">
                  <option value="" key="0"/>
                  {users
                    ? users.map((otherEntity, index) => (
                      <option value={index} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/points" replace color="info">
                <FontAwesomeIcon icon="arrow-left"/>
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save"/>
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
  updateSuccess: storeState.points.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PointsUpdate);
