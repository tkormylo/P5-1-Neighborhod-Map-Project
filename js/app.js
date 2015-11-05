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
        name: 'Pengillys Saloon',
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
        center: {lat: 43.615612, lng: -116.203751}, // Center map to Boise, ID
        zoom: 16 // Zoom map to show downtown Boise, ID up close
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
        setTimeout(function(){ marker.setAnimation(null); }, 700); // Only allow the marker to bounce one time.
    }
    console.log('Exiting toggleBounce Function');
}

// Add search functionality to the search text box and table of locations.
// After the review of many, MANY solutions available to search and filter
// a table, I found the following solution to be the easist to understand and
// customize as needed.
// Code Obtained from: http://dotnetprof.blogspot.com/2012/08/html-table-search-using-javascript.html
function doSearch() {
    var searchText = document.getElementById('searchTerm').value;
    var targetTable = document.getElementById('dataTable');
    var targetTableColCount;

    //Loop through table rows
    for (var rowIndex = 0; rowIndex < targetTable.rows.length; rowIndex++) {
        var rowData = '';

        //Get column count from header row
        if (rowIndex == 0) {
            targetTableColCount = targetTable.rows.item(rowIndex).cells.length;
            continue; //do not execute further code for header row.
        }

        //Process data rows. (rowIndex >= 1)
        for (var colIndex = 0; colIndex < targetTableColCount; colIndex++) {
            var cellText = '';

            if (navigator.appName == 'Microsoft Internet Explorer')
                cellText = targetTable.rows.item(rowIndex).cells.item(colIndex).innerText;
            else
                cellText = targetTable.rows.item(rowIndex).cells.item(colIndex).textContent;

            rowData += cellText;
        }

        // Make search case insensitive.
        rowData = rowData.toLowerCase();
        searchText = searchText.toLowerCase();

        //If search term is not found in row data
        //then hide the row, else show
        if (rowData.indexOf(searchText) == -1)
            targetTable.rows.item(rowIndex).style.display = 'none';
        else
            targetTable.rows.item(rowIndex).style.display = 'table-row';
    }
}

// Initiate the knockout.js bindings
ko.applyBindings(new ViewModel());

