# Permian Basin Sample Data Package

This directory contains the source code and documentation for the Petrolord DCA Sample Dataset.

## Files
- `SAMPLE_DATA_OVERVIEW.md`: High-level summary of the dataset.
- `WELL_DESCRIPTIONS.md`: Details for each of the 10 wells.
- `PRODUCTION_DATA_DOCUMENTATION.md`: How the synthetic data was generated.
- `FITTED_MODELS_DOCUMENTATION.md`: Details on the DCA parameters.
- `SCENARIOS_DOCUMENTATION.md`: Economic scenario definitions.
- `GROUPS_DOCUMENTATION.md`: Logic for well grouping.
- `SAMPLE_DATA_USER_GUIDE.md`: Step-by-step instructions for users.
- `SAMPLE_DATA_QUALITY_REPORT.md`: Data integrity assessment.

## Source Code
The actual JavaScript data objects are located in:
- `src/data/permianBasinWells.js`
- `src/data/permianBasinProductionData.js`
- `src/data/permianBasinFittedModels.js`
- `src/data/permianBasinScenarios.js`
- ... and others.

## Usage
This data is ingested via `src/utils/permianBasinDataLoader.js` and loaded into the React Context state. It is not persisted to a database by default but is generated in-memory for demonstration purposes.