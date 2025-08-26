// SkinTwin AtomSpace Integration - Infrastructure Template
// Deploys RegimAI Gateway with cognitive architecture support

// ------------------
//    PARAMETERS
// ------------------

@description('SKU for the API Management service')
param apimSku string = 'StandardV2'

@description('Configuration for OpenAI cognitive services')
param openAIConfig array = []

@description('OpenAI model configuration')
param openAIModelName string = 'gpt-4-turbo'
param openAIModelVersion string = '2024-04-09'
param openAIModelSKU string = 'GlobalStandard'
param openAIDeploymentName string = 'dermatology-model'
param openAIAPIVersion string = '2024-02-01'

@description('Model configuration for AI Foundry')
param modelsConfig array = []

@description('Configuration for APIM subscriptions')
param apimSubscriptionsConfig array = []

@description('SkinTwin cognitive architecture configuration')
param cognitiveConfig object = {
  atomspace_enabled: true
  pln_reasoning: true
  medical_ontology: 'dermatology_v2.0'
  evidence_validation: true
  clinical_compliance: 'HIPAA'
}

@description('Azure region for deployment')
param location string = resourceGroup().location

@description('Tags for all resources')
param tagValues object = {
  lab: 'skintwin-atomspace'
  cognitive_architecture: 'enabled'
  medical_domain: 'dermatology'
}

// ------------------
//    VARIABLES
// ------------------

var resourceSuffix = uniqueString(subscription().id, resourceGroup().id)
var apiManagementName = 'apim-skintwin-${resourceSuffix}'
var cognitiveAPIName = 'cognitive-api'
var atomspaceAPIName = 'atomspace-api'

// Load and customize policy for cognitive integration
var policyXml = loadTextContent('cognitive-policy.xml')
var updatedPolicyXml = replace(policyXml, '{backend-id}', (length(openAIConfig) > 1) ? 'openai-backend-pool' : openAIConfig[0].name)

// ------------------
//    RESOURCES
// ------------------

// 1. Log Analytics Workspace for medical compliance monitoring
module lawModule '../../modules/operational-insights/v1/workspaces.bicep' = {
  name: 'lawModule'
  params: {
    tags: tagValues
  }
}

var lawId = lawModule.outputs.id

// 2. Application Insights with medical-specific dashboard
module appInsightsModule '../../modules/monitor/v1/appinsights.bicep' = {
  name: 'appInsightsModule'
  params: {
    workbookJson: loadTextContent('medical-analytics-workbook.json')
    lawId: lawId
    customMetricsOptedInType: 'WithDimensions'
    tags: tagValues
  }
}

var appInsightsId = appInsightsModule.outputs.id
var appInsightsInstrumentationKey = appInsightsModule.outputs.instrumentationKey

// 3. API Management with cognitive architecture support
module apimModule '../../modules/apim/v1/apim.bicep' = {
  name: 'apimModule'
  params: {
    apimSku: apimSku
    appInsightsInstrumentationKey: appInsightsInstrumentationKey
    appInsightsId: appInsightsId
    tags: union(tagValues, {
      cognitive_features: 'atomspace,pln,moses,esn'
    })
  }
}

// 4. Cognitive Services for medical AI
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
      medical_certified: 'true'
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

// 6. Cognitive API for AtomSpace integration
resource cognitiveAPI 'Microsoft.ApiManagement/service/apis@2024-06-01-preview' = {
  name: cognitiveAPIName
  parent: apimModule.outputs.service
  properties: {
    apiType: 'http'
    description: 'SkinTwin Cognitive Architecture API'
    displayName: 'SkinTwin Cognitive API'
    path: 'cognitive'
    protocols: ['https']
    subscriptionRequired: true
    subscriptionKeyParameterNames: {
      header: 'X-API-Key'
      query: 'cognitive-key'
    }
    format: 'openapi+json'
    value: loadTextContent('cognitive-openapi.json')
  }
}

// 7. AtomSpace API operations
resource atomspaceAPI 'Microsoft.ApiManagement/service/apis@2024-06-01-preview' = {
  name: atomspaceAPIName
  parent: apimModule.outputs.service
  properties: {
    apiType: 'http'
    description: 'AtomSpace Knowledge Representation API'
    displayName: 'AtomSpace API'
    path: 'cognitive/atomspace'
    protocols: ['https']
    subscriptionRequired: true
    subscriptionKeyParameterNames: {
      header: 'X-API-Key'
      query: 'atomspace-key'
    }
    format: 'openapi+json'
    value: loadTextContent('atomspace-openapi.json')
  }
}

// 8. Cognitive architecture policy
resource cognitivePolicy 'Microsoft.ApiManagement/service/apis/policies@2021-12-01-preview' = {
  name: 'policy'
  parent: cognitiveAPI
  properties: {
    format: 'rawxml'
    value: updatedPolicyXml
  }
}

// 9. APIM subscriptions for cognitive access
resource cognitiveSubscriptions 'Microsoft.ApiManagement/service/subscriptions@2024-06-01-preview' = [for (config, i) in apimSubscriptionsConfig: {
  name: config.name
  parent: apimModule.outputs.service
  properties: {
    displayName: config.displayName
    scope: '/apis/${cognitiveAPI.name}'
    state: 'active'
    allowTracing: true
  }
}]

// 10. Medical compliance backend configuration
resource medicalComplianceBackend 'Microsoft.ApiManagement/service/backends@2023-05-01-preview' = {
  name: 'medical-compliance-backend'
  parent: apimModule.outputs.service
  properties: {
    description: 'Medical compliance validation service'
    url: 'https://medical-compliance-${resourceSuffix}.azurewebsites.net'
    protocol: 'http'
    credentials: {
      authorization: {
        scheme: 'header'
        parameter: 'X-Medical-Key'
      }
    }
    properties: {
      medical_domain: 'dermatology'
      compliance_level: 'HIPAA'
      evidence_validation: 'enabled'
    }
  }
}

// 11. Storage account for cognitive data persistence
resource cognitiveStorage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'stcognitive${resourceSuffix}'
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
        file: {
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
  }
}

// 12. Cosmos DB for AtomSpace persistence
resource cognitiveCosmosDB 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'cosmos-skintwin-${resourceSuffix}'
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

// 13. Cosmos DB database for knowledge storage
resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  name: 'skintwin-knowledge'
  parent: cognitiveCosmosDB
  properties: {
    resource: {
      id: 'skintwin-knowledge'
    }
  }
}

// 14. AtomSpace container in Cosmos DB
resource atomspaceContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: 'atomspace'
  parent: cosmosDatabase
  properties: {
    resource: {
      id: 'atomspace'
      partitionKey: {
        paths: ['/atomType']
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
output cognitiveAPIUrl string = '${apimModule.outputs.gatewayUrl}/cognitive'
output atomspaceAPIUrl string = '${apimModule.outputs.gatewayUrl}/cognitive/atomspace'
output cognitiveStorageAccount string = cognitiveStorage.name
output cosmosDBAccount string = cognitiveCosmosDB.name
output cognitiveConfig object = cognitiveConfig

// Subscription keys for access
output subscriptionKeys array = [for (config, i) in apimSubscriptionsConfig: {
  name: config.name
  primaryKey: cognitiveSubscriptions[i].listSecrets().primaryKey
  secondaryKey: cognitiveSubscriptions[i].listSecrets().secondaryKey
}]