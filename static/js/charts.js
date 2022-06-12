function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/data/samples.json").then((data) => {
    console.log(data);
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    console.log(metadata);

    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    console.log(PANEL);
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleID = result.otu_ids;
    var sampleLabel = result.otu_labels;
    var sampleValue = result.sample_values;

    // variable to hold metadata array
    var metadata = data.metadata;

    // Variable that filters the metatdata for the object with the desired dample ID
    var subjectMeta = metadata.filter(sampleObj => sampleObj.id == sample);

    // Variable to hold first subject in the array
    var subject = subjectMeta[0];

    // Variable to hold washing frequency
    let subject_wfreq = subject.wfreq;

    // variable to set charts as mobile responsive
    var config = {responsive: true};

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = sampleID.slice(0, 10).map((otuID) => `OTU ${otuID}`).reverse();
    console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sampleValue.slice(0, 10).reverse(),
      y: yticks, 
      text: sampleLabel.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    var data = [barData];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>" 
      
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, barLayout, config);

    // Bar and Bubble charts
   // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sampleID,
      y: sampleValue,
      text: sampleLabel,
      mode: "markers",
      marker: {
        color: sampleID,
        size: sampleValue,
        colorscale: "YlGnBu"
      }
      
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>", 
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
      width: window.width
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config); 

   // Create the trace for the gauge chart.
   var gaugeData = [{
    domain: {x: [0,1], y: [0,1]},
    value: parseFloat(subject_wfreq),
    type: "indicator",
    mode: "gauge+number",
    title: {text: "<b>Belly Button Washing Frequency</b>"},
    gauge: {
      axis: { range: [null, 10] },
      bar: { color: "white"},
      steps: [
        { range: [0, 2], color: "darkblue" },
        { range: [2, 4], color: "steelblue"},
        { range: [4, 6], color: "deepskyblue"},
        { range: [6, 8], color: "skyblue" },
        { range: [8, 10], color: "lightskyblue" },
      ]
    }
  }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 375,
      height: 350,
      margin: { t: 50, r: 50, l: 50, b: 25 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, config);
  });

}


 