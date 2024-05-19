provider "aws" {
  region = "us-east-2"

#   # Uncomment if you want to use localstack to test the system
#   skip_credentials_validation = true
#   skip_metadata_api_check     = true
#   s3_force_path_style         = true
#
#   endpoints {
#     s3 = "http://localhost:4566"
#     dynamodb = "http://localhost:4566"
#     lambda = "http://localhost:4566"
#   }

  default_tags {
    tags = {
      "project": "mediaConvert",
      "owner": "zac@novu.co"
    }
  }
}
