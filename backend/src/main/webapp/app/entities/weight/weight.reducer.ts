import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction,
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IWeight, defaultValue } from 'app/shared/model/weight.model';

export const ACTION_TYPES = {
  FETCH_WEIGHT_LIST: 'weight/FETCH_WEIGHT_LIST',
  FETCH_WEIGHT: 'weight/FETCH_WEIGHT',
  CREATE_WEIGHT: 'weight/CREATE_WEIGHT',
  UPDATE_WEIGHT: 'weight/UPDATE_WEIGHT',
  PARTIAL_UPDATE_WEIGHT: 'weight/PARTIAL_UPDATE_WEIGHT',
  DELETE_WEIGHT: 'weight/DELETE_WEIGHT',
  RESET: 'weight/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IWeight>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type WeightState = Readonly<typeof initialState>;

// Reducer

export default (state: WeightState = initialState, action): WeightState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_WEIGHT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_WEIGHT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_WEIGHT):
    case REQUEST(ACTION_TYPES.UPDATE_WEIGHT):
    case REQUEST(ACTION_TYPES.DELETE_WEIGHT):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_WEIGHT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_WEIGHT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_WEIGHT):
    case FAILURE(ACTION_TYPES.CREATE_WEIGHT):
    case FAILURE(ACTION_TYPES.UPDATE_WEIGHT):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_WEIGHT):
    case FAILURE(ACTION_TYPES.DELETE_WEIGHT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WEIGHT_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_WEIGHT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_WEIGHT):
    case SUCCESS(ACTION_TYPES.UPDATE_WEIGHT):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_WEIGHT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_WEIGHT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/weights';

// Actions

export const getEntities: ICrudGetAllAction<IWeight> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_WEIGHT_LIST,
    payload: axios.get<IWeight>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IWeight> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_WEIGHT,
    payload: axios.get<IWeight>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IWeight> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WEIGHT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<IWeight> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_WEIGHT,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IWeight> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_WEIGHT,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IWeight> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_WEIGHT,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
