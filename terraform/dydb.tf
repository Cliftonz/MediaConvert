resource "aws_dynamodb_table" "status-dynamodb-table" {
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
#
#   attribute {
#     name = "bucket"
#     type = "S"
#   }
#
#   attribute {
#     name = "bucketPath"
#     type = "S"
#   }
#
#   attribute {
#     name = "processingStatus"
#     type = "S"
#   }
#
#   attribute {
#     name = "status"
#     type = "S"
#   }
#
#   attribute {
#     name = "pastJobId"
#     type = "S"
#   }

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

resource "aws_dynamodb_table" "events-dynamodb-table" {
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

#   attribute {
#     name = "project"
#     type = "S"
#   }
#
#   attribute {
#     name = "filename"
#     type = "S"
#   }
#
#   attribute {
#     name = "jobid"
#     type = "S"
#   }
#
#   attribute {
#     name = "event"
#     type = "S"
#   }
#
#   attribute {
#     name = "status"
#     type = "S"
#   }

#   attribute {
#     name = "timestamp"
#     type = "S"
#   }
#
#   attribute {
#     name = "path"
#     type = "S"
#   }

  tags = {
    Environment = "production"
    project = "mediaConvert"
  }
}