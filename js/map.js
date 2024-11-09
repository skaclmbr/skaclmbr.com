

$(document).ready(function(){
	//35.614103, -79.158084
	//console.log(quads);
	var myMap;
	var latitude = 35.614103;
	var longitude = -79.158084;
	var zoom = 12;
	var priorityQuadBlock = 'CE';

	var quadStylePriority = {
	    "color": "#ff7800",
	    "weight": 5,
	    "opacity": 0.5
	};

	var quadStyle = {
	    "color": "#ff7800",
	    "stroke":true,
	    "weight": 0.5,
	    "opacity": 0.4,
	    "fill":false
	};

	//marker click event
	function onHotspotClick(h) {
		console.log(h['srcElement']);
	}

	//Vue Script

    var vm = new Vue({
        el: '#app',
        data: {
			hotspots:[]
        },
        created: function () {
        	var m = this.loadMap();
            this.fetchNearbyHotspot(m);
            this.addQuads(m);
        },
        methods: {
            loadMap: function() {
				var mapboxToken = "pk.eyJ1Ijoic2thY2xtYnIiLCJhIjoiY2s5eDdtdHlsMGNmYTNrcXd3OXBtZTdrMCJ9.PHRVYAbFzi8kXQAkKq3ZEg";
				var mapboxUser = "skaclmbr";
				var myMap = L.map('map').setView([latitude,longitude],zoom);
				var baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/{style}/tiles/{z}/{x}/{y}?access_token={accessToken}';
				//console.log(myMap);
				var mbox = L.tileLayer(baseUrl, {
				    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				    maxZoom: 50,
				    tileSize: 512,
				    zoomOffset: -1,
				    style:'outdoors-v11',
				    accessToken: 'pk.eyJ1Ijoic2thY2xtYnIiLCJhIjoiY2s5eDdtdHlsMGNmYTNrcXd3OXBtZTdrMCJ9.PHRVYAbFzi8kXQAkKq3ZEg'
				});
				console.log(mbox);
				console.log(myMap);
				mbox.addTo(myMap);
				return myMap;            	
            },
            fetchNearbyHotspot: function (m) {
                var apiKey = '2640vsbu2uq3'; //eBird API key for skaclmbr
                var url = `https://api.ebird.org/v2/ref/hotspot/geo?fmt=json&lat=${latitude}&lng=${longitude}`;
                axios.get(url,{
                	params: {
                		"X-eBirdApiToken":apiKey
                	}
                })
                    .then(function (res) {
                        console.log(url);
                        console.log(res);
                        vm.hotspots = res.data;
                        //add code here to populate markers

                        for (var i = res.data.length - 1; i >= 0; i--) {
                        	var h = res.data[i];
                        	//var marker = L.marker([h.lat,h.lng].hMarker).addTo(myMap);
                        	var marker = L.marker([h.lat,h.lng],{
                        		title:h.locName,
                        		alt:h.locName,
                        		riseOnHover:true
                        	}).bindPopup(h.locName).addTo(m);
                        	marker.on('click',onHotspotClick);
                        }

                    });

            },
            fetchW3W: function(m) {
            	//https://api.what3words.com/v3/grid-section
            	//https://developer.what3words.com/public-api/docs#grid-section
            	
            },
            addQuads: function(m) {
            	//priority blocks
        		L.geoJSON(quads, {
        			style: quadStylePriority,
        			filter:function(gj, layer) {
        				return gj.properties.BLOCK_ID == priorityQuadBlock;
        			}
        		}).addTo(m);

        		//rest of grid
           		L.geoJSON(quads, {
        			style: quadStyle,
        			filter:function(gj, layer) {
        				return gj.properties.BLOCK_ID != priorityQuadBlock;
        			}
        		}).addTo(m);

            }
        }     
    });    

});


/*https://api.mapbox.com/styles/v1/tiles/12/1171/1566?access_token=pk.eyJ1Ijoic2thY2xtYnIiLCJhIjoiY2s5eDdtdHlsMGNmYTNrcXd3OXBtZTdrMCJ9.PHRVYAbFzi8kXQAkKq3ZEg
WORKS
  https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/12/1171/1566?access_token=pk.eyJ1Ijoic2thY2xtYnIiLCJhIjoiY2s5eDdtdHlsMGNmYTNrcXd3OXBtZTdrMCJ9.PHRVYAbFzi8kXQAkKq3ZEg
BROKEN
  https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/12/1170/1567.png?access_token=pk.eyJ1Ijoic2thY2xtYnIiLCJhIjoiY2s5eDdtdHlsMGNmYTNrcXd3OXBtZTdrMCJ9.PHRVYAbFzi8kXQAkKq3ZEg
  https://api.tiles.mapbox.com/styles/v1/mapbox/streets-v11/tiles/12/1172/1566.png?access_token=pk.eyJ1Ijoic2thY2xtYnIiLCJhIjoiY2s5eDdtdHlsMGNmYTNrcXd3OXBtZTdrMCJ9.PHRVYAbFzi8kXQAkKq3ZEg
*/