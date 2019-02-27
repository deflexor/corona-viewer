import React, { Component } from 'react';

import './App.css';
import CheckBox from './components/CheckBox';

class App extends Component {

  constructor(props) {
    super(props);

    this.checkboxChanged = this.checkboxChanged.bind(this);
  }

  checkboxChanged (e) {
    e.preventDefault();
    console.log(e.currentTarget);
  }

  render() {
    return (
      <div>
        <aside>
          <div className="top-section">
            <div className="logo">
              <img src="./i/logo.svg" alt="logo" />
            </div>
            <div className="chart-wrapper">
              <div className="chart" id="chart"></div>
            </div>

            <div className="statistic-wrapper">
              <div className="statistic">
                <strong data-prefix="" data-count="134">1,34M</strong>
                <small>MEMBERS</small>
              </div>
              <div className="statistic">
                <strong data-prefix="" data-count="12525">12,525</strong>
                <small>NEW REGISTRATIONS</small>
              </div>
              <div className="statistic">
                <strong data-prefix="" data-count="245">245</strong>
                <small>CHALLENGES</small>
              </div>
              <div className="statistic">
                <strong data-prefix="$" data-count="358436">$358,436</strong>
                <small>IN PRIZES // LAST 7 DAYS</small>
              </div>
            </div>
          </div>
          <div className="filters">
            <h3>TRACKS</h3>
            <ul className="track" id="trackFilter">
              <li data-track="DESIGN" className="design active"><a href="javascript:;"><i></i><span>DESIGN</span></a></li>
              <li data-track="DEVELOPMENT" className="development active"><a href="javascript:;"><i></i><span>DEVELOPMENT</span></a></li>
              <li data-track="DATA-SCIENCE" className="data-science active"><a href="javascript:;"><i></i><span>DATA SCIENCE</span></a></li>
              <li data-track="ALGORITHM" className="algorithm active"><a href="javascript:;"><i></i><span>ALGORITHM</span></a></li>
            </ul>
          </div>
          <div className="filters">
            <h3>SHOW ON MAP</h3>
            <ul className="operation" id="operationFilter">
              <li data-operation="SUBMISSIONS" className="submission"><CheckBox text="SUBMISSIONS" onChange={this.checkboxChanged} /></li>
              <li data-operation="REVIEW" className="submission"><a href="javascript:;" className="checkbox"><span>REVIEW</span> <i></i></a></li>
              <li data-operation="REGISTRATION" className="submission active"><a href="javascript:;" className="checkbox"><span>REGISTRATION</span> <i></i></a></li>
              <li data-operation="FORUM" className="submission"><a href="javascript:;" className="checkbox"><span>FORUM</span> <i></i></a></li>
              <li data-operation="VIEW" className="submission"><a href="javascript:;" className="checkbox"><span>VIEW</span> <i></i></a></li>
              <li data-operation="SRM" className="submission"><a href="javascript:;" className="checkbox active"><span>SRM</span> <i></i></a></li>
            </ul>
          </div>
        </aside>
        <div className="google-map" id="map" ></div>
      </div>
    );
  }
}

export default App;
