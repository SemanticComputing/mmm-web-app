import React from 'react'
import PropTypes from 'prop-types'
import Manuscripts from './Manuscripts'
import Works from './Works'
import Events from './Events'
import Places from './Places'
import Actors from './Actors'

/**
 * A component for creating a faceted search perspective for a semantic portal.
 */
const FacetedSearchPerspective = props => {
  const renderPerspective = () => {
    let perspectiveElement = null
    switch (props.perspective.id) {
      case 'manuscripts':
        perspectiveElement =
          <Manuscripts {...props} />
        break
      case 'works':
        perspectiveElement =
          <Works {...props} />
        break
      case 'events':
        perspectiveElement =
          <Events {...props} />
        break
      case 'actors':
        perspectiveElement =
          <Actors {...props} />
        break
      case 'places':
        perspectiveElement =
          <Places {...props} />
        break
      default:
        perspectiveElement = <div />
        break
    }
    return perspectiveElement
  }
  return (
    <>
      {renderPerspective()}
    </>
  )
}

FacetedSearchPerspective.propTypes = {
  /**
   * Faceted search configs and results of this perspective.
   */
  perspectiveState: PropTypes.object.isRequired,
  /**
   * Faceted search configs and results of places related to this perspective.
   */
  facetState: PropTypes.object.isRequired,
  /**
   * Facet values where facets constrain themselves, used for statistics.
   */
  facetConstrainSelfState: PropTypes.object,
  /**
   * Leaflet map config and external layers.
   */
  leafletMapState: PropTypes.object.isRequired,
  /**
   * Redux action for fetching paginated results.
   */
  fetchPaginatedResults: PropTypes.func.isRequired,
  /**
   * Redux action for fetching all results.
   */
  fetchResults: PropTypes.func.isRequired,
  /**
   * Redux action for fetching facet values for statistics.
   */
  fetchFacetConstrainSelf: PropTypes.func.isRequired,
  /**
   * Redux action for loading external GeoJSON layers.
   */
  fetchGeoJSONLayers: PropTypes.func.isRequired,
  /**
   * Redux action for loading external GeoJSON layers via backend.
   */
  fetchGeoJSONLayersBackend: PropTypes.func.isRequired,
  /**
   * Redux action for clearing external GeoJSON layers.
   */
  clearGeoJSONLayers: PropTypes.func.isRequired,
  /**
   * Redux action for fetching information about a single entity.
   */
  fetchByURI: PropTypes.func.isRequired,
  /**
   * Redux action for updating the page of paginated results.
   */
  updatePage: PropTypes.func.isRequired,
  /**
   * Redux action for updating the rows per page of paginated results.
   */
  updateRowsPerPage: PropTypes.func.isRequired,
  /**
   * Redux action for sorting the paginated results.
   */
  sortResults: PropTypes.func.isRequired,
  /**
   * Redux action for updating the active selection or config of a facet.
   */
  showError: PropTypes.func.isRequired,
  /**
   * Redux action for showing an error
   */
  updateFacetOption: PropTypes.func.isRequired,
  /**
   * Routing information from React Router.
   */
  routeProps: PropTypes.object.isRequired,
  /**
   * Perspective config.
   */
  perspective: PropTypes.object.isRequired,
  /**
   * State of the animation, used by TemporalMap.
   */
  animationValue: PropTypes.array.isRequired,
  /**
   * Redux action for animating TemporalMap.
   */
  animateMap: PropTypes.func.isRequired,
  /**
   * Current screen size.
   */
  screenSize: PropTypes.string.isRequired,
  /**
   * Root url of the application.
   */
  rootUrl: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export default FacetedSearchPerspective
