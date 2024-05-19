# resource "aws_lambda_function" "s3_event_processor" {
#   function_name = "S3EventProcessor"
#   handler       = "index.handler"  # Adjust based on your runtime and entry point
#   runtime       = "nodejs14.x"     # Adjust the runtime as necessary
#
#   s3_bucket = "your-lambda-code-bucket"
#   s3_key    = "lambda-code.zip"  # Ensure your Lambda code is uploaded to this S3 location
#
#   role = aws_iam_role.lambda_exec_role.arn
# }
#
# resource "aws_iam_role" "lambda_exec_role" {
#   name = "lambda_exec_role_for_s3"
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
# resource "aws_iam_policy" "lambda_s3_access" {
#   name   = "lambda_s3_access_policy"
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = [
#           "s3:GetObject",
#         ],
#         Resource = [
#           "${aws_s3_bucket.input.arn}/*"
#         ],
#         Effect = "Allow"
#       },
#       {
#         Action = [
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:PutLogEvents"
#         ],
#         Resource = "arn:aws:logs:*:*:*"
#         Effect   = "Allow"
#       }
#     ]
#   })
# }
#
# resource "aws_iam_role_policy_attachment" "lambda_policy_attach" {
#   role       = aws_iam_role.lambda_exec_role.name
#   policy_arn = aws_iam_policy.lambda_s3_access.arn
# }
#
# resource "aws_s3_bucket_notification" "bucket_notification" {
#   bucket = aws_s3_bucket.input.id
#
#   lambda_function {
#     lambda_function_arn = aws_lambda_function.s3_event_processor.arn
#     events              = ["s3:ObjectCreated:*"]
#     #filter_prefix       = "uploads/"  # Optional: Specify prefix, if needed
#     #filter_suffix       = ".txt"      # Optional: Specify suffix, if you want to filter on file type
#   }
#
#   depends_on = [
#     aws_lambda_permission.allow_s3_invoke
#   ]
# }
#
# resource "aws_lambda_permission" "allow_s3_invoke" {
#   statement_id  = "AllowExecutionFromS3"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.s3_event_processor.function_name
#   principal     = "s3.amazonaws.com"
#   source_arn    = aws_s3_bucket.input.arn
# }
#
#
