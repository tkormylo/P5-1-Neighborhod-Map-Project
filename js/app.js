// Data Model
// These are the locations that should show on the map when the web page loads.
var locationModel = [
    {
        name: 'China Blue',
        location: {lat: 43.614036, lng: -116.201171},
        marker: {}
    },
    {
        name: 'Dirty Little Roddys',
        location: {lat: 43.614080, lng: -116.200995},
        marker: {}
    },
    {
        name: 'Pengillys Saloon',
        location: {lat: 43.614036, lng: -116.200712},
        marker: {}
    }
];

// Location object
var Location = function (data) {
    this.name = ko.observable(data.name);
    this.location = ko.observable(data.location);
};

// ViewModel
var ViewModel = function () {
    var self = this;

    this.locationArray = ko.observableArray([]);

    locationModel.forEach(function (locationItem) {
        self.locationArray.push(new Location(locationItem));
    });

};

// Google Maps API
// Code to initialize the map when the web page loads
// Obtained from: https://developers.google.com/maps/documentation/javascript/examples/map-simple
var map;
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.618722, lng: -116.215768}, // Center map to Boise, ID
        zoom: 15 // Zoom map to show downtown Boise, ID up close
    });

    // Place Google Map Markers on map
    // Obtained from: https://developers.google.com/maps/documentation/javascript/examples/marker-simple
    locationModel.forEach(function (locationItem) {
        locationItem.marker = new google.maps.Marker({
            position: locationItem.location,
            map: map,
            animation: google.maps.Animation.DROP,
            title: locationItem.name
        });

        locationItem.marker.addListener('click', function () {
            toggleBounce(locationItem.marker);
        });

    });


}

function toggleBounce(marker) {
    console.log('Entered toggleBounce Function');
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    console.log('Exiting toggleBounce Function');
}

// Initiate the knockout.js bindings
ko.applyBindings(new ViewModel());

