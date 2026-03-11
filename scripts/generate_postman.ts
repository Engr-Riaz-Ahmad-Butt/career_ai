import fs from 'fs';
import path from 'path';

const BACKEND_SRC_ROUTES_DIR = path.join(__dirname, '../backend/src/routes');
const POSTMAN_DIR = path.join(__dirname, '../postman');

// Basic Postman Collection structure (v2.1.0)
const postmanCollection = {
    info: {
        name: "CareerAI API Collection",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [] as any[]
};

// Postman Environment structure
const postmanEnvironment = {
    name: "CareerAI Environment",
    values: [
        {
            key: "base_url",
            value: "http://localhost:5000/api/v1",
            type: "default",
            enabled: true
        },
        {
            key: "token",
            value: "",
            type: "secret",
            enabled: true
        }
    ]
};

// Function to generate sample body based on endpoint name
function getSampleBody(folderName: string, endpointName: string, method: string) {
    if (method !== 'POST' && method !== 'PUT') return null;

    let bodyObj: any = {};
    if (folderName === 'auth') {
        if (endpointName.includes('register')) {
            bodyObj = {
                firstName: "Test",
                lastName: "User",
                email: "testuser@example.com",
                password: "Password123!"
            };
        } else if (endpointName.includes('login')) {
            bodyObj = {
                email: "testuser@example.com",
                password: "Password123!"
            };
        } else if (endpointName.includes('forgot-password')) {
            bodyObj = { email: "testuser@example.com" };
        } else if (endpointName.includes('reset-password')) {
            bodyObj = { password: "NewPassword123!" };
        }
    } else if (folderName === 'resume' || folderName === 'resumes') {
        bodyObj = {
            title: "Software Engineer Resume",
            template: "modern",
            styling: {
                theme: "light",
                color: "#000000"
            }
        };
    } else if (folderName === 'job' || folderName === 'jobs') {
        if (endpointName.includes('resume')) {
            bodyObj = {};
        }
    }

    if (Object.keys(bodyObj).length === 0) {
        bodyObj = { sample: "data" };
    }

    return {
        mode: "raw",
        raw: JSON.stringify(bodyObj, null, 2),
        options: {
            raw: {
                language: "json"
            }
        }
    };
}

// Function to determine auth requirements
function requiresAuth(folderName: string, endpointName: string) {
    if (folderName === 'auth') {
        if (endpointName.includes('logout') || endpointName.includes('me')) {
            return true;
        }
        return false;
    }
    return true; // Assume most other endpoints require auth
}

// Function to generate scripts
function getEventScripts(folderName: string, endpointName: string) {
    if (folderName === 'auth' && endpointName.includes('login')) {
        return [
            {
                listen: "test",
                script: {
                    exec: [
                        "var jsonData = pm.response.json();",
                        "if (jsonData.data && jsonData.data.accessToken) {",
                        "    pm.environment.set(\"token\", jsonData.data.accessToken);",
                        "}"
                    ],
                    type: "text/javascript"
                }
            }
        ];
    }
    return [];
}

function parseRoutes() {
    const routeFiles = fs.readdirSync(BACKEND_SRC_ROUTES_DIR).filter(file => file.endsWith('.routes.ts'));
    console.log(`Found ${routeFiles.length} route files.`);

    routeFiles.forEach(file => {
        const folderName = file.replace('.routes.ts', '');
        const folderDesc = folderName.charAt(0).toUpperCase() + folderName.slice(1);
        
        let folderItem: any = {
            name: folderDesc,
            description: `Endpoints for ${folderDesc}`,
            item: []
        };

        const filePath = path.join(BACKEND_SRC_ROUTES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Match lines like router.get('/path', ...)
        const routeRegex = /router\.(get|post|put|delete|patch)\((['"`])(.*?)['"`]/g;
        let match;

        while ((match = routeRegex.exec(content)) !== null) {
            const method = match[1].toUpperCase();
            let routePath = match[3];

            // Replace express params :id with {{id}} or a default value
            let postmanPath = routePath.split('/').map(segment => {
                if (segment.startsWith(':')) {
                    const paramName = segment.substring(1);
                    return `{{${paramName}}}`;
                }
                return segment;
            });
            let finalPathString = postmanPath.filter(x => x !== '').join('/');

            // Remove leading slash if exists
            if (routePath.startsWith('/')) {
                routePath = routePath.substring(1);
            }

            const endpointName = routePath === '' ? `[${method}] Root/List` : `[${method}] ${routePath}`;
            
            let requestObj: any = {
                name: endpointName,
                event: getEventScripts(folderName, routePath),
                request: {
                    method: method,
                    header: [],
                    url: {
                        raw: `{{base_url}}/${folderName}${finalPathString ? '/' + finalPathString : ''}`,
                        host: ["{{base_url}}"],
                        path: [folderName].concat(postmanPath.filter(p => p !== ''))
                    }
                },
                response: []
            };

            // Add Authorization header if needed
            if (requiresAuth(folderName, routePath)) {
                requestObj.request.auth = {
                    type: "bearer",
                    bearer: [
                        {
                            key: "token",
                            value: "{{token}}",
                            type: "string"
                        }
                    ]
                };
            }

            // Add body for POST/PUT if needed
            const body = getSampleBody(folderName, routePath, method);
            if (body) {
                requestObj.request.body = body;
            }

            folderItem.item.push(requestObj);
        }

        if (folderItem.item.length > 0) {
            postmanCollection.item.push(folderItem);
        }
    });

    if (!fs.existsSync(POSTMAN_DIR)){
        fs.mkdirSync(POSTMAN_DIR);
    }

    const collectionPath = path.join(POSTMAN_DIR, 'CareerAI_API_Collection.json');
    fs.writeFileSync(collectionPath, JSON.stringify(postmanCollection, null, 2));
    console.log(`Generated Postman Collection at ${collectionPath}`);

    const envPath = path.join(POSTMAN_DIR, 'CareerAI_Environment.json');
    fs.writeFileSync(envPath, JSON.stringify(postmanEnvironment, null, 2));
    console.log(`Generated Postman Environment at ${envPath}`);
}

parseRoutes();
