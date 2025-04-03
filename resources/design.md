# hackathon-demo project
# Requirement
## 1 hello world api
this is first api, should return the "Hello World!"

## 2 consentCheck api
request Body 
```json
{
  "userId": "job",
  // the first is purpose and later is scopes
  "scope": "purpose1 scope1 scope2",
  "clientId": "bop"
}
```
should query specification bind with clientId and match scope and purpose
response body
```json
{
  "specificationId": "id1",
  "predicates": [
    {
      "purpose": ["purpose1"],
      "scope": ["scope1"],
      "description": "bop want to access your scope2 for purpose: purpose1"
    },
    {
      "purpose": ["purpose1", "purpose1"],
      "scope": ["scope2"],
      "description": "bop want to access your scope2 for purpose: purpose1, purpose2"
    }
  ]
}
```