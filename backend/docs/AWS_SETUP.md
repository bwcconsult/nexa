# AWS Setup Guide for Nexa CRM

Complete guide to set up all AWS services for Nexa CRM backend.

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- Domain name (for production)

## 1. AWS RDS (PostgreSQL) Setup

### Create Database Instance

```bash
aws rds create-db-instance \
  --db-instance-identifier nexa-crm-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.3 \
  --master-username postgres \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name your-subnet-group \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "mon:04:00-mon:05:00" \
  --publicly-accessible \
  --storage-encrypted \
  --multi-az
```

### Or use AWS Console:

1. Go to RDS → Create database
2. Select PostgreSQL
3. Choose production template
4. Set instance identifier: `nexa-crm-db`
5. Master username: `postgres`
6. Auto-generate password (save it!)
7. Instance type: `db.t3.micro` (or larger for production)
8. Storage: 20 GB SSD (auto-scaling enabled)
9. Enable automated backups
10. Create database

### Get Connection Details:

```bash
aws rds describe-db-instances \
  --db-instance-identifier nexa-crm-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

Update `.env`:
```
DB_HOST=nexa-crm-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=nexa_crm
DB_USER=postgres
DB_PASSWORD=YourSecurePassword123!
DB_SSL=true
```

## 2. AWS ElastiCache (Redis) Setup

### Create Redis Cluster

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id nexa-crm-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --cache-subnet-group-name your-subnet-group \
  --security-group-ids sg-xxxxxxxxx
```

### Or use AWS Console:

1. Go to ElastiCache → Redis clusters
2. Create cluster
3. Cluster name: `nexa-crm-redis`
4. Engine version: 7.x
5. Node type: `cache.t3.micro`
6. Number of replicas: 0 (or 2 for HA)
7. Create

### Get Connection Details:

```bash
aws elasticache describe-cache-clusters \
  --cache-cluster-id nexa-crm-redis \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
  --output text
```

Update `.env`:
```
REDIS_HOST=nexa-crm-redis.xxxxxx.0001.use1.cache.amazonaws.com
REDIS_PORT=6379
```

## 3. AWS S3 (File Storage) Setup

### Create S3 Bucket

```bash
aws s3 mb s3://nexa-crm-files --region us-east-1
```

### Configure Bucket Policy

```bash
aws s3api put-public-access-block \
  --bucket nexa-crm-files \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### Enable Versioning

```bash
aws s3api put-bucket-versioning \
  --bucket nexa-crm-files \
  --versioning-configuration Status=Enabled
```

### Enable Encryption

```bash
aws s3api put-bucket-encryption \
  --bucket nexa-crm-files \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

### Enable CORS (for direct uploads)

```bash
aws s3api put-bucket-cors \
  --bucket nexa-crm-files \
  --cors-configuration file://cors.json
```

`cors.json`:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourcrm.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Update `.env`:
```
AWS_S3_BUCKET=nexa-crm-files
AWS_S3_REGION=us-east-1
```

## 4. AWS SES (Email Service) Setup

### Verify Email Address (for testing)

```bash
aws ses verify-email-identity \
  --email-address noreply@yourcrm.com \
  --region us-east-1
```

Check your email and click verification link.

### Move Out of Sandbox (for production)

1. Go to SES → Account dashboard
2. Click "Request production access"
3. Fill out form:
   - Mail type: Transactional
   - Website URL: https://yourcrm.com
   - Use case description: CRM email notifications
4. Submit and wait for approval (usually 24-48 hours)

### Verify Domain (production)

```bash
aws ses verify-domain-identity \
  --domain yourcrm.com \
  --region us-east-1
```

Add DNS records shown in response to your domain.

### Test Email Sending

```bash
aws ses send-email \
  --from noreply@yourcrm.com \
  --destination ToAddresses=test@example.com \
  --message Subject={Data="Test"},Body={Text={Data="Test email"}} \
  --region us-east-1
```

Update `.env`:
```
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@yourcrm.com
AWS_SES_FROM_NAME=Nexa CRM
```

