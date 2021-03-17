import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './weight.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWeightDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WeightDetail = (props: IWeightDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { weightEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="weightDetailsHeading">
          <Translate contentKey="healthPointsApp.weight.detail.title">Weight</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{weightEntity.id}</dd>
          <dt>
            <span id="timestamp">
              <Translate contentKey="healthPointsApp.weight.timestamp">Timestamp</Translate>
            </span>
          </dt>
          <dd>{weightEntity.timestamp ? <TextFormat value={weightEntity.timestamp} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="weight">
              <Translate contentKey="healthPointsApp.weight.weight">Weight</Translate>
            </span>
          </dt>
          <dd>{weightEntity.weight}</dd>
          <dt>
            <Translate contentKey="healthPointsApp.weight.user">User</Translate>
          </dt>
          <dd>{weightEntity.user ? weightEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/weight" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/weight/${weightEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ weight }: IRootState) => ({
  weightEntity: weight.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WeightDetail);
