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
      icon: 'file:marqo.svg',
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
          displayName: 'Document',
          name: 'document',
          type: 'json',
          default: '',
          required: true,
          description: 'Document to create or update',
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
            if (operation === 'create') {
              const indexName = this.getNodeParameter('indexName', i) as string;
              const document = JSON.parse(this.getNodeParameter('document', i) as string);
              const endpoint = `${credentials.url}/indexes/${indexName}/documents`;
              const options: OptionsWithUri = {
                method: 'POST',
                uri: endpoint,
                body: [document],
                json: true,
              };
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
            } else if (operation === 'search') {
              const indexName = this.getNodeParameter('indexName', i) as string;
              const searchQuery = this.getNodeParameter('searchQuery', i) as string;
              const endpoint = `${credentials.url}/indexes/${indexName}/search`;
              const options: OptionsWithUri = {
                method: 'POST',
                uri: endpoint,
                body: { q: searchQuery },
                json: true,
              };
              const response = await this.helpers.request(options);
              returnData.push({ json: response });
            } else if (operation === 'update') {
              const indexName = this.getNodeParameter('indexName', i) as string;
              const documentId = this.getNodeParameter('documentId', i) as string;
              const document = JSON.parse(this.getNodeParameter('document', i) as string);
              const endpoint = `${credentials.url}/indexes/${indexName}/documents/${documentId}`;
              const options: OptionsWithUri = {
                method: 'PUT',
                uri: endpoint,
                body: document,
                json: true,
              };
              const response = await this.helpers.request(options);
              returnData.push({ json: response });
            }
          } else if (resource === 'index') {
            if (operation === 'create') {
              const indexName = this.getNodeParameter('indexName', i) as string;
              const endpoint = `${credentials.url}/indexes/${indexName}`;
              const options: OptionsWithUri = {
                method: 'POST',
                uri: endpoint,
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