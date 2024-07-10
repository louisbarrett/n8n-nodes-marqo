import {
    ICredentialType,
    INodeProperties,
  } from 'n8n-workflow';
  
  export class MarqoApi implements ICredentialType {
    name = 'marqoApi';
    displayName = 'Marqo API';
    documentationUrl = 'https://docs.marqo.ai/';
    properties: INodeProperties[] = [
      {
        displayName: 'Marqo Server URL',
        name: 'url',
        type: 'string',
        default: 'http://localhost:8882',
        required: true,
      },
    ];
  }