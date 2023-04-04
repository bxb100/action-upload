<div align="center">
  :outbox_tray: :octocat:
</div>
<h1 align="center">
  Uniform Uploader Action
</h1>
<p align="center">
A GitHub Action for uploading files to S3/FTP/WebDAV and more services[^1]
</p>

<p align="right">
powered by <a href="https://github.com/apache/incubator-opendal">Apache OpenDAL</a>
</p>

## Defect

* currently, the action only supports **Linux-x64** platform
* just implements the `Write` and `CreateDir` methods
* the action may contain bunch bugs

[^1]: https://docs.rs/opendal/latest/opendal/services/index.html
