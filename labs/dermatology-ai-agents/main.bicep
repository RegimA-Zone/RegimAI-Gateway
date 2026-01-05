// Dermatology AI Agents Lab - Infrastructure Template
// Specialized AI agents for skincare consultation and clinical dermatology assistance
// Integrates with SkinTwin cognitive architecture

// ------------------
//    PARAMETERS
// ------------------

@description('SKU for the API Management service')
param apimSku string = 'StandardV2'

@description('Configuration for OpenAI cognitive services')
param openAIConfig array = []

@description('OpenAI model configuration for agents')
param openAIModelName string = 'gpt-4-turbo'
param openAIModelVersion string = '2024-04-09'
param openAIModelSKU string = 'GlobalStandard'
param openAIDeploymentName string = 'dermatology-agent'
param openAIAPIVersion string = '2024-02-01'

@description('Agent configuration')
param agentConfig object = {
  skincare_consultant: {
    enabled: true
    max_conversation_turns: 20
    knowledge_domains: ['skincare', 'ingredients', 'routines', 'skin_types']
    safety_level: 'consumer'
  }
  clinical_assistant: {
    enabled: true
    max_conversation_turns: 30
    knowledge_domains: ['dermatology', 'diagnosis', 'treatment', 'pharmacology']
    safety_level: 'professional'
    requires_credentials: true
  }
  product_advisor: {
    enabled: true
    max_conversation_turns: 15
    knowledge_domains: ['products', 'ingredients', 'formulations']
    safety_level: 'consumer'
  }
}

@description('Azure region for deployment')
param location string = resourceGroup().location

@description('Tags for all resources')
param tagValues object = {
  lab: 'dermatology-ai-agents'
  cognitive_architecture: 'skintwin'
  medical_domain: 'dermatology'
  agent_framework: 'openai'
}

// ------------------
//    VARIABLES
// ------------------

var resourceSuffix = uniqueString(subscription().id, resourceGroup().id)
var apiManagementName = 'apim-derm-agents-${resourceSuffix}'
var agentsAPIName = 'dermatology-agents-api'

// Load agent policy
var policyXml = loadTextContent('agents-policy.xml')
var updatedPolicyXml = replace(policyXml, '{backend-id}', (length(openAIConfig) > 1) ? 'openai-backend-pool' : openAIConfig[0].name)

// ------------------
//    RESOURCES
// ------------------

// 1. Log Analytics for agent monitoring
module lawModule '../../modules/operational-insights/v1/workspaces.bicep' = {
  name: 'lawModule'
  params: {
    tags: tagValues
  }
}

var lawId = lawModule.outputs.id

// 2. Application Insights with agent metrics
module appInsightsModule '../../modules/monitor/v1/appinsights.bicep' = {
  name: 'appInsightsModule'
  params: {
    workbookJson: loadTextContent('agents-analytics-workbook.json')
    lawId: lawId
    customMetricsOptedInType: 'WithDimensions'
    tags: tagValues
  }
}

var appInsightsId = appInsightsModule.outputs.id
var appInsightsInstrumentationKey = appInsightsModule.outputs.instrumentationKey

// 3. API Management with agent support
module apimModule '../../modules/apim/v1/apim.bicep' = {
  name: 'apimModule'
  params: {
    apimSku: apimSku
    appInsightsInstrumentationKey: appInsightsInstrumentationKey
    appInsightsId: appInsightsId
    tags: union(tagValues, {
      agent_types: 'skincare_consultant,clinical_assistant,product_advisor'
    })
  }
}

// 4. OpenAI for agent reasoning
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
      agent_enabled: 'true'
    })
  }
}

// 5. Dermatology Agents API
resource agentsAPI 'Microsoft.ApiManagement/service/apis@2024-06-01-preview' = {
  name: agentsAPIName
  parent: apimModule.outputs.service
  properties: {
    apiType: 'http'
    description: 'Dermatology AI Agents API for skincare consultation and clinical assistance'
    displayName: 'Dermatology AI Agents'
    path: 'agents'
    protocols: ['https']
    subscriptionRequired: true
    subscriptionKeyParameterNames: {
      header: 'X-Agent-Key'
      query: 'agent-key'
    }
  }
}

// 6. Skincare Consultant Agent Operations
resource skincareConsultOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'skincare-consultant-chat'
  parent: agentsAPI
  properties: {
    displayName: 'Chat with Skincare Consultant'
    method: 'POST'
    urlTemplate: '/skincare-consultant/chat'
    description: 'Interact with the AI skincare consultant for personalized skincare advice'
    request: {
      representations: [
        {
          contentType: 'application/json'
          examples: {
            default: {
              value: {
                session_id: 'session-123'
                message: 'What skincare routine would you recommend for oily, acne-prone skin?'
                context: {
                  skin_type: 'oily'
                  concerns: ['acne', 'enlarged_pores']
                  age_range: '20-30'
                }
              }
            }
          }
        }
      ]
    }
    responses: [
      {
        statusCode: 200
        description: 'Agent response with skincare recommendations'
      }
    ]
  }
}

resource skincareAnalyzeOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'skincare-consultant-analyze'
  parent: agentsAPI
  properties: {
    displayName: 'Analyze Skincare Routine'
    method: 'POST'
    urlTemplate: '/skincare-consultant/analyze-routine'
    description: 'Analyze an existing skincare routine and provide optimization suggestions'
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
        description: 'Routine analysis with improvement suggestions'
      }
    ]
  }
}

