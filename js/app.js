// Data Model
// These are the locations that should show on the map when the web page loads.
var locationModel = [
    {
        name: 'China Blue',
        lat: 43.614036,
        lng: -116.201171
    },
    {
        name: 'Dirty Little Roddys',
        lat: 43.614080,
        lng: -116.200995
    },
    {
        name: 'Pengillys Saloon',
        lat: 43.614036,
        lng: -116.200712
    }
];

// Location object
var Location = function (data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
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

    var myLatLng = {lat: 43.614036, lng: -116.201171};

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.618722, lng: -116.215768}, // Center map to Boise, ID
        zoom: 15 // Zoom map to show downtown Boise, ID up close
    });

    // Place Google Map Markers on map
    // Obtained from: https://developers.google.com/maps/documentation/javascript/examples/marker-simple
    locationModel.forEach(function (locationItem) {
        var marker = new google.maps.Marker({
            position: {lat: locationItem.lat, lng: locationItem.lng},
            map: map,
            title: 'Dynamically Created'
        });
    });
}

// Initiate the knockout.js bindings
ko.applyBindings(new ViewModel());

