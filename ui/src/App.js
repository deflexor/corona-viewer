import React, { Component } from 'react';

import { connectWS } from "./wsAPI";
import './App.css';
import CheckBox1 from './components/CheckBox1';
import StatItem from './components/StatItem';
import Map from './components/Map';
import Chart from './components/Chart';
import { geocode, addMarker, showPopupForMarker, generateToolTip } from './map';
import { ALPHA3 } from './countryData';
import { DEFAULT_EVENT_LOCATION } from './config';

let geoCache = {};


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tracks: {
                design: true,
                development: true,
                'data-science': true,
                algorithm: true
            },
            operations: {
                submissions: true,
                review: true,
                registration: true,
                forum: true,
                view: false,
                srm: true
            }
        };
        this.trackChanged = this.trackChanged.bind(this);
        this.operationChanged = this.operationChanged.bind(this);
        connectWS(message => {
            this.handleData(message);
        });
    }

    async handleData(data) {
        let geodata;
        let loc = data.location ? ALPHA3[data.location] : null;
        data.city = loc = loc || DEFAULT_EVENT_LOCATION;
        if (geoCache[loc]) {
            geodata = geoCache[loc];
        } else {
            geodata = await geocode(loc);
            geoCache[loc] = geodata;
        }
        [data.lat, data.lng] = geodata;
        if (data.firstName || data.lastName) data.user = [data.firstName, data.lastName].filter(n => n).join(' ')
        if (data.challengePrizes) data.prizesStr = data.challengePrizes.join(', ');
        data.type1 = 'DEVELOPMENT';
        data.tooltipHTML = generateToolTip(data);
        if(data.tooltipHTML) {
            const marker = addMarker(this.mapComp.map, data);
            showPopupForMarker(this.mapComp.map, marker, data);
        }
    }

    trackChanged(e) {
        const active = !!!this.state.tracks[e.name];
        this.setState({
            tracks: { ...this.state.tracks, [e.name]: active }
        });
        // selectTrack(this.mapComp.map, active, e.text)
        console.log(`change track: ${e.name} to ${active}`)
    }

    operationChanged(e) {
        const active = !!!this.state.operations[e.name]
        this.setState({
            operations: { ...this.state.operations, [e.name]: active }
        });
        // selectOperation(this.map.map, active, e.text)
        console.log(`change operation: ${e.name} to ${active}`)
    }

    render() {
        const tracks = [
            { name: 'design', text: 'DESIGN' },
            { name: 'development', text: 'DEVELOPMENT' },
            { name: 'data-science', text: 'DATA SCIENCE' },
            { name: 'algorithm', text: 'ALGORITHM' },
        ];
        const operations = [
            { text: 'SUBMISSIONS', name: 'submissions' },
            { text: 'REVIEW', name: 'review' },
            { text: 'REGISTRATION', name: 'registration' },
            { text: 'FORUM', name: 'forum' },
            { text: 'VIEW', name: 'view' },
            { text: 'SRM', name: 'srm' }
        ];
        return (
            <div>
                <aside>
                    <div className="top-section">
                        <div className="logo">
                            <img src="./i/logo.svg" alt="logo" />
                        </div>
                        <div className="chart-wrapper">
                            <Chart />
                        </div>

                        <div className="statistic-wrapper">
                            <StatItem count={134} text="MEMBERS"></StatItem>
                            <StatItem count={12525} text="NEW REGISTRATIONS"></StatItem>
                            <StatItem count={245} text="CHALLENGES"></StatItem>
                            <StatItem count={358436} prefix="$" text="IN PRIZES // LAST 7 DAYS"></StatItem>
                        </div>
                    </div>
                    <div className="filters">
                        <h3>TRACKS</h3>
                        <ul className="track" id="trackFilter">
                            {tracks.map(b =>
                                <li data-track={b.text} className={b.name} key={b.name}>
                                    <CheckBox1 name={b.name} text={b.text} kind={2} onChange={this.trackChanged} checked={this.state.tracks[b.name]} />
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="filters">
                        <h3>SHOW ON MAP</h3>
                        <ul className="operation" id="operationFilter">
                            {operations.map(b =>
                                <li data-operation={b.name} className="submission" key={b.name}>
                                    <CheckBox1 name={b.name} text={b.text} onChange={this.operationChanged} checked={this.state.operations[b.name]} />
                                </li>
                            )}
                        </ul>
                    </div>
                </aside>
                <Map ref={e => this.mapComp = e} />
            </div>
        );
    }
}

export default App;
