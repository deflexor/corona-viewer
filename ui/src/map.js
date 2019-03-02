/*global google*/
import { definePopupClass } from './mapPopup'
import { MAX_EVENTS_TO_DISPLAY } from './config';
const _ = require('lodash');
const openGeocoder = require('node-open-geocoder');

let mapMarkers = {};
let popupClass = null;
let selectedMarkerKey = null;
let selectedMarkerElement = null;

const colorMap = {
    "DESIGN": "#44dcff",
    "DATA-SCIENCE": "#feb902",
    "DEVELOPMENT": "#12b81c",
    "ALGORITHM": "#ff3413"
};

const selectedTracks = ["DESIGN", "DEVELOPMENT", "DATA-SCIENCE", "ALGORITHM"];
const selectedOperations = ["SUBMISSIONS", "REVIEW", "REGISTRATION", "FORUM", "SRM"];

export function initMap(map) {
    // init custom popup
    popupClass = definePopupClass();

    map.setOptions({
        center: new google.maps.LatLng(20, -10),
        zoom: 3,
        disableDefaultUI: true,
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "weight": "0.20"
                    },
                    {
                        "lightness": "28"
                    },
                    {
                        "saturation": "23"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#494949"
                    },
                    {
                        "lightness": 13
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#144b53"
                    },
                    {
                        "lightness": 14
                    },
                    {
                        "weight": 1.4
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#000f14"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#0c4152"
                    },
                    {
                        "lightness": 5
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#0b434f"
                    },
                    {
                        "lightness": 25
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#0b3d51"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#146474"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#003846"
                    }
                ]
            }
        ]
    });

    map.addListener('click', function () {
        if (selectedMarkerElement) {
            // markerSetIcon(selectedMarkerElement)
        }
        // popups.setMap(null);
    });

}

export function geocode(address) {
    let p = new Promise((resolve, reject) => {
        openGeocoder()
            .geocode(address)
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (!res.length) {
                        reject('no results')
                    } else {
                        resolve([+res[0].lat, +res[0].lon])
                    }
                }
            })
    })
    return p;
}

export function generateToolTip(data) {
    let compiled = null;
    // 'UPDATE_DRAFT_CHALLENGE' - ignore
    // 'CLOSE_TASK' - ignore
    if (data.type === 'USER_REGISTRATION') {
        compiled = _.template(`<strong>@<%= handle %></strong> registered for the contestt <srong>"<%= challengeName %>"</strong> in the <srong>"<%= challengeType %>"</strong> track`);
    } else if (data.type === 'ADD_RESOURCE') {
        compiled = _.template(`<strong>@<%= handle %></strong> was added to contest <strong>"<%= challengeName %>"</strong> in the <srong>"<%= challengeType %>"</strong> track.`);
    } else if (data.type === 'ACTIVATE_CHALLENGE') {
        compiled = _.template(`Contest <strong>"<%= challengeName %>"</strong> has just been launched in the <strong>"<%= challengeType %>"</strong> track. The prize(s) are <strong>"<%= prizesStr %>"</strong>.`);
    } else if (data.type === 'CONTEST_SUBMISSION') {
        compiled = _.template(`<strong>@<%= handle %></strong> has uploaded a submission for the contest <strong>"<%= challengeName %>"</strong> in the <strong>"<%= challengeType %>"</strong> track`);
    } else if (data.type === 'END') {
        compiled = _.template(`<strong>"<%= phaseTypeName %>"</strong> phase for contest <strong>"<%= challengeName %>"</strong> in <strong>"<%= challengeType %>"</strong> track has <strong>"<%= state %>"</strong>`);
    }

    if (!compiled) return;

    let html = compiled(data);
    html = "<div>" + html + "</div>";
    let user
    if (data.photoURL) {
        user = _.template("<div class='user-details'><img src='<%= photoURL %>' alt='user' /><small><%= createdAt %> вЂў <%= city %></small></div>");
    } else {
        user = _.template("<div class='user-details'><small><%= createdAt %> вЂў <%= city %></small></div>");
    }
    html += user(data);
    return html
}

function removeAllMarkers() {
    for (const k in mapMarkers) {
        removeMarker(k);
    }
}

