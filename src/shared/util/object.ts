export function formDataToStringRecord(
    formData: FormData
  ): Record<string, string> {
    const formDataObject = Object.fromEntries(formData.entries());
    const stringRecord: Record<string, string> = {};
  
    for (const key in formDataObject) {
      if (Object.prototype.hasOwnProperty.call(formDataObject, key)) {
        const value = formDataObject[key];
  
        if (value instanceof File) {
          stringRecord[key] = value.name;
        } else {
          stringRecord[key] = value;
        }
      }
    }
  
    return stringRecord;
  }