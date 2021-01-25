import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { has } from 'lodash'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { withRouter, Route, Redirect, Switch } from 'react-router-dom'
import classNames from 'classnames'
import { compose } from '@shakacode/recompose'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import 'moment/locale/fi'
import Grid from '@material-ui/core/Grid'

// ** General components **
import InfoHeader from '../components/main_layout/InfoHeader'
import TextPage from '../components/main_layout/TextPage'
import Message from '../components/main_layout/Message'
import FacetBar from '../components/facet_bar/FacetBar'
// ** General components end **

// ** Portal specific components and configs **
import TopBar from '../components/perspectives/mmm/TopBar'
import Main from '../components/perspectives/mmm/Main'
import FacetedSearchPerspective from '../components/perspectives/mmm/FacetedSearchPerspective'
import FullTextSearch from '../components/perspectives/mmm/FullTextSearch'
import InstanceHomePage from '../components/perspectives/mmm/InstanceHomePage'
import Footer from '../components/perspectives/mmm/Footer'
import KnowledgeGraphMetadataTable from '../components/perspectives/mmm/KnowledgeGraphMetadataTable'
import { perspectiveConfig } from '../configs/mmm/PerspectiveConfig'
import { perspectiveConfigOnlyInfoPages } from '../configs/mmm/PerspectiveConfigOnlyInfoPages'
import { rootUrl } from '../configs/mmm/GeneralConfig'
// ** Portal specific components and configs end **

import {
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchInstanceAnalysis,
  fetchFullTextResults,
  clearResults,
  fetchByURI,
  fetchFacet,
  fetchFacetConstrainSelf,
  clearFacet,
  clearAllFacets,
  fetchGeoJSONLayers,
  fetchGeoJSONLayersBackend,
  clearGeoJSONLayers,
  sortResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  updateMapBounds,
  showError,
  updatePerspectiveHeaderExpanded,
  loadLocales,
  animateMap,
  clientFSToggleDataset,
  clientFSFetchResults,
  clientFSSortResults,
  clientFSClearResults,
  clientFSUpdateQuery,
  clientFSUpdateFacet,
  fetchKnowledgeGraphMetadata
} from '../actions'
// import { filterResults } from '../selectors'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    // Set app height for different screen sizes
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    /* Background color of the app.
       In order to use both 'auto' and '100%' heights, bg-color
       needs to be defined also in index.html (for #app and #root elements)
    */
    backgroundColor: '#bdbdbd'
  },
  flex: {
    flexGrow: 1
  },
  appFrame: {
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  mainContainer: {
    height: 'auto',
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 64px)' // 100% - app bar - padding
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 56 // app bar
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 64 // app bar
    }
  },
  mainContainerClientFS: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 144px)' // 100% - app bar - padding * 2
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 64 // app bar
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 72 // app bar + padding
    }
  },
  textPageContainer: {
    width: '100%',
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 80px)'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 64 // app bar + padding
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 72 // app bar + padding
    }
  },
  perspectiveContainer: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 130px)'
    },
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 126 // app bar + header
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 130 // app bar + header
    }
  },
  perspectiveContainerHeaderExpanded: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 316px)'
    },
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 308 // app bar + header
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 316 // app bar + header
    }
  },
  // perspective container is divided into two columns:
  facetBarContainer: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    overflow: 'auto',
    paddingTop: '0px !important',
    paddingBottom: '0px !important'
  },
  facetBarContainerClientFS: {
    height: 'auto',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      height: '100%',
      overflow: 'auto'
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(1)
    },
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5)
  },
  resultsContainer: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1)
    }
  },
  resultsContainerClientFS: {
    height: 800,
    [theme.breakpoints.down('md')]: {
      marginBottom: 8,
      width: 'calc(100% - 2px)'
    },
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
    paddingRight: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5)
    // [theme.breakpoints.down('sm')]: {
    //   marginTop: theme.spacing(1)
    // }
  },
  instancePageContainer: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 170px)'
    },
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 164
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 170
    }
  },
  instancePageContainerHeaderExpanded: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 354px)'
    },
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 348
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 354
    }
  },
  instancePageContent: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%'
    },
    paddingTop: '0px !important',
    paddingBottom: '0px !important'
  }
}))