function removeMarker(k) {
    if (mapMarkers[k].popup !== null) {
        mapMarkers[k].popup.setMap(null);
        mapMarkers[k].popup = null;
    }
    if (mapMarkers[k].marker) {
        mapMarkers.marker.setMap(null);
        mapMarkers.marker = null;
    }
    delete mapMarkers[k]
}

export function selectTrack(map, active, track) {
    removeAllMarkers();
    if (active) {
        selectedTracks.push(track)
    } else {
        const index = selectedTracks.indexOf(track);
        if (index !== -1) {
            selectedTracks.splice(index, 1);
        }
    }
    const filterd = mapMarkers.filter(item => {
        return selectedOperations.indexOf(item.operation) !== -1 && selectedTracks.indexOf(item.type) !== -1;
    });
    for (let i = 0; i < filterd.length; i++) {
        addMarker(map, filterd[i], i);
    }
}

export function selectOperation(map, active, operation) {
    removeAllMarkers();
    if (active) {
        selectedOperations.push(operation)
    } else {
        const index = selectedOperations.indexOf(operation);
        if (index !== -1) {
            selectedOperations.splice(index, 1);
        }
    }
    const filterd = mapMarkers.filter(item => {
        return selectedOperations.indexOf(item.operation) !== -1 && selectedTracks.indexOf(item.type) !== -1;
    });
    for (let i = 0; i < filterd.length; i++) {
        addMarker(map, filterd[i], i);
    }
}

export function addMarker(map, data) {
    var marker = new google.maps.Marker({
        position: { lat: data.lat, lng: data.lng },
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: colorMap[data.type1],
            fillOpacity: 1,
            scale: 3,
            strokeWeight: 0
        }
    });
    marker.addListener('click', () => showPopupForMarker(map, marker, data, true));

    marker.setMap(map)
    const nmarkers = Object.keys(mapMarkers).length;
    mapMarkers[getCoordsStr(data)] = { ...data, marker, popup: null, i: nmarkers + 1 }
    // remove old event markers
    if (nmarkers + 1 > MAX_EVENTS_TO_DISPLAY) {
        let min = nmarkers + 1
        let mink
        for (const k in mapMarkers) {
            if (mapMarkers[k].i < min) {
                min = mapMarkers[k].i
                mink = k
            }
        }
        removeMarker(mink)
    }
    return marker;
}

function getCoordsStr({ lat, lng }) {
    return `${lat}-${lng}`;
}

function markerSetIcon(marker) {
    marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: colorMap['DEVELOPMENT'],
        fillOpacity: 1,
        scale: 3,
        strokeWeight: 0
    });
}

function markerSetIconSel(marker) {
    marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: colorMap['DEVELOPMENT'],
        fillOpacity: 1,
        scale: 3,
        strokeOpacity: .5,
        strokeWeight: 12,
        strokeColor: colorMap['DEVELOPMENT']
    });
}

export function showPopupForMarker(map, marker, data, manual) {
    const selectedMarkerCoords = { lat: () => data.lat, lng: () => data.lng };
    const coordsStr = getCoordsStr(data);

    if (mapMarkers[coordsStr].popup !== null) {
        mapMarkers[coordsStr].popup.setMap(null);
        mapMarkers[coordsStr].popup = null;
        markerSetIcon(mapMarkers[coordsStr].marker);
    }
    if (selectedMarkerElement) {
        selectedMarkerElement = null;
    }
    if (selectedMarkerKey === coordsStr) {
        selectedMarkerKey = null;
        return false;
    }
    markerSetIconSel(marker);
    selectedMarkerKey = coordsStr;
    selectedMarkerElement = marker;
    let tooltip = document.createElement('div');
    tooltip.innerHTML = data.tooltipHTML;
    tooltip.classList.add('tooltip-bubble', data.type1);
    document.body.appendChild(tooltip);
    const popup = new popupClass(
        selectedMarkerCoords,
        tooltip,
        data.type1);
    popup.setMap(map);
    mapMarkers[coordsStr].popup = popup;
    if (!manual) {
        setTimeout(() => {
            popup.setMap(null);
            mapMarkers[coordsStr].popup = null;
            markerSetIcon(marker);
        }, 2000);
    }

}
