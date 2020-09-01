var myGeoJSONPath = 'data/map2.geojson'; 
$.getJSON(myGeoJSONPath,function(data){
    var map = L.map('map').setView([15, 0], 5);
    //Couleurs pays
    function getColor(d) {
        return  d > 20000 ? '#67000d' :
        d > 10000 ? '#a50f15' :
        d > 5000 ? '#cb181d' :
        d > 1000  ? '#ef3b2c' :
        d >= 0 ? '#fb6a4a':'#67000d';
    }
    //Style pays
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.total),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '1',
            fillOpacity: 0.9
        };
    }

    //Afficher nom et population
    var info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Zone CEDEAO</h4>' +  (props ?
        '<img id="pays" src="images/'+props.name+'.jpg"><b>' + props.name + '</b><br />Total cas: ' + props.total + '</br>En traitement: ' + props.cas + '</br>Guéris: '+ props.gueris + '<br/>Deces: ' + props.deces
        : '<b>Espace CEDEAO</b><br/>Cliquez ou passez la souris sur un pays');
    };
    info.addTo(map);

    //Mouseover
    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 2,
            color: '#666',
            fillColor: "#ffffff",
            dashArray: '',
            fillOpacity: 0.5
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }

    //Mouseleave
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }
    var geojson;
    // ... our listeners
    geojson = L.geoJson(data, {style:style});

    //Appliquer les évènements ci dessus
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            click: highlightFeature,
            mouseout: resetHighlight
        });
    }
    //Legende
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1000, 5000, 10000, 20000],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' cas<br>' : '+');
    }
    return div;
};

legend.addTo(map);

    //Afficher la carte et ses elements
    L.geoJson(data, {
        clickable: false,
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    //Un peu de mobilité avec d3.js
    //var virus=d3.select('svg').append("g").attr("id","corona").attr("transform","translate(200,200)")
    //virus.append("circle").attr("x","2700").attr("y","-50").attr("r","10").style("fill","green")
});