/**
 * A top-level container component, which connects all Sampo-UI components to the Redux store. Also
 * the main routes of the portal are defined here using React Router. Currently it is not possible to
 * render this component in Storybook.
 */
const SemanticPortal = props => {
  const { error } = props
  const classes = useStyles(props)
  const xsScreen = useMediaQuery(theme => theme.breakpoints.down('xs'))
  const smScreen = useMediaQuery(theme => theme.breakpoints.between('sm', 'md'))
  const mdScreen = useMediaQuery(theme => theme.breakpoints.between('md', 'lg'))
  const lgScreen = useMediaQuery(theme => theme.breakpoints.between('lg', 'xl'))
  const xlScreen = useMediaQuery(theme => theme.breakpoints.up('xl'))
  let screenSize = ''
  if (xsScreen) { screenSize = 'xs' }
  if (smScreen) { screenSize = 'sm' }
  if (mdScreen) { screenSize = 'md' }
  if (lgScreen) { screenSize = 'lg' }
  if (xlScreen) { screenSize = 'xl' }
  const rootUrlWithLang = `${rootUrl}/${props.options.currentLocale}`
  // const noResults = props.clientFS.results == null

  useEffect(() => {
    document.title = intl.get('appTitle.html')
  }, [props.options.currentLocale])

  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={props.options.currentLocale}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <Message error={error} />
          <>
            <TopBar
              rootUrl={rootUrlWithLang}
              search={props.fullTextSearch}
              fetchFullTextResults={props.fetchFullTextResults}
              clearResults={props.clearResults}
              perspectives={perspectiveConfig}
              currentLocale={props.options.currentLocale}
              availableLocales={props.options.availableLocales}
              loadLocales={props.loadLocales}
              xsScreen={xsScreen}
              location={props.location}
            />
            <Route exact path={`${rootUrl}/`}>
              <Redirect to={rootUrlWithLang} />
            </Route>
            <Route
              exact path={`${rootUrlWithLang}/`}
              render={() =>
                <Grid container spacing={1} className={classes.mainContainer}>
                  <Main
                    perspectives={perspectiveConfig}
                    screenSize={screenSize}
                    rootUrl={rootUrlWithLang}
                  />
                  <Footer />
                </Grid>}
            />
            {/* https://stackoverflow.com/a/41024944 */}
            <Route
              path={`${rootUrlWithLang}/`} render={({ location }) => {
                if (typeof window.ga === 'function') {
                  window.ga('set', 'page', location.pathname + location.search)
                  window.ga('send', 'pageview')
                }
                return null
              }}
            />
            {/* route for full text search results */}
            <Route
              path={`${rootUrlWithLang}/full-text-search`}
              render={routeProps =>
                <Grid container spacing={1} className={classes.mainContainer}>
                  <Grid item xs={12} className={classes.resultsContainer}>
                    <FullTextSearch
                      fullTextSearch={props.fullTextSearch}
                      routeProps={routeProps}
                      screenSize={screenSize}
                      rootUrl={rootUrlWithLang}
                    />
                  </Grid>
                </Grid>}
            />
            {/* routes for faceted search perspectives */}
            {perspectiveConfig.map(perspective => {
              if (!has(perspective, 'externalUrl') && perspective.id !== 'placesClientFS') {
                return (
                  <React.Fragment key={perspective.id}>
                    <Route
                      path={`${rootUrlWithLang}/${perspective.id}/faceted-search`}
                      render={routeProps => {
                        return (
                          <>
                            <InfoHeader
                              resultClass={perspective.id}
                              pageType='facetResults'
                              expanded={props[perspective.id].facetedSearchHeaderExpanded}
                              updateExpanded={props.updatePerspectiveHeaderExpanded}
                              descriptionHeight={perspective.perspectiveDescHeight}
                            />
                            <Grid
                              container spacing={1} className={props[perspective.id].facetedSearchHeaderExpanded
                                ? classes.perspectiveContainerHeaderExpanded
                                : classes.perspectiveContainer}
                            >
                              <Grid item xs={12} md={3} className={classes.facetBarContainer}>
                                <FacetBar
                                  facetedSearchMode='serverFS'
                                  facetData={props[`${perspective.id}Facets`]}
                                  facetDataConstrainSelf={has(props, `${perspective.id}FacetsConstrainSelf`)
                                    ? props[`${perspective.id}FacetsConstrainSelf`]
                                    : null}
                                  facetResults={props[`${perspective.id}`]}
                                  facetClass={perspective.id}
                                  resultClass={perspective.id}
                                  fetchingResultCount={props[perspective.id].fetchingResultCount}
                                  resultCount={props[perspective.id].resultCount}
                                  fetchFacet={props.fetchFacet}
                                  fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                                  fetchResults={props.fetchResults}
                                  clearFacet={props.clearFacet}
                                  clearAllFacets={props.clearAllFacets}
                                  fetchResultCount={props.fetchResultCount}
                                  updateFacetOption={props.updateFacetOption}
                                  showError={props.showError}
                                  defaultActiveFacets={perspective.defaultActiveFacets}
                                  rootUrl={rootUrlWithLang}
                                />
                              </Grid>
                              <Grid item xs={12} md={9} className={classes.resultsContainer}>
                                <FacetedSearchPerspective
                                  facetResults={props[`${perspective.id}`]}
                                  placesResults={props.places}
                                  facetData={props[`${perspective.id}Facets`]}
                                  facetDataConstrainSelf={has(props, `${perspective.id}FacetsConstrainSelf`)
                                    ? props[`${perspective.id}FacetsConstrainSelf`]
                                    : null}
                                  leafletMap={props.leafletMap}
                                  fetchPaginatedResults={props.fetchPaginatedResults}
                                  fetchResults={props.fetchResults}
                                  fetchInstanceAnalysis={props.fetchInstanceAnalysis}
                                  fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                                  fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                                  fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                                  clearGeoJSONLayers={props.clearGeoJSONLayers}
                                  fetchByURI={props.fetchByURI}
                                  updatePage={props.updatePage}
                                  updateRowsPerPage={props.updateRowsPerPage}
                                  updateFacetOption={props.updateFacetOption}
                                  sortResults={props.sortResults}
                                  showError={props.showError}
                                  routeProps={routeProps}
                                  perspective={perspective}
                                  animationValue={props.animationValue}
                                  animateMap={props.animateMap}
                                  screenSize={screenSize}
                                  rootUrl={rootUrlWithLang}
                                />
                              </Grid>
                            </Grid>
                          </>
                        )
                      }}
                    />
                    <Switch>
                      <Redirect
                        from={`/${perspective.id}/page/:id`}
                        to={`${rootUrlWithLang}/${perspective.id}/page/:id`}
                      />
                      <Route
                        path={`${rootUrlWithLang}/${perspective.id}/page/:id`}
                        render={routeProps => {
                          return (
                            <>
                              <InfoHeader
                                resultClass={perspective.id}
                                pageType='instancePage'
                                instanceData={props[perspective.id].instanceTableData}
                                expanded={props[perspective.id].instancePageHeaderExpanded}
                                updateExpanded={props.updatePerspectiveHeaderExpanded}
                                descriptionHeight={perspective.perspectiveDescHeight}
                              />
                              <Grid
                                container spacing={1} className={props[perspective.id].instancePageHeaderExpanded
                                  ? classes.instancePageContainerHeaderExpanded
                                  : classes.instancePageContainer}
                              >
                                <Grid item xs={12} className={classes.instancePageContent}>
                                  <InstanceHomePage
                                    rootUrl={rootUrlWithLang}
                                    fetchByURI={props.fetchByURI}
                                    fetchResults={props.fetchResults}
                                    resultClass={perspective.id}
                                    tableData={props[perspective.id].instanceTableData}
                                    tableExternalData={props[perspective.id].instancePageTableExternalData}
                                    properties={props[perspective.id].properties}
                                    results={props[perspective.id].results}
                                    resultUpdateID={props[perspective.id].resultUpdateID}
                                    tabs={perspective.instancePageTabs}
                                    sparqlQuery={props[perspective.id].instanceSparqlQuery}
                                    isLoading={props[perspective.id].fetching}
                                    routeProps={routeProps}
                                    screenSize={screenSize}
                                    fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                                    fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                                    fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                                    clearGeoJSONLayers={props.clearGeoJSONLayers}
                                    leafletMap={props.leafletMap}
                                    showError={props.showError}
                                  />
                                </Grid>
                              </Grid>
                            </>
                          )
                        }}
                      />
                    </Switch>
                  </React.Fragment>
                )
              }
            })}
            {/* create routes for classes that have only info pages and no faceted search perspective */}
            {perspectiveConfigOnlyInfoPages.map(perspective =>
              <Switch key={perspective.id}>
                <Redirect
                  from={`${rootUrl}/${perspective.id}/page/:id`}
                  to={`${rootUrlWithLang}/${perspective.id}/page/:id`}
                />
                <Route
                  path={`${rootUrlWithLang}/${perspective.id}/page/:id`}
                  render={routeProps => {
                    return (
                      <>
                        <InfoHeader
                          resultClass={perspective.id}
                          pageType='instancePage'
                          instanceData={props[perspective.id].instanceTableData}
                          expanded={props[perspective.id].instancePageHeaderExpanded}
                          updateExpanded={props.updatePerspectiveHeaderExpanded}
                          descriptionHeight={perspective.perspectiveDescHeight}
                        />
                        <Grid
                          container spacing={1} className={props[perspective.id].instancePageHeaderExpanded
                            ? classes.instancePageContainerHeaderExpanded
                            : classes.instancePageContainer}
                        >
                          <Grid item xs={12} className={classes.instancePageContent}>
                            <InstanceHomePage
                              rootUrl={rootUrlWithLang}
                              fetchByURI={props.fetchByURI}
                              fetchResults={props.fetchResults}
                              resultClass={perspective.id}
                              tableData={props[perspective.id].instanceTableData}
                              tableExternalData={props[perspective.id].instancePageTableExternalData}
                              properties={props[perspective.id].properties}
                              results={props[perspective.id].results}
                              resultUpdateID={props[perspective.id].resultUpdateID}
                              tabs={perspective.instancePageTabs}
                              sparqlQuery={props[perspective.id].instanceSparqlQuery}
                              isLoading={props[perspective.id].fetching}
                              routeProps={routeProps}
                              screenSize={screenSize}
                              fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                              fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                              fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                              clearGeoJSONLayers={props.clearGeoJSONLayers}
                              leafletMap={props.leafletMap}
                              showError={props.showError}
                            />
                          </Grid>
                        </Grid>
                      </>
                    )
                  }}
                />
              </Switch>
            )}
            {/* <Route
              path={`${rootUrlWithLang}/clientFSPlaces/federated-search`}
              render={routeProps =>
                <Grid container className={classes.mainContainerClientFS}>
                  <Grid item sm={12} md={4} lg={3} className={classes.facetBarContainerClientFS}>
                    <FacetBar
                      facetedSearchMode='clientFS'
                      facetClass='clientFSPlaces'
                      resultClass='clientFSPlaces'
                      facetData={props.clientFS}
                      clientFSFacetValues={props.clientFSFacetValues}
                      fetchingResultCount={props.clientFS.textResultsFetching}
                      resultCount={noResults ? 0 : props.clientFS.results.length}
                      clientFS={props.clientFS}
                      clientFSToggleDataset={props.clientFSToggleDataset}
                      clientFSFetchResults={props.clientFSFetchResults}
                      clientFSClearResults={props.clientFSClearResults}
                      clientFSUpdateQuery={props.clientFSUpdateQuery}
                      clientFSUpdateFacet={props.clientFSUpdateFacet}
                      defaultActiveFacets={perspectiveConfig.find(p => p.id === 'clientFSPlaces').defaultActiveFacets}
                      leafletMap={props.leafletMap}
                      updateMapBounds={props.updateMapBounds}
                      screenSize={screenSize}
                      showError={props.showError}
                      rootUrl={rootUrlWithLang}
                    />
                  </Grid>
                  <Grid item sm={12} md={8} lg={9} className={classes.resultsContainerClientFS}>
                    {noResults && <ClientFSMain />}
                    {!noResults &&
                      <ClientFSPerspective
                        routeProps={routeProps}
                        perspective={perspectiveConfig.find(p => p.id === 'clientFSPlaces')}
                        screenSize={screenSize}
                        clientFS={props.clientFS}
                        clientFSResults={props.clientFSResults}
                        clientFSSortResults={props.clientFSSortResults}
                        leafletMap={props.leafletMap}
                        fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                        fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                        clearGeoJSONLayers={props.clearGeoJSONLayers}
                        showError={props.showError}
                        rootUrl={rootUrlWithLang}
                      />}
                  </Grid>
                </Grid>}
            /> */}
            {/* create routes for info buttons */}
            <Route
              path={`${rootUrlWithLang}/feedback`}
              render={() =>
                <div className={classNames(classes.mainContainer, classes.textPageContainer)}>
                  <TextPage>{intl.getHTML('feedback')}</TextPage>
                </div>}
            />
            <Route
              path={`${rootUrlWithLang}/about`}
              render={() =>
                <div className={classNames(classes.mainContainer, classes.textPageContainer)}>
                  <TextPage>
                    {intl.getHTML('aboutThePortalPartOne')}
                    <KnowledgeGraphMetadataTable
                      resultClass='manuscriptsKnowledgeGraphMetadata'
                      fetchKnowledgeGraphMetadata={props.fetchKnowledgeGraphMetadata}
                      knowledgeGraphMetadata={props.manuscripts.knowledgeGraphMetadata}
                    />
                    {intl.getHTML('aboutThePortalPartTwo')}
                  </TextPage>
                </div>}
            />
            <Route
              path={`${rootUrlWithLang}/instructions`}
              render={() =>
                <div className={classNames(classes.mainContainer, classes.textPageContainer)}>
                  <TextPage>{intl.getHTML('instructions')}</TextPage>
                </div>}
            />
          </>
        </div>
      </div>
    </MuiPickersUtilsProvider>
  )
}

