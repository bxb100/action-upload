<div align="center">
  :outbox_tray: :octocat:
</div>
<h1 align="center">
  Uniform Uploader Action
</h1>
<p align="center">
A GitHub Action for uploading files to S3/FTP/WebDAV and <a href="https://docs.rs/opendal/latest/opendal/services/index.html">more</a> 
</p>

<p align="right">
powered by <a href="https://github.com/apache/incubator-opendal">Apache OpenDAL</a>
</p>

> currently, the action only supports **Linux-x64** platform

## Memory  [![build-test](https://github.com/bxb100/action-upload/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/bxb100/action-upload/actions/workflows/test.yml)

```yaml
- name: Upload to memory
  uses: bxb100/action-upload@main
  with:
    provider: memory
    include: '__tests__/**'
```

## WebDAV [![test-webdav](https://github.com/bxb100/action-upload/actions/workflows/test-webdav.yml/badge.svg?branch=main)](https://github.com/bxb100/action-upload/actions/workflows/test-webdav.yml)

<details>
<summary>Options</summary>

[OpenDAL WebDAV](https://docs.rs/opendal/latest/opendal/services/struct.Webdav.html)

| Name     | Description         | Default | Other                                          |
|----------|---------------------|---------|------------------------------------------------|
| endpoint | WebDAV endpoint     | -       | -                                              |
| username | WebDAV username     | -       | -                                              |
| password | WebDAV password     | -       | -                                              |
| token    | WebDAV bearer token | -       | -                                              |
| root     | WebDAV root path    | -       | Input root MUST be the format like `/abc/def/` |

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
