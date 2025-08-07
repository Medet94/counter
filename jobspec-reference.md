# JobSpec Reference Guide

## Overview

JobSpecs are the fundamental building blocks of the Phoenix Builds system. They are complete, self-contained specifications that describe how to execute data processing and transformation jobs. This document provides a comprehensive reference for all JobSpec types, including **enhanced transformation capabilities** planned for Phase 2 implementation with TQL expressions, ML-powered analytics, and sophisticated data processing functions.

## JobSpec Anatomy

### Unified JobSpec Structure

All JobSpecs follow a unified envelope format that supports 4 execution flows. Builds Service acts as an intelligent dispatcher, routing jobs to appropriate execution engines based on `jobType`:

```json
{
  // Unified JobSpec Envelope
  "jobId": "unique-job-id",
  "jobType": "DATA_CONNECTION_SYNC|PIPELINE_TRANSFORM|OBJECT_TYPE_BUILD|ML_TRANSFORM",
  "name": "Human-readable name",
  "description": "Detailed description",
  
  // Context
  "projectId": "project-id", 
  "createdBy": "user-id",
  "createdAt": "2025-01-01T10:00:00Z",
  
  // Job-Specific Payload (varies by jobType)
  "payload": {
    // Contents depend on jobType - see specific sections below
  },
  
  // Execution Settings (shared across all job types)
  "executionConfig": {
    "resourceProfile": "SMALL|MEDIUM|LARGE|XLARGE|CUSTOM",
    "timeout": "PT30M",
    "priority": "LOW|NORMAL|HIGH|CRITICAL",
    "retryPolicy": {
      "maxAttempts": 3,
      "backoffStrategy": "LINEAR|EXPONENTIAL"
    }
  },
  
  // Additional metadata
  "metadata": {}
}
```

### Unified JobSpec Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `jobId` | string | Yes | Unique identifier for the JobSpec |
| `jobType` | enum | Yes | Execution flow: DATA_CONNECTION_SYNC, PIPELINE_TRANSFORM, OBJECT_TYPE_BUILD, ML_TRANSFORM |
| `name` | string | Yes | Human-readable name |
| `description` | string | No | Detailed description |
| `projectId` | string | Yes | Phoenix project context |
| `createdBy` | string | Yes | User/service that created the JobSpec |
| `createdAt` | datetime | Yes | Creation timestamp |
| `payload` | object | Yes | Job-specific configuration (structure varies by jobType) |
| `executionConfig` | object | No | Shared execution parameters across all job types |
| `metadata` | object | No | Additional metadata and tags |

### Job Type Routing

Builds Service routes JobSpecs to appropriate execution engines:

| JobType | Created By | Purpose | Executor | Payload Structure |
|---------|------------|---------|----------|-------------------|
| `DATA_CONNECTION_SYNC` | Data Connection App | Data movement | DataMicron Connector SDK | sourceConnector, destinationConnector, loadTables |
| `PIPELINE_TRANSFORM` | Pipeline Builder App | Data transformations | EZData spark-runtime (Scala) | EZData task contracts with TQL/JSON |
| `OBJECT_TYPE_BUILD` | KB-Store system | Phoenix landed → DataWarehouse | DataMicron Connector SDK | Phoenix-specific movement contracts |
| `ML_TRANSFORM` | ML Service App | Machine learning analytics | Foresight ML engine | Foresight ML algorithm contracts |

## Enhanced Transformation Capabilities (Phase 2)

### TQL Expression Integration - Coming in Phase 2

The Phoenix Builds Service **will support** **TQL (Transformation Query Language) expressions** for advanced data processing, machine learning, and analytics operations in Phase 2 implementation (Weeks 7-12). TQL expressions will provide 100+ functions for complex transformations that go far beyond basic SQL operations.

> **📋 Current Status**: MVP Phase (Weeks 1-6) supports basic SQL transforms only. TQL integration is planned for Phase 2 (Weeks 7-12).

#### TQL Transformation Schema (Phase 2)

```json
{
  "transformation": {
    "enabled": true,
    "type": "tql_transform",  // Phase 2 feature
    "basicTransforms": [
      // Backward compatible basic SQL transforms
      {
        "sourceColumn": "customer_name",
        "transform": "TRIM(UPPER(customer_name))"
      }
    ],
    "tqlExpressions": [
      // Advanced TQL expressions for sophisticated transformations
      "DERIVE value: mavg(sales, 30) as: 'sales_30d_avg';",
      "DERIVE value: detect_outliers(transaction_amount, 'zscore') as: 'spending_anomaly';",
      "DERIVE value: jaro_winkler(customer_name, canonical_name) > 0.85 ? 'duplicate' : 'unique' as: 'duplicate_flag';"
    ]
  }
}
```

