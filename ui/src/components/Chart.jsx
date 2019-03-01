import React, { Component } from 'react';

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

class Chart extends Component {

    render() {
        for(let d of chartData) {
            const tday = new Date();
            d.today = d.date === tday.getFullYear() + '/' + (tday.getMonth() + 1) + '/' + tday.getDay();
            d.zero = d.value === 0;
        }
        return (
            <div className="chart">
                {chartData.map(d =>
                    <div 
                        style={{height: d.zero ? '4px' : (d.value + '%')}}
                        className={`${d.zero ? 'zero' : ''} ${d.today ? 'today' : ''}`}>&nbsp;</div>
                )}
            </div>
        )
    }
}

export default Chart;
