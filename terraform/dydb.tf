resource "aws_dynamodb_table" "status_dynamodb_table" {
  name           = "MediaConvert-status"
  billing_mode   = "PAY_PER_REQUEST"

  hash_key       = "project"
  range_key      = "fileName"

  attribute {
    name = "project"
    type = "S"
  }

  attribute {
    name = "fileName"
    type = "S"
  }

  attribute {
    name = "jobId"
    type = "S"
  }

  global_secondary_index {
    name               = "JobIdIndex"
    hash_key           = "jobId"
    projection_type    = "ALL"
  }

  tags = {
    Environment = "production"
    project = "mediaConvert"
  }
}

resource "aws_dynamodb_table" "events_dynamodb_table" {
  name           = "MediaConvert-events"
  billing_mode   = "PAY_PER_REQUEST"

  hash_key       = "jobid"
  range_key      = "number"

  attribute {
    name = "jobid"
    type = "S"
  }

  attribute {
    name = "number"
    type = "N"
  }

  tags = {
    Environment = "production"
    project = "mediaConvert"
  }
}

resource "aws_dynamodb_table_item" "status_projects" {
#   count = var.init ? 1 : 0
  table_name = aws_dynamodb_table.status_dynamodb_table.name
  hash_key   = aws_dynamodb_table.status_dynamodb_table.hash_key
  range_key  = aws_dynamodb_table.status_dynamodb_table.range_key

  item = <<ITEM
{
  "project": {"S": "list"},
  "fileName": {"S": "projects"},
  "list": {"L": []}
}
ITEM


}

resource "aws_dynamodb_table_item" "status_status" {
#   count = var.init ? 1 : 0
  table_name = aws_dynamodb_table.status_dynamodb_table.name
  hash_key   = aws_dynamodb_table.status_dynamodb_table.hash_key
  range_key  = aws_dynamodb_table.status_dynamodb_table.range_key

  item = <<ITEM
{
  "project": {"S": "list"},
  "fileName": {"S": "status"},
  "totalProjects": {"N": "0"},
  "completedConversions": {"N": "0"},
  "inProgress": {"N": "0"},
  "archived": {"N": "0"}
}
ITEM

}
