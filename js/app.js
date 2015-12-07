// Data Model
// These are the locations that should show on the map when the web page loads.
var locationModel = [
    {
        name: 'China Blue',
        location: {lat: 43.614036, lng: -116.201171},
        marker: {}
    },
    {
        name: 'Dirty Little Roddy\'s',
        location: {lat: 43.614080, lng: -116.200995},
        marker: {}
    },
    {
        name: 'Pengilly\'s Saloon',
        location: {lat: 43.614036, lng: -116.200712},
        marker: {}
    },
    {
        name: 'Reef',
        location: {lat: 43.614435, lng: -116.201461},
        marker: {}
    },
    {
        name: 'Hannah\'s',
        location: {lat: 43.614718, lng: -116.202104},
        marker: {}
    },
    {
        name: 'Taphouse',
        location: {lat: 43.615534, lng: -116.202754},
        marker: {}
    },
    {
        name: 'The Piper Pub & Grill',
        location: {lat: 43.615701, lng: -116.202986},
        marker: {}
    },
    {
        name: 'Mulligans\' Pub & Eatery',
        location: {lat: 43.616932, lng: -116.206382},
        marker: {}
    },
    {
        name: 'Pre Funk Beer Bar',
        location: {lat: 43.616216, lng: -116.208503},
        marker: {}
    },
    {
        name: 'Solid Grill & Bar',
        location: {lat: 43.613429, lng: -116.205984},
        marker: {}
    },
    {
        name: 'Liquid Lounge',
        location: {lat: 43.613332, lng: -116.206378},
        marker: {}
    },
    {
        name: 'Double Tap Pub',
        location: {lat: 43.613048, lng: -116.206335},
        marker: {}
    },
    {
        name: 'Bodovino',
        location: {lat: 43.612941, lng: -116.205531},
        marker: {}
    },
    {
        name: 'Modern Bar',
        location: {lat: 43.618391, lng: -116.209987},
        marker: {}
    },
    {
        name: 'Neurolux',
        location: {lat: 43.618010, lng: -116.206264},
        marker: {}
    }
];

// Location object
var Location = function (data) {
    this.name = ko.observable(data.name);
    this.location = ko.observable(data.location);
    this.marker = ko.observable({});
};

// ViewModel
var ViewModel = function () {
    var self = this;

    this.locationArray = ko.observableArray([]);

    locationModel.forEach(function (locationItem) {
        self.locationArray.push(new Location(locationItem));
    });

    this.query = ko.observable('');

    this.search = function (value) {
        closeMarkerInfoWindows();

        self.locationArray().forEach(function (locationItem) {
            locationItem.marker.setMap(null);
        });

        self.locationArray([]);

        for(var x in locationModel) {
            if(locationModel[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                //self.locationArray.push(locationModel[x]);
                self.locationArray.push(new Location(locationModel[x]));
            }
        }

        // Place Google Map Markers for each search result
        self.locationArray().forEach(function (locationItem) {
            locationItem.marker = new google.maps.Marker({
                position: locationItem.location(),
                map: map,
                title: locationItem.name()
            });
        });
        createNewInfoWindow();
        addMarkerClickEventListner();
    }

    this.query.subscribe(this.search);
};

var fsClientID = '4V5DEEIKDI0JBNNO4KJK03BEADIOKLRLDENVJTNBAYAIQQFY';
var fsClientSecret = 'CQ21XTFDMK4QSIRHDY2N5SN5LJPV5HHCDAVZKI3OBFJDQFS0';
var fsVersionDate = '20161231';
var fsMode = 'foursquare';

var fsAPICallSettings = {
    url: 'https://api.foursquare.com/v2/venues/4b4781c6f964a5204a3426e3?client_id=' + fsClientID + '&client_secret=' + fsClientSecret + '&v=' + fsVersionDate + '&m=' + fsMode,
    dataType: 'json',
    success: function() {
        console.log('Got a file');
    },
    error: function() {
        console.log('Error getting file');
    }
}

// Code to execute when a list item (location) is clicked
$('#location-list').on('click', 'li', function() {

    // Add code here to perform foursquare API call
    $.ajax(fsAPICallSettings);

    // Add / Remove the "highlight" class to highlight the selected item
    $('.highlight').removeClass('highlight');
    $(this).toggleClass('highlight');

    // Get the location name of the list item selected
    var selectedItemName = $(this).text();

    // Scan the location array and bounce the marker of the location with a matching name of the clicked list item.
    appVM.locationArray().forEach(function (locationItem) {
        if(locationItem.name() == selectedItemName) {
            toggleBounce(locationItem.marker);
            // Close all open marker windows
            closeMarkerInfoWindows();
            // Open the marker info window
            openMarkerInfoWindow(locationItem.marker);
        };
    });
});

// Google Maps API
// Code to initialize the map when the web page loads
// Obtained from: https://developers.google.com/maps/documentation/javascript/examples/map-simple
var map;
var infoWindowContentString = '';
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.615612, lng: -116.203751}, // Center map to Boise, ID
        zoom: 16 // Zoom map to show downtown Boise, ID up close
    });

    // Place Google Map Markers on map
    // Obtained from: https://developers.google.com/maps/documentation/javascript/examples/marker-simple
    appVM.locationArray().forEach(function (locationItem) {
        locationItem.marker = new google.maps.Marker({
            position: locationItem.location(),
            map: map,
            animation: google.maps.Animation.DROP,
            title: locationItem.name()
        });
    });
    createNewInfoWindow()
    addMarkerClickEventListner();
}

function createNewInfoWindow() {
    appVM.locationArray().forEach(function (locationItem) {
        // Create a new info window object for each marker object
        locationItem.marker.infowindow = new google.maps.InfoWindow({
            content: infoWindowContentString
        });
    });
}

function addMarkerClickEventListner() {
    // Add the click event lister to each marker in the locationsArray
    appVM.locationArray().forEach(function (locationItem) {

        locationItem.marker.addListener('click', function () {
            closeMarkerInfoWindows();
            // Bounce the marker
            toggleBounce(locationItem.marker);
            // Open the marker info window
            openMarkerInfoWindow(locationItem.marker);
        });

    });
}

function closeMarkerInfoWindows() {
    // Close any and all marker info windows
    appVM.locationArray().forEach(function (locationItem) {
        locationItem.marker.infowindow.close();
    });
}

// Bounce the appropriate map marker one time when selected
function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 700); // Only allow the marker to bounce one time.
}

// Open an info window for the marker selected displaying information
// about the location selected
function openMarkerInfoWindow (marker) {
    marker.infowindow.open(map, marker);
}

// Initiate the knockout.js bindings
var appVM = new ViewModel();
ko.applyBindings(appVM);