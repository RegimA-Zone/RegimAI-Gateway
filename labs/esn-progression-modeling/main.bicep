// ESN Progression Modeling Lab - Infrastructure Template
// Echo State Networks for temporal skin condition progression prediction
// Integrates with SkinTwin cognitive architecture for disease trajectory modeling

// ------------------
//    PARAMETERS
// ------------------

@description('SKU for the API Management service')
param apimSku string = 'StandardV2'

@description('Configuration for OpenAI cognitive services')
param openAIConfig array = []

@description('OpenAI model configuration for progression analysis')
param openAIModelName string = 'gpt-4-turbo'
param openAIModelVersion string = '2024-04-09'
param openAIModelSKU string = 'GlobalStandard'
param openAIDeploymentName string = 'esn-predictor'
param openAIAPIVersion string = '2024-02-01'

@description('ESN architecture configuration')
param esnConfig object = {
  reservoir_size: 500
  spectral_radius: 0.95
  input_scaling: 0.5
  leaking_rate: 0.3
  regularization: 1e-6
  washout_period: 50
  prediction_horizon_days: 90
}

@description('Supported condition trajectories')
param conditionTrajectories array = [
  'acne_severity_progression'
  'psoriasis_flare_cycles'
  'eczema_seasonal_patterns'
  'rosacea_trigger_responses'
  'melasma_sun_exposure_effects'
  'treatment_response_curves'
  'healing_time_prediction'
]

@description('Azure region for deployment')
param location string = resourceGroup().location

@description('Tags for all resources')
param tagValues object = {
  lab: 'esn-progression-modeling'
  cognitive_architecture: 'esn'
  medical_domain: 'dermatology'
  prediction_type: 'temporal'
}

// ------------------
//    VARIABLES
// ------------------

var resourceSuffix = uniqueString(subscription().id, resourceGroup().id)
var apiManagementName = 'apim-esn-${resourceSuffix}'
var esnAPIName = 'esn-prediction-api'
var timeseriesAPIName = 'timeseries-api'

// Load ESN policy
var policyXml = loadTextContent('esn-policy.xml')
var updatedPolicyXml = replace(policyXml, '{backend-id}', (length(openAIConfig) > 1) ? 'openai-backend-pool' : openAIConfig[0].name)

// ------------------
//    RESOURCES
// ------------------

// 1. Log Analytics for temporal analytics
module lawModule '../../modules/operational-insights/v1/workspaces.bicep' = {
  name: 'lawModule'
  params: {
    tags: tagValues
  }
}

var lawId = lawModule.outputs.id

// 2. Application Insights with prediction metrics
module appInsightsModule '../../modules/monitor/v1/appinsights.bicep' = {
  name: 'appInsightsModule'
  params: {
    workbookJson: loadTextContent('esn-analytics-workbook.json')
    lawId: lawId
    customMetricsOptedInType: 'WithDimensions'
    tags: tagValues
  }
}

var appInsightsId = appInsightsModule.outputs.id
var appInsightsInstrumentationKey = appInsightsModule.outputs.instrumentationKey

// 3. API Management with ESN support
module apimModule '../../modules/apim/v1/apim.bicep' = {
  name: 'apimModule'
  params: {
    apimSku: apimSku
    appInsightsInstrumentationKey: appInsightsInstrumentationKey
    appInsightsId: appInsightsId
    tags: union(tagValues, {
      cognitive_features: 'esn,temporal_prediction,progression_modeling'
    })
  }
}

// 4. OpenAI for progression analysis augmentation
module openAIModule '../../modules/cognitive-services/v1/openai.bicep' = if(length(openAIConfig) > 0) {
  name: 'openAIModule'
  params: {
    openAIConfig: openAIConfig
    openAIDeploymentName: openAIDeploymentName
    openAIModelName: openAIModelName
    openAIModelVersion: openAIModelVersion
    openAIModelSKU: openAIModelSKU
    apimPrincipalId: apimModule.outputs.principalId
    lawId: lawId
    tags: union(tagValues, {
      temporal_modeling: 'enabled'
    })
  }
}

// 5. ESN Prediction API
resource esnAPI 'Microsoft.ApiManagement/service/apis@2024-06-01-preview' = {
  name: esnAPIName
  parent: apimModule.outputs.service
  properties: {
    apiType: 'http'
    description: 'Echo State Network API for temporal skin condition progression prediction'
    displayName: 'ESN Progression Prediction API'
    path: 'cognitive/esn'
    protocols: ['https']
    subscriptionRequired: true
    subscriptionKeyParameterNames: {
      header: 'X-ESN-Key'
      query: 'esn-key'
    }
  }
}

// 6. ESN Operations
resource predictOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'predict-progression'
  parent: esnAPI
  properties: {
    displayName: 'Predict Condition Progression'
    method: 'POST'
    urlTemplate: '/predict'
    description: 'Predict future progression of skin condition based on historical data'
    request: {
      representations: [
        {
          contentType: 'application/json'
          examples: {
            default: {
              value: {
                condition: 'acne_vulgaris'
                patient_id: 'patient-123'
                historical_data: [
                  { date: '2024-01-01', severity: 0.7, treatment_active: true }
                  { date: '2024-01-15', severity: 0.6, treatment_active: true }
                  { date: '2024-02-01', severity: 0.5, treatment_active: true }
                ]
                prediction_horizon_days: 30
                include_confidence_intervals: true
              }
            }
          }
        }
      ]
    }
    responses: [
      {
        statusCode: 200
        description: 'Progression prediction with confidence intervals'
      }
    ]
  }
}

resource analyzePatternOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'analyze-patterns'
  parent: esnAPI
  properties: {
    displayName: 'Analyze Temporal Patterns'
    method: 'POST'
    urlTemplate: '/patterns/analyze'
    description: 'Analyze recurring patterns in condition history (flares, cycles, triggers)'
    request: {
      representations: [
        {
          contentType: 'application/json'
        }
      ]
    }
    responses: [
      {
        statusCode: 200
        description: 'Identified temporal patterns with periodicity analysis'
      }
    ]
  }
}

resource treatmentResponseOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'predict-treatment-response'
  parent: esnAPI
  properties: {
    displayName: 'Predict Treatment Response'
    method: 'POST'
    urlTemplate: '/treatment/response'
    description: 'Predict patient response to treatment over time'
    request: {
      representations: [
        {
          contentType: 'application/json'
        }
      ]
    }
    responses: [
      {
        statusCode: 200
        description: 'Predicted treatment response trajectory'
      }
    ]
  }
}

resource healingTimeOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'estimate-healing-time'
  parent: esnAPI
  properties: {
    displayName: 'Estimate Healing Time'
    method: 'POST'
    urlTemplate: '/healing/estimate'
    description: 'Estimate time to healing based on current trajectory'
    request: {
      representations: [
        {
          contentType: 'application/json'
        }
      ]
    }
    responses: [
      {
        statusCode: 200
        description: 'Estimated healing timeline with milestones'
      }
    ]
  }
}

// 7. Time Series Data API
resource timeseriesAPI 'Microsoft.ApiManagement/service/apis@2024-06-01-preview' = {
  name: timeseriesAPIName
  parent: apimModule.outputs.service
  properties: {
    apiType: 'http'
    description: 'Time series data management for progression modeling'
    displayName: 'Time Series API'
    path: 'cognitive/timeseries'
    protocols: ['https']
    subscriptionRequired: true
  }
}

// 8. ESN prediction policy
resource esnPolicy 'Microsoft.ApiManagement/service/apis/policies@2021-12-01-preview' = {
  name: 'policy'
  parent: esnAPI
  properties: {
    format: 'rawxml'
    value: updatedPolicyXml
  }
}

// 9. Time Series Insights for temporal data storage
resource timeSeriesInsights 'Microsoft.TimeSeriesInsights/environments@2020-05-15' = {
  name: 'tsi-esn-${resourceSuffix}'
  location: location
  tags: tagValues
  sku: {
    name: 'L1'
    capacity: 1
  }
  kind: 'Gen2'
  properties: {
    storageConfiguration: {
      accountName: temporalStorage.name
      managementKey: temporalStorage.listKeys().keys[0].value
    }
    timeSeriesIdProperties: [
      {
        name: 'patientId'
        type: 'String'
      }
      {
        name: 'conditionType'
        type: 'String'
      }
    ]
    warmStoreConfiguration: {
      dataRetention: 'P31D'
    }
  }
}

// 10. Storage for temporal data
resource temporalStorage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'sttemporal${resourceSuffix}'
  location: location
  tags: tagValues
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        blob: {
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
  }
}

// 11. Cosmos DB for progression history
resource progressionCosmosDB 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'cosmos-esn-${resourceSuffix}'
  location: location
  tags: tagValues
  properties: {
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
  }
}

// 12. Progression database
resource progressionDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  name: 'progression-history'
  parent: progressionCosmosDB
  properties: {
    resource: {
      id: 'progression-history'
    }
  }
}

// 13. Patient progression container
resource progressionContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: 'patient-progression'
  parent: progressionDatabase
  properties: {
    resource: {
      id: 'patient-progression'
      partitionKey: {
        paths: ['/patientId']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
        compositeIndexes: [
          [
            { path: '/patientId', order: 'ascending' }
            { path: '/timestamp', order: 'descending' }
          ]
        ]
      }
      defaultTtl: -1  // No expiration for medical records
    }
  }
}

// 14. Prediction cache container
resource predictionCacheContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: 'prediction-cache'
  parent: progressionDatabase
  properties: {
    resource: {
      id: 'prediction-cache'
      partitionKey: {
        paths: ['/predictionId']
        kind: 'Hash'
      }
      defaultTtl: 86400  // 24 hour cache
    }
  }
}

// ------------------
//    OUTPUTS
// ------------------

output apimServiceName string = apimModule.outputs.serviceName
output apimGatewayUrl string = apimModule.outputs.gatewayUrl
output esnAPIUrl string = '${apimModule.outputs.gatewayUrl}/cognitive/esn'
output timeseriesAPIUrl string = '${apimModule.outputs.gatewayUrl}/cognitive/timeseries'
output timeSeriesInsightsName string = timeSeriesInsights.name
output cosmosDBAccount string = progressionCosmosDB.name
output esnConfig object = esnConfig
output supportedTrajectories array = conditionTrajectories
