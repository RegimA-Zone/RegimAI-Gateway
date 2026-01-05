// MOSES Treatment Optimization Lab - Infrastructure Template
// Meta-Optimizing Semantic Evolutionary Search for dermatology treatment patterns
// Integrates with SkinTwin cognitive architecture for treatment discovery

// ------------------
//    PARAMETERS
// ------------------

@description('SKU for the API Management service')
param apimSku string = 'StandardV2'

@description('Configuration for OpenAI cognitive services')
param openAIConfig array = []

@description('OpenAI model configuration for pattern mining')
param openAIModelName string = 'gpt-4-turbo'
param openAIModelVersion string = '2024-04-09'
param openAIModelSKU string = 'GlobalStandard'
param openAIDeploymentName string = 'moses-optimizer'
param openAIAPIVersion string = '2024-02-01'

@description('MOSES algorithm configuration')
param mosesConfig object = {
  population_size: 1000
  max_generations: 100
  tournament_size: 7
  crossover_rate: 0.8
  mutation_rate: 0.1
  fitness_function: 'clinical_efficacy'
  optimization_target: 'treatment_outcome'
  medical_constraints_enabled: true
}

@description('Treatment optimization domains')
param treatmentDomains array = [
  'acne_vulgaris'
  'psoriasis'
  'eczema'
  'rosacea'
  'melasma'
  'seborrheic_dermatitis'
  'alopecia'
  'hyperpigmentation'
]

@description('Azure region for deployment')
param location string = resourceGroup().location

@description('Tags for all resources')
param tagValues object = {
  lab: 'moses-treatment-optimization'
  cognitive_architecture: 'moses'
  medical_domain: 'dermatology'
  optimization_type: 'evolutionary_search'
}

// ------------------
//    VARIABLES
// ------------------

var resourceSuffix = uniqueString(subscription().id, resourceGroup().id)
var apiManagementName = 'apim-moses-${resourceSuffix}'
var mosesAPIName = 'moses-optimization-api'
var treatmentAPIName = 'treatment-patterns-api'

// Load MOSES optimization policy
var policyXml = loadTextContent('moses-policy.xml')
var updatedPolicyXml = replace(policyXml, '{backend-id}', (length(openAIConfig) > 1) ? 'openai-backend-pool' : openAIConfig[0].name)

// ------------------
//    RESOURCES
// ------------------

// 1. Log Analytics Workspace for optimization metrics
module lawModule '../../modules/operational-insights/v1/workspaces.bicep' = {
  name: 'lawModule'
  params: {
    tags: tagValues
  }
}

var lawId = lawModule.outputs.id

// 2. Application Insights with MOSES optimization dashboard
module appInsightsModule '../../modules/monitor/v1/appinsights.bicep' = {
  name: 'appInsightsModule'
  params: {
    workbookJson: loadTextContent('moses-analytics-workbook.json')
    lawId: lawId
    customMetricsOptedInType: 'WithDimensions'
    tags: tagValues
  }
}

var appInsightsId = appInsightsModule.outputs.id
var appInsightsInstrumentationKey = appInsightsModule.outputs.instrumentationKey

// 3. API Management with MOSES cognitive support
module apimModule '../../modules/apim/v1/apim.bicep' = {
  name: 'apimModule'
  params: {
    apimSku: apimSku
    appInsightsInstrumentationKey: appInsightsInstrumentationKey
    appInsightsId: appInsightsId
    tags: union(tagValues, {
      cognitive_features: 'moses,evolutionary_search,pattern_mining'
    })
  }
}

// 4. OpenAI for pattern evaluation and fitness scoring
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
      optimization_enabled: 'true'
    })
  }
}

// 5. MOSES Optimization API
resource mosesAPI 'Microsoft.ApiManagement/service/apis@2024-06-01-preview' = {
  name: mosesAPIName
  parent: apimModule.outputs.service
  properties: {
    apiType: 'http'
    description: 'MOSES Meta-Optimizing Semantic Evolutionary Search API for treatment pattern discovery'
    displayName: 'MOSES Optimization API'
    path: 'cognitive/moses'
    protocols: ['https']
    subscriptionRequired: true
    subscriptionKeyParameterNames: {
      header: 'X-MOSES-Key'
      query: 'moses-key'
    }
  }
}

