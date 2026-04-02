# n8n-nodes-bamboohr

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with BambooHR's human resources management platform. With 6 core resources and extensive operations, it enables complete automation of employee data management, time tracking, goal setting, reporting, and file management workflows within your HR processes.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![BambooHR](https://img.shields.io/badge/BambooHR-HR%20Platform-green)
![API](https://img.shields.io/badge/API-REST-orange)
![HR](https://img.shields.io/badge/HR-Automation-purple)

## Features

- **Employee Management** - Complete CRUD operations for employee records, profiles, and directory listings
- **Time Off Management** - Handle time off requests, approvals, balances, and policy administration
- **Advanced Reporting** - Generate custom reports with flexible filtering and export capabilities
- **File Management** - Upload, download, and manage employee files and company documents
- **Goal Tracking** - Create, update, and monitor employee goals and performance metrics
- **Time Tracking** - Record and manage employee time entries and timesheets
- **Bulk Operations** - Efficient batch processing for large-scale HR data operations
- **Error Handling** - Comprehensive error management with detailed feedback and retry logic

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-bamboohr`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-bamboohr
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-bamboohr.git
cd n8n-nodes-bamboohr
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-bamboohr
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your BambooHR API key from Settings > API Keys | Yes |
| Subdomain | Your BambooHR subdomain (e.g., 'company' for company.bamboohr.com) | Yes |
| Test Connection | Validates credentials against BambooHR API | No |

## Resources & Operations

### 1. Employee

| Operation | Description |
|-----------|-------------|
| Get | Retrieve employee information by ID |
| Get All | List all employees with optional filtering |
| Create | Add new employee record |
| Update | Modify existing employee information |
| Delete | Remove employee from system |
| Get Directory | Retrieve employee directory with contact information |
| Get Profile Photo | Download employee profile picture |
| Upload Profile Photo | Set employee profile picture |

### 2. Time Off

| Operation | Description |
|-----------|-------------|
| Get | Retrieve specific time off request details |
| Get All | List time off requests with filtering options |
| Create | Submit new time off request |
| Update | Modify existing time off request |
| Approve | Approve pending time off request |
| Deny | Reject time off request |
| Cancel | Cancel approved time off request |
| Get Balance | Check employee time off balances |
| Get Policies | Retrieve time off policies and rules |

### 3. Report

| Operation | Description |
|-----------|-------------|
| Generate | Create custom report with specified parameters |
| Get | Download existing report by ID |
| Get All | List available reports |
| Delete | Remove report from system |
| Schedule | Set up automated report generation |
| Get Fields | Retrieve available report fields |
| Export | Export report in various formats (PDF, CSV, Excel) |

### 4. Company File

| Operation | Description |
|-----------|-------------|
| Get | Download company file by ID |
| Get All | List all company files |
| Upload | Add new company file |
| Update | Modify company file metadata |
| Delete | Remove company file |
| Get Categories | Retrieve file categories |
| Share | Share file with specific employees |

### 5. Goal

| Operation | Description |
|-----------|-------------|
| Get | Retrieve specific goal details |
| Get All | List goals with filtering options |
| Create | Create new employee goal |
| Update | Modify existing goal |
| Delete | Remove goal |
| Complete | Mark goal as completed |
| Get Progress | Check goal completion progress |
| Get Comments | Retrieve goal comments and feedback |

### 6. Time Tracking

| Operation | Description |
|-----------|-------------|
| Get | Retrieve time entry details |
| Get All | List time entries with date range filtering |
| Create | Add new time entry |
| Update | Modify existing time entry |
| Delete | Remove time entry |
| Get Timesheet | Retrieve employee timesheet for period |
| Approve | Approve timesheet entries |
| Get Projects | List available time tracking projects |

## Usage Examples

```javascript
// Create a new employee
const newEmployee = {
  "firstName": "John",
  "lastName": "Doe",
  "workEmail": "john.doe@company.com",
  "jobTitle": "Software Engineer",
  "department": "Engineering",
  "hireDate": "2024-01-15",
  "location": "San Francisco"
};
```

```javascript
// Submit time off request
const timeOffRequest = {
  "employeeId": "12345",
  "timeOffTypeId": "1",
  "startDate": "2024-03-15",
  "endDate": "2024-03-17",
  "amount": "24",
  "notes": "Spring vacation with family"
};
```

```javascript
// Generate custom employee report
const reportParams = {
  "format": "PDF",
  "fields": ["firstName", "lastName", "jobTitle", "department", "hireDate"],
  "filters": {
    "department": "Engineering",
    "status": "Active"
  }
};
```

```javascript
// Create employee goal
const employeeGoal = {
  "employeeId": "12345",
  "title": "Complete React Certification",
  "description": "Obtain React developer certification by Q2 2024",
  "dueDate": "2024-06-30",
  "milestones": ["Complete online course", "Pass practice exam", "Schedule certification"]
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API key or subdomain | Verify credentials in node configuration |
| 403 Forbidden | Insufficient permissions for operation | Contact BambooHR admin to grant required permissions |
| 404 Not Found | Employee, report, or resource doesn't exist | Verify the ID exists and user has access |
| 429 Rate Limited | Too many API requests | Implement delays between requests or reduce frequency |
| 400 Bad Request | Invalid request parameters or data format | Check required fields and data types |
| 500 Internal Server Error | BambooHR server error | Retry request after delay or contact BambooHR support |

## Development

```bash
npm install
npm run build
npm test
npm run lint
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

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-bamboohr/issues)
- **BambooHR API Documentation**: [BambooHR API Reference](https://documentation.bamboohr.com/reference)
- **BambooHR Community**: [BambooHR Help Center](https://help.bamboohr.com/)