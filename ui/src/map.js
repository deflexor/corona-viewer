/*global google*/
import { mapData } from './mapData'
import { definePopupClass } from './mapPopup'
const _ = require('lodash');

let popup = null;
let popupClass = null;
let selectedMarkerObj = null;
let selectedMarkerElement = null;
let selectedMarkerFillColor = null;

const colorMap = {
    "DESIGN": "#44dcff",
    "DATA-SCIENCE": "#feb902",
    "DEVELOPMENT": "#12b81c",
    "ALGORITHM": "#ff3413"
};

const chartData = [
    {
        "date": "2018/11/1",
        "value": 8
    },
    {
        "date": "2018/11/2",
        "value": 43
    },
    {
        "date": "2018/11/3",
        "value": 7
    },
    {
        "date": "2018/11/4",
        "value": 13
    },
    {
        "date": "2018/11/5",
        "value": 9
    },
    {
        "date": "2018/11/6",
        "value": 2
    },
    {
        "date": "2018/11/7",
        "value": 0
    },
    {
        "date": "2018/11/8",
        "value": 30
    },
    {
        "date": "2018/11/9",
        "value": 19
    },
    {
        "date": "2018/11/10",
        "value": 0
    },
    {
        "date": "2018/11/11",
        "value": 24
    },
    {
        "date": "2018/11/12",
        "value": 16
    },
    {
        "date": "2018/11/13",
        "value": 21
    },
    {
        "date": "2018/11/14",
        "value": 13
    },
    {
        "date": "2018/11/15",
        "value": 11
    },
    {
        "date": "2018/11/16",
        "value": 10
    },
    {
        "date": "2018/11/17",
        "value": 47
    },
    {
        "date": "2018/11/18",
        "value": 3
    },
    {
        "date": "2018/11/19",
        "value": 49
    },
    {
        "date": "2018/11/20",
        "value": 39
    },
    {
        "date": "2018/11/21",
        "value": 33
    }
];

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

    // add markers
    const filterd = mapData.filter(item => {
        return selectedOperations.indexOf(item.operation) !== -1 && selectedTracks.indexOf(item.type) !== -1;
    });

    for (let i = 0; i < filterd.length; i++) {
        addMarkers(map, filterd[i], i);
    }

    map.addListener('click', function () {
        if (popup !== null) {
            popup.setMap(null);
            if (selectedMarkerElement) {
                selectedMarkerElement.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: selectedMarkerFillColor,
                    fillOpacity: 1,
                    scale: 3,
                    strokeWeight: 0
                });
            }
        }
    });

}

function generateToolTip(data) {
    let compiled = null;
    if (data.operation === 'REGISTRATION') {
        compiled = _.template("<strong>@<%= user %></strong> register on <strong>\"<%= challenge %>\"</strong>");
    } else if (data.operation === 'SUBMISSIONS') {
        compiled = _.template("<strong>@<%= user %></strong> submitted on <strong>\"<%= challenge %>\"</strong>.");
    } else if (data.operation === 'REVIEW') {
        compiled = _.template("<strong>@<%= user %></strong> review submissions on <strong>\"<%= challenge %>\"</strong>.");
    } else if (data.operation === 'FORUM') {
        compiled = _.template("<strong>@<%= user %></strong> replied on <strong>\"<%= challenge %>\"</strong> forum");
    } else if (data.operation === 'VIEW') {
        compiled = _.template("<strong>@<%= user %></strong> view on <strong>\"<%= challenge %>\"</strong>");
    } else if (data.operation === 'SRM') {
        compiled = _.template("<strong>@<%= user %></strong> submitted on <strong>\"<%= challenge %>\"</strong>");
    }
    let html = compiled(data);
    html = "<div>" + html + "</div>";
    const user = _.template("<div class='user-details'><img src='i/<%= avatar %>' alt='user' /><small><%= date %> вЂў <%= city %></small></div>");
    html += user(data);
    return html
}

function removeAllMarkers() {
    if (popup !== null) {
        popup.setMap(null);
    }
    for (const data of mapData) {
        if (data.marker) {
            data.marker.setMap(null);
            data.marker = null;
        }
    }
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
    const filterd = mapData.filter(item => {
        return selectedOperations.indexOf(item.operation) !== -1 && selectedTracks.indexOf(item.type) !== -1;
    });
    for (let i = 0; i < filterd.length; i++) {
        addMarkers(map, filterd[i], i);
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
    const filterd = mapData.filter(item => {
        return selectedOperations.indexOf(item.operation) !== -1 && selectedTracks.indexOf(item.type) !== -1;
    });
    for (let i = 0; i < filterd.length; i++) {
        addMarkers(map, filterd[i], i);
    }
}

function addMarkers(map, data, i) {
    var marker = new google.maps.Marker({
        position: { lat: data.lat, lng: data.lng },
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: colorMap[data.type],
            fillOpacity: 1,
            scale: 3,
            strokeWeight: 0
        }
    });
    mapData[i].marker = marker;
    marker.addListener('click', (selectedMarker) => {
        if (document.getElementById('tooltip-content')) {
            document.getElementById('tooltip-content').remove();
        }

        if (popup !== null) {
            popup.setMap(null);
        }
        if (selectedMarkerElement) {
            selectedMarkerElement.setIcon({
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: selectedMarkerFillColor,
                fillOpacity: 1,
                scale: 3,
                strokeWeight: 0
            });
            selectedMarkerElement = null;
        }
        if (_.isEqual(selectedMarkerObj, selectedMarker)) {
            selectedMarkerObj = null;
            return false;
        }
        marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: colorMap[data.type],
            fillOpacity: 1,
            scale: 3,
            strokeOpacity: .5,
            strokeWeight: 12,
            strokeColor: colorMap[data.type]
        });
        selectedMarkerObj = selectedMarker;
        selectedMarkerFillColor = colorMap[data.type];
        selectedMarkerElement = marker;
        let tooltip = document.createElement('div');
        tooltip.id = 'tooltip-content';
        tooltip.innerHTML = generateToolTip(data);
        tooltip.classList.add('tooltip-bubble', data.type);
        document.body.appendChild(tooltip);
        popup = new popupClass(
            selectedMarker.latLng,
            document.getElementById('tooltip-content'),
            data.type);
        popup.setMap(map);
    });

    marker.setMap(map)
}

/*
function chart(chartData) {
    let $chart = $('#chart');
    _.each(chartData, function (d) {
        let $bar = $('<div>&nbsp;</div>');
        let zero = d.value === 0;
        const tday = new Date();
        let today = d.date === tday.getFullYear() + '/' + (tday.getMonth() + 1) + '/' + tday.getDay();
        $bar.css('height', zero ? '4px' : (d.value + '%'));
        if (zero) {
            $bar.addClass('zero')
        }
        if (today) {
            $bar.addClass('today')
        }
        $chart.append($bar)
    })
}*/
