import React, { Component } from 'react';
import './map.css';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

class Map extends Component {
  componentDidMount() {

let root = am5.Root.new("chartdiv");
root.setThemes([am5themes_Animated.new(root)]);

let chart = root.container.children.push(
  am5map.MapChart.new(root, {

  })
  );

//Define Data
 /* Chart code */
 let zombieLocations = [
  {
    id: "US",
    name: "United States",
    value: 100
  }, {
    id: "GB",
    name: "United Kingdom",
    value: 100
  }, {
    id: "CN",
    name: "China",
    value: 100
  }, {
    id: "IN",
    name: "India",
    value: 100
  }, {
    id: "AU",
    name: "Australia",
    value: 100
  }, {
    id: "CA",
    name: "Canada",
    value: 100
  }, {
    id: "BR",
    name: "Brasil",
    value: 100
  }, {
    id: "ZA",
    name: "South Africa",
    value: 100
  }
];







// Create Polygon Series
let polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am5geodata_worldLow,
    exclude: ["AQ"]
  })
);

// Create bubble series
let bubbleSeries = chart.series.push(
  am5map.MapPointSeries.new(root, {
    valueField: "value",
    calculateAggregates: true,
    polygonIdField: "id"
  })
);


let circleTemplate = am5.Template.new({});

bubbleSeries.bullets.push(function(root, series, dataItem) {
  let container = am5.Container.new(root, {});

  let circle = container.children.push(
    am5.Circle.new(root, {
      radius: 20,
      fillOpacity: 0.7,
      fill: am5.color(0xff0000),
      cursorOverStyle: "pointer",
      tooltipText: `{name}: [bold]{value}[/]`
    }, circleTemplate)
  );

  let countryLabel = container.children.push(
    am5.Label.new(root, {
      text: "{name}",
      paddingLeft: 5,
      populateText: true,
      fontWeight: "bold",
      fontSize: 13,
      centerY: am5.p50
    })
  );

  circle.on("radius", function(radius) {
    countryLabel.set("x", radius);
  })

  return am5.Bullet.new(root, {
    sprite: container,
    dynamic: true
  });
});

bubbleSeries.bullets.push(function(root, series, dataItem) {
  return am5.Bullet.new(root, {
    sprite: am5.Label.new(root, {
      text: "{value.formatNumber('#.')}",
      fill: am5.color(0xffffff),
      populateText: true,
      centerX: am5.p50,
      centerY: am5.p50,
      textAlign: "center"
    }),
    dynamic: true
  });
});



// minValue and maxValue must be set for the animations to work
bubbleSeries.set("heatRules", [
  {
    target: circleTemplate,
    dataField: "value",
    min: 10,
    max: 50,
    minValue: 0,
    maxValue: 100,
    key: "radius"
  }
]);

bubbleSeries.data.setAll(zombieLocations);

updateData();
setInterval(function() {
  updateData();
}, 2000)

function updateData() {
  for (var i = 0; i < bubbleSeries.dataItems.length; i++) {
    bubbleSeries.data.setIndex(i, { value: Math.round(Math.random() * 100), id: zombieLocations[i].id, name: zombieLocations[i].name })
  }
}

this.root = root;
  }



  componentWillUnmount() {
    if (this.root) {
     this.root.dispose();
    }

   /*
   am5.array.each(am5.registry.rootElements, function(root) {
    if (root.dom.id == "chartdiv") {
      root.dispose();
    }
  });
  */
   

  }

  render() {
    return (
      <div id="chartdiv"></div>
    )
  }

}


export default Map