dynamodump wipe-data --throughput 5 --table=$DB_PREFIX-counts --region=$AWS_REGION
dynamodump wipe-data --throughput 5 --table=$DB_PREFIX-users --region=$AWS_REGION
dynamodump wipe-data --throughput 5 --table=$DB_PREFIX-ratings --region=$AWS_REGION
dynamodump wipe-data --throughput 5 --table=$DB_PREFIX-tracks --region=$AWS_REGION
dynamodump wipe-data --throughput 5 --table=$DB_PREFIX-poll --region=$AWS_REGION
dynamodump wipe-data --throughput 5 --table=$DB_PREFIX-poll-other --region=$AWS_REGION