# resource "aws_lambda_function" "mediaconvert_event_handler" {
#   function_name = "MediaConvertEventHandler"
#   handler       = "index.handler"  # Adjust based on your runtime and entry point
#   runtime       = "nodejs14.x"     # Adjust the runtime as necessary
#
#   s3_bucket        = "your-lambda-code-bucket"
#   s3_key           = "lambda-code.zip"  # Ensure your Lambda code is uploaded to this location
#
#   role = aws_iam_role.lambda_exec_role.arn
# }
#
# # IAM role for the Lambda function
# resource "aws_iam_role" "lambda_exec_role" {
#   name = "lambda_exec_role"
#
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:AssumeRole"
#         Principal = {
#           Service = "lambda.amazonaws.com"
#         }
#         Effect = "Allow"
#       },
#     ]
#   })
# }
#
# # Policy to allow the Lambda function to log to CloudWatch
# resource "aws_iam_policy" "lambda_logging" {
#   name   = "lambda_logging_policy"
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = [
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:PutLogEvents"
#         ],
#         Resource = "arn:aws:logs:*:*:*"
#         Effect   = "Allow"
#       },
#     ]
#   })
# }
#
# resource "aws_iam_role_policy_attachment" "lambda_logs" {
#   role       = aws_iam_role.lambda_exec_role.name
#   policy_arn = aws_iam_policy.lambda_logging.arn
# }
