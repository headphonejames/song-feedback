dynamodump import-data --region=$AWS_REGION --file=$DB_PREFIX-counts.dynamodata --table=$DB_PREFIX-counts
dynamodump import-data --region=$AWS_REGION --file=$DB_PREFIX-users.dynamodata --table=$DB_PREFIX-users
dynamodump import-data --region=$AWS_REGION --file=$DB_PREFIX-ratings.dynamodata --table=$DB_PREFIX-ratings
dynamodump import-data --region=$AWS_REGION --file=$DB_PREFIX-tracks.dynamodata --table=$DB_PREFIX-tracks
dynamodump import-data --region=$AWS_REGION --file=$DB_PREFIX-poll.dynamodata --table=$DB_PREFIX-tracks
dynamodump import-data --region=$AWS_REGION --file=$DB_PREFIX-poll-other.dynamodata --table=$DB_PREFIX-tracks
