<div align="center">
  :outbox_tray: :octocat:
</div>
<h1 align="center">
Uniform Uploader 
</h1>
<p align="center">
A GitHub Action for uploading files to S3/FTP/WebDAV and <a href="https://docs.rs/opendal/latest/opendal/services/index.html">more</a>, powered by <a href="https://github.com/apache/incubator-opendal">Apache OpenDAL</a>
</p>

<p align="right">
</p>

> currently, the action only supports **Linux-x64** platform

## All Parameters

| Input              | Description                                                                                                                                | Default |
|:-------------------|:-------------------------------------------------------------------------------------------------------------------------------------------|:--------|
| `provider`         | The uploader name                                                                                                                          | -       |
| `provider_options` | Newline-delimited list of the uploader options<br/>🐾 You can learn more about multi-line YAML syntax [here](https://yaml-multiline.info/) | -       |
| `include`          | Newline-delimited list of the glob pattern [^1]                                                                                            | -       |
| `flatten`          | flatten the upload path                                                                                                                    | false   |

## Providers

### Memory (for test)

[![build-test](https://github.com/bxb100/action-upload/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/bxb100/action-upload/actions/workflows/test.yml)

```yaml
- name: Upload to memory
  uses: bxb100/action-upload@main
  with:
    provider: memory
    include: '__tests__/**'
```

### WebDAV

[![test-webdav](https://github.com/bxb100/action-upload/actions/workflows/test-webdav.yml/badge.svg?branch=main)](https://github.com/bxb100/action-upload/actions/workflows/test-webdav.yml)
<details>
<summary>Options</summary>

[OpenDAL WebDAV](https://docs.rs/opendal/latest/opendal/services/struct.Webdav.html)

| Name     | Description         | Default | Other                               |
|----------|---------------------|---------|-------------------------------------|
| endpoint | WebDAV endpoint     | -       | -                                   |
| username | WebDAV username     | -       | -                                   |
| password | WebDAV password     | -       | -                                   |
| token    | WebDAV bearer token | -       | -                                   |
| root     | WebDAV root path    | -       | MUST be the format like `/abc/def/` |

</details>

```yaml
- name: Upload to WebDAV
  uses: bxb100/action-upload@main
  with:
    provider: webdav
    provider_options: |
      endpoint: ${{ secrets.WEBDAV_ENDPOINT }}
      username: ${{ secrets.WEBDAV_USERNAME }}
      password: ${{ secrets.WEBDAV_PASSWORD }}
      root: /test/
    include: '__tests__/**'
```

### S3

[![test-s3](https://github.com/bxb100/action-upload/actions/workflows/test-s3.yml/badge.svg?branch=main)](https://github.com/bxb100/action-upload/actions/workflows/test-s3.yml)

Aws S3 and compatible services (including minio, digitalocean space and so on) support.

<details>
<summary>Options</summary>

[OpenDAL S3](https://docs.rs/opendal/latest/opendal/services/struct.S3.html)

- `root`: Set the work dir for backend.
- `bucket`: Set the container name for backend.
- `endpoint`: Set the endpoint for backend.
- `region`: Set the region for backend.
- `access_key_id`: Set the access_key_id for backend.
- `secret_access_key`: Set the secret_access_key for backend.
- `security_token`: Set the security_token for backend.
- `server_side_encryption`: Set the server_side_encryption for backend.
- `server_side_encryption_aws_kms_key_id`: Set the server_side_encryption_aws_kms_key_id for backend.
- `server_side_encryption_customer_algorithm`: Set the server_side_encryption_customer_algorithm for backend.
- `server_side_encryption_customer_key`: Set the server_side_encryption_customer_key for backend.
- `server_side_encryption_customer_key_md5`: Set the server_side_encryption_customer_key_md5 for backend.
- `disable_config_load`: Disable aws config load from env
- `enable_virtual_host_style`: Enable virtual host style.

</details>

```yaml
- name: Upload to S3
  uses: bxb100/action-upload@main
  with:
    provider: s3
    provider_options: |
      root=/cs
      bucket=action-upload-test
      endpoint=https://${{secrets.CLOUDFLARE_R2_ACCOUNTID}}.r2.cloudflarestorage.com
      access_key_id=${{secrets.CLOUDFLARE_R2_KEY}}
      secret_access_key=${{secrets.CLOUDFLARE_R2_SECRET}}
    include: '__tests__/**'
```

### Azblob

Azure Storage Blob services support.
<details>
<summary>Options</summary>

[OpenDAL Azblob](https://docs.rs/opendal/latest/opendal/services/struct.Azblob.html)

- `root`: Set the work dir for backend.
- `container`: Set the container name for backend.
- `endpoint`: Set the endpoint for backend.
- `account_name`: Set the account_name for backend.
- `account_key`: Set the account_key for backend.

</details>

## Dev (Apple silicon)

### JetBrains IDE

Using `sitespeedio/node:ubuntu-22.04-nodejs-18.14.2` as node interpreter[^2]

```bash
docker pull sitespeedio/node:ubuntu-22.04-nodejs-18.14.2 --platform "linux/amd64"
```

### Manual

1. compile project [openDAL](https://github.com/apache/incubator-opendal) nodejs binding
2. copy binary `opendal.darwin-arm64.node` to `node_modules/opendal` and `lib` folder

[^1]: https://github.com/actions/toolkit/tree/main/packages/glob

[^2]:  https://www.jetbrains.com/help/idea/node-js-interpreters.html#ws_node_interpreters_dialog_open
