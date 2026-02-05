import Papa from 'papaparse';
import { UserManagementService } from './userManagementService';

export const CSVValidator = {
  async validateFile(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const validation = await this.validateData(results.data);
            resolve(validation);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(new Error(`CSV Parsing Error: ${error.message}`));
        }
      });
    });
  },

  async validateData(rows) {
    const result = {
      total: rows.length,
      valid: [],
      invalid: []
    };

    if (rows.length === 0) {
      throw new Error("The CSV file appears to be empty.");
    }

    // Check headers
    const headers = Object.keys(rows[0]).map(h => h.trim().toLowerCase());
    const required = ['firstname', 'lastname', 'email', 'role', 'moduleid'];
    const missing = required.filter(r => !headers.includes(r));

    if (missing.length > 0) {
      throw new Error(`Missing required columns: ${missing.join(', ')}. Please use the template.`);
    }

    // Batch check emails
    const emails = rows.map(r => r.Email || r.email).filter(Boolean);
    const existingEmails = await UserManagementService.checkEmailsExist(emails);

    rows.forEach((row, index) => {
      const rowNum = index + 1;
      const errors = [];
      
      // Normalize keys
      const data = {
        firstName: (row.FirstName || row.firstname || '').trim(),
        lastName: (row.LastName || row.lastname || '').trim(),
        email: (row.Email || row.email || '').trim(),
        role: (row.Role || row.role || '').trim(),
        moduleId: (row.ModuleID || row.moduleid || '').trim()
      };

      // Basic Validation
      if (!data.firstName) errors.push("First Name is required");
      if (!data.lastName) errors.push("Last Name is required");
      
      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email) {
        errors.push("Email is required");
      } else if (!emailRegex.test(data.email)) {
        errors.push("Invalid email format");
      } else if (existingEmails.includes(data.email)) {
        errors.push("User already exists");
      }

      // Role Validation
      const validRoles = ['student', 'lecturer'];
      if (!validRoles.includes(data.role.toLowerCase())) {
        errors.push("Role must be 'Student' or 'Lecturer'");
      }

      // Module Validation (Basic check for presence)
      if (!data.moduleId) {
        errors.push("Module ID is required");
      } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.moduleId)) {
         // Optionally validate UUID format if desired, but existence is key
         errors.push("Invalid Module ID format (must be UUID)");
      }

      if (errors.length > 0) {
        result.invalid.push({ ...data, rowNumber: rowNum, errors });
      } else {
        // Map to internal format for API
        result.valid.push({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          user_type: data.role.toLowerCase(), // Normalize to lowercase for DB
          module_id: data.moduleId,
          rowNumber: rowNum
        });
      }
    });

    return result;
  }
};