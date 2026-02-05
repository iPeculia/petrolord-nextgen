export const PROJECT_STRUCTURE = [
  {
    id: 'permian',
    name: 'Permian Basin Study',
    fields: [
      {
        id: 'midland',
        name: 'Midland Field',
        wells: [
           {
             id: 'well_a1',
             name: 'Well A-01',
             tests: [
               { id: 'drawdown_mar10', name: 'Drawdown Test (Mar 10)', datasetId: 'drawdown_basic' },
               { id: 'buildup_mar14', name: 'Buildup Test (Mar 14)', datasetId: 'buildup_standard' }
             ]
           },
           {
             id: 'well_b02',
             name: 'Well B-02',
             tests: [
               { id: 'multirate_mar18', name: 'Multi-Rate Test (Mar 18)', datasetId: 'multi_rate' },
               { id: 'injection_mar22', name: 'Injection Test (Mar 22)', datasetId: 'injection' }
             ]
           }
        ]
      },
      {
         id: 'delaware',
         name: 'Delaware Basin',
         wells: [
            {
               id: 'well_c03',
               name: 'Well C-03',
               tests: [
                  { id: 'interference_apr05', name: 'Interference Test (Apr 05)', datasetId: 'interference' },
                  { id: 'fractured_apr12', name: 'Fractured Reservoir (Apr 12)', datasetId: 'fractured' }
               ]
            }
         ]
      }
    ]
  },
  {
      id: 'gulf_coast',
      name: 'Gulf Coast Study',
      fields: [
          {
              id: 'texas_coast',
              name: 'Texas Coastal',
              wells: [
                  {
                      id: 'well_g07',
                      name: 'Well G-07',
                      tests: [
                          { id: 'bounded_may01', name: 'Bounded Reservoir (May 01)', datasetId: 'bounded' }
                      ]
                  },
                  {
                      id: 'well_h08',
                      name: 'Well H-08',
                      tests: [
                          { id: 'damaged_may08', name: 'Damaged Well Test (May 08)', datasetId: 'damaged' }
                      ]
                  },
                  {
                      id: 'well_i09',
                      name: 'Well I-09',
                      tests: [
                          { id: 'stimulated_may15', name: 'Stimulated Well Test (May 15)', datasetId: 'stimulated' }
                      ]
                  }
              ]
          }
      ]
  }
];

export const findTestById = (testId) => {
    for (const project of PROJECT_STRUCTURE) {
        for (const field of project.fields) {
            for (const well of field.wells) {
                const test = well.tests.find(t => t.id === testId);
                if (test) return { ...test, wellName: well.name, fieldName: field.name, projectName: project.name };
            }
        }
    }
    return null;
};