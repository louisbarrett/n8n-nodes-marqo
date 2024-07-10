# n8n-nodes-marqo

This is an n8n community node. It lets you use Marqo in your n8n workflows.

[Marqo](https://www.marqo.ai/) is a powerful, open-source vector search engine that makes it easy to add semantic search and similarity search to your applications.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  <!-- [Compatibility](#compatibility) -->  
[Usage](#usage)  <!-- [Resources](#resources) -->  
[Version history](#version-history)  <!-- [Troubleshooting](#troubleshooting) -->  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Document Operations
- Create Document
- Update Document
- Delete Document
- Search Documents

### Index Operations
- Create Index
- Delete Index
- List Indexes

## Credentials

To use this node, you need to provide the Marqo server URL.

## Usage

To use this node, you need to have a Marqo instance running. You can then use the node to interact with your Marqo indexes and documents.

### Document Operations

#### Create/Update Document
- Specify the index name
- Provide the document title and content
- Optionally specify a page number

The node will automatically set the `tensorFields` to include 'title' and 'content' for vectorization.

#### Delete Document
- Specify the index name and document ID

#### Search Documents
- Specify the index name and search query
- Optionally set additional parameters like limit, filter, and attributes to retrieve

### Index Operations

#### Create Index
- Specify the index name
- Optionally provide index settings

#### Delete Index
- Specify the index name

#### List Indexes
- No additional parameters required

## Version history

### 0.1.0
- Initial release
