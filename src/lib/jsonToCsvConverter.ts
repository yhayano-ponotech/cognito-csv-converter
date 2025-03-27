/**
 * JSON to CSV converter for Cognito user data
 * @file lib/jsonToCsvConverter.ts
 */

// User data interfaces
export interface Attribute {
    Name: string;
    Value: string;
  }
  
  export interface User {
    Username: string;
    Attributes: Attribute[];
    UserCreateDate: string;
    UserLastModifiedDate: string;
    Enabled: boolean;
    UserStatus: string;
  }
  
  export interface UserData {
    Users: User[];
  }
  
  /**
   * Convert ISO date string to epoch milliseconds
   */
  export const isoToEpochMillis = (dateString: string): number => {
    try {
      // Parse ISO 8601 format
      const dt = new Date(dateString);
      // Convert to epoch milliseconds
      return dt.getTime();
    } catch (e) {
      console.error(`Error converting date ${dateString}: ${e}`);
      return 0;
    }
  };
  
  /**
   * Get attribute value from user object
   */
  export const getAttributeValue = (user: User, attributeName: string): string => {
    if (!user.Attributes) {
      return "";
    }
    
    const attribute = user.Attributes.find(attr => attr.Name === attributeName);
    return attribute ? attribute.Value : "";
  };
  
  /**
   * Convert JSON user data to CSV format
   */
  export const convertUserJsonToCsv = (jsonData: UserData): string => {
    // CSV header structure based on template.csv
    const csvHeaders = [
      "profile", "address", "birthdate", "gender", "preferred_username", 
      "updated_at", "website", "picture", "phone_number", "phone_number_verified", 
      "zoneinfo", "custom:custId", "custom:contactId", "custom:subStatus", 
      "locale", "email", "email_verified", "given_name", "family_name", 
      "middle_name", "name", "nickname", "cognito:mfa_enabled", "cognito:username"
    ];
    
    // Create CSV rows
    const rows: string[] = [];
    
    // Add header row
    rows.push(csvHeaders.join(','));
    
    // Process each user
    jsonData.Users.forEach(user => {
      const email = getAttributeValue(user, "email");
      
      const rowData = csvHeaders.map(header => {
        switch (header) {
          case "updated_at":
            // Convert date to epoch timestamp
            return user.UserLastModifiedDate ? 
              isoToEpochMillis(user.UserLastModifiedDate).toString() : "";
          case "email":
            return email;
          case "email_verified":
            return getAttributeValue(user, "email_verified");
          case "custom:custId":
            return getAttributeValue(user, "custom:custId");
          case "custom:contactId":
            return getAttributeValue(user, "custom:contactId");
          case "custom:subStatus":
            return getAttributeValue(user, "custom:subStatus");
          case "cognito:username":
            // Use email as username
            return email;
          default:
            // For any other fields
            return getAttributeValue(user, header);
        }
      }).map(value => {
        // Escape CSV field if needed
        if (value && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      
      rows.push(rowData.join(','));
    });
    
    return rows.join('\n');
  };
  
  /**
   * Parse JSON string and convert to CSV
   */
  export const parseJsonAndConvertToCsv = (jsonString: string): string => {
    try {
      const data = JSON.parse(jsonString) as UserData;
      return convertUserJsonToCsv(data);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      throw new Error("Invalid JSON format");
    }
  };