// PLN Clinical Reasoning Lab - Infrastructure Template
// Probabilistic Logic Networks for clinical decision support
// Handles medical uncertainty with confidence intervals and evidence-based inference

// ------------------
//    PARAMETERS
// ------------------

@description('SKU for the API Management service')
param apimSku string = 'PremiumV2'

@description('Configuration for OpenAI cognitive services')
param openAIConfig array = []

@description('OpenAI model configuration for clinical reasoning')
param openAIModelName string = 'gpt-4-turbo'
param openAIModelVersion string = '2024-04-09'
param openAIModelSKU string = 'GlobalStandard'
param openAIDeploymentName string = 'clinical-reasoning-model'
param openAIAPIVersion string = '2024-02-01'

@description('Model configuration for AI Foundry')
param modelsConfig array = []

@description('Configuration for APIM subscriptions')
param apimSubscriptionsConfig array = []

@description('PLN reasoning configuration')
param pln_config object = {
  reasoning_engine: 'PLN-4.0'
  inference_modes: ['forward_chaining', 'backward_chaining', 'abduction']
  evidence_integration: true
  uncertainty_handling: 'bayesian'
  clinical_validation: true
  medical_ontology: 'SNOMED-CT'
}

@description('Azure region for deployment')
param location string = resourceGroup().location

@description('Tags for all resources')
param tagValues object = {
  lab: 'pln-clinical-reasoning'
  cognitive_architecture: 'skintwin'
  medical_domain: 'dermatology'
  reasoning_framework: 'pln'
}

// ------------------
//    VARIABLES
// ------------------

var resourceSuffix = uniqueString(subscription().id, resourceGroup().id)
var apiManagementName = 'apim-pln-reasoning-${resourceSuffix}'
var plnAPIName = 'pln-reasoning-api'

// Load PLN reasoning policy
var policyXml = loadTextContent('reasoning-policy.xml')
var updatedPolicyXml = replace(policyXml, '{backend-id}', (length(openAIConfig) > 1) ? 'openai-backend-pool' : openAIConfig[0].name)

// ------------------
//    RESOURCES
// ------------------

// 1. Log Analytics for clinical reasoning monitoring
module lawModule '../../modules/operational-insights/v1/workspaces.bicep' = {
  name: 'lawModule'
  params: {
    tags: tagValues
  }
}

var lawId = lawModule.outputs.id

// 2. Application Insights with reasoning metrics
module appInsightsModule '../../modules/monitor/v1/appinsights.bicep' = {
  name: 'appInsightsModule'
  params: {
    lawId: lawId
    customMetricsOptedInType: 'WithDimensions'
    tags: tagValues
  }
}

var appInsightsId = appInsightsModule.outputs.id
var appInsightsInstrumentationKey = appInsightsModule.outputs.instrumentationKey

// 3. API Management with PLN reasoning support
module apimModule '../../modules/apim/v1/apim.bicep' = {
  name: 'apimModule'
  params: {
    apimSku: apimSku
    appInsightsInstrumentationKey: appInsightsInstrumentationKey
    appInsightsId: appInsightsId
    tags: union(tagValues, {
      reasoning_modes: 'forward_chaining,backward_chaining,abduction'
    })
  }
}

// 4. OpenAI for clinical reasoning backbone
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
      clinical_certified: 'true'
    })
  }
}

// 5. AI Services for inference models
module aiServicesModule '../../modules/cognitive-services/v1/aiservices.bicep' = if(length(modelsConfig) > 0) {
  name: 'aiServicesModule'
  params: {
    modelsConfig: modelsConfig
    apimPrincipalId: apimModule.outputs.principalId
    lawId: lawId
    tags: tagValues
  }
}

// 6. PLN Reasoning API
resource plnAPI 'Microsoft.ApiManagement/service/apis@2024-06-01-preview' = {
  name: plnAPIName
  parent: apimModule.outputs.service
  properties: {
    apiType: 'http'
    description: 'Probabilistic Logic Networks Clinical Reasoning API'
    displayName: 'PLN Clinical Reasoning API'
    path: 'cognitive/reasoning'
    protocols: ['https']
    subscriptionRequired: true
    subscriptionKeyParameterNames: {
      header: 'X-API-Key'
      query: 'reasoning-key'
    }
  }
}

// 7. Clinical reasoning operations
resource performReasoningOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'perform-reasoning'
  parent: plnAPI
  properties: {
    displayName: 'Perform Clinical Reasoning'
    method: 'POST'
    urlTemplate: '/'
    description: 'Perform PLN-based probabilistic clinical reasoning on a clinical scenario'
    request: {
      representations: [
        {
          contentType: 'application/json'
          examples: {
            default: {
              value: {
                scenario: {
                  patient: { age: 16, gender: 'female', skin_type: 'oily' }
                  condition: { diagnosis: 'acne_vulgaris', severity: 'moderate' }
                }
                reasoning_type: 'treatment_selection'
                inference_mode: 'forward_chaining'
                confidence_threshold: 0.7
              }
            }
          }
        }
      ]
    }
    responses: [
      {
        statusCode: 200
        description: 'Clinical reasoning result with confidence measures and evidence'
      }
    ]
  }
}

