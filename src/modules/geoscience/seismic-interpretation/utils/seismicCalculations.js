/**
 * Exports horizon pick data to a CSV file.
 * @param {Array<Object>} horizons - Array of horizon objects.
 * @param {string} fileName - The original name of the seismic data file.
 */
export const exportHorizonsToCSV = (horizons, fileName) => {
  if (!horizons || horizons.length === 0) {
    alert("No horizons to export.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Horizon,Trace,Time\n";

  horizons.forEach(horizon => {
    horizon.picks.forEach(pick => {
      csvContent += `${horizon.name},${pick.trace},${pick.time.toFixed(4)}\n`;
    });
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const exportFileName = fileName ? `${fileName.split('.')[0]}_horizons.csv` : "horizons.csv";
  link.setAttribute("download", exportFileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports the entire interpretation session to a JSON file.
 * @param {Object} seismicData - The main seismic data object.
 * @param {Array<Object>} horizons - Array of horizon objects.
 * @param {Object} viewSettings - The current view settings.
 */
export const exportInterpretationToJson = (seismicData, horizons, viewSettings) => {
    if (!seismicData) {
        alert("No data to export.");
        return;
    }

    const exportData = {
        seismicData,
        horizons,
        viewSettings,
        exportedAt: new Date().toISOString(),
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "seismic_interpretation.json";
    link.click();
};

/**
 * Exports the current canvas view as a PNG image.
 * This function is pure and relies on the calling component to provide toast notifications.
 * @param {HTMLCanvasElement} canvas - The main drawing canvas.
 * @param {HTMLCanvasElement} backgroundCanvas - The background canvas.
 * @returns {boolean} - True if export was successful, false otherwise.
 */
export const exportViewAsImage = (canvas, backgroundCanvas) => {
    if (!canvas || !backgroundCanvas) {
        console.error("Export Failed: Canvas elements not provided.");
        return false;
    }

    try {
        const mergedCanvas = document.createElement('canvas');
        mergedCanvas.width = canvas.width;
        mergedCanvas.height = canvas.height;
        const ctx = mergedCanvas.getContext('2d');

        // Draw background first
        ctx.drawImage(backgroundCanvas, 0, 0);
        // Draw main content on top
        ctx.drawImage(canvas, 0, 0);

        const image = mergedCanvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = 'seismic_view.png';
        link.href = image;
        link.click();
        return true;
    } catch (error) {
        console.error("Failed to export image:", error);
        return false;
    }
};