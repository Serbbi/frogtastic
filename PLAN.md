# Database entities

### User
- username
- password
- dict
    - organization id -> privileges
- list of organizations

### Organization
- id 
- participants

### Frog
- id
- frog number
- current tank id
- dict (for custom attributes)
- organization id

### Tank
- id
- dict (for custom attributes)