

resource "aws_s3_bucket" "input" {
  bucket = "novu-mc-input"
}

resource "aws_s3_bucket" "output" {
  bucket = "novu-mc-output"
}


resource "aws_iam_role" "my_role" {
  name = "MediaConvert_Role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

  depends_on = [aws_s3_bucket.input,aws_s3_bucket.input]
}

resource "aws_iam_role_policy" "my_role_policy" {
  name = "MediaConvert_Role_Policy"
  role = aws_iam_role.my_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:Get*",
        "s3:List*"
      ],
      "Resource": [
        "arn:aws:s3:::${aws_s3_bucket.input.arn}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:Put*"
      ],
      "Resource": [
        "arn:aws:s3:::${aws_s3_bucket.output.arn}/*"
      ]
    }
  ]
}
EOF

  depends_on = [aws_s3_bucket.input,aws_s3_bucket.input]
}