### TQL Function Categories

**Advanced Analytics (Foresight-Powered)**:
- **Time Series**: `mavg()`, `forecast()`, `seasonality()`, `trend()`
- **Statistical**: `percentile()`, `zscore()`, `iqr()`, `correlation()`
- **ML Functions**: `detect_outliers()`, `cluster()`, `classify()`

**Geospatial Analysis**:
- **Distance**: `haversine()`, `euclidean()`, `manhattan()`
- **Spatial**: `within_radius()`, spatial clustering

**Fuzzy Matching**:
- **String Similarity**: `jaro_winkler()`, `levenshtein()`, `cosine_similarity()`
- **Phonetic**: `soundex()`, `metaphone()`
- **Matching**: `fuzzy_match()`, `best_match()`

**Enhanced Data Quality**:
- **Validation**: `valid()`, `mismatched()`, enhanced type checking
- **Completeness**: Advanced null handling and data scoring

### TQL Expression Examples

#### Customer Analytics
```json
{
  "tqlExpressions": [
    "DERIVE value: cluster([recency, frequency, monetary], 5, 'kmeans') as: 'customer_segment';",
    "DERIVE value: forecast(monthly_spend, 6, 'arima') as: 'predicted_spend';",
    "DERIVE value: datediff(today(), last_purchase, 'day') as: 'days_since_purchase';"
  ]
}
```

#### Data Quality Enhancement
```json
{
  "tqlExpressions": [
    "DERIVE value: detect_outliers(transaction_amount, 'iqr') as: 'amount_outlier';",
    "DERIVE value: jaro_winkler(address, canonical_address) as: 'address_similarity';",
    "DERIVE value: valid(email, 'Email') && !empty(email) ? 'valid' : 'invalid' as: 'email_quality';"
  ]
}
```

#### Geospatial Analysis
```json
{
  "tqlExpressions": [
    "DERIVE value: haversine(customer_lat, customer_lon, store_lat, store_lon) as: 'distance_to_store';",
    "DERIVE value: within_radius(lat, lon, warehouse_lat, warehouse_lon, 25) ? 'local' : 'regional' as: 'delivery_zone';"
  ]
}
```

### Backward Compatibility

**All existing JobSpecs continue to work unchanged**:
- Basic SQL transforms in `basicTransforms` array
- Existing `transformation.type: "direct_copy"` patterns
- All current column mapping syntax

**Enhanced capabilities planned for Phase 2**:
- Add `tqlExpressions` array for advanced transformations (Phase 2)
- Use `transformation.type: "tql_transform"` for enhanced processing (Phase 2)
- Combine basic and TQL transforms in the same JobSpec (Phase 2)

## JobSpec Types

### 1. DATA_CONNECTION_SYNC

**Purpose**: Data movement from external sources to Phoenix using DataMicron Connector SDK.  
**Created By**: Data Connection App  
**Executor**: DataMicron Connector SDK  
**Payload Structure**: DataLoader.Core contracts with sourceConnector, destinationConnector, and loadTables.

