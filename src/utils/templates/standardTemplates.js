export const STANDARD_TEMPLATES = [
    {
        id: 'tpl_surf_13375',
        name: 'Standard Surface - 13 3/8"',
        type: 'Casing',
        od: 13.375,
        description: 'Common surface casing configuration for shallow freshwater protection.',
        sections: [
            {
                top_depth: 0,
                bottom_depth: 2500,
                weight: 54.5,
                grade: 'K-55',
                connection_type: 'API BTC',
                burst_rating: 2730,
                collapse_rating: 1130,
                tensile_strength: 545000
            }
        ]
    },
    {
        id: 'tpl_inter_9625',
        name: 'Standard Intermediate - 9 5/8"',
        type: 'Casing',
        od: 9.625,
        description: 'Intermediate string for isolation of troublesome zones.',
        sections: [
            {
                top_depth: 0,
                bottom_depth: 5000,
                weight: 40.0,
                grade: 'L-80',
                connection_type: 'API BTC',
                burst_rating: 5750,
                collapse_rating: 3090,
                tensile_strength: 727000
            },
            {
                top_depth: 5000,
                bottom_depth: 8500,
                weight: 47.0,
                grade: 'P-110',
                connection_type: 'Premium',
                burst_rating: 9440,
                collapse_rating: 5380,
                tensile_strength: 1086000
            }
        ]
    },
    {
        id: 'tpl_prod_5500',
        name: 'Production String - 5 1/2"',
        type: 'Casing',
        od: 5.5,
        description: 'Standard production casing for moderate depth wells.',
        sections: [
            {
                top_depth: 0,
                bottom_depth: 12000,
                weight: 17.0,
                grade: 'P-110',
                connection_type: 'Premium',
                burst_rating: 10640,
                collapse_rating: 7480,
                tensile_strength: 445000
            }
        ]
    }
];