## 5. IAM User & Permissions

### Create IAM User for Application

```bash
aws iam create-user --user-name nexa-crm-app
```

### Create Access Keys

```bash
aws iam create-access-key --user-name nexa-crm-app
```

Save the `AccessKeyId` and `SecretAccessKey`!

### Attach Policies

```bash
# S3 access
aws iam attach-user-policy \
  --user-name nexa-crm-app \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# SES access
aws iam attach-user-policy \
  --user-name nexa-crm-app \
  --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess

# CloudWatch logs
aws iam attach-user-policy \
  --user-name nexa-crm-app \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess
```

### Create Custom Policy (Least Privilege)

Create `nexa-crm-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::nexa-crm-files/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

Apply:
```bash
aws iam create-policy \
  --policy-name NexaCRMPolicy \
  --policy-document file://nexa-crm-policy.json

aws iam attach-user-policy \
  --user-name nexa-crm-app \
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/NexaCRMPolicy
```

Update `.env`:
```
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
```

## 6. Security Groups

### Create Security Group

```bash
aws ec2 create-security-group \
  --group-name nexa-crm-sg \
  --description "Security group for Nexa CRM" \
  --vpc-id vpc-xxxxxxxxx
```

### Allow Inbound Rules

```bash
# SSH (for EC2 management)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

# HTTP
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Application (if needed)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 5000 \
  --cidr 0.0.0.0/0
```

## 7. (Optional) AWS Cognito Setup

### Create User Pool

```bash
aws cognito-idp create-user-pool \
  --pool-name nexa-crm-users \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": true
    }
  }' \
  --auto-verified-attributes email \
  --username-attributes email
```

### Create App Client

```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id us-east-1_xxxxxxxxx \
  --client-name nexa-crm-web \
  --no-generate-secret
```

Update `.env`:
```
AWS_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_COGNITO_REGION=us-east-1
```

## 8. Cost Optimization

### Development Environment

- RDS: db.t3.micro ($15/month)
- ElastiCache: cache.t3.micro ($12/month)
- S3: Pay per use (~$1-5/month)
- SES: First 62,000 emails free
- **Total: ~$30-35/month**

### Production Environment

- RDS: db.t3.small + Multi-AZ ($60/month)
- ElastiCache: cache.t3.small + Replica ($50/month)
- S3: ~$10-20/month
- SES: $0.10 per 1000 emails
- Load Balancer: $20/month
- **Total: ~$150-200/month**

## 9. Monitoring Setup

### CloudWatch Alarms

```bash
# Database CPU
aws cloudwatch put-metric-alarm \
  --alarm-name nexa-crm-db-cpu \
  --alarm-description "RDS CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=DBInstanceIdentifier,Value=nexa-crm-db
```

## 10. Backup Strategy

### RDS Automated Backups

Already configured in step 1.

### S3 Versioning

Already enabled in step 3.

### Manual Backups

```bash
# Create RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier nexa-crm-db \
  --db-snapshot-identifier nexa-crm-backup-$(date +%Y%m%d)

# S3 backup
aws s3 sync s3://nexa-crm-files s3://nexa-crm-backups
```

## ✅ Verification Checklist

- [ ] RDS database created and accessible
- [ ] ElastiCache cluster running
- [ ] S3 bucket created with encryption
- [ ] SES email verified (or domain verified)
- [ ] IAM user created with access keys
- [ ] Security groups configured
- [ ] `.env` file updated with all credentials
- [ ] Test database connection
- [ ] Test email sending
- [ ] Test file upload to S3

## 🚨 Security Best Practices

1. **Never commit `.env` file** to git
2. **Use AWS Secrets Manager** for production credentials
3. **Enable MFA** on AWS root account
4. **Rotate access keys** regularly
5. **Use least privilege** IAM policies
6. **Enable CloudTrail** for audit logs
7. **Use VPC** for private networking
8. **Enable encryption** everywhere

## Next Steps

After AWS setup:
1. Run database migrations: `npm run migrate`
2. Start backend: `npm start`
3. Test API endpoints
4. Deploy to production
