import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const DataValidationFeedback = ({ validation }) => {
  if (!validation) return null;

  const { isValid, errors = [], warnings = [], source } = validation;

  const getIcon = () => {
    if (errors.length > 0) return <XCircle className="h-5 w-5 text-destructive" />;
    if (warnings.length > 0) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  };

  const getTitle = () => {
    if (errors.length > 0) return 'Validation Failed';
    if (warnings.length > 0) return 'Validation Passed with Warnings';
    return 'Validation Successful';
  };

  const getVariant = () => {
    if (errors.length > 0) return 'destructive';
    if (warnings.length > 0) return 'default';
    return 'default';
  };

  const alertClass = {
      'destructive': 'bg-destructive/10 border-destructive/50 text-destructive',
      'default': 'bg-background border-border'
  }

  return (
    <Alert variant={getVariant()} className={getVariant() === 'destructive' ? alertClass.destructive : alertClass.default}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <AlertTitle>{getTitle()}</AlertTitle>
      </div>
      <AlertDescription className="mt-2 space-y-2 pl-8">
        {source === 'sample' && !isValid && (
            <p className="text-sm text-yellow-400">Sample data loaded, but validation issues were found. This might be intentional for demonstration.</p>
        )}
        {errors.length > 0 && (
          <div>
            <h4 className="font-semibold text-destructive">Errors ({errors.length}):</h4>
            <ul className="list-disc pl-5 text-sm">
              {errors.slice(0, 5).map((error, i) => (
                <li key={`err-${i}`}>
                  {error.row && `Row ${error.row}, `}
                  {error.column && `Column '${error.column}': `}
                  {error.message}
                </li>
              ))}
            </ul>
            {errors.length > 5 && <p className="text-sm">...and {errors.length - 5} more errors.</p>}
          </div>
        )}
        {warnings.length > 0 && (
          <div>
            <h4 className="font-semibold text-yellow-500">Warnings ({warnings.length}):</h4>
            <ul className="list-disc pl-5 text-sm">
              {warnings.slice(0, 5).map((warning, i) => (
                <li key={`warn-${i}`}>
                  {warning.row && `Row ${warning.row}, `}
                  {warning.column && `Column '${warning.column}': `}
                  {warning.message}
                </li>
              ))}
            </ul>
            {warnings.length > 5 && <p className="text-sm">...and {warnings.length - 5} more warnings.</p>}
          </div>
        )}
        {isValid && <p>Your data looks good and is ready for analysis.</p>}
      </AlertDescription>
    </Alert>
  );
};

export default DataValidationFeedback;