// Data Model
// These are the locations that should show on the map when the web page loads.
var locationModel = [
    {
        name: 'China Blue',
        location: {lat: 43.614036, lng: -116.201171},
        fourSquareVenueID: '4be0aae5b238d13a47a870a4',
        marker: {}
    },
    {
        name: 'Dirty Little Roddy\'s',
        location: {lat: 43.614080, lng: -116.200995},
        fourSquareVenueID: '4b45bfb7f964a520d00f26e3',
        marker: {}
    },
    {
        name: 'Pengilly\'s Saloon',
        location: {lat: 43.614036, lng: -116.200712},
        fourSquareVenueID: '4b47ca74f964a520dc3e26e3',
        marker: {}
    },
    {
        name: 'Reef',
        location: {lat: 43.614435, lng: -116.201461},
        fourSquareVenueID: '4b4781c6f964a5204a3426e3',
        marker: {}
    },
    {
        name: 'Hannah\'s',
        location: {lat: 43.614718, lng: -116.202104},
        fourSquareVenueID: '4b45c054f964a520d70f26e3',
        marker: {}
    },
    {
        name: 'Taphouse',
        location: {lat: 43.615534, lng: -116.202754},
        fourSquareVenueID: '4f061f2177c8f87cd21c87f3',
        marker: {}
    },
    {
        name: 'The Piper Pub & Grill',
        location: {lat: 43.615701, lng: -116.202986},
        fourSquareVenueID: '4b4519f6f964a520a40426e3',
        marker: {}
    },
    {
        name: 'Mulligans\' Pub & Eatery',
        location: {lat: 43.616932, lng: -116.206382},
        fourSquareVenueID: '4b45c338f964a520f80f26e3',
        marker: {}
    },
    {
        name: 'Pre Funk Beer Bar',
        location: {lat: 43.616216, lng: -116.208503},
        fourSquareVenueID: '51f6d2c7498eeefd09925f7c',
        marker: {}
    },
    {
        name: 'Solid Grill & Bar',
        location: {lat: 43.613429, lng: -116.205984},
        fourSquareVenueID: '4b7756c2f964a5204e932ee3',
        marker: {}
    },
    {
        name: 'Liquid Lounge',
        location: {lat: 43.613332, lng: -116.206378},
        fourSquareVenueID: '4b462a6af964a520c31826e3',
        marker: {}
    },
    {
        name: 'The Matador',
        location: {lat: 43.617241, lng: -116.202416},
        fourSquareVenueID: '4c65720118b676b09317aa0e',
        marker: {}
    },
    {
        name: 'Bodovino',
        location: {lat: 43.612941, lng: -116.205531},
        fourSquareVenueID: '514b67b7f2e738cb0d22597b',
        marker: {}
    },
    {
        name: 'Modern Bar',
        location: {lat: 43.618391, lng: -116.209987},
        fourSquareVenueID: '4b496efaf964a520bd6f26e3',
        marker: {}
    },
    {
        name: 'Neurolux',
        location: {lat: 43.618010, lng: -116.206264},
        fourSquareVenueID: '4b43d6b2f964a5209ceb25e3',
        marker: {}
    }
];

// "Global" variables used thoughout the app
var map;
var infoWindowContentString = '';
var fsVenueID = '';
var fsClientID = '4V5DEEIKDI0JBNNO4KJK03BEADIOKLRLDENVJTNBAYAIQQFY';
var fsClientSecret = 'CQ21XTFDMK4QSIRHDY2N5SN5LJPV5HHCDAVZKI3OBFJDQFS0';
var fsVersionDate = '20161231';
var fsMode = 'foursquare';
var fsAPICallSettings = {};
var fsResult = {};
var url = '';