> **📋 Complete Examples**: For detailed application-specific JobSpec examples, see the [Implementation Guide - Section 10.5](phoenix-builds-implementation-guide.md#105-jobspec-examples-by-application)

#### Complete Example

```json
{
  "jobId": "sync-postgres-customers-20250101",
  "jobType": "DATA_CONNECTION_SYNC",
  "name": "Daily Customer Data Sync",
  "description": "Import customer data from production PostgreSQL database",
  "projectId": "proj-analytics-prod",
  "createdBy": "user-john-doe",
  "createdAt": "2025-01-01T10:00:00Z",
  
  "payload": {
    "sourceConnector": {
      "type": "PostgreSQL",
      "connectionString": "Host=postgres-prod.company.com;Database=sales;Username=readonly_user;Password=secure_password",
      "query": "SELECT customer_id, email, created_date, revenue FROM customers WHERE updated_at > @incrementalValue AND status = 'active'",
      "incremental": {
        "enabled": true,
        "column": "updated_at",
        "lastValue": "2024-12-31T00:00:00Z"
      }
    },
    
    "destinationConnector": {
      "type": "Phoenix",
      "connectionString": "DATABASE=s3a://phoenix-data/analytics/customers/{TABLE}.parquet;SparkMaster=local[4];UseS3Storage=true;S3Endpoint=http://minio:9000;S3AccessKey=minioadmin;S3SecretKey=minioadmin123;S3BucketName=phoenix-data",
      "tableName": "customers_raw",
      "writeMode": "append",
      "partitionColumns": ["import_date"]
    },
    
    "loadTables": [
      {
        "name": "customers",
        "type": "Table",
        "staticLoadType": "Incremental",
        "topRows": 0,
        "isReplaceExistingData": false,
        "whereCondition": "status = 'active'",
        "destinationUploadType": "Append"
      }
    ],
    
    "sparkConfiguration": {
      "master": "local[4]",
      "appName": "Phoenix-CustomerSync",
      "driverMemory": "2g",
      "executorMemory": "4g",
      "executorCores": 2
    }
  },
  
  "executionConfig": {
    "resourceProfile": "MEDIUM",
    "timeout": "PT30M",
    "priority": "NORMAL",
    "retryPolicy": {
      "maxAttempts": 3,
      "backoffStrategy": "LINEAR"
    }
  },
  
  "metadata": {
    "source": "production_database",
    "owner": "analytics_team",
    "sla": "daily_sync_before_9am"
  }
}
```

#### Key Features for DATA_CONNECTION_SYNC

- **Direct RDBMS Integration**: Uses DataMicron database connectors (PostgreSQL, MySQL, SQL Server, etc.)
- **Incremental Processing**: Supports timestamp-based incremental loads
- **Spark Processing**: Phoenix connector manages internal Spark sessions for Parquet operations
- **S3 Storage**: Direct write to MinIO/S3-compatible storage via Phoenix connector
- **Configurable Performance**: Adjustable batch sizes, memory settings, and parallelism

### 2. PIPELINE_TRANSFORM

**Purpose**: Data transformations (single/multi-table) using EZData spark-runtime.  
**Created By**: Pipeline Builder App  
**Executor**: EZData spark-runtime (Scala)  
**Payload Structure**: EZData task contracts with TQL scripts or JSON specifications.

#### Complete Example

```json
{
  "jobId": "transform-sales-aggregation-20250101",
  "jobType": "PIPELINE_TRANSFORM",
  "name": "Advanced Sales Analytics Pipeline",
  "description": "Multi-table transformations with TQL and aggregations",
  "projectId": "proj-analytics-prod",
  "createdBy": "pipeline-builder-service",
  "createdAt": "2025-01-01T10:00:00Z",
  
  "payload": {
    "datasets": [
      {
        "id": null,
        "name": "sales-raw",
        "alias": "sales",
        "scripts": [
          "DERIVE value: mavg(amount, 30) as: 'amount_30d_avg';",
          "DERIVE value: detect_outliers(amount, 'zscore') as: 'amount_outlier';"
        ],
        "schema": {
          "columnNames": ["sale_id", "product_id", "amount", "date", "region"],
          "columns": [
            {"name": "sale_id", "type": "String", "not_null": true},
            {"name": "amount", "type": "Double", "not_null": true}
          ]
        },
        "datasource": {
          "connector": {
            "type": "parquet",
            "values": [
              {"key": "defaultFilePath", "value": "s3a://phoenix-data/sales/raw"}
            ]
          }
        }
      }
    ],
    "output": {
      "destinationDatasources": [{
        "connector": {
          "type": "parquet",
          "values": [
            {"key": "header", "value": "true"},
            {"key": "outputPath", "value": "s3a://phoenix-data/sales/analytics"}
          ]
        }
      }]
    }
  },
  
  "executionConfig": {
    "resourceProfile": "ML_ENABLED",
    "timeout": "PT2H",
    "priority": "HIGH",
    "sparkConfig": {
      "spark.sql.adaptive.enabled": "true",
      "spark.sql.adaptive.coalescePartitions.enabled": "true"
    }
  },
  
  "metadata": {
    "source": "pipeline-builder-service",
    "transformationType": "multi-table-analytics",
    "tags": ["tql", "ml-analytics", "sales"]
  }
}
```

#### Key Features for PIPELINE_TRANSFORM

- **EZData Integration**: Uses inherited EZData spark-runtime (Scala) for execution
- **TQL Support**: Single-table transformations with TQL expressions and Foresight ML functions
- **Multi-Table Operations**: JSON-based specifications for joins, unions, and aggregations
- **Advanced Analytics**: ML-powered forecasting, anomaly detection, and statistical analysis

### 3. OBJECT_TYPE_BUILD

**Purpose**: Move data from Phoenix landed dataset to Phoenix DataWarehouse (MSSQL).  
**Created By**: KB-Store system  
**Executor**: DataMicron Connector SDK (specialized for Phoenix→MSSQL)  
**Payload Structure**: Phoenix-specific data movement contracts.

#### Complete Example

```json
{
  "jobId": "build-customer-objects-20250101",
  "jobType": "OBJECT_TYPE_BUILD",
  "name": "Enhanced Customer Object Build with ML Analytics",
  "description": "Materialize customer objects with advanced data quality and predictive analytics",
  "projectId": "proj-analytics-prod",
  "createdBy": "data-funnel-service",
  "createdAt": "2025-01-01T10:00:00Z",
  
  "payload": {
    "sourceConnector": {
      "type": "Phoenix",
      "connectionString": "DATABASE=s3a://phoenix-data/landed/customers/{TABLE}.parquet;SparkMaster=local[4]",
      "tableName": "customers_landed",
      "query": "SELECT * FROM customers_landed WHERE processed_flag = false"
    },
    
    "destinationConnector": {
      "type": "MSSQL",
      "connectionString": "Server=phoenix-datawarehouse.company.com;Database=Phoenix_DW;Integrated Security=true",
      "tableName": "tbl_customer_enhanced",
      "writeMode": "append",
      "schema": "Schema_ontology_sales"
    },
    
    "loadTables": [
      {
        "name": "tbl_customer_enhanced",
        "type": "ObjectTable",
        "staticLoadType": "Full",
        "topRows": 0,
        "isReplaceExistingData": false,
        "whereCondition": "processed_flag = false",
        "destinationUploadType": "Append"
      }
    ],
  
    "phoenixMigrationSpec": {
      "objectTypeId": "ot-customer-enhanced",
      "ontologyId": "ontology-sales",
      "objectTypeName": "EnhancedCustomer",
      "nameProperty": "clean_customer_name",
      
      "columnMappings": [
        {
          "sourceColumn": "customer_id",
          "destinationColumn": "customer_id",
          "dataType": "varchar(50)",
          "isPrimaryKey": true
        },
        {
          "sourceColumn": "customer_name",
          "destinationColumn": "customer_name",
          "dataType": "nvarchar(255)",
          "transform": "TRIM(INITCAP(customer_name))"
        },
        {
          "sourceColumn": "email",
          "destinationColumn": "email",
          "dataType": "varchar(320)",
          "transform": "LOWER(email)"
        },
        {
          "sourceColumn": "revenue",
          "destinationColumn": "total_revenue",
          "dataType": "decimal(18,2)",
          "defaultValue": 0
        }
      ],
      
      "filterConditions": [
        "customer_id IS NOT NULL",
        "processed_flag = false"
      ]
    }
  },
  
  "executionConfig": {
    "resourceProfile": "MEDIUM",
    "timeout": "PT1H",
    "priority": "HIGH",
    "sqlExecutionConfig": {
      "commandTimeout": 600,
      "bulkCopyTimeout": 1200,
      "transactionIsolationLevel": "READ_COMMITTED"
    }
  },
  
  "metadata": {
    "source": "kb-store-system",
    "migrationType": "phoenix-to-datawarehouse",
    "tags": ["object-build", "datawarehouse", "mssql"]
  }
}
```

#### Key Features for OBJECT_TYPE_BUILD

- **Phoenix Integration**: Specialized for Phoenix landed dataset → DataWarehouse migration
- **MSSQL Destination**: Direct integration with Phoenix DataWarehouse (MSSQL)
- **Object Materialization**: Converts Phoenix datasets into structured SQL tables
- **KB-Store Automation**: Automatically triggered by KB-Store system processes

### 4. ML_TRANSFORM

**Purpose**: Machine learning algorithms and advanced analytics using Foresight ML engine.  
**Created By**: ML Service App  
**Executor**: Foresight ML engine  
**Payload Structure**: Foresight ML algorithm contracts with models and training data.

#### Complete Example

```json
{
  "jobId": "ml-customer-segmentation-20250101",
  "jobType": "ML_TRANSFORM",
  "name": "Customer Segmentation ML Pipeline",
  "description": "Advanced customer segmentation using clustering and predictive analytics",
  "projectId": "proj-ml-analytics",
  "createdBy": "ml-service-app",
  "createdAt": "2025-01-01T10:00:00Z",
  
  "payload": {
    "datasets": [
      {
        "id": "customers-features",
        "name": "customer-behavioral-features",
        "datasource": {
          "connector": {
            "type": "parquet",
            "values": [
              {"key": "defaultFilePath", "value": "s3a://phoenix-data/ml/features/customers"}
            ]
          }
        },
        "schema": {
          "columnNames": ["customer_id", "recency", "frequency", "monetary", "tenure", "engagement_score"],
          "columns": [
            {"name": "customer_id", "type": "String", "not_null": true},
            {"name": "recency", "type": "Double", "not_null": true},
            {"name": "frequency", "type": "Double", "not_null": true},
            {"name": "monetary", "type": "Double", "not_null": true}
          ]
        }
      }
    ],
    
    "mlAlgorithms": [
      {
        "algorithmType": "CLUSTERING",
        "algorithm": "kmeans",
        "parameters": {
          "k": 5,
          "features": ["recency", "frequency", "monetary"],
          "maxIterations": 100,
          "tolerance": 0.001
        },
        "outputColumn": "customer_segment"
      },
      {
        "algorithmType": "REGRESSION",
        "algorithm": "linear_regression",
        "parameters": {
          "targetColumn": "monetary",
          "features": ["frequency", "tenure", "engagement_score"],
          "regularization": "ridge",
          "alpha": 0.1
        },
        "outputColumn": "predicted_ltv"
      },
      {
        "algorithmType": "CLASSIFICATION",
        "algorithm": "random_forest",
        "parameters": {
          "targetColumn": "churn_risk",
          "features": ["recency", "frequency", "engagement_score"],
          "numTrees": 100,
          "maxDepth": 10
        },
        "outputColumn": "churn_probability"
      }
    ],
    
    "output": {
      "destinationDatasources": [{
        "connector": {
          "type": "parquet",
          "values": [
            {"key": "outputPath", "value": "s3a://phoenix-data/ml/results/customer-analytics"}
          ]
        },
        "writeOptions": [
          {"key": "partitionBy", "value": "customer_segment"},
          {"key": "merge", "value": "true"},
          {"key": "overwrite", "value": "true"}
        ]
      }]
    }
  },
  
  "executionConfig": {
    "resourceProfile": "GPU_ACCELERATED",
    "timeout": "PT4H",
    "priority": "HIGH",
    "foresightConfig": {
      "enableGPU": true,
      "parallelAlgorithms": true,
      "cacheFeatures": true,
      "modelValidation": {
        "crossValidation": 5,
        "testSplit": 0.2
      }
    }
  },
  
  "metadata": {
    "source": "ml-service-app",
    "mlPipelineType": "customer-analytics",
    "algorithms": ["kmeans", "linear_regression", "random_forest"],
    "tags": ["ml", "segmentation", "predictive-analytics"]
  }
}
```

#### Key Features for ML_TRANSFORM

- **Foresight Integration**: Uses Foresight ML engine with 24+ algorithms
- **Multi-Algorithm Support**: Clustering, regression, classification, and statistical analysis
- **Advanced Analytics**: Time series forecasting, anomaly detection, and predictive modeling
- **GPU Acceleration**: Supports GPU-accelerated processing for complex ML workloads

## InputSpec Reference

### Structure

```json
{
  "datasetId": "dataset-identifier",
  "view": "latest | snapshot-2025-01-01 | 2025-01-01T10:00:00Z",
  "branch": "master",
  "fallbackBranch": "main",
  "columns": ["col1", "col2"],
  "filter": "status = 'active'",
  "validation": {
    "requireNonEmpty": true,
    "maxStaleness": "PT24H",
    "minRowCount": 1000
  }
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `datasetId` | string | Yes | Dataset identifier |
| `view` | string | No | Dataset version to use (default: "latest") |
| `branch` | string | No | Dataset branch (default: "master") |
| `fallbackBranch` | string | No | Branch to use if primary unavailable |
| `columns` | array | No | Specific columns to read |
| `filter` | string | No | SQL WHERE clause to filter rows |
| `validation` | object | No | Input validation rules |

## OutputSpec Reference

### Dataset Output

```json
{
  "type": "DATASET",
  "datasetId": "dataset-identifier",
  "transactionType": "SNAPSHOT | APPEND | UPDATE | DELETE",
  "format": "PARQUET | CSV | JSON | AVRO",
  "partitionBy": ["date", "region"],
  "bucketBy": {
    "numBuckets": 10,
    "columns": ["customer_id"]
  },
  "sortBy": ["timestamp"],
  "compaction": {
    "enabled": true,
    "targetFileSize": "128MB",
    "minFiles": 5
  },
  "schema": {
    "enforceSchema": true,
    "evolutionPolicy": "STRICT | LENIENT",
    "columns": []
  }
}
```

### Object Table Output

```json
{
  "type": "OBJECT_TABLE",
  "schema": "database_schema",
  "tableName": "table_name",
  "transactionType": "SNAPSHOT | APPEND | UPDATE",
  "indexes": [],
  "constraints": [],
  "partitioning": {
    "type": "RANGE | LIST | HASH",
    "columns": ["date"],
    "values": ["2025-01-01", "2025-02-01"]
  }
}
```

### External System Output

```json
{
  "type": "EXTERNAL_SYSTEM",
  "connectionId": "connection-identifier",
  "format": "CSV | JSON | XML | PARQUET",
  "destination": {
    "type": "FILE | TABLE | QUEUE | API",
    "path": "/path/to/destination",
    "options": {}
  }
}
```

## ExecutionConfig Reference

### Common Configuration

```json
{
  "resourceProfile": "SMALL | MEDIUM | LARGE | XLARGE | CUSTOM",
  "timeout": "PT30M",  // ISO 8601 duration
  "priority": "LOW | NORMAL | HIGH | CRITICAL",
  "retryPolicy": {
    "maxAttempts": 3,
    "backoffStrategy": "LINEAR | EXPONENTIAL | FIBONACCI",
    "initialDelay": "PT30S",
    "maxDelay": "PT5M"
  },
  "notifications": {
    "onSuccess": ["email:success@example.com"],
    "onFailure": ["email:alerts@example.com", "slack:#alerts"],
    "onStart": [],
    "onComplete": []
  }
}
```

### Resource Profiles

| Profile | CPU | Memory | Executors | Use Case |
|---------|-----|--------|-----------|----------|
| SMALL | 2 | 4GB | 2 | Small datasets (<1GB) |
| MEDIUM | 4 | 8GB | 4 | Medium datasets (1-10GB) |
| LARGE | 8 | 16GB | 8 | Large datasets (10-100GB) |
| XLARGE | 16 | 32GB | 16 | Very large datasets (>100GB) |

**Phase 2 Resource Profiles (Available)**:
| ML_ENABLED | 8 | 16GB | 8 | TQL with basic ML functions |
| ADVANCED_ANALYTICS | 12 | 32GB | 12 | Complex TQL + Foresight ML |
| GPU_ACCELERATED | 16 | 64GB | 16 | Foresight ML algorithms and deep learning |

### Custom Resource Configuration

```json
{
  "resourceProfile": "CUSTOM",
  "resources": {
    "driver": {
      "cpu": "4",
      "memory": "8g"
    },
    "executor": {
      "cpu": "2",
      "memory": "4g",
      "instances": 10
    },
    "dynamicAllocation": {
      "enabled": true,
      "minExecutors": 2,
      "maxExecutors": 20
    }
  }
}
```

## Transaction Types

### SNAPSHOT
- Completely replaces the target dataset/table
- All existing data is removed
- New data becomes the entire content
- Use for: Full refreshes, dimension tables

### APPEND
- Adds new data to existing content
- No existing data is modified or removed
- New files/rows are added
- Use for: Event logs, time-series data

### UPDATE
- Modifies existing data based on keys
- Can add new rows and update existing ones
- Requires key columns for matching
- Use for: Incremental updates, CDC patterns

### DELETE
- Removes data based on conditions
- Can be logical (mark as deleted) or physical
- Requires delete conditions
- Use for: Data cleanup, GDPR compliance

## TQL Expression Validation

### TQL Syntax Rules

1. **Expression Format**: All TQL expressions must follow the pattern `DERIVE value: function_call as: 'column_name';`
2. **Function Validation**: TQL functions are validated against the comprehensive function registry
3. **Type Safety**: Column types are validated for compatibility with TQL functions
4. **Dependency Resolution**: TQL expressions are executed in dependency order
5. **Error Handling**: Invalid TQL expressions result in JobSpec validation failures

### Supported TQL Function Categories

- **Core Functions** (100+ functions): String manipulation, date operations, mathematical functions
- **Advanced Analytics** (29 Foresight-powered): Time series, statistical analysis, ML functions
- **Data Quality**: Validation, cleansing, and completeness functions
- **Geospatial**: Distance calculations and spatial analysis
- **Fuzzy Matching**: String similarity and phonetic matching

### TQL Expression Validation Rules

```json
{
  "tqlValidation": {
    "maxExpressions": 50,
    "allowedFunctions": "all|basic|advanced",
    "requireValidColumns": true,
    "validateTypes": true,
    "allowMLFunctions": true
  }
}
```

## Best Practices

### JobSpec Design

1. **Idempotency**: Design JobSpecs to be safely re-runnable
2. **Atomicity**: Ensure all-or-nothing execution semantics
3. **Validation**: Include comprehensive input validation
4. **Error Handling**: Define clear error handling strategies
5. **Resource Efficiency**: Right-size resource allocations
6. **TQL Optimization**: Use appropriate resource profiles for TQL complexity

### Naming Conventions

```
Format: {type}-{description}-{timestamp}
Examples:
- sync-customers-daily-20250101
- transform-sales-aggregation-20250101
- build-product-objects-20250101
- export-reports-monthly-20250101
```

### Metadata Standards

Always include:
- Source system/service that created the JobSpec
- Business context and tags
- Related schedule or trigger information
- Version information for transforms

### Performance Guidelines

1. **Batch Sizing**: 
   - Basic Syncs: 10,000-50,000 records per batch
   - TQL Transforms: 5,000-25,000 records (higher memory usage)
   - ML-Heavy TQL: 1,000-10,000 records (complex computations)
   - Exports: Consider destination system limits

2. **Parallelism**:
   - CPU-bound: 2x CPU cores
   - TQL Basic: 1.5x CPU cores (function overhead)
   - TQL ML-Heavy: 1x CPU cores (memory intensive)
   - I/O-bound: 4x CPU cores
   - Network-bound: Based on bandwidth

3. **Memory Management**:
   - Basic operations: Reserve 10% for overhead
   - TQL expressions: Reserve 25% for function execution
   - ML algorithms: Reserve 40% for model computation
   - Consider data skew in calculations
   - Use adaptive query execution

4. **TQL-Specific Optimizations (Phase 2)**:
   - Group similar TQL functions for batch execution
   - Use ML_ENABLED+ resource profiles for Foresight functions
   - Consider GPU_ACCELERATED for complex ML workloads
   - Cache intermediate results for repeated function calls

## Troubleshooting

### Common Issues

1. **Schema Mismatch**
   - Symptom: "Column not found" errors
   - Solution: Verify column mappings and data types

2. **Resource Exhaustion**
   - Symptom: Out of memory errors
   - Solution: Increase resource profile or optimize query

3. **Dependency Failures**
   - Symptom: Jobs stuck in WAITING state
   - Solution: Check upstream dataset freshness

4. **Connection Timeouts**
   - Symptom: Sync jobs failing after specific duration
   - Solution: Adjust timeout settings and fetch sizes

### Debugging JobSpecs

1. Enable debug logging in executionConfig
2. Use smaller data samples for testing
3. Validate JobSpec JSON against schema
4. Check input dataset availability and freshness
5. Verify output destination permissions

## Migration Guide

### From Legacy Job Definitions

| Legacy Field | JobSpec Field | Notes |
|--------------|---------------|-------|
| `jobType` | `type` | Enum values changed |
| `inputs` | `inputSpecs` | More structured format |
| `outputs` | `outputSpecs` | Supports multiple outputs |
| `config` | `executionConfig` | Standardized structure |
| `transform` | `transformationSpec` | Type-specific structure |

### Version Compatibility

- JobSpec v1: Phoenix 1.0 - 1.5
- JobSpec v2: Phoenix 2.0+ (current)
- Backwards compatibility maintained via adapters
- Version specified in metadata.jobspecVersion