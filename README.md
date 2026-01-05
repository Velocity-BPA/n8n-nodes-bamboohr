# n8n-nodes-bamboohr

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for BambooHR, providing complete HR automation capabilities including employee management, time off tracking, benefits administration, goals management, time tracking, and webhook integrations.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

- **9 Resource Categories** with 54+ operations for complete BambooHR API coverage
- **Employee Management** - Create, update, and manage employee records with custom fields
- **Time Off Tracking** - Handle time off requests, balances, policies, and approvals
- **Employee Files** - Upload, download, and manage employee documents
- **Benefits Administration** - Access benefit plans, enrollments, and deductions
- **Goals Management** - Track and update employee goals and progress
- **Time Tracking** - Manage timesheets, clock entries, and approvals
- **Custom Reports** - Generate standard and custom HR reports
- **Custom Tables** - Work with BambooHR custom table data
- **Webhooks** - Set up event-driven integrations

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-bamboohr`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-bamboohr

# Restart n8n
```

### Development Installation

```bash
# Clone or extract the repository
cd n8n-nodes-bamboohr

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-bamboohr

# Restart n8n
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| Company Domain | Your BambooHR subdomain (e.g., `yourcompany` from `yourcompany.bamboohr.com`) | Yes |
| API Key | API key from BambooHR Settings > API Keys | Yes |

### Obtaining API Credentials

1. Log in to your BambooHR account
2. Navigate to **Account** > **API Keys**
3. Click **Add New Key**
4. Enter a name for the key and save
5. Copy the generated API key (it will only be shown once)

## Resources & Operations

### Employee

| Operation | Description |
|-----------|-------------|
| Create | Add a new employee to BambooHR |
| Get | Retrieve an employee by ID |
| Get All | List all employees with optional filters |
| Get Directory | Get the full employee directory |
| Update | Update employee information |
| Get Fields | Get available employee fields |
| Get Changed Employees | Get employees modified since a timestamp |
| Upload Photo | Upload a photo for an employee |

### Employee File

| Operation | Description |
|-----------|-------------|
| List Categories | Get all file categories |
| Add Category | Create a new file category |
| List Files | List files for an employee |
| Upload File | Upload a file for an employee |
| Get File | Download an employee file |
| Update File | Update file metadata |
| Delete File | Delete an employee file |

### Time Off

| Operation | Description |
|-----------|-------------|
| Get Requests | List time off requests |
| Create Request | Submit a time off request |
| Update Request Status | Approve, deny, or cancel a request |
| Get Balances | Get time off balances for an employee |
| Get Policies | List time off policies |
| Get Types | List time off types |
| Add History | Add a time off history entry |
| Estimate Future Balance | Calculate future time off balance |

### Report

| Operation | Description |
|-----------|-------------|
| Get Report | Retrieve a standard report |
| Create Custom Report | Generate a custom report with selected fields |
| List Reports | Get available reports |

### Table

| Operation | Description |
|-----------|-------------|
| Get Table Data | Get rows from a custom table |
| Add Table Row | Add a row to a custom table |
| Update Table Row | Update a table row |
| Delete Table Row | Delete a table row |
| Get Table List | List available tables |

### Benefit

| Operation | Description |
|-----------|-------------|
| Get Benefit Plans | List benefit plans |
| Get Benefit Groups | List benefit groups |
| Get Enrollments | Get benefit enrollments |
| Update Enrollment | Update an enrollment |
| Get Benefit Deductions | Get deduction information |
| Get Benefit Dependents | Get dependent information |

### Goal

| Operation | Description |
|-----------|-------------|
| Get Goals | List employee goals |
| Create Goal | Create a new goal |
| Update Goal | Update goal details |
| Delete Goal | Delete a goal |
| Get Goal Status | Get goal progress details |
| Update Goal Progress | Update progress percentage |
| Close Goal | Mark a goal as closed |

### Time Tracking

| Operation | Description |
|-----------|-------------|
| Get Timesheets | Get timesheet data |
| Get Clock Entries | List clock entries |
| Add Clock Entry | Create a clock entry |
| Update Clock Entry | Update a clock entry |
| Delete Clock Entry | Delete a clock entry |
| Get Daily Entries | Get daily time entries |
| Approve Timesheets | Approve timesheet entries |

### Webhook

| Operation | Description |
|-----------|-------------|
| Create | Register a new webhook |
| Get All | List all webhooks |
| Delete | Remove a webhook |

## Usage Examples

### Create an Employee

```javascript
// Create a new employee with basic information
{
  "resource": "employee",
  "operation": "create",
  "firstName": "John",
  "lastName": "Doe",
  "additionalFields": {
    "workEmail": "john.doe@company.com",
    "department": "Engineering",
    "jobTitle": "Software Developer",
    "hireDate": "2024-01-15"
  }
}
```

### Submit a Time Off Request

```javascript
// Create a time off request
{
  "resource": "timeOff",
  "operation": "createRequest",
  "employeeId": "123",
  "timeOffTypeId": "78",
  "startDate": "2024-06-01",
  "endDate": "2024-06-05",
  "amount": 40,
  "note": "Family vacation"
}
```

### Generate a Custom Report

```javascript
// Create a custom report with specific fields
{
  "resource": "report",
  "operation": "createCustomReport",
  "title": "Employee Directory",
  "fields": ["firstName", "lastName", "department", "jobTitle", "workEmail"],
  "format": "JSON"
}
```

### Track Time

```javascript
// Add a clock entry
{
  "resource": "timeTracking",
  "operation": "addClockEntry",
  "employeeId": "123",
  "date": "2024-03-15",
  "clockIn": "09:00",
  "clockOut": "17:30",
  "projectId": "456",
  "note": "Project work"
}
```

## BambooHR Concepts

### Employee Fields

BambooHR supports both standard and custom fields for employees. Standard fields include:

- **Personal**: firstName, lastName, dateOfBirth, ssn, gender
- **Contact**: workEmail, homeEmail, workPhone, mobilePhone, address
- **Employment**: hireDate, department, division, jobTitle, location
- **Compensation**: payRate, payType, payPer, paySchedule

Use the "Get Fields" operation to discover all available fields in your account.

### Time Off Types

Time off in BambooHR is categorized by types (vacation, sick, personal, etc.). Each type can have:

- Different accrual policies
- Balance tracking
- Approval workflows

### Custom Tables

BambooHR uses custom tables for structured data like:

- Job history (jobInfo)
- Employment status history
- Compensation history
- Custom data tables

## Error Handling

The node implements comprehensive error handling:

- **Rate Limiting**: Automatic exponential backoff for 503 responses
- **Authentication Errors**: Clear messages for invalid credentials
- **Validation Errors**: Detailed field-level error information
- **Continue On Fail**: Option to continue workflow on errors

## Security Best Practices

1. **API Key Security**: Store API keys securely using n8n credentials
2. **Minimal Permissions**: Use API keys with only required permissions
3. **Audit Access**: Regularly review API key usage in BambooHR
4. **Secure Webhooks**: Use HTTPS endpoints for webhook URLs
5. **Data Handling**: Be mindful of sensitive HR data in workflows

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use

Permitted for personal, educational, research, and internal business use.

### Commercial Use

Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass
- Code follows the existing style
- New features include tests
- Documentation is updated

## Support

- **Documentation**: [BambooHR API Documentation](https://documentation.bamboohr.com/reference)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-bamboohr/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [BambooHR](https://www.bamboohr.com/) for their comprehensive HR platform and API
- [n8n](https://n8n.io/) for the workflow automation platform
- The n8n community for inspiration and best practices
