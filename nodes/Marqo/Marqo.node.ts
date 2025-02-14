import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';

export class Marqo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Marqo',
    name: 'marqo',
    icon: 'file:Marqo.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Marqo API',
    defaults: {
      name: 'Marqo',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'marqoApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Document',
            value: 'document',
          },
          {
            name: 'Index',
            value: 'index',
          },
        ],
        default: 'document',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: [
              'document',
            ],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a document',
            action: 'Create a document',
          },
          {
            name: 'Delete',
            value: 'delete',
            description: 'Delete a document',
            action: 'Delete a document',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a document',
            action: 'Get a document',
          },
          {
            name: 'Search',
            value: 'search',
            description: 'Search for documents',
            action: 'Search for documents',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Update a document',
            action: 'Update a document',
          },
        ],
        default: 'search',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: [
              'index',
            ],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create an index',
            action: 'Create an index',
          },
          {
            name: 'Delete',
            value: 'delete',
            description: 'Delete an index',
            action: 'Delete an index',
          },
          {
            name: 'List',
            value: 'list',
            description: 'List all indexes',
            action: 'List all indexes',
          },
        ],
        default: 'list',
      },
      {
        displayName: 'Index Name',
        name: 'indexName',
        type: 'string',
        default: '',
        required: true,
        description: 'Name of the index',
        displayOptions: {
          show: {
            resource: [
              'document',
              'index',
            ],
            operation: [
              'create',
              'delete',
              'get',
              'search',
              'update',
            ],
          },
        },
      },
      {
        displayName: 'Document ID',
        name: 'documentId',
        type: 'string',
        default: '',
        required: true,
        description: 'ID of the document',
        displayOptions: {
          show: {
            resource: [
              'document',
            ],
            operation: [
              'delete',
              'get',
              'update',
            ],
          },
        },
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        required: true,
        description: 'Title of the document',
        displayOptions: {
          show: {
            resource: [
              'document',
            ],
            operation: [
              'create',
              'update',
            ],
          },
        },
      },
      {
        displayName: 'Content',
        name: 'content',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        required: true,
        description: 'Content of the document',
        displayOptions: {
          show: {
            resource: [
              'document',
            ],
            operation: [
              'create',
              'update',
            ],
          },
        },
      },
      {
        displayName: 'Page Number',
        name: 'pageNumber',
        type: 'number',
        default: 1,
        required: false,
        description: 'Page number of the document (optional)',
        displayOptions: {
          show: {
            resource: [
              'document',
            ],
            operation: [
              'create',
              'update',
            ],
          },
        },
      },
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        required: true,
        description: 'Query to search for documents',
        displayOptions: {
          show: {
            resource: [
              'document',
            ],
            operation: [
              'search',
            ],
          },
        },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'document',
            ],
            operation: [
              'search',
            ],
          },
        },
        options: [
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            default: 10,
            description: 'Maximum number of results to return',
          },
          {
            displayName: 'Filter',
            name: 'filter',
            type: 'json',
            default: '{}',
            description: 'Filter to apply to the search (as JSON)',
          },
          {
            displayName: 'Attributes to Retrieve',
            name: 'attributesToRetrieve',
            type: 'string',
            default: '',
            description: 'Comma-separated list of attributes to retrieve',
          },
        ],
      },
      {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        default: 'hf/e5-base-v2',
        required: true,
        description: 'The model to use for vectorizing content',
        displayOptions: {
          show: {
            resource: [
              'index',
            ],
            operation: [
              'create',
            ],
          },
        },
        options: [
          { name: 'Marqo Stella EN 400M v5', value: 'Marqo/dunzhang-stella_en_400M_v5' },
          { name: 'MiniLM L6 v1', value: 'sentence-transformers/all-MiniLM-L6-v1' },
          { name: 'MiniLM L6 v2', value: 'sentence-transformers/all-MiniLM-L6-v2' },
          { name: 'MiniLM L12 v2', value: 'sentence-transformers/all-MiniLM-L12-v2' },
          { name: 'MPNet Base v1', value: 'sentence-transformers/all-mpnet-base-v1' },
          { name: 'MPNet Base v2', value: 'sentence-transformers/all-mpnet-base-v2' },
          { name: 'STSB XLM R Multilingual', value: 'sentence-transformers/stsb-xlm-r-multilingual' },
          { name: 'E5 Small', value: 'hf/e5-small' },
          { name: 'E5 Base', value: 'hf/e5-base' },
          { name: 'E5 Large', value: 'hf/e5-large' },
          { name: 'E5 Small v2', value: 'hf/e5-small-v2' },
          { name: 'E5 Base v2', value: 'hf/e5-base-v2' },
          { name: 'E5 Large v2', value: 'hf/e5-large-v2' },
          { name: 'BGE Small EN v1.5', value: 'hf/bge-small-en-v1.5' },
          { name: 'BGE Base EN v1.5', value: 'hf/bge-base-en-v1.5' },
          { name: 'BGE Large EN v1.5', value: 'hf/bge-large-en-v1.5' },
          { name: 'Multilingual E5 Small', value: 'hf/multilingual-e5-small' },
          { name: 'Multilingual E5 Base', value: 'hf/multilingual-e5-base' },
          { name: 'Multilingual E5 Large', value: 'hf/multilingual-e5-large' },
          { name: 'GIST Large Embedding v0', value: 'hf/GIST-large-Embedding-v0' },
          { name: 'Snowflake Arctic Embed M', value: 'hf/snowflake-arctic-embed-m' },
          { name: 'Snowflake Arctic Embed L', value: 'hf/snowflake-arctic-embed-l' },
          { name: 'Ember v1', value: 'hf/ember-v1' },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    const credentials = await this.getCredentials('marqoApi');

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'document') {
          if (operation === 'create' || operation === 'update') {
            const indexName = this.getNodeParameter('indexName', i) as string;
            const title = this.getNodeParameter('title', i) as string;
            const content = this.getNodeParameter('content', i) as string;
            const pageNumber = this.getNodeParameter('pageNumber', i) as number;
            
            const document = {
              title,
              content,
              page_number: pageNumber,
            };
            
            const tensorFields = ['title', 'content'];
            
            const endpoint = `${credentials.url}/indexes/${indexName}/documents`;
            const options: OptionsWithUri = {
              method: operation === 'create' ? 'POST' : 'PUT',
              uri: endpoint,
              body: {
                documents: [document],
                tensorFields: tensorFields,
              },
              json: true,
            };
            
            if (operation === 'update') {
              const documentId = this.getNodeParameter('documentId', i) as string;
              options.uri += `/${documentId}`;
              options.body = document;
            }
            
            const response = await this.helpers.request(options);
            returnData.push({ json: response });
          } else if (operation === 'delete') {
            const indexName = this.getNodeParameter('indexName', i) as string;
            const documentId = this.getNodeParameter('documentId', i) as string;
            const endpoint = `${credentials.url}/indexes/${indexName}/documents/${documentId}`;
            const options: OptionsWithUri = {
              method: 'DELETE',
              uri: endpoint,
              json: true,
            };
            const response = await this.helpers.request(options);
            returnData.push({ json: response });
          } else if (operation === 'get') {
            const indexName = this.getNodeParameter('indexName', i) as string;
            const documentId = this.getNodeParameter('documentId', i) as string;
            const endpoint = `${credentials.url}/indexes/${indexName}/documents/${documentId}`;
            const options: OptionsWithUri = {
              method: 'GET',
              uri: endpoint,
              json: true,
            };
            const response = await this.helpers.request(options);
            returnData.push({ json: response });
          } else if (operation === 'search') {
            const indexName = this.getNodeParameter('indexName', i) as string;
            const searchQuery = this.getNodeParameter('searchQuery', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i) as {
              limit?: number;
              filter?: string;
              attributesToRetrieve?: string;
            };
            const endpoint = `${credentials.url}/indexes/${indexName}/search`;
            const body: any = { q: searchQuery };
            if (additionalFields.limit) body.limit = additionalFields.limit;
            if (additionalFields.filter) body.filter = JSON.parse(additionalFields.filter);
            if (additionalFields.attributesToRetrieve) body.attributes_to_retrieve = additionalFields.attributesToRetrieve.split(',');
            const options: OptionsWithUri = {
              method: 'POST',
              uri: endpoint,
              body,
              json: true,
            };
            const response = await this.helpers.request(options);
            returnData.push({ json: response });
          }
        } else if (resource === 'index') {
          if (operation === 'create') {
            const indexName = this.getNodeParameter('indexName', i) as string;
            const model = this.getNodeParameter('model', i) as string;
            
            const endpoint = `${credentials.url}/indexes/${indexName}`;
            const options: OptionsWithUri = {
              method: 'POST',
              uri: endpoint,
              body: {
                model: model,
              },
              json: true,
            };
            
            const response = await this.helpers.request(options);
            returnData.push({ json: response });
          } else if (operation === 'delete') {
            const indexName = this.getNodeParameter('indexName', i) as string;
            const endpoint = `${credentials.url}/indexes/${indexName}`;
            const options: OptionsWithUri = {
              method: 'DELETE',
              uri: endpoint,
              json: true,
            };
            const response = await this.helpers.request(options);
            returnData.push({ json: response });
          } else if (operation === 'list') {
            const endpoint = `${credentials.url}/indexes`;
            const options: OptionsWithUri = {
              method: 'GET',
              uri: endpoint,
              json: true,
            };
            const response = await this.helpers.request(options);
            returnData.push({ json: response });
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw new NodeOperationError(this.getNode(), `Error: ${error.message}`);
      }
    }

    return [returnData];
  }
}