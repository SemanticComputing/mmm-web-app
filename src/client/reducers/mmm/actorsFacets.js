import {
  FETCH_FACET,
  FETCH_FACET_FAILED,
  UPDATE_FACET_VALUES,
  UPDATE_FACET_OPTION,
  CLEAR_FACET
} from '../../actions'
import {
  fetchFacet,
  fetchFacetFailed,
  updateFacetValues,
  updateFacetOption,
  clearFacet
} from '../helpers'

export const INITIAL_STATE = {
  updatedFacet: null,
  facetUpdateID: 0,
  updatedFilter: null,
  facets: {
    prefLabel: {
      id: 'prefLabel',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'one',
      filterType: 'textFilter',
      textFilter: null,
      priority: 1
    },
    type: {
      id: 'type',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'three',
      filterType: 'uriFilter',
      uriFilter: null,
      spatialFilter: null,
      priority: 5
    },
    birthDateTimespan: {
      id: 'birthDateTimespan',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: null,
      sortDirection: null,
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'three',
      filterType: 'timespanFilter',
      min: null,
      max: null,
      timespanFilter: null,
      type: 'timespan',
      priority: 3
    },
    deathDateTimespan: {
      id: 'deathDateTimespan',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: null,
      sortDirection: null,
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'three',
      filterType: 'timespanFilter',
      min: null,
      max: null,
      timespanFilter: null,
      type: 'timespan',
      priority: 4
    },
    place: {
      id: 'place',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      spatialFilterButton: true,
      spatialFilterTab: 'map',
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      spatialFilter: null,
      type: 'hierarchical',
      selectAlsoSubconceptsButton: true,
      selectAlsoSubconcepts: true,
      priority: 2

    },
    source: {
      id: 'source',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'five',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 6
    }
  }
}

const actorsFacets = (state = INITIAL_STATE, action) => {
  if (action.facetClass === 'actors') {
    switch (action.type) {
      case FETCH_FACET:
        return fetchFacet(state, action)
      case FETCH_FACET_FAILED:
        return fetchFacetFailed(state, action)
      case UPDATE_FACET_VALUES:
        return updateFacetValues(state, action)
      case UPDATE_FACET_OPTION:
        return updateFacetOption(state, action)
      case CLEAR_FACET:
        return clearFacet(state, action)
      default:
        return state
    }
  } else return state
}

export default actorsFacets
