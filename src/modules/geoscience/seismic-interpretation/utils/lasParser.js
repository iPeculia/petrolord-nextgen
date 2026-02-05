import React from 'react';

/**
 * Parses a LAS (Log ASCII Standard) file.
 * This is a simplified parser and might need to be extended for all LAS versions and variations.
 * @param {string} fileContent - The string content of the LAS file.
 * @returns {Promise<Object>} A promise that resolves to a structured object with well data.
 */
export const parseLAS = (fileContent) => {
  return new Promise((resolve, reject) => {
    try {
      const lines = fileContent.split(/\r?\n/);
      const sections = {};
      let currentSection = null;
      let dataLines = [];

      lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('~')) {
          currentSection = line.replace(/~/g, '').split(' ')[0].toUpperCase();
          sections[currentSection] = [];
        } else if (currentSection && !line.startsWith('#') && line) {
          if (currentSection === 'A') {
            dataLines.push(line);
          } else {
            sections[currentSection].push(line);
          }
        }
      });

      // Parse Well Information
      const wellInfo = {};
      sections.W.forEach(line => {
        const match = line.match(/^(\w+)\s*\.\s*([\w\s]*?)\s*:\s*(.*)$/);
        if (match) {
          const [, mnemonic, , value] = match;
          wellInfo[mnemonic.trim()] = value.trim();
        }
      });

      // Parse Curve Information
      const curveInfo = sections.C.map(line => {
        const match = line.match(/^(\w+)\s*\.\s*([\w\s]*?)\s*:\s*(.*)$/);
        if(match) {
            const [, mnemonic, unit, description] = match;
            return { mnemonic: mnemonic.trim(), unit: unit.trim(), description: description.trim() };
        }
        return null;
      }).filter(Boolean);

      // Parse Data
      const curveNames = curveInfo.map(c => c.mnemonic);
      const data = dataLines.map(line => {
        const values = line.trim().split(/\s+/);
        const row = {};
        curveNames.forEach((name, i) => {
          row[name] = parseFloat(values[i]);
        });
        return row;
      });

      resolve({ wellInfo, curveInfo, data });

    } catch (error) {
      console.error("Failed to parse LAS file:", error);
      reject(new Error("Invalid or unsupported LAS file format."));
    }
  });
};