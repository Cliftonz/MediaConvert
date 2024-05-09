

resource "aws_s3_bucket" "input" {
  bucket = "novu-mc-input"
}

resource "aws_s3_bucket" "output" {
  bucket = "novu-mc-output"
}
