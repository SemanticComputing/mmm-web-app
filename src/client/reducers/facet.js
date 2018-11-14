import {
  FETCH_FACET,
  UPDATE_FACET,
  UPDATE_FILTER
} from '../actions';

export const INITIAL_STATE = {
  facetOptions : {
    creationPlace: {
      hierarchical: true,
    },
    author: {
      hierarchical: false,
    }
  },
  facetValues : {
    creationPlace: [],
    author: []
  },
  facetFilters: {
    creationPlace: new Set(),
    author: new Set(),
  },
  fetchingFacet : false
};

const facet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_FACET:
      return { ...state, fetchingFacet: true };
    case UPDATE_FACET:
      return {
        ...state,
        facetValues: action.facetValues,
        fetchingFacet: false
      };
    case UPDATE_FILTER:
      return updateFilter(state, action);
    default:
      return state;
  }
};

const updateFilter = (state, action) => {
  const { property, value } = action.filter;
  let nSet = state.facetFilters[property];
  if (nSet.has(value)) {
    nSet.delete(value);
  } else {
    nSet.add(value);
  }
  const newFilter = updateObject(state.filters, { [property]: nSet });
  return updateObject(state, { facetFilters: newFilter });
};

const updateObject = (oldObject, newValues) => {
  // Encapsulate the idea of passing a new object as the first parameter
  // to Object.assign to ensure we correctly copy data instead of mutating
  //console.log(Object.assign({}, oldObject, newValues));
  return Object.assign({}, oldObject, newValues);
};

export default facet;
