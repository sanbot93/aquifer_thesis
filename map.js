$(document).ready(function () {
    // MAP
    const map = L.map("map").setView([50.918619, -116.9], 7);
    L.tileLayer(
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }).addTo(map));
  
    const rechargePotential = "http://127.0.0.1:5500/demo/wind_speed.tif";
    // const windSpeedUrl =
    //   "https://danwild.github.io/leaflet-geotiff-2/wind_speed.tif";
  
    const plottyRenderer = L.LeafletGeotiff.plotty({
      displayMin: 0,
      displayMax: 10,
      clampLow: false,
      clampHigh: false,
    });
    const windSpeedLayer = L.leafletGeotiff(rechargePotential, {
      renderer: plottyRenderer,
    }).addTo(map);
  
    // Raster Control
    
  
    $("#displayMin").on("change", (event) => {
      windSpeedLayer.options.renderer.setDisplayRange(
        +event.currentTarget.value,
        windSpeedLayer.options.renderer.options.displayMax
      );
    });
    $("#displayMax").on("change", (event) => {
      windSpeedLayer.options.renderer.setDisplayRange(
        windSpeedLayer.options.renderer.options.displayMin,
        +event.currentTarget.value
      );
    });
  
    $("#clampLow").on("change", (event) => {
      windSpeedLayer.options.renderer.setClamps(
        event.currentTarget.checked,
        windSpeedLayer.options.renderer.options.clampHigh
      );
    });
  
    $("#clampHigh").on("change", (event) => {
      windSpeedLayer.options.renderer.setClamps(
        windSpeedLayer.options.renderer.options.clampLow,
        event.currentTarget.checked
      );
    });
  
    $("#colorScale").on("change", (event) => {
      const colorScale = $("#colorScale option:selected").val();
      windSpeedLayer.options.renderer.setColorScale(colorScale);
    });
  
    $("#getBounds").on("click", (event) => {
      event.preventDefault();
      const bounds = windSpeedLayer.getBounds();
      map.fitBounds(bounds, { maxZoom: 15 });
    });
  
    $("#getColorbarOptions").on("click", (event) => {
      event.preventDefault();
      const options = windSpeedLayer.options.renderer.getColorbarOptions();
      console.log("getColorbarOptions", options);
    });
  
    let popup;
    map.on("click", function (e) {
      if (!popup) {
        popup = L.popup().setLatLng([e.latlng.lat, e.latlng.lng]).openOn(map);
      } else {
        popup.setLatLng([e.latlng.lat, e.latlng.lng]);
      }
      const value = windSpeedLayer.getValueAtLatLng(+e.latlng.lat, +e.latlng.lng);
      popup
        .setContent(`Possible value at point (experimental/buggy): ${value}`)
        .openOn(map);
    });
  });
  