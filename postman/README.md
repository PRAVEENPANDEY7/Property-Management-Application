# Property Management API — Postman Testing Suite

This directory contains the complete, production-grade Postman collection and local environment for the Property Management System API.

## Files Included

- `Property-Management.postman_collection.json`: The complete API collection covering Authentication, Public Properties, Admin Property Management, and Authorization/Negative Tests with automated Postman test assertions and token extractions.
- `Property-Management-Local.postman_environment.json`: Pre-configured environment variables for local testing against `http://localhost:8080`.
- `README.md`: This step-by-step setup and test execution guide.

---

## 1. Environment Variables

The collection uses dynamic environment variables to pass tokens and IDs between requests:

| Variable | Initial Value | Description |
| :--- | :--- | :--- |
| `baseUrl` | `http://localhost:8081` | Root API host and port (default local port: 8081; configurable to 8080). |
| `jwtToken` | `""` | User JWT token automatically extracted upon regular user login. |
| `adminToken` | `""` | Administrator JWT token automatically extracted upon admin login. |
| `propertyId` | `""` | Target property ID created during the Admin workflow. |
| `testPropertyId` | `""` | Property ID captured from public browse listings for testing. |

> **Security Note**: No production credentials, real JWTs, or passwords are stored in the collection or environment files. The provided credentials use reproducible local testing accounts.

---

## 2. Importing into Postman

1. Open **Postman** (desktop app or web client).
2. Click the **Import** button in the upper-left navigation bar.
3. Select or drag-and-drop both files:
   - `Property-Management.postman_collection.json`
   - `Property-Management-Local.postman_environment.json`
4. In the top-right environment selector, select **Property Management - Local Environment**.

---

## 3. Provisioning Users & Running the Test Sequence

Run the collection folders sequentially using Postman's **Collection Runner** or execute them manually in the following order:

### Step 1: Authentication Folder
1. **Register New User**: `POST {{baseUrl}}/api/auth/register`
   - Body contains unique user credentials (`testuser@example.com`).
   - Asserts HTTP `201 Created` and standard envelope structure.
2. **Login User**: `POST {{baseUrl}}/api/auth/login`
   - Automated script extracts `data.token` from the response and saves it to `{{jwtToken}}`.
   - Asserts HTTP `200 OK` and presence of token.
3. **Get Current User Profile**: `GET {{baseUrl}}/api/auth/me`
   - Uses `Authorization: Bearer {{jwtToken}}`.
   - Verifies profile retrieval for the authenticated user.
4. **Register / Login Admin**:
   - `POST {{baseUrl}}/api/auth/register` with role `ADMIN` (or log in with provisioned admin credentials `admin@example.com`).
   - Automated script extracts `data.token` and stores it into `{{adminToken}}`.

### Step 2: Public Properties Folder
1. **Get Public Properties (Paginated)**: `GET {{baseUrl}}/api/properties?page=0&size=10&sortBy=createdAt&sortDir=desc`
   - Tests server-side pagination metadata (`currentPage`, `totalPages`, `totalElements`, `first`, `last`, `empty`).
   - Captures first item ID to `{{testPropertyId}}`.
2. **Filter Properties by City**: `GET {{baseUrl}}/api/properties?city=los angeles`
   - Verifies case-insensitive filtering.
3. **Get Property Details by ID**: `GET {{baseUrl}}/api/properties/{{testPropertyId}}`
   - Asserts property attributes and eager image metadata list.
4. **Stream Property Image**: `GET {{baseUrl}}/api/properties/images/:filename`
   - Asserts safe image streaming with `image/*` Content-Type.

### Step 3: Admin Property Management Folder
1. **Create Property with Images**: `POST {{baseUrl}}/api/admin/properties`
   - Uses `Authorization: Bearer {{adminToken}}`.
   - Uses `multipart/form-data` with fields (`name`, `description`, `price`, `location`, `city`) and file uploads (`images`).
   - Automated script saves created `data.id` to `{{propertyId}}`.
2. **Update Property Details & Retain Images**: `PUT {{baseUrl}}/api/admin/properties/{{propertyId}}`
   - Demonstrates partial image replacement, retaining specific image IDs (`keepImageIds`), and uploading `newImages`.
3. **Get Admin Properties Listing**: `GET {{baseUrl}}/api/admin/properties`
   - Verifies administrative paginated view with management metadata.
4. **Delete Property**: `DELETE {{baseUrl}}/api/admin/properties/{{propertyId}}`
   - Verifies cascade database cleanup and disk file deletion. Asserts HTTP `200 OK`.

### Step 4: Authorization and Negative Tests Folder
1. **Access Protected Endpoint Without Token**: Expects HTTP `401 Unauthorized`.
2. **User Token Accessing Admin Route**: Expects HTTP `403 Forbidden` (`ROLE_ADMIN` required).
3. **Property Not Found**: `GET {{baseUrl}}/api/properties/999999` expects HTTP `404 Not Found`.
4. **Validation Failure (Invalid Price/Empty Name)**: Expects HTTP `400 Bad Request` with field validation errors.
5. **Path Traversal Attack**: `GET {{baseUrl}}/api/properties/images/..%2F..%2Fetc%2Fpasswd` expects HTTP `400 Bad Request`.
6. **Invalid Image Upload (Executable/Malicious content)**: Expects HTTP `400 Bad Request` with magic-byte verification failure.

---

## 4. Automated Postman Test Scripts

All requests include Postman pre-request and post-response assertion scripts, for example:

```javascript
// Extract and store JWT token automatically
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Extract JWT token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.token).to.be.a("string");
    pm.environment.set("jwtToken", jsonData.data.token);
});
```

For admin requests:
```javascript
pm.test("Extract Admin token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.token).to.be.a("string");
    pm.environment.set("adminToken", jsonData.data.token);
});
```

---

## 5. Running via Newman (CLI)

You can run the entire suite headless from the command line using Newman:

```bash
npx newman run postman/Property-Management.postman_collection.json \
  -e postman/Property-Management-Local.postman_environment.json \
  --reporters cli
```