const mapStateToProps = state => {
  // const { clientFSResults, clientFSFacetValues } = filterResults(state.clientSideFacetedSearch)
  return {
    manuscripts: state.manuscripts,
    manuscriptsFacets: state.manuscriptsFacets,
    manuscriptsFacetsConstrainSelf: state.manuscriptsFacetsConstrainSelf,
    works: state.works,
    worksFacets: state.worksFacets,
    events: state.events,
    eventsFacets: state.eventsFacets,
    actors: state.actors,
    actorsFacets: state.actorsFacets,
    places: state.places,
    placesFacets: state.placesFacets,
    collections: state.collections,
    expressions: state.expressions,
    clientSideFacetedSearch: state.clientSideFacetedSearch,
    leafletMap: state.leafletMap,
    fullTextSearch: state.fullTextSearch,
    // clientFS: state.clientSideFacetedSearch,
    // clientFSResults,
    // clientFSFacetValues,
    animationValue: state.animation.value,
    options: state.options,
    error: state.error
  }
}

const mapDispatchToProps = ({
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchInstanceAnalysis,
  fetchFullTextResults,
  fetchByURI,
  fetchFacet,
  fetchFacetConstrainSelf,
  clearFacet,
  clearAllFacets,
  fetchGeoJSONLayers,
  fetchGeoJSONLayersBackend,
  clearGeoJSONLayers,
  sortResults,
  clearResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  updateMapBounds,
  showError,
  updatePerspectiveHeaderExpanded,
  loadLocales,
  animateMap,
  clientFSToggleDataset,
  clientFSFetchResults,
  clientFSClearResults,
  clientFSSortResults,
  clientFSUpdateQuery,
  clientFSUpdateFacet,
  fetchKnowledgeGraphMetadata
})

SemanticPortal.propTypes = {
  /**
   * General options considering the whole semantic portal, e.g. language.
   */
  options: PropTypes.object.isRequired,
  /**
   * Errors shown with react-redux-toastr.
   */
  error: PropTypes.object.isRequired,
  manuscripts: PropTypes.object.isRequired,
  manuscriptsFacets: PropTypes.object.isRequired,
  manuscriptsFacetsConstrainSelf: PropTypes.object.isRequired,
  works: PropTypes.object.isRequired,
  worksFacets: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  eventsFacets: PropTypes.object.isRequired,
  actors: PropTypes.object.isRequired,
  actorsFacets: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  placesFacets: PropTypes.object.isRequired,
  collections: PropTypes.object.isRequired,
  expressions: PropTypes.object.isRequired,
  leafletMap: PropTypes.object.isRequired,
  /**
   * State of the animation, used by TemporalMap.
   */
  animationValue: PropTypes.array.isRequired,
  /**
   * Redux action for fetching all faceted search results.
   */
  fetchResults: PropTypes.func.isRequired,
  /**
   * Redux action for fetching the total count faceted search results.
   */
  fetchResultCount: PropTypes.func.isRequired,
  /**
   * Redux action for full text search results.
   */
  fetchFullTextResults: PropTypes.func.isRequired,
  /**
   * Redux action for fetching paginated faceted search results.
   */
  fetchPaginatedResults: PropTypes.func.isRequired,
  /**
   * Redux action for fetching information about a single entity.
   */
  fetchByURI: PropTypes.func.isRequired,
  /**
   * Redux action for loading external GeoJSON layers.
   */
  fetchGeoJSONLayers: PropTypes.func.isRequired,
  /**
   * Redux action for clearing external GeoJSON layers.
   */
  clearGeoJSONLayers: PropTypes.func.isRequired,
  /**
   * Redux action for loading external GeoJSON layers via the backend.
   * Useful when the API or similar needs to be hidden.
   */
  fetchGeoJSONLayersBackend: PropTypes.func.isRequired,
  /**
   * Redux action for sorting the paginated results.
   */
  sortResults: PropTypes.func.isRequired,
  /**
   * Redux action for clearing the full text results.
   */
  clearResults: PropTypes.func.isRequired,
  /**
   * Redux action for updating the page of paginated faceted search results.
   */
  updatePage: PropTypes.func.isRequired,
  /**
   * Redux action for updating the rows per page of paginated faceted search results.
   */
  updateRowsPerPage: PropTypes.func.isRequired,
  /**
   * Redux action for updating the active selection or config of a facet.
   */
  updateFacetOption: PropTypes.func.isRequired,
  /**
   * Redux action for fetching the values of a facet.
   */
  fetchFacet: PropTypes.func.isRequired,
  /**
   * Redux action for resetting a facet.
   */
  clearFacet: PropTypes.func.isRequired,
  /**
   * Redux action for displaying an error message.
   */
  showError: PropTypes.func.isRequired,
  /**
   * Redux action expanding and collapsing the header of perspective.
   */
  updatePerspectiveHeaderExpanded: PropTypes.func.isRequired,
  /**
   * Redux action for updating the bounds of a Leaflet map.
   */
  updateMapBounds: PropTypes.func.isRequired,
  /**
   * Redux action for loading translations from JavaScript objects.
   */
  loadLocales: PropTypes.func.isRequired,
  /**
   * Redux action for animating TemporalMap.
   */
  animateMap: PropTypes.func.isRequired,
  /**
   * State for client-side faceted search.
   */
  clientFS: PropTypes.object,
  /**
   * Redux action for updating the dataset selections in client-side faceted search.
   */
  clientFSToggleDataset: PropTypes.func.isRequired,
  /**
   * Redux action for the fetching the initial result set in client-side faceted search.
   */
  clientFSFetchResults: PropTypes.func.isRequired,
  /**
   * Redux action for the clearing the initial result set in client-side faceted search.
   */
  clientFSClearResults: PropTypes.func.isRequired,
  /**
   * Redux action for sorting results in client-side faceted search.
   */
  clientFSSortResults: PropTypes.func.isRequired,
  /**
   * Redux action for updating the initial query in client-side faceted search.
   */
  clientFSUpdateQuery: PropTypes.func.isRequired,
  /**
   * Redux action for updating a facet in client-side faceted search.
   */
  clientFSUpdateFacet: PropTypes.func.isRequired
}

export const SemanticPortalComponent = SemanticPortal

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SemanticPortal)