// 6. MOSES Operations
resource optimizeOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'optimize-treatment'
  parent: mosesAPI
  properties: {
    displayName: 'Optimize Treatment Protocol'
    method: 'POST'
    urlTemplate: '/optimize'
    description: 'Run MOSES optimization to discover optimal treatment patterns'
    request: {
      representations: [
        {
          contentType: 'application/json'
          examples: {
            default: {
              value: {
                condition: 'acne_vulgaris'
                patient_profile: {
                  age: 25
                  skin_type: 'oily'
                  severity: 'moderate'
                  previous_treatments: ['benzoyl_peroxide', 'salicylic_acid']
                }
                constraints: {
                  avoid_ingredients: ['retinoids']
                  max_products: 4
                  budget_range: 'moderate'
                }
                optimization_goals: ['reduce_inflammation', 'prevent_scarring', 'minimize_side_effects']
              }
            }
          }
        }
      ]
    }
    responses: [
      {
        statusCode: 200
        description: 'Optimized treatment protocol'
      }
    ]
  }
}

resource evaluateOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'evaluate-protocol'
  parent: mosesAPI
  properties: {
    displayName: 'Evaluate Treatment Protocol'
    method: 'POST'
    urlTemplate: '/evaluate'
    description: 'Evaluate fitness of a treatment protocol using clinical evidence'
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
        description: 'Protocol evaluation results with fitness scores'
      }
    ]
  }
}

resource evolveOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'evolve-generation'
  parent: mosesAPI
  properties: {
    displayName: 'Evolve Population Generation'
    method: 'POST'
    urlTemplate: '/evolve'
    description: 'Perform evolutionary step on treatment population'
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
        description: 'Next generation of treatment candidates'
      }
    ]
  }
}

resource patternMiningOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'mine-patterns'
  parent: mosesAPI
  properties: {
    displayName: 'Mine Treatment Patterns'
    method: 'POST'
    urlTemplate: '/patterns/mine'
    description: 'Extract successful treatment patterns from historical data'
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
        description: 'Discovered treatment patterns with confidence scores'
      }
    ]
  }
}

// 7. Treatment Patterns API for pattern storage and retrieval
resource treatmentPatternsAPI 'Microsoft.ApiManagement/service/apis@2024-06-01-preview' = {
  name: treatmentAPIName
  parent: apimModule.outputs.service
  properties: {
    apiType: 'http'
    description: 'Treatment pattern storage and retrieval API'
    displayName: 'Treatment Patterns API'
    path: 'cognitive/patterns'
    protocols: ['https']
    subscriptionRequired: true
  }
}

// 8. MOSES optimization policy
resource mosesPolicy 'Microsoft.ApiManagement/service/apis/policies@2021-12-01-preview' = {
  name: 'policy'
  parent: mosesAPI
  properties: {
    format: 'rawxml'
    value: updatedPolicyXml
  }
}

// 9. Cosmos DB for pattern storage
resource patternCosmosDB 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'cosmos-moses-${resourceSuffix}'
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

// 10. Pattern database
resource patternDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  name: 'treatment-patterns'
  parent: patternCosmosDB
  properties: {
    resource: {
      id: 'treatment-patterns'
    }
  }
}

// 11. Patterns container
resource patternsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: 'patterns'
  parent: patternDatabase
  properties: {
    resource: {
      id: 'patterns'
      partitionKey: {
        paths: ['/condition']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
      }
    }
  }
}

// 12. Generations container for evolutionary history
resource generationsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: 'generations'
  parent: patternDatabase
  properties: {
    resource: {
      id: 'generations'
      partitionKey: {
        paths: ['/optimizationId']
        kind: 'Hash'
      }
      defaultTtl: 2592000 // 30 days retention
    }
  }
}

// 13. Redis Cache for population caching during optimization
resource mosesCache 'Microsoft.Cache/redis@2023-08-01' = {
  name: 'redis-moses-${resourceSuffix}'
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

// ------------------
//    OUTPUTS
// ------------------

output apimServiceName string = apimModule.outputs.serviceName
output apimGatewayUrl string = apimModule.outputs.gatewayUrl
output mosesAPIUrl string = '${apimModule.outputs.gatewayUrl}/cognitive/moses'
output patternsAPIUrl string = '${apimModule.outputs.gatewayUrl}/cognitive/patterns'
output cosmosDBAccount string = patternCosmosDB.name
output redisCacheName string = mosesCache.name
output mosesConfig object = mosesConfig
output supportedConditions array = treatmentDomains
