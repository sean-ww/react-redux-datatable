const schema = {
  "type": "object",
  "properties": {
    "searchSuccess": true,
    "dataTotalSize": 119,
    "data": {
      "type": "array",
      "minItems": 119,
      "maxItems": 119,
      "items": {
        "type": "object",
        "properties": {
          "request_id": {
            "type": "integer",
            "unique": true,
            "minimum": 1,
            "maximum": 500
          },
          "user_id": {
            "type": "integer",
            "minimum": 1,
            "maximum": 500
          },
          "first_name": {
            "type": "string",
            "faker": "name.firstName"
          },
          "surname": {
            "type": "string",
            "faker": "name.lastName"
          },
          "email": {
            "type": "string",
            "faker": "internet.email"
          },
          "created_at": {
            "type": "string",
            "faker": "custom.dateFromPastYear"
          },
          "type": {
            "type": "string",
            "pattern": "Add|Amend|Remove"
          },
          "system_type": {
            "type": "string",
            "pattern": "training|staging|production"
          },
          "actions": {
            "type": "integer",
            "minimum": 1,
            "maximum": 500
          }
        },
        "required": [
          "request_id",
          "user_id",
          "first_name",
          "surname",
          "email",
          "created_at",
          "type",
          "system_type",
          "actions"
        ]
      }
    }
  },
  "required": [
    "searchSuccess",
    "dataTotalSize",
    "data"
  ]
};

module.exports = schema;
