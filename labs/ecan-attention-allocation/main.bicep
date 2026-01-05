// ECAN Attention Allocation Lab - Infrastructure Template
// Economic Attention Network for cognitive resource optimization
// Manages attention distribution across SkinTwin cognitive components

// ------------------
//    PARAMETERS
// ------------------

@description('SKU for the API Management service')
param apimSku string = 'StandardV2'

@description('Configuration for OpenAI services')
param openAIConfig array = []

@description('ECAN configuration')
param ecanConfig object = {
  attention_budget: 1000
  spreading_rate: 0.3
  decay_rate: 0.1
  importance_threshold: 0.5
  sti_cap: 100  // Short-term importance cap
  lti_cap: 50   // Long-term importance cap
  hebbian_learning_rate: 0.05
}

@description('Cognitive component weights')
param componentWeights object = {
  atomspace: 0.25
  pln_reasoning: 0.30
  moses_optimization: 0.20
  esn_prediction: 0.15
  agent_responses: 0.10
}

@description('Azure region for deployment')
param location string = resourceGroup().location

@description('Tags for all resources')
param tagValues object = {
  lab: 'ecan-attention-allocation'
  cognitive_architecture: 'ecan'
  medical_domain: 'dermatology'
  resource_management: 'attention'
}

// ------------------
//    VARIABLES
// ------------------

var resourceSuffix = uniqueString(subscription().id, resourceGroup().id)
var ecanAPIName = 'ecan-attention-api'

// ------------------
//    RESOURCES
// ------------------

// 1. Log Analytics for attention metrics
module lawModule '../../modules/operational-insights/v1/workspaces.bicep' = {
  name: 'lawModule'
  params: {
    tags: tagValues
  }
}

var lawId = lawModule.outputs.id

// 2. Application Insights with attention dashboard
module appInsightsModule '../../modules/monitor/v1/appinsights.bicep' = {
  name: 'appInsightsModule'
  params: {
    workbookJson: loadTextContent('ecan-analytics-workbook.json')
    lawId: lawId
    customMetricsOptedInType: 'WithDimensions'
    tags: tagValues
  }
}

var appInsightsId = appInsightsModule.outputs.id
var appInsightsInstrumentationKey = appInsightsModule.outputs.instrumentationKey

// 3. API Management with ECAN support
module apimModule '../../modules/apim/v1/apim.bicep' = {
  name: 'apimModule'
  params: {
    apimSku: apimSku
    appInsightsInstrumentationKey: appInsightsInstrumentationKey
    appInsightsId: appInsightsId
    tags: union(tagValues, {
      cognitive_features: 'ecan,attention_management,resource_allocation'
    })
  }
}

// 4. ECAN Attention API
resource ecanAPI 'Microsoft.ApiManagement/service/apis@2024-06-01-preview' = {
  name: ecanAPIName
  parent: apimModule.outputs.service
  properties: {
    apiType: 'http'
    description: 'ECAN Attention Allocation API for cognitive resource management'
    displayName: 'ECAN Attention API'
    path: 'cognitive/ecan'
    protocols: ['https']
    subscriptionRequired: true
    subscriptionKeyParameterNames: {
      header: 'X-ECAN-Key'
      query: 'ecan-key'
    }
  }
}

// 5. ECAN Operations
resource allocateAttentionOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'allocate-attention'
  parent: ecanAPI
  properties: {
    displayName: 'Allocate Attention'
    method: 'POST'
    urlTemplate: '/allocate'
    description: 'Allocate attention budget across cognitive components'
    request: {
      representations: [
        {
          contentType: 'application/json'
          examples: {
            default: {
              value: {
                request_context: {
                  query_type: 'clinical_diagnosis'
                  complexity: 'high'
                  urgency: 'normal'
                }
                components: ['atomspace', 'pln_reasoning', 'moses_optimization']
                budget_limit: 500
              }
            }
          }
        }
      ]
    }
    responses: [
      {
        statusCode: 200
        description: 'Attention allocation results'
      }
    ]
  }
}

resource getStatusOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'get-attention-status'
  parent: ecanAPI
  properties: {
    displayName: 'Get Attention Status'
    method: 'GET'
    urlTemplate: '/status'
    description: 'Get current attention allocation status across all components'
    responses: [
      {
        statusCode: 200
        description: 'Current attention distribution'
      }
    ]
  }
}

resource stimulateOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'stimulate-atom'
  parent: ecanAPI
  properties: {
    displayName: 'Stimulate Atom'
    method: 'POST'
    urlTemplate: '/stimulate'
    description: 'Increase attention value for a specific knowledge atom'
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
        description: 'Updated atom attention values'
      }
    ]
  }
}

resource spreadingOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'spread-attention'
  parent: ecanAPI
  properties: {
    displayName: 'Spread Attention'
    method: 'POST'
    urlTemplate: '/spread'
    description: 'Trigger attention spreading across connected atoms'
    responses: [
      {
        statusCode: 200
        description: 'Attention spreading results'
      }
    ]
  }
}

resource hebbianUpdateOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'hebbian-update'
  parent: ecanAPI
  properties: {
    displayName: 'Hebbian Learning Update'
    method: 'POST'
    urlTemplate: '/hebbian'
    description: 'Apply Hebbian learning to strengthen attention connections'
    responses: [
      {
        statusCode: 200
        description: 'Updated connection weights'
      }
    ]
  }
}

// 6. ECAN policy
resource ecanPolicy 'Microsoft.ApiManagement/service/apis/policies@2021-12-01-preview' = {
  name: 'policy'
  parent: ecanAPI
  properties: {
    format: 'rawxml'
    value: loadTextContent('ecan-policy.xml')
  }
}

// 7. Redis for attention state caching
resource ecanCache 'Microsoft.Cache/redis@2023-08-01' = {
  name: 'redis-ecan-${resourceSuffix}'
  location: location
  tags: tagValues
  properties: {
    sku: {
      name: 'Basic'
      family: 'C'
      capacity: 1
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    redisConfiguration: {
      'maxmemory-policy': 'allkeys-lru'
    }
  }
}

// 8. Cosmos DB for attention history
resource ecanCosmosDB 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'cosmos-ecan-${resourceSuffix}'
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

// 9. Attention history database
resource attentionDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  name: 'attention-history'
  parent: ecanCosmosDB
  properties: {
    resource: {
      id: 'attention-history'
    }
  }
}

// 10. Attention logs container
resource attentionLogsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: 'attention-logs'
  parent: attentionDatabase
  properties: {
    resource: {
      id: 'attention-logs'
      partitionKey: {
        paths: ['/componentId']
        kind: 'Hash'
      }
      defaultTtl: 86400  // 24 hour retention for real-time logs
    }
  }
}

// ------------------
//    OUTPUTS
// ------------------

output apimServiceName string = apimModule.outputs.serviceName
output apimGatewayUrl string = apimModule.outputs.gatewayUrl
output ecanAPIUrl string = '${apimModule.outputs.gatewayUrl}/cognitive/ecan'
output redisCacheName string = ecanCache.name
output cosmosDBAccount string = ecanCosmosDB.name
output ecanConfig object = ecanConfig
output componentWeights object = componentWeights