resource differentialDiagnosisOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'differential-diagnosis'
  parent: plnAPI
  properties: {
    displayName: 'Generate Differential Diagnosis'
    method: 'POST'
    urlTemplate: '/differential'
    description: 'Generate ranked differential diagnoses using abductive PLN reasoning'
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
        description: 'Differential diagnoses ranked by PLN probability scores'
      }
    ]
  }
}

resource treatmentOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'treatment-recommendation'
  parent: plnAPI
  properties: {
    displayName: 'Get Evidence-Based Treatment'
    method: 'POST'
    urlTemplate: '/treatment'
    description: 'Generate evidence-based treatment recommendations with PLN confidence intervals'
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
        description: 'Treatment recommendations with evidence grades and confidence measures'
      }
    ]
  }
}

resource uncertaintyOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'uncertainty-analysis'
  parent: plnAPI
  properties: {
    displayName: 'Analyze Clinical Uncertainty'
    method: 'POST'
    urlTemplate: '/uncertainty'
    description: 'Quantify clinical uncertainty and identify knowledge gaps using PLN'
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
        description: 'Uncertainty quantification with confidence intervals and gap analysis'
      }
    ]
  }
}

resource decisionTreeOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'decision-tree'
  parent: plnAPI
  properties: {
    displayName: 'Generate Clinical Decision Tree'
    method: 'POST'
    urlTemplate: '/decision-tree'
    description: 'Generate interactive clinical decision tree with PLN probability scoring'
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
        description: 'Clinical decision tree with probabilistic branching'
      }
    ]
  }
}

resource monitoringOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'clinical-monitoring'
  parent: plnAPI
  properties: {
    displayName: 'Setup Clinical Monitoring'
    method: 'POST'
    urlTemplate: '/monitoring'
    description: 'Configure PLN-based real-time clinical monitoring with alert thresholds'
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
        description: 'Monitoring configuration with PLN-driven alert rules'
      }
    ]
  }
}

resource knowledgeValidationOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'knowledge-validate'
  parent: plnAPI
  properties: {
    displayName: 'Validate Knowledge Base'
    method: 'GET'
    urlTemplate: '/knowledge/validate'
    description: 'Validate consistency of the PLN clinical knowledge base'
    responses: [
      {
        statusCode: 200
        description: 'Knowledge base validation report with consistency metrics'
      }
    ]
  }
}

resource metricsOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'reasoning-metrics'
  parent: plnAPI
  properties: {
    displayName: 'Get Reasoning Metrics'
    method: 'GET'
    urlTemplate: '/metrics'
    description: 'Retrieve PLN reasoning performance and accuracy metrics'
    responses: [
      {
        statusCode: 200
        description: 'PLN reasoning performance metrics'
      }
    ]
  }
}

// 8. PLN reasoning policy
resource plnPolicy 'Microsoft.ApiManagement/service/apis/policies@2021-12-01-preview' = {
  name: 'policy'
  parent: plnAPI
  properties: {
    format: 'rawxml'
    value: updatedPolicyXml
  }
}

// 9. APIM subscriptions for clinical reasoning access
resource plnSubscriptions 'Microsoft.ApiManagement/service/subscriptions@2024-06-01-preview' = [for (config, i) in apimSubscriptionsConfig: {
  name: config.name
  parent: apimModule.outputs.service
  properties: {
    displayName: config.displayName
    scope: '/apis/${plnAPI.name}'
    state: 'active'
    allowTracing: true
  }
}]

// 10. Cosmos DB for PLN knowledge persistence
resource plnCosmosDB 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'cosmos-pln-${resourceSuffix}'
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

// 11. PLN knowledge database
resource plnDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  name: 'pln-knowledge'
  parent: plnCosmosDB
  properties: {
    resource: {
      id: 'pln-knowledge'
    }
  }
}

// 12. Clinical reasoning rules container
resource reasoningRulesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: 'reasoning-rules'
  parent: plnDatabase
  properties: {
    resource: {
      id: 'reasoning-rules'
      partitionKey: {
        paths: ['/ruleType']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
        excludedPaths: [
          {
            path: '/"_etag"/?'
          }
        ]
      }
    }
  }
}

// ------------------
//    OUTPUTS
// ------------------

output apimServiceName string = apimModule.outputs.serviceName
output apimGatewayUrl string = apimModule.outputs.gatewayUrl
output appInsightsName string = appInsightsModule.outputs.name
output plnAPIUrl string = '${apimModule.outputs.gatewayUrl}/cognitive/reasoning'
output cosmosDBAccount string = plnCosmosDB.name
output plnConfig object = pln_config

// Subscription keys for access
output subscriptionKeys array = [for (config, i) in apimSubscriptionsConfig: {
  name: config.name
  primaryKey: plnSubscriptions[i].listSecrets().primaryKey
  secondaryKey: plnSubscriptions[i].listSecrets().secondaryKey
}]