// Location object
var Location = function (data) {
    this.name = ko.observable(data.name);
    this.location = ko.observable(data.location);
    this.fourSquareVenueID = ko.observable(data.fourSquareVenueID);
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

    // Search to run with each keystroke in the search field
    this.search = function (value) {
        closeMarkerInfoWindows();

        self.locationArray().forEach(function (locationItem) {
            locationItem.marker.setMap(null);
        });

        self.locationArray([]);

        for(var x in locationModel) {
            if(locationModel[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
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

// Code to execute when a list item (location) is clicked
$('#location-list').on('click', 'li', function() {
    // Get the location name of the list item selected
    var selectedItemName = $(this).text();

    // Add / Remove the "highlight" class to highlight the selected item
    $('.highlight').removeClass('highlight');
    $(this).toggleClass('highlight');

    // Scan the location array and bounce the marker of the location with a matching name of the clicked list item.
    appVM.locationArray().forEach(function (locationItem) {
        if(locationItem.name() == selectedItemName) {
            // Close all open marker windows
            closeMarkerInfoWindows();

            // Bounce the selected location marker
            toggleBounce(locationItem.marker);

            // Update the foursquare venue ID with the location selected from the list
            fsVenueID = locationItem.fourSquareVenueID();

            performFsAPICall(locationItem);
        };
    });
});

// Perform the foursquare API call
function performFsAPICall(locationItem) {
    // Update the URL to make the call
    url = 'https://api.foursquare.com/v2/venues/' + fsVenueID + '?client_id=' + fsClientID + '&client_secret=' + fsClientSecret + '&v=' + fsVersionDate + '&m=' + fsMode;

    // Attempt to get JSON data about the venue location from foursquare
    $.getJSON(url, function (json) {

        // Check if keys exist in foursquare venu data. For example, "hours" may not exist as a key.
        var venueName = '';
        var venueAddress = '';
        var venueFormattedPhone = '';
        var venueHours = '';
        var venueURL = '';
        var venueURLTag = 'Venue Fourquare Page';
        var venueBestPhotoURL = '';

        // Check each element of the JSON response and if it is not present, handle it.
        if(json.response.venue.name) {
            venueName = json.response.venue && json.response.venue.name;
        }
        else {
            venueName = 'Venue Name Unavailable';
        }

        if(json.response.venue && json.response.venue.location && json.response.venue.location.address) {
            venueAddress = json.response.venue.location.address;
        }
        else {
            venueAddress = 'Venue Address Unavailable';
        }

        if(json.response.venue.contact && json.response.venue.contact && json.response.venue.contact.formattedPhone) {
            venueFormattedPhone = json.response.venue.contact.formattedPhone
        }
        else {
            venueFormattedPhone = 'Venue Phone Number Unavailable';
        }

        if(json.response.venue && json.response.venue.hours && json.response.venue.hours.status) {
            venueHours = json.response.venue.hours.status
        }
        else {
            venueHours = 'Venue Hours Unavailable';
        }

        if(json.response.venue && json.response.venue.canonicalUrl) {
            venueURL = json.response.venue.canonicalUrl
        }
        else {
            venueURL = 'http://www.foursquare.com';
            venueURLTag = 'Foursquare Page Unavailable';
        }

        if(json.response.venue && json.response.venue.bestPhoto) {
            var venueBestPhotoPrefix = json.response.venue.bestPhoto.prefix;
            var venueBestPhotoSuffix = json.response.venue.bestPhoto.suffix;
            venueBestPhotoURL = json.response.venue.bestPhoto.prefix + '125x125' + json.response.venue.bestPhoto.suffix;
        }
        else {
            venueBestPhotoURL = 'images/foursquare_appicon_72-eb6c8127fe40e296c7491e363b62e159.png';
        }

        //Update marker infowindow with content to display
        locationItem.marker.infowindow.setContent('<div class="container-fluid">' +
            '<div class="row">' +
                '<div class="col-md-12">' +
                    '<h3>' + venueName +'</h3>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-6">' +
                    '<address>' +
                        venueAddress + '<br>' +
                        '<abbr title="Phone">P:</abbr>' + venueFormattedPhone +
                    '</address>' +
                    '<p>' + venueHours + '</p>' +
                    '<a target="_blank" href="' + venueURL + '">' + venueURLTag + '</a>' +
                '</div>' +
                '<div class="col-md-6">' +
                    '<img src="' + venueBestPhotoURL + '" class="img-responsive center-block">' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-12">' +
                    '<img src="images/poweredby-one-color-cdf070cc7ae72b3f482cf2d075a74c8c.png" height="25" width="150" class="img-responsive center-block">' +
                '</div>' +
            '</div>');

        // Open the marker info window
        openMarkerInfoWindow(locationItem.marker);
    })

    .done(function() { console.log('getJSON request for ' + '"' + locationItem.name() + '"' + ' succeeded!'); })
    .fail(function() { alert('getJSON request for ' + '"' + locationItem.name() + '"' + ' failed! Please check browser console for additional information.'); })
    .always(function() { console.log('getJSON request for ' + '"' + locationItem.name() + '"' + ' ended!'); });
}

// Google Maps API
// Code to initialize the map when the web page loads
// Obtained from: https://developers.google.com/maps/documentation/javascript/examples/map-simple
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

// Create a new info window object for the marker on each location
function createNewInfoWindow() {
    appVM.locationArray().forEach(function (locationItem) {
        // Create a new info window object for each marker object
        locationItem.marker.infowindow = new google.maps.InfoWindow({
            content: infoWindowContentString
        });
    });
}

// Add marker click event listner to all locations
function addMarkerClickEventListner() {
    // Add the click event lister to each marker in the locationsArray
    appVM.locationArray().forEach(function (locationItem) {

        locationItem.marker.addListener('click', function () {
            // Close all open marker windows
            closeMarkerInfoWindows();

            // Bounce the selected location marker
            toggleBounce(locationItem.marker);

            // Update the foursquare venue ID with the location selected from the list
            fsVenueID = locationItem.fourSquareVenueID();

            performFsAPICall(locationItem);
        });
    });
}

// Close all marker info windows
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