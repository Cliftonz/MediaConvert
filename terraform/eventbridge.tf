# resource "aws_cloudwatch_event_rule" "mediaconvert_event_rule" {
#   name        = "mediaconvert-job-state-change"
#   description = "Trigger on MediaConvert job state changes."
#
#   event_pattern = jsonencode({
#     source     = ["aws.mediaconvert"],
#     "detail-type" = ["MediaConvert Job State Change"]
#   })
# }
#
# resource "aws_cloudwatch_event_target" "invoke_lambda" {
#   rule      = aws_cloudwatch_event_rule.mediaconvert_event_rule.name
#   target_id = "MediaConvertEventLambdaTarget"
#   arn       = aws_lambda_function.mediaconvert_event_handler.arn
# }
#
# resource "aws_lambda_permission" "allow_eventbridge_to_call_lambda" {
#   statement_id  = "AllowExecutionFromEventBridge"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.mediaconvert_event_handler.function_name
#   principal     = "events.amazonaws.com"
#   source_arn    = aws_cloudwatch_event_rule.mediaconvert_event_rule.arn
# }