// 7. Clinical Dermatology Assistant Operations
resource clinicalChatOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'clinical-assistant-chat'
  parent: agentsAPI
  properties: {
    displayName: 'Chat with Clinical Dermatology Assistant'
    method: 'POST'
    urlTemplate: '/clinical-assistant/chat'
    description: 'Clinical decision support for healthcare professionals (requires credentials)'
    request: {
      representations: [
        {
          contentType: 'application/json'
          examples: {
            default: {
              value: {
                session_id: 'clinical-session-456'
                message: 'Patient presents with erythematous papules and pustules on the face. What differential diagnoses should I consider?'
                clinical_context: {
                  patient_age: 28
                  patient_sex: 'female'
                  duration: '3 months'
                  location: 'face, predominantly cheeks and chin'
                }
              }
            }
          }
        }
      ]
    }
    responses: [
      {
        statusCode: 200
        description: 'Clinical guidance with differential diagnoses and treatment considerations'
      }
    ]
  }
}

resource clinicalDifferentialOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'clinical-assistant-differential'
  parent: agentsAPI
  properties: {
    displayName: 'Generate Differential Diagnosis'
    method: 'POST'
    urlTemplate: '/clinical-assistant/differential'
    description: 'Generate differential diagnosis based on clinical presentation'
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
        description: 'Differential diagnoses ranked by likelihood'
      }
    ]
  }
}

resource clinicalTreatmentOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'clinical-assistant-treatment'
  parent: agentsAPI
  properties: {
    displayName: 'Get Treatment Recommendations'
    method: 'POST'
    urlTemplate: '/clinical-assistant/treatment'
    description: 'Evidence-based treatment recommendations for diagnosed conditions'
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
        description: 'Treatment recommendations with evidence grades'
      }
    ]
  }
}

// 8. Product Advisor Operations
resource productAdvisorOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'product-advisor-recommend'
  parent: agentsAPI
  properties: {
    displayName: 'Get Product Recommendations'
    method: 'POST'
    urlTemplate: '/product-advisor/recommend'
    description: 'Get personalized skincare product recommendations'
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
        description: 'Personalized product recommendations'
      }
    ]
  }
}

resource ingredientAnalysisOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'product-advisor-ingredients'
  parent: agentsAPI
  properties: {
    displayName: 'Analyze Product Ingredients'
    method: 'POST'
    urlTemplate: '/product-advisor/analyze-ingredients'
    description: 'Analyze skincare product ingredients for compatibility and efficacy'
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
        description: 'Ingredient analysis with compatibility assessment'
      }
    ]
  }
}

// 9. Agent session management
resource sessionCreateOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'session-create'
  parent: agentsAPI
  properties: {
    displayName: 'Create Agent Session'
    method: 'POST'
    urlTemplate: '/sessions'
    description: 'Create a new conversation session with an agent'
    request: {
      representations: [
        {
          contentType: 'application/json'
        }
      ]
    }
    responses: [
      {
        statusCode: 201
        description: 'Session created successfully'
      }
    ]
  }
}

resource sessionGetOperation 'Microsoft.ApiManagement/service/apis/operations@2024-06-01-preview' = {
  name: 'session-get'
  parent: agentsAPI
  properties: {
    displayName: 'Get Session History'
    method: 'GET'
    urlTemplate: '/sessions/{sessionId}'
    description: 'Retrieve conversation history for a session'
    templateParameters: [
      {
        name: 'sessionId'
        type: 'string'
        required: true
      }
    ]
    responses: [
      {
        statusCode: 200
        description: 'Session conversation history'
      }
    ]
  }
}

// 10. Agents policy
resource agentsPolicy 'Microsoft.ApiManagement/service/apis/policies@2021-12-01-preview' = {
  name: 'policy'
  parent: agentsAPI
  properties: {
    format: 'rawxml'
    value: updatedPolicyXml
  }
}

// 11. Cosmos DB for conversation history
resource agentCosmosDB 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'cosmos-agents-${resourceSuffix}'
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

// 12. Agent conversations database
resource agentDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  name: 'agent-conversations'
  parent: agentCosmosDB
  properties: {
    resource: {
      id: 'agent-conversations'
    }
  }
}

// 13. Sessions container
resource sessionsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: 'sessions'
  parent: agentDatabase
  properties: {
    resource: {
      id: 'sessions'
      partitionKey: {
        paths: ['/userId']
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
      defaultTtl: 604800  // 7 day session retention
    }
  }
}

// 14. Redis for agent response caching
resource agentCache 'Microsoft.Cache/redis@2023-08-01' = {
  name: 'redis-agents-${resourceSuffix}'
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
output agentsAPIUrl string = '${apimModule.outputs.gatewayUrl}/agents'
output skincareConsultantUrl string = '${apimModule.outputs.gatewayUrl}/agents/skincare-consultant'
output clinicalAssistantUrl string = '${apimModule.outputs.gatewayUrl}/agents/clinical-assistant'
output productAdvisorUrl string = '${apimModule.outputs.gatewayUrl}/agents/product-advisor'
output cosmosDBAccount string = agentCosmosDB.name
output redisCacheName string = agentCache.name
output agentConfig object = agentConfig
