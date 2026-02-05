export const CSVTemplateService = {
  // Define header structure
  headers: ['FirstName', 'LastName', 'Email', 'Role', 'ModuleID'],
  
  // Sample data for the template
  sampleData: [
    {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john.doe@university.edu',
      Role: 'Student',
      ModuleID: 'e.g. 550e8400-e29b-41d4-a716-446655440000'
    },
    {
      FirstName: 'Jane',
      LastName: 'Smith',
      Email: 'jane.smith@university.edu',
      Role: 'Lecturer',
      ModuleID: 'e.g. 550e8400-e29b-41d4-a716-446655440000'
    }
  ],

  /**
   * Generates and downloads the CSV template
   */
  downloadTemplate() {
    const csvContent = [
      this.headers.join(','),
      ...this.sampleData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Create download link
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'petrolord_user_import_template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};