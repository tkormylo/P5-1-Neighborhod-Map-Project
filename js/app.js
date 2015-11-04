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

// Initiate the KO bindings
ko.applyBindings(new ViewModel());

// Google Maps API
// Code to initialize the map when the web page loads
// Obtained from: https://developers.google.com/maps/documentation/javascript/examples/map-simple
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}