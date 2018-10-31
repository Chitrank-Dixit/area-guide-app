import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default class MapUIWrapper extends Component {
  componentDidMount() {
    // Use Meteor Blaze to render login buttons
    const script = document.createElement('script');
    script.src = '/sdk/tomtom.min.js';
    document.body.appendChild(script);
    script.type = "text/javascript";
    script.async = true;
    script.onload = function () {
        window.tomtom.setProductInfo('smart_home', '1.0.0');
        //Setting TomTom keys
        window.tomtom.routingKey('7zBFp5e5YL0hArGOaXE0Q6adgHAwJMv1');
        window.tomtom.searchKey('7zBFp5e5YL0hArGOaXE0Q6adgHAwJMv1');
    
        var map = window.tomtom.L.map('map', {
            source: 'vector',
            key: '7zBFp5e5YL0hArGOaXE0Q6adgHAwJMv1',
            basePath: '/sdk',
            center: [-11.345410950766238, -46.7193603515625],
            geopolView: 'IN'

        });
        // map.setGeopoliticalView('Unified');
        // map.setCurrentGeopolView([geopolView='IN'])

        map.zoomControl.setPosition('topright');
        var unitSelector = window.tomtom.unitSelector.getHtmlElement(window.tomtom.globalUnitService);
        var languageSelector = window.tomtom.languageSelector.getHtmlElement(window.tomtom.globalLocaleService, 'search');
        var unitRow = document.createElement('div');
        var unitLabel = document.createElement('label');
        unitLabel.innerHTML = 'Unit of measurement';
        unitLabel.appendChild(unitSelector);
        unitRow.appendChild(unitLabel);
        unitRow.className = 'input-container';
        var langRow = document.createElement('div');
        var langLabel = document.createElement('label');
        langLabel.innerHTML = 'Search language';
        langLabel.appendChild(languageSelector);
        langRow.appendChild(langLabel);
        langRow.className = 'input-container';
        window.tomtom.controlPanel({
            position: 'bottomright',
            title: 'Settings',
            collapsed: true
        })
        .addTo(map)
        .addContent(unitRow)
        .addContent(langRow);
        // Relocating zoom buttons
        map.zoomControl.setPosition('bottomleft');
        // Adding the route widget
        var routeOnMapView = tomtom.routeOnMap({
            // Options for the route start marker
            startMarker: {
                icon: tomtom.L.icon({
                    iconUrl: '/sdk/images/start-black.png',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            },
        // Options for the route end marker
            endMarker: {
                icon: window.tomtom.L.icon({
                    iconUrl: '/sdk/images/end-black.png',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            }
        }).addTo(map);
        // Creating route inputs widget
        var routeInputsInstance = window.tomtom.routeInputs({location: true})
            .addTo(map);
        // Connecting the route inputs widget with the route widget
        routeInputsInstance.on(routeInputsInstance.Events.LocationsFound, function(eventObject) {
            routeOnMapView.draw(eventObject.points);
            console.log(eventObject);
            console.log("calling");
            if (eventObject.points[1] != undefined) {
                Meteor.call('routeLog.insert', 
                eventObject.target.searchBoxes[0].lastSearchText, 
                eventObject.points[0].lat , 
                eventObject.points[0].lng, 
                eventObject.target.searchBoxes[1].lastSearchText, 
                eventObject.points[1].lat , 
                eventObject.points[1].lng
                );
            }
            
            console.log("called");
        });
        routeInputsInstance.on(routeInputsInstance.Events.LocationsCleared, function(eventObject) {
            routeOnMapView.draw(eventObject.points);
        });

    }
  }
//   componentWillUnmount() {
//     // Clean up Blaze view
//     Blaze.remove(this.view);
//   }
  render() {
    // Just render a placeholder container that will be filled in
    return <div id='map'></div>;
  }
}
