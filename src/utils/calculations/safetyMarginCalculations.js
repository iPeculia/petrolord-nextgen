export const calculateSafetyFactor = (rating, load) => {
  if (!load || load === 0) return 999; // Infinite safety factor if no load
  return Number(rating) / Number(load);
};

export const calculateSafetyMargin = (rating, load) => {
  if (!load || load === 0) return 100;
  // Margin as percentage exceeding the load: (Rating - Load) / Rating * 100 ? 
  // Or (Rating/Load - 1) * 100
  // Often presented as: (SF - 1) * 100%
  const sf = calculateSafetyFactor(rating, load);
  return (sf - 1) * 100;
};