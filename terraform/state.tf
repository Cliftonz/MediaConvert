terraform {
  cloud {
    organization = "novuhq"

    workspaces {
      name = "media-convert"
    }
  }
}