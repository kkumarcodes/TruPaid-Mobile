# App Kickoff Project

The following API details for interacting with the Reveel backend can be used to complete the self-service registration flow for the mobile App. Reveel has integrated the [ORY Ecosystem](https://ory.sh) services for User authentication. Users register and login with ORY Kratos via a REST-based API. Once authenticated in the App, Reveel uses GraphQL for all other API operations.

## User Registration Flow

To initiate a User registration flow in the platform, an initial call is necessary to establish a flow identifier. The response to this call is required when submitting the User information for registration. The API endpoint is:

```
GET https://staging.usetrupaid.com/trupaid-kratos/self-service/registration/api
```

Required Headers:

```
Accept: application/json
```

The response contains a dynamic array of nodes used to describe the inputs expected for User registration. This is intended to provide a mechanism where the frontend can dynamically produce a form based on this response, but this is out of scope and not necessary for the Reveel App.

The key elements of the response needed to continue the registration flow are the outermost `id` representing the flow, the `action` field, the `csrf_token` (empty string for the App - this is only needed for browser flows), and the general hierarchy of the fields. More on this below when POSTing the User registration data.

Example Response:

```
{
    "id": "5342695d-ab03-4718-bbf7-e80f8ed77629",
    "type": "api",
    "expires_at": "2021-06-14T03:39:33.709674601Z",
    "issued_at": "2021-06-14T02:39:33.709674601Z",
    "request_url": "http://trupaid-kratos-srv:3000/self-service/registration/api",
    "ui": {
        "action": "https://staging.usetrupaid.com/trupaid-kratos-public/self-service/registration?flow=5342695d-ab03-4718-bbf7-e80f8ed77629",
        "method": "POST",
        "nodes": [
            {
                "type": "input",
                "group": "default",
                "attributes": {
                    "name": "csrf_token",
                    "type": "hidden",
                    "value": "",
                    "required": true,
                    "disabled": false
                },
                "messages": null,
                "meta": {}
            },
            {
                "type": "input",
                "group": "password",
                "attributes": {
                    "name": "traits.email",
                    "type": "email",
                    "disabled": false
                },
                "messages": null,
                "meta": {
                    "label": {
                        "id": 1070002,
                        "text": "E-Mail",
                        "type": "info"
                    }
                }
            },
            {
                "type": "input",
                "group": "password",
                "attributes": {
                    "name": "password",
                    "type": "password",
                    "required": true,
                    "disabled": false
                },
                "messages": null,
                "meta": {
                    "label": {
                        "id": 1070001,
                        "text": "Password",
                        "type": "info"
                    }
                }
            },
            {
                "type": "input",
                "group": "password",
                "attributes": {
                    "name": "traits.name.first",
                    "type": "text",
                    "disabled": false
                },
                "messages": null,
                "meta": {}
            },
            {
                "type": "input",
                "group": "password",
                "attributes": {
                    "name": "traits.name.last",
                    "type": "text",
                    "disabled": false
                },
                "messages": null,
                "meta": {}
            },
            {
                "type": "input",
                "group": "password",
                "attributes": {
                    "name": "traits.accepted_tos",
                    "type": "text",
                    "disabled": false
                },
                "messages": null,
                "meta": {}
            },
            {
                "type": "input",
                "group": "password",
                "attributes": {
                    "name": "method",
                    "type": "submit",
                    "value": "password",
                    "disabled": false
                },
                "messages": null,
                "meta": {
                    "label": {
                        "id": 1040001,
                        "text": "Sign up",
                        "type": "info",
                        "context": {}
                    }
                }
            }
        ]
    }
}
```

The App can then POST the form data collected in the UX. The `action` field from the previous
request dictates what endpoint to hit:

```
POST https://staging.usetrupaid.com/trupaid-kratos-public/self-service/registration?flow=5342695d-ab03-4718-bbf7-e80f8ed77629
```

Headers required:

```
Accept: application/json
```

Body JSON to send:

```
{
    "csrf_token": "",
    "method": "password",
    "password": "mySuperSecurePassword1234!",
    "traits": {
        "email": "test@geemail.com",
        "name": {
            "first": "Tester",
            "last": "Staging"
        }
    }
}
```

The response will contain the `session_token` to use in the `Authorization` header as a Bearer token for all requests as this new User. The response will also contain all `identity` info for the newly established User.

Sample Response:

```
{
    "session_token": "bjk9Vp6ZSdYoR7sVXJeyfhBBGAHIXPdk",
    "session": {
        "id": "5cbdc56a-a6fd-4aa6-aa9e-7ff0fbc8fdb2",
        "active": true,
        "expires_at": "2021-06-15T03:03:25.032119819Z",
        "authenticated_at": "2021-06-14T03:03:25.082754668Z",
        "issued_at": "2021-06-14T03:03:25.032144741Z",
        "identity": {
            "id": "4e161114-4146-4d51-b3b9-0ca7deb3247c",
            "schema_id": "default",
            "schema_url": "https://staging.usetrupaid.com/trupaid-kratos-public/schemas/default",
            "traits": {
                "email": "test@geemail.com",
                "name": {
                    "first": "Tester",
                    "last": "Staging"
                }
            },
            "verifiable_addresses": [
                {
                    "id": "6111fa25-f840-4ae1-8276-2b7e465cd94c",
                    "value": "test@geemail.com",
                    "verified": false,
                    "via": "email",
                    "status": "sent",
                    "verified_at": null,
                    "created_at": "2021-06-14T03:03:25.002771Z",
                    "updated_at": "2021-06-14T03:03:25.002771Z"
                }
            ],
            "recovery_addresses": [
                {
                    "id": "c9697e20-eb37-4885-915e-dede2b80c007",
                    "value": "test@geemail.com",
                    "via": "email",
                    "created_at": "2021-06-14T03:03:25.01113Z",
                    "updated_at": "2021-06-14T03:03:25.01113Z"
                }
            ],
            "created_at": "2021-06-14T03:03:24.994555Z",
            "updated_at": "2021-06-14T03:03:24.994555Z"
        }
    },
    "identity": {
        "id": "4e161114-4146-4d51-b3b9-0ca7deb3247c",
        "schema_id": "default",
        "schema_url": "https://staging.usetrupaid.com/trupaid-kratos-public/schemas/default",
        "traits": {
            "email": "test@geemail.com",
            "name": {
                "first": "Tester",
                "last": "Staging"
            }
        },
        "verifiable_addresses": [
            {
                "id": "6111fa25-f840-4ae1-8276-2b7e465cd94c",
                "value": "test@geemail.com",
                "verified": false,
                "via": "email",
                "status": "sent",
                "verified_at": null,
                "created_at": "2021-06-14T03:03:25.002771Z",
                "updated_at": "2021-06-14T03:03:25.002771Z"
            }
        ],
        "recovery_addresses": [
            {
                "id": "c9697e20-eb37-4885-915e-dede2b80c007",
                "value": "test@geemail.com",
                "via": "email",
                "created_at": "2021-06-14T03:03:25.01113Z",
                "updated_at": "2021-06-14T03:03:25.01113Z"
            }
        ],
        "created_at": "2021-06-14T03:03:24.994555Z",
        "updated_at": "2021-06-14T03:03:24.994555Z"
    }
}
```

## User Login Flow

User login works in much the same way as the registration. First a request must be made to initiate a login flow with the backend from the App. To begin a login, send a request to this endpoint:

```
GET https://staging.usetrupaid.com/trupaid-kratos/self-service/login/api
```

Include the required header:

```
Accept: application/json
```

You will receive a flow `id` to use when submitting the User credentials for authentication.

Sample Response:

```
{
    "id": "0b6421f0-9c49-46bf-b8e0-d746370f3059",
    "type": "api",
    "expires_at": "2021-06-15T01:45:20.360378796Z",
    "issued_at": "2021-06-15T00:45:20.360378796Z",
    "request_url": "http://trupaid-kratos-srv:3000/self-service/login/api",
    "ui": {
        "action": "https://staging.usetrupaid.com/trupaid-kratos-public/self-service/login?flow=0b6421f0-9c49-46bf-b8e0-d746370f3059",
        "method": "POST",
        "nodes": [
            {
                "type": "input",
                "group": "default",
                "attributes": {
                    "name": "csrf_token",
                    "type": "hidden",
                    "value": "",
                    "required": true,
                    "disabled": false
                },
                "messages": null,
                "meta": {}
            },
            {
                "type": "input",
                "group": "password",
                "attributes": {
                    "name": "password_identifier",
                    "type": "text",
                    "value": "",
                    "required": true,
                    "disabled": false
                },
                "messages": null,
                "meta": {
                    "label": {
                        "id": 1070004,
                        "text": "ID",
                        "type": "info"
                    }
                }
            },
            {
                "type": "input",
                "group": "password",
                "attributes": {
                    "name": "password",
                    "type": "password",
                    "required": true,
                    "disabled": false
                },
                "messages": null,
                "meta": {
                    "label": {
                        "id": 1070001,
                        "text": "Password",
                        "type": "info"
                    }
                }
            },
            {
                "type": "input",
                "group": "password",
                "attributes": {
                    "name": "method",
                    "type": "submit",
                    "value": "password",
                    "disabled": false
                },
                "messages": null,
                "meta": {
                    "label": {
                        "id": 1010001,
                        "text": "Sign in",
                        "type": "info",
                        "context": {}
                    }
                }
            }
        ]
    },
    "created_at": "2021-06-15T00:45:20.36185Z",
    "updated_at": "2021-06-15T00:45:20.36185Z",
    "forced": false
}
```

Again, when the User credentials are ready, POST to the url provided by the `action` field in the previous response:

```
POST https://staging.usetrupaid.com/trupaid-kratos-public/self-service/login?flow=0b6421f0-9c49-46bf-b8e0-d746370f3059
```

Include the required header:

```
Accept: application/json
```

Body containing the User credentials:

```
{
    "csrf_token": "",
    "method": "password",
    "password": "mySuperSecurePassword1234!",
    "password_identifier": "test@geemail.com"
}
```

Sample response containing the `identity` and the `session_token`:

```
{
    "session_token": "ixaHqYZyyAlvbMZDejbwoK3ENmMRPYgh",
    "session": {
        "id": "352a0764-28d8-4ec2-af1b-2141bc6d68c1",
        "active": true,
        "expires_at": "2021-06-16T00:45:38.961879731Z",
        "authenticated_at": "2021-06-15T00:45:38.961879731Z",
        "issued_at": "2021-06-15T00:45:38.961906851Z",
        "identity": {
            "id": "4e161114-4146-4d51-b3b9-0ca7deb3247c",
            "schema_id": "default",
            "schema_url": "https://staging.usetrupaid.com/trupaid-kratos-public/schemas/default",
            "traits": {
                "name": {
                    "last": "Staging",
                    "first": "SeanTest"
                },
                "email": "test@geemail.com"
            },
            "verifiable_addresses": [
                {
                    "id": "6111fa25-f840-4ae1-8276-2b7e465cd94c",
                    "value": "test@geemail.com",
                    "verified": false,
                    "via": "email",
                    "status": "sent",
                    "verified_at": null,
                    "created_at": "2021-06-14T03:03:25.002771Z",
                    "updated_at": "2021-06-14T03:03:25.002771Z"
                }
            ],
            "recovery_addresses": [
                {
                    "id": "c9697e20-eb37-4885-915e-dede2b80c007",
                    "value": "test@geemail.com",
                    "via": "email",
                    "created_at": "2021-06-14T03:03:25.01113Z",
                    "updated_at": "2021-06-14T03:03:25.01113Z"
                }
            ],
            "created_at": "2021-06-14T03:03:24.994555Z",
            "updated_at": "2021-06-14T03:03:24.994555Z"
        }
    }
}
```

## Authenticated Requests

ORY Kratos has a quirk that we leverage to configure the ORY Oathkeeper proxy routing rules in a way that passes requests through to ORY Kratos based on the presence of a Cookie header key. The presence of the `x-session-token` tells our routing layer to pass the session requests along to Kratos to be authenticated.

For example, a raw authenticated GraphQL query for the logged in session above would look like the following:

```
POST https://staging.usetrupaid.com/graphql
```

Required Headers:
```
Accept: application/json
Cookie: x-session-token=readAuthorization
Authorization: Bearer ixaHqYZyyAlvbMZDejbwoK3ENmMRPYgh
```

Body containing the raw GraphQL json:

```
{"operationName":null,"variables":{},"query":"{\n  myReceipts {\n    id\n    type\n    subtype\n    amount\n    description\n    status\n    brand {\n      id\n      name\n    }\n  }\n}\n"}
```

A successful response would look like this for a new User with no Receipts:

```
{
    "data": {
        "myReceipts": []
    }
}
```
