import { handleDataFetchingAction } from '../general/results'

export const INITIAL_STATE = {
  results: null,
  resultUpdateID: 0,
  resultsSparqlQuery: null,
  paginatedResults: [],
  paginatedResultsSparqlQuery: null,
  resultCount: 0,
  page: -1,
  pagesize: 10,
  sortBy: null,
  sortDirection: null,
  fetching: false,
  fetchingResultCount: false,
  facetedSearchHeaderExpanded: false,
  instancePageHeaderExpanded: false,
  instanceTableData: null,
  instanceTableExternalData: null,
  instanceAnalysisData: null,
  instanceAnalysisDataUpdateID: 0,
  instanceSparqlQuery: null,
  properties: [
    {
      id: 'uri',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      onlyOnInstancePage: true
    },
    {
      id: 'prefLabel',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'manuscript',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'owner',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'place',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'source',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    }
  ]
}

const resultClasses = new Set([
  'collections'
])

const collections = (state = INITIAL_STATE, action) => {
  if (resultClasses.has(action.resultClass)) {
    return handleDataFetchingAction(state, action)
  } else return state
}

export default collections
