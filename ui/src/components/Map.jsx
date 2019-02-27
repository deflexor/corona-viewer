import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import { initMap } from '../map';
import { apiKey } from '../apikey'
// import styles from './Map.module.css';

const propTypes = {
    center: PropTypes.object,
    zoom: PropTypes.number
};

const defaultProps = {
    center: {
        lat: 59.95,
        lng: 30.33
    },
    zoom: 11
};

class Map extends Component {

    constructor(props) {
        super(props);
    }

    handleApiLoaded(map, maps) {
        this.map = map;
        initMap(map);
    }

    render() {
        // const { name, text, checked, kind } = this.props
        return (
            <div className="google-map">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: apiKey }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
                >
                </GoogleMapReact>
            </div>
        )
    }
}

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;


export default Map;